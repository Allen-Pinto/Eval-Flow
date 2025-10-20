import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { maskPii } from '../../../../lib/maskPii';

interface IngestPayload {
  interaction_id: string;
  prompt: string;
  response: string;
  score: number;
  latency_ms: number;
  flags?: string[];
  pii_tokens_redacted?: number;
  created_at?: string;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !userData.user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const payload: IngestPayload = await request.json();

    if (!payload.interaction_id || !payload.prompt || !payload.response) {
      return NextResponse.json(
        { error: 'Missing required fields: interaction_id, prompt, response' },
        { status: 400 }
      );
    }

    if (typeof payload.score !== 'number' || payload.score < 0 || payload.score > 100) {
      return NextResponse.json({ error: 'Score must be 0-100' }, { status: 400 });
    }

    if (typeof payload.latency_ms !== 'number' || payload.latency_ms < 0) {
      return NextResponse.json({ error: 'Latency must be non-negative number' }, { status: 400 });
    }

    const { data: config } = await supabaseAdmin
      .from('evaluation_configs')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    if (config?.run_policy === 'sampled') {
      const random = Math.random() * 100;
      if (random > (config.sample_rate_pct || 50)) {
        return NextResponse.json(
          { success: true, eval_id: 'sampled_out', message: 'Not sampled' },
          { status: 202 }
        );
      }
    }

    let promptMasked = payload.prompt;
    let responseMasked = payload.response;
    let piiCount = payload.pii_tokens_redacted || 0;

    if (config?.obfuscate_pii) {
      const { masked: pm, redactedCount: pc } = maskPii(payload.prompt);
      const { masked: rm, redactedCount: rc } = maskPii(payload.response);
      promptMasked = pm;
      responseMasked = rm;
      piiCount = pc + rc;
    }

    const { data: eval_data, error: insertError } = await supabaseAdmin
      .from('evaluations')
      .insert({
        user_id: userData.user.id,
        interaction_id: payload.interaction_id,
        prompt: payload.prompt,
        response: payload.response,
        score: payload.score,
        latency_ms: payload.latency_ms,
        flags: payload.flags || [],
        pii_tokens_redacted: piiCount,
        prompt_masked: config?.obfuscate_pii ? promptMasked : null,
        response_masked: config?.obfuscate_pii ? responseMasked : null,
        created_at: payload.created_at || new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) throw insertError;

    await supabaseAdmin.from('audit_logs').insert({
      user_id: userData.user.id,
      action: 'EVAL_INGESTED',
      resource_type: 'evaluation',
      resource_id: eval_data.id,
      details: { score: payload.score, pii_redacted: piiCount },
    });

    return NextResponse.json(
      {
        success: true,
        eval_id: eval_data.id,
        user_id: userData.user.id,
        config_applied: {
          run_policy: config?.run_policy,
          pii_masked: config?.obfuscate_pii,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ingest error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
