'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// Extend window type for HoodiniViz UMD
declare global {
  interface Window {
    HoodiniViz?: {
      createDashboard: (config: any) => { destroy: () => void; root: any }
      createViz: (config: any) => { destroy: () => void; root: any }
    }
  }
}

interface HoodiniDemoProps {
  type?: 'dashboard' | 'viz'
  dataPaths?: Record<string, string>
  config?: Record<string, any>
  height?: string | number
  /** Lazy load - only initialize when visible in viewport */
  lazy?: boolean
}

const DATA_BASE_URL = 'https://raw.githubusercontent.com/pentamorfico/hoodini-viz/main/src/data'

// Default data paths for demos
const DEFAULT_DATA_PATHS = {
  newick: `${DATA_BASE_URL}/small/tree.nwk`,
  gffParquet: `${DATA_BASE_URL}/small/parquet/gff.parquet`,
  hoodsParquet: `${DATA_BASE_URL}/small/parquet/hoods.parquet`,
  proteinLinksParquet: `${DATA_BASE_URL}/small/parquet/protein_links.parquet`,
  nucleotideLinksParquet: `${DATA_BASE_URL}/small/parquet/nucleotide_links.parquet`,
  domainsParquet: `${DATA_BASE_URL}/small/parquet/domains.parquet`,
  proteinMetadataParquet: `${DATA_BASE_URL}/small/parquet/protein_metadata.parquet`,
  domainsMetadataParquet: `${DATA_BASE_URL}/small/parquet/domains_metadata.parquet`,
  treeMetadataParquet: `${DATA_BASE_URL}/small/parquet/tree_metadata.parquet`,
}

function DemoSkeleton() {
  return (
    <div className="hoodini-demo-skeleton">
      <div className="skeleton-sidebar" />
      <div className="skeleton-main">
        <div className="skeleton-tree" />
        <div className="skeleton-tracks">
          <div className="skeleton-track" />
          <div className="skeleton-track" />
          <div className="skeleton-track" />
          <div className="skeleton-track" />
        </div>
      </div>
    </div>
  )
}

export function HoodiniDemo({ 
  type = 'dashboard', 
  dataPaths,
  config = {},
  height = '700px',
  lazy = true  // Default to lazy loading
}: HoodiniDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<{ destroy: () => void } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(!lazy) // Start visible if not lazy
  const initializedRef = useRef(false)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isVisible) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' } // Start loading 100px before visible
    )

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, isVisible])

  // Only load when visible
  useEffect(() => {
    if (!isVisible) return
    if (initializedRef.current) return
    initializedRef.current = true

    let unmounted = false

    const loadHoodiniViz = async () => {
      try {
        // Check if already loaded
        if (window.HoodiniViz) {
          if (!unmounted) initializeDemo()
          return
        }

        // Load CSS
        if (!document.querySelector('link[href*="hoodini-viz.css"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/hoodini-viz@0.2.3/dist/hoodini-viz.css'
          document.head.appendChild(link)
        }

        // Load UMD script
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/hoodini-viz@0.2.3/dist/hoodini-viz.umd.js'
        script.async = true
        
        script.onload = () => {
          // Small delay to ensure HoodiniViz is ready
          setTimeout(() => {
            if (!unmounted) initializeDemo()
          }, 100)
        }
        
        script.onerror = () => {
          if (!unmounted) {
            setError('Failed to load HoodiniViz library')
            setLoading(false)
          }
        }
        
        document.head.appendChild(script)
      } catch (err) {
        if (!unmounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          setLoading(false)
        }
      }
    }

    const initializeDemo = () => {
      if (!containerRef.current || !window.HoodiniViz) {
        setError('Container or HoodiniViz not available')
        setLoading(false)
        return
      }

      try {
        const finalDataPaths = dataPaths || DEFAULT_DATA_PATHS
        
        // Store the instance so we can destroy it on unmount
        if (type === 'dashboard') {
          instanceRef.current = window.HoodiniViz.createDashboard({
            container: containerRef.current,
            dataPaths: finalDataPaths,
            ...config
          })
        } else {
          instanceRef.current = window.HoodiniViz.createViz({
            container: containerRef.current,
            dataPaths: finalDataPaths,
            ...config
          })
        }
        
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize demo')
        setLoading(false)
      }
    }

    loadHoodiniViz()

    // Cleanup on unmount - destroy the visualization properly
    return () => {
      unmounted = true
      // Call destroy() to unmount React root and clean up WebGL
      if (instanceRef.current) {
        try {
          instanceRef.current.destroy()
        } catch (e) {
          console.warn('Error destroying HoodiniViz instance:', e)
        }
        instanceRef.current = null
      }
      initializedRef.current = false
    }
  }, [type, dataPaths, config, isVisible])

  if (error) {
    return (
      <div className="hoodini-demo-error">
        <p>⚠️ Error loading demo: {error}</p>
        <p>Try refreshing the page or check the browser console.</p>
      </div>
    )
  }

  return (
    <div ref={wrapperRef} className="hoodini-demo-wrapper" style={{ height }}>
      {(loading || !isVisible) && <DemoSkeleton />}
      <div 
        ref={containerRef} 
        className="hoodini-demo-container"
        style={{ 
          height: '100%', 
          width: '100%',
          display: (loading || !isVisible) ? 'none' : 'block'
        }} 
      />
    </div>
  )
}

// Pre-configured demo variants
export function DashboardBasicDemo() {
  return <HoodiniDemo type="dashboard" />
}

export function DashboardCustomPaletteDemo() {
  return (
    <HoodiniDemo 
      type="dashboard"
      config={{
        initialState: {
          genePalette: { type: 'qualitative', name: 'Vivid', numColors: 12, enabled: true },
          domainPalette: { type: 'qualitative', name: 'Set1', numColors: 9, enabled: true },
          geneColorBy: 'cluster',
          domainColorBy: 'domainName',
        }
      }}
    />
  )
}

export function DashboardNoSidebarDemo() {
  return (
    <HoodiniDemo 
      type="dashboard"
      config={{
        showSidebar: false,
        showToolbar: true,
      }}
    />
  )
}

export function DashboardLinksDemo() {
  return (
    <HoodiniDemo 
      type="dashboard"
      config={{
        initialState: {
          showProteinLinkLayer: true,
          showNucleotideLinkLayer: true,
          genePalette: { type: 'qualitative', name: 'Set2', numColors: 8, enabled: true },
          geneColorBy: 'cluster',
          proteinLinkConfig: { colorBy: 'source_gene', useAlpha: true, minAlpha: 0.1, maxAlpha: 0.6 },
        }
      }}
    />
  )
}

export function DashboardDomainsDemo() {
  return (
    <HoodiniDemo 
      type="dashboard"
      config={{
        initialState: {
          showDomainLayer: true,
          domainPalette: { type: 'qualitative', name: 'Prism', numColors: 10, enabled: true },
          domainColorBy: 'domainName',
          geneHeight: 80,
        }
      }}
    />
  )
}

export function DashboardTreeOnlyDemo() {
  return (
    <HoodiniDemo 
      type="dashboard"
      dataPaths={{
        newick: `${DATA_BASE_URL}/small/tree.nwk`,
        gffParquet: `${DATA_BASE_URL}/small/parquet/gff.parquet`,
        hoodsParquet: `${DATA_BASE_URL}/small/parquet/hoods.parquet`,
        treeMetadataParquet: `${DATA_BASE_URL}/small/parquet/tree_metadata.parquet`,
      }}
      config={{
        initialState: {
          phyloPalette: { type: 'qualitative', name: 'Vivid', numColors: 8, enabled: true },
          treeColorBy: 'phylum',
        }
      }}
    />
  )
}

export function VizStandaloneDemo() {
  return (
    <HoodiniDemo 
      type="dashboard"
      config={{
        showSidebar: false,
        showToolbar: false,
      }}
      height="500px"
    />
  )
}

export function VizMinimalDemo() {
  return (
    <HoodiniDemo 
      type="dashboard"
      dataPaths={{
        newick: `${DATA_BASE_URL}/small/tree.nwk`,
        gffParquet: `${DATA_BASE_URL}/small/parquet/gff.parquet`,
        hoodsParquet: `${DATA_BASE_URL}/small/parquet/hoods.parquet`,
      }}
      config={{
        showSidebar: false,
        showToolbar: false,
      }}
      height="400px"
    />
  )
}

export function VizWithTreeDemo() {
  return (
    <HoodiniDemo 
      type="dashboard"
      dataPaths={{
        newick: `${DATA_BASE_URL}/small/tree.nwk`,
        gffParquet: `${DATA_BASE_URL}/small/parquet/gff.parquet`,
        hoodsParquet: `${DATA_BASE_URL}/small/parquet/hoods.parquet`,
        treeMetadataParquet: `${DATA_BASE_URL}/small/parquet/tree_metadata.parquet`,
      }}
      config={{
        showSidebar: false,
        showToolbar: true,
        initialState: {
          ultrametric: false,
          alignLabels: true,
        }
      }}
      height="500px"
    />
  )
}

export function VizCompactDemo() {
  return (
    <HoodiniDemo 
      type="dashboard"
      config={{
        showSidebar: false,
        showToolbar: true,
        initialState: {
          ySpacing: 100,
          geneHeight: 40,
          arrowheadHeight: 15,
          showScrollbar: true,
        }
      }}
      height="450px"
    />
  )
}
