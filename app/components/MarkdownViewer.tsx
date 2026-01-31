    'use client'

import { useEffect, useState } from 'react'

interface MarkdownViewerProps {
  src: string
}

export function MarkdownViewer({ src }: MarkdownViewerProps) {
  const [html, setHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    
    async function loadAndRender() {
      try {
        // Fetch markdown
        const res = await fetch(src)
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`)
        const text = await res.text()
        
        // Load marked.js
        const { marked } = await import('marked')
        
        // Configure marked
        marked.setOptions({
          gfm: true,
          breaks: false
        })
        
        // Parse markdown to HTML
        const rendered = await marked.parse(text)
        
        if (isMounted) {
          setHtml(rendered)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          setLoading(false)
        }
      }
    }
    
    loadAndRender()
    return () => { isMounted = false }
  }, [src])

  // Add syntax highlighting after HTML is rendered
  useEffect(() => {
    if (!html) return
    
    // Load highlight.js for code highlighting
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github-dark.min.css'
    document.head.appendChild(link)
    
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/highlight.js@11/highlight.min.js'
    script.onload = () => {
      const hljs = (window as any).hljs
      if (hljs) {
        document.querySelectorAll('#api-markdown-content pre code').forEach((block) => {
          hljs.highlightElement(block as HTMLElement)
        })
      }
    }
    document.head.appendChild(script)
  }, [html])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading API reference...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
        Error loading API reference: {error}
      </div>
    )
  }

  return (
    <div 
      id="api-markdown-content"
      className="nextra-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
