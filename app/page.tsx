import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { InteractiveEyeFollower } from '@/components/EyeFollower';

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Google Style */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-medium text-gray-900">EvalFlow</div>
          <div className="flex gap-4 items-center">
            <Link href="/auth/login" className="text-gray-700 hover:text-[#4285F4] font-medium text-sm transition">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2.5 bg-[#4285F4] text-white rounded-lg hover:bg-[#1967D2] font-medium text-sm transition shadow-sm"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - 3D Element Hidden on Mobile */}
      <section className="min-h-[calc(100vh-73px)] flex items-center py-12 lg:py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content - Full width on mobile */}
            <div className="space-y-8 text-center lg:text-left lg:col-span-1">
              <h1 className="text-5xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal text-gray-900 leading-tight">
                Evaluate your AI agents
                <span className="text-[#4285F4] font-medium block lg:inline"> with confidence</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Real-time dashboards, configurable policies, and comprehensive metrics to track your AI agent performance.
                Built for teams that need visibility without complexity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center lg:justify-start">
                <Link
                  href="/auth/signup"
                  className="px-8 sm:px-10 py-3 sm:py-4 bg-[#4285F4] text-white rounded-lg hover:bg-[#1967D2] font-medium text-base transition shadow-md text-center"
                >
                  Start free trial
                </Link>
                <Link
                  href="#features"
                  className="px-8 sm:px-10 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#4285F4] hover:text-[#4285F4] font-medium text-base transition text-center"
                >
                  Learn more
                </Link>
              </div>
            </div>

            {/* Right 3D Interactive Element - Hidden on mobile */}
            <div className="hidden lg:flex h-[500px] bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl items-center justify-center overflow-hidden relative">
              <InteractiveEyeFollower />
            </div>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-16" />

      {/* Stats Section */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-normal text-[#4285F4] mb-4">20K+</div>
              <p className="text-gray-600 text-base">Evaluations per user</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-normal text-[#4285F4] mb-4">&lt;50ms</div>
              <p className="text-gray-600 text-base">Query response time</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-normal text-[#4285F4] mb-4">100%</div>
              <p className="text-gray-600 text-base">Data isolation via RLS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-16" />

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <h2 className="text-3xl lg:text-4xl font-normal text-gray-900 mb-12 lg:mb-16 text-center">
          Everything you need to evaluate AI
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Feature 1 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 hover:shadow-md hover:border-[#4285F4] transition">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg bg-[#E8F0FE] flex items-center justify-center text-xl lg:text-2xl mb-4 lg:mb-5">
              🔐
            </div>
            <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-3">Multi-Tenant Secure</h3>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
              Enterprise-grade security with Supabase Auth and Row-Level Security. Each user sees only their data.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 hover:shadow-md hover:border-[#4285F4] transition">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg bg-[#E8F0FE] flex items-center justify-center text-xl lg:text-2xl mb-4 lg:mb-5">
              ⚙️
            </div>
            <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-3">Flexible Policies</h3>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
              Choose to evaluate always or use sampling. Adjust policies in real-time without redeployment.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 hover:shadow-md hover:border-[#4285F4] transition">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg bg-[#E8F0FE] flex items-center justify-center text-xl lg:text-2xl mb-4 lg:mb-5">
              🛡️
            </div>
            <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-3">PII Protection</h3>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
              Automatic redaction of emails, phone numbers, and sensitive data. Stay GDPR compliant.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 hover:shadow-md hover:border-[#4285F4] transition">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg bg-[#E8F0FE] flex items-center justify-center text-xl lg:text-2xl mb-4 lg:mb-5">
              📊
            </div>
            <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-3">Live Dashboards</h3>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
              4 chart types, KPI cards, and 7/30-day trends. Drill down into individual evaluations.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 hover:shadow-md hover:border-[#4285F4] transition">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg bg-[#E8F0FE] flex items-center justify-center text-xl lg:text-2xl mb-4 lg:mb-5">
              ⚡
            </div>
            <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-3">Lightning Fast</h3>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
              Indexed queries under 50ms. Pagination handles 20K+ evaluations without slowdown.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 hover:shadow-md hover:border-[#4285F4] transition">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg bg-[#E8F0FE] flex items-center justify-center text-xl lg:text-2xl mb-4 lg:mb-5">
              📡
            </div>
            <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-3">REST API</h3>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
              Simple POST endpoint to ingest evaluations. Bearer token authentication for security.
            </p>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-16" />

      {/* How It Works */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-normal text-gray-900 mb-12 lg:mb-16 text-center">
            How it works
          </h2>

          <div className="space-y-12 lg:space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#4285F4] text-white rounded-full flex items-center justify-center text-base font-medium">
                  1
                </div>
              </div>
              <div className="flex-grow pt-1">
                <h3 className="text-xl lg:text-2xl font-medium text-gray-900 mb-3">Configure Your Policy</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Set your evaluation policy: always run, or use sampling to reduce costs. Adjust PII masking and daily limits.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#4285F4] text-white rounded-full flex items-center justify-center text-base font-medium">
                  2
                </div>
              </div>
              <div className="flex-grow pt-1">
                <h3 className="text-xl lg:text-2xl font-medium text-gray-900 mb-3">Ingest Evaluations</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Send evaluation results to our REST API. We handle validation, masking, and storage automatically.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#4285F4] text-white rounded-full flex items-center justify-center text-base font-medium">
                  3
                </div>
              </div>
              <div className="flex-grow pt-1">
                <h3 className="text-xl lg:text-2xl font-medium text-gray-900 mb-3">View Analytics</h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  Real-time dashboards show trends, KPIs, and performance metrics. Drill down into details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-16" />

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <h2 className="text-2xl lg:text-3xl font-normal text-gray-900 mb-4 text-center">
          Simple, transparent pricing
        </h2>
        <p className="text-base lg:text-lg text-gray-600 text-center mb-8 lg:mb-12 max-w-2xl mx-auto">
          Start free. Scale as you grow. No credit card required for the free tier.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
            <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-1">Starter</h3>
            <p className="text-gray-600 text-sm mb-4">Perfect to get started</p>
            <div className="mb-6">
              <span className="text-3xl lg:text-4xl font-normal text-gray-900">$0</span>
              <span className="text-gray-600 text-sm">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-2">
                <span className="text-[#4285F4] font-medium">✓</span>
                <span className="text-gray-700 text-sm">5,000 evaluations/month</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#4285F4] font-medium">✓</span>
                <span className="text-gray-700 text-sm">Basic dashboard</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#4285F4] font-medium">✓</span>
                <span className="text-gray-700 text-sm">PII masking</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#4285F4] font-medium">✓</span>
                <span className="text-gray-700 text-sm">Email support</span>
              </li>
            </ul>
            <Link
              href="/auth/signup"
              className="block w-full px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#4285F4] hover:text-[#4285F4] font-medium text-sm transition text-center"
            >
              Get started
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-white border-2 border-[#4285F4] rounded-lg p-6 shadow-md transform lg:scale-105">
            <div className="bg-[#4285F4] text-white px-3 py-1 rounded text-xs font-medium inline-block mb-3">
              RECOMMENDED
            </div>
            <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-1">Professional</h3>
            <p className="text-gray-600 text-sm mb-4">For growing teams</p>
            <div className="mb-6">
              <span className="text-3xl lg:text-4xl font-normal text-gray-900">$29</span>
              <span className="text-gray-600 text-sm">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-2">
                <span className="text-[#4285F4] font-medium">✓</span>
                <span className="text-gray-700 text-sm">100,000 evaluations/month</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#4285F4] font-medium">✓</span>
                <span className="text-gray-700 text-sm">Advanced analytics</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#4285F4] font-medium">✓</span>
                <span className="text-gray-700 text-sm">Priority support</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#4285F4] font-medium">✓</span>
                <span className="text-gray-700 text-sm">Custom integrations</span>
              </li>
            </ul>
            <Link
              href="/auth/signup"
              className="block w-full px-4 py-2.5 bg-[#4285F4] text-white rounded-lg hover:bg-[#1967D2] font-medium text-sm transition text-center shadow-md"
            >
              Try free for 30 days
            </Link>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
            <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-1">Enterprise</h3>
            <p className="text-gray-600 text-sm mb-4">For large-scale deployments</p>
            <div className="mb-6">
              <span className="text-3xl lg:text-4xl font-normal text-gray-900">Custom</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-2">
                <span className="text-[#4285F4] font-medium">✓</span>
                <span className="text-gray-700 text-sm">Unlimited evaluations</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#4285F4] font-medium">✓</span>
                <span className="text-gray-700 text-sm">SLA guarantee</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#4285F4] font-medium">✓</span>
                <span className="text-gray-700 text-sm">Dedicated support</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#4285F4] font-medium">✓</span>
                <span className="text-gray-700 text-sm">On-premise option</span>
              </li>
            </ul>
            <Link
              href="/auth/signup"
              className="block w-full px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#4285F4] hover:text-[#4285F4] font-medium text-sm transition text-center"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-16" />

      {/* CTA Section */}
      <section className="bg-[#4285F4] py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-normal text-white mb-4">Ready to get started?</h2>
          <p className="text-blue-100 text-base lg:text-lg mb-8">
            Join teams that are already evaluating their AI agents with confidence.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-6 lg:px-8 py-3 bg-white text-[#4285F4] rounded-lg hover:bg-gray-50 font-medium text-sm transition shadow-md"
          >
            Start free today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8 mb-8">
            <div>
              <div className="text-xl font-medium text-gray-900 mb-3">EvalFlow</div>
              <p className="text-gray-600 text-sm">AI Agent Evaluation Framework</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="#features" className="hover:text-[#4285F4] transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-[#4285F4] transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-[#4285F4] transition">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3 text-sm">Resources</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="#" className="hover:text-[#4285F4] transition">Documentation</Link></li>
                <li><Link href="#" className="hover:text-[#4285F4] transition">API Reference</Link></li>
                <li><Link href="#" className="hover:text-[#4285F4] transition">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link href="#" className="hover:text-[#4285F4] transition">About</Link></li>
                <li><Link href="#" className="hover:text-[#4285F4] transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-[#4285F4] transition">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-gray-600 text-sm">
            <p>&copy; 2025 EvalFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}