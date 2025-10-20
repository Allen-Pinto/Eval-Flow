'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { useState } from 'react';

export function Navbar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold" style={{ color: '#4285F4' }}>
          EvalFlow
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-gray-700 hover:text-[#4285F4] transition font-medium">
            Dashboard
          </Link>
          <Link href="/dashboard/evals" className="text-gray-700 hover:text-[#4285F4] transition font-medium">
            Evaluations
          </Link>
          <Link href="/dashboard/settings" className="text-gray-700 hover:text-[#4285F4] transition font-medium">
            Settings
          </Link>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-6 py-2.5 text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 font-medium"
            style={{ backgroundColor: '#4285F4' }}
          >
            {loading ? 'Signing out...' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  );
}
