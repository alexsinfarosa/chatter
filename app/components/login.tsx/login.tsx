import {useOutletContext} from '@remix-run/react'
import type {SupabaseOutletContext} from '~/root'

export default function Login() {
  const {supabase} = useOutletContext<SupabaseOutletContext>()

  async function handleLogin() {
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'github',
    })

    if (error) {
      console.log(error)
    }
  }

  async function handleLogout() {
    const {error} = await supabase.auth.signOut()

    if (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
