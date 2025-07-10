'use client'

import { ReactNode } from 'react'
// Ajoute ici tes vrais providers :
import ThemeProvider from './theme-provider'
// Ajoute d'autres providers au besoin

interface Props {
  children: ReactNode
}

export default function ClientProviders({ children }: Props) {
  // Ici tu peux gérer le state/langue/side effects, etc.
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}
