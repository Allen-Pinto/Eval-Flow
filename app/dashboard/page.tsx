import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Dashboard } from '@/components/Dashboard'

export default async function DashboardPage() {
  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  
  const { data: { session }, error } = await supabase.auth.getSession()

  // CRITICAL FIX: Better session validation
  if (!session || error) {
    console.log('No session found, redirecting to login')
    redirect('/auth/login?message=Please log in to continue')
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Analytics Dashboard</h1>
        <Dashboard />
      </main>
    </>
  )
}