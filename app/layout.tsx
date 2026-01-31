import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import type { ReactNode } from 'react'
import { Space_Grotesk } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Hoodini Documentation',
    template: '%s | Hoodini'
  },
  description: 'Gene Neighborhood Analysis at Scale - Documentation for the Hoodini Suite',
  icons: {
    icon: '/favicon.ico'
  }
}

const logo = (
  <span className="flex items-center font-semibold">
    {/* Light mode logo */}
    <img 
      src="/images/hoodini_logo.svg" 
      alt="Hoodini" 
      className="h-8 w-auto logo-light" 
    />
    {/* Dark mode logo */}
    <img 
      src="/images/hoodini_logo_light.svg" 
      alt="Hoodini" 
      className="h-8 w-auto logo-dark" 
    />
  </span>
)

const navbar = (
  <Navbar
    logo={logo}
    projectLink="https://github.com/pentamorfico/hoodini"
  >
    {/* Center navigation links */}
    <div className="navbar-center-nav hidden md:flex">
      <Link href="/docs">Docs</Link>
      <Link href="/demo">Live Demo</Link>
      <Link href="/gallery">Gallery</Link>
      <a 
        href="https://colab.research.google.com/github/pentamorfico/hoodini-colab/blob/main/hoodini_colab.ipynb"
        target="_blank"
        rel="noopener noreferrer"
      >
        Colab
      </a>
    </div>
    <ThemeSwitch />
  </Navbar>
)

const footer = (
  <Footer className="flex-col items-center justify-center text-center">
    <span className="text-sm text-gray-500">
      © {new Date().getFullYear()} Hoodini
    </span>
    <span className="text-xs text-gray-400 mt-1">
      Sponsored by MIMOSAS
    </span>
  </Footer>
)

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={spaceGrotesk.variable}>
      <Head />
      <body suppressHydrationWarning className={spaceGrotesk.className}>
        <Layout
          navbar={navbar}
          footer={footer}
          docsRepositoryBase="https://github.com/pentamorfico/hoodini-docs/tree/main"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={await getPageMap()}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
