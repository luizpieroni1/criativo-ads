import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Anúncios que Vendem',
  description: 'Gerador de criativos para Meta Ads com IA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#0f0f0f] text-white">{children}</body>
    </html>
  )
}
