'use client';

import { LoadProgramForm } from '@/components/admin/LoadProgramForm'

export default function LoadPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#002654] via-[#ffffff] to-[#EF4135] bg-clip-text text-transparent drop-shadow-lg">Charger un programme</h1>
        <a
          href="/admin"
          className="text-blue-600 hover:text-blue-800"
        >
          Retour au dashboard
        </a>
      </div>
      <LoadProgramForm />
    </div>
  )
} 