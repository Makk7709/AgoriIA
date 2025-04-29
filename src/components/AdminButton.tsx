'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { checkAdminStatus } from '@/lib/checkAdmin'

export function AdminButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return
      try {
        const admin = await checkAdminStatus(user.email)
        setIsAdmin(admin)
      } catch (error) {
        console.error('Erreur lors de la vérification du statut admin:', error)
      }
    }
    checkAdmin()
  }, [user])

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Mot de passe en dur pour le test
      if (password === 'admin123') {
        setIsOpen(false)
        router.push('/admin')
      } else {
        toast.error('Mot de passe incorrect')
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error)
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) return null
  if (!user || !isAdmin) return null

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        Administration
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accès Administration</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe"
                  required
                  className="text-black"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Vérification...' : 'Accéder'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
} 