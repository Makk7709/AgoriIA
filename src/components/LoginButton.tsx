'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

export function LoginButton() {
  const handleLogin = async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <Button
      onClick={handleLogin}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Github className="h-4 w-4" />
      Se connecter avec GitHub
    </Button>
  )
} 