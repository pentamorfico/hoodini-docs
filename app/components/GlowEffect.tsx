'use client'

import { useEffect } from 'react'

export function useGlowEffect() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll('.glow-card, .glow-btn')
      
      cards.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        ;(card as HTMLElement).style.setProperty('--mouse-x', `${x}px`)
        ;(card as HTMLElement).style.setProperty('--mouse-y', `${y}px`)
      })
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
}

export default function GlowEffect() {
  useGlowEffect()
  return null
}
