"use client"; // Force client-side rendering to eliminate server/client hydration differences

import '@/styles/tailwind.css'
import { Roboto, Nunito } from 'next/font/google'
import 'rc-slider/assets/index.css'
import { useEffect, useState } from 'react'
import CustomizeControl from './customize-control'
import ThemeProvider from './theme-provider'
import Header from '@/components/Common/Header'
import Footer from '@/components/Common/Footer'
import { AsideProvider } from '@/components/aside/aside'

const roboto = Roboto({ 
  subsets: ['latin'], 
  weight: ['400', '700'], 
  display: 'swap',
  variable: '--font-roboto'
})

const nunito = Nunito({ 
  subsets: ['latin'], 
  weight: ['300', '400', '700'], 
  display: 'swap',
  variable: '--font-nunito'
})

// Note: Metadata is not supported in client components
// Move metadata to a server component or use next/head for dynamic meta tags if needed

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('fr') // Default language

  useEffect(() => {
    // Client-side language detection
    if (typeof navigator !== 'undefined') {
      const detectedLang = navigator.language?.split('-')[0] || 'fr'
      setLanguage(detectedLang)
    }
  }, [])

  return (
    <html lang={language} className={`${roboto.variable} ${nunito.variable} font-sans`}>
      <head>
        <title>Chisfis - Activités pour enfants et familles à Saint-Étienne</title>
        <meta name="description" content="Découvrez des activités pour enfants et familles à Saint-Étienne. Réservation en ligne d'activités sportives, culturelles et ludiques." />
        <meta name="keywords" content="activités enfants, familles, Saint-Étienne, réservation, sport, culture, loisirs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 pb-16 md:pb-0">
        <AsideProvider>
          <Header />
          <ThemeProvider>
            <div>
              {children}
              {/* For Chisfis's demo  -- you can remove it  */}
              <CustomizeControl />
            </div>
          </ThemeProvider>
          <Footer />
        </AsideProvider>
      </body>
    </html>
  )
}
