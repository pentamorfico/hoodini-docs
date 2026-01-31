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
  /** 'dashboard' uses createDashboard with dataPaths, 'viz' uses createViz with inline data */
  type?: 'dashboard' | 'viz'
  /** Data paths for Dashboard mode (parquet files) */
  dataPaths?: Record<string, string>
  /** Inline data for Viz mode (pre-parsed arrays) */
  vizData?: {
    newickStr?: string
    gffFeatures?: any[]
    hoods?: any[]
    proteinLinks?: any[]
    nucleotideLinks?: any[]
    domains?: any[]
    proteinMetadata?: Record<string, any>
    treeMetadata?: Record<string, any>
  }
  /** Config options passed to the component */
  config?: Record<string, any>
  height?: string | number
  /** Lazy load - only initialize when visible in viewport */
  lazy?: boolean
}

const DATA_BASE_URL = 'https://raw.githubusercontent.com/pentamorfico/hoodini-viz/main/src/data'

// Default data paths for Dashboard demos
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

// ============================================================================
// SAMPLE DATA for HoodiniViz demos (incremental complexity)
// ============================================================================

// Simple 3-genome tree
const SAMPLE_NEWICK = '((genome_A:0.1,genome_B:0.15):0.05,genome_C:0.2);'

// Basic genes - 5 genes per genome
const SAMPLE_GFF_FEATURES = [
  // Genome A
  { seqid: 'genome_A', source: 'hoodini', type: 'CDS', start: 1000, end: 2500, strand: '+', attributes: { ID: 'gene_A1', Name: 'proteinA1', product: 'Hypothetical protein', locus_tag: 'gene_A1' } },
  { seqid: 'genome_A', source: 'hoodini', type: 'CDS', start: 2700, end: 4200, strand: '+', attributes: { ID: 'gene_A2', Name: 'proteinA2', product: 'ABC transporter', locus_tag: 'gene_A2' } },
  { seqid: 'genome_A', source: 'hoodini', type: 'CDS', start: 4500, end: 6000, strand: '-', attributes: { ID: 'gene_A3', Name: 'proteinA3', product: 'DNA helicase', locus_tag: 'gene_A3' } },
  { seqid: 'genome_A', source: 'hoodini', type: 'CDS', start: 6200, end: 7800, strand: '+', attributes: { ID: 'gene_A4', Name: 'proteinA4', product: 'Methyltransferase', locus_tag: 'gene_A4' } },
  { seqid: 'genome_A', source: 'hoodini', type: 'CDS', start: 8000, end: 9500, strand: '+', attributes: { ID: 'gene_A5', Name: 'proteinA5', product: 'Restriction enzyme', locus_tag: 'gene_A5' } },
  // Genome B
  { seqid: 'genome_B', source: 'hoodini', type: 'CDS', start: 500, end: 2000, strand: '+', attributes: { ID: 'gene_B1', Name: 'proteinB1', product: 'Hypothetical protein', locus_tag: 'gene_B1' } },
  { seqid: 'genome_B', source: 'hoodini', type: 'CDS', start: 2200, end: 3700, strand: '+', attributes: { ID: 'gene_B2', Name: 'proteinB2', product: 'ABC transporter', locus_tag: 'gene_B2' } },
  { seqid: 'genome_B', source: 'hoodini', type: 'CDS', start: 4000, end: 5500, strand: '-', attributes: { ID: 'gene_B3', Name: 'proteinB3', product: 'DNA helicase', locus_tag: 'gene_B3' } },
  { seqid: 'genome_B', source: 'hoodini', type: 'CDS', start: 5700, end: 7200, strand: '+', attributes: { ID: 'gene_B4', Name: 'proteinB4', product: 'Methyltransferase', locus_tag: 'gene_B4' } },
  { seqid: 'genome_B', source: 'hoodini', type: 'CDS', start: 7400, end: 8900, strand: '+', attributes: { ID: 'gene_B5', Name: 'proteinB5', product: 'Restriction enzyme', locus_tag: 'gene_B5' } },
  // Genome C
  { seqid: 'genome_C', source: 'hoodini', type: 'CDS', start: 800, end: 2300, strand: '-', attributes: { ID: 'gene_C1', Name: 'proteinC1', product: 'Hypothetical protein', locus_tag: 'gene_C1' } },
  { seqid: 'genome_C', source: 'hoodini', type: 'CDS', start: 2500, end: 4000, strand: '-', attributes: { ID: 'gene_C2', Name: 'proteinC2', product: 'ABC transporter', locus_tag: 'gene_C2' } },
  { seqid: 'genome_C', source: 'hoodini', type: 'CDS', start: 4300, end: 5800, strand: '+', attributes: { ID: 'gene_C3', Name: 'proteinC3', product: 'DNA helicase', locus_tag: 'gene_C3' } },
  { seqid: 'genome_C', source: 'hoodini', type: 'CDS', start: 6000, end: 7500, strand: '-', attributes: { ID: 'gene_C4', Name: 'proteinC4', product: 'Methyltransferase', locus_tag: 'gene_C4' } },
  { seqid: 'genome_C', source: 'hoodini', type: 'CDS', start: 7700, end: 9200, strand: '-', attributes: { ID: 'gene_C5', Name: 'proteinC5', product: 'Restriction enzyme', locus_tag: 'gene_C5' } },
]

// Hoods (neighborhood windows) aligned on gene 3 (the helicase)
const SAMPLE_HOODS = [
  { hood_id: '1', seqid: 'genome_A', start: 0, end: 10000, align_gene: 'gene_A3' },
  { hood_id: '2', seqid: 'genome_B', start: 0, end: 9500, align_gene: 'gene_B3' },
  { hood_id: '3', seqid: 'genome_C', start: 0, end: 10000, align_gene: 'gene_C3' },
]

// Protein links (synteny between homologous genes)
const SAMPLE_PROTEIN_LINKS = [
  { source: 'gene_A1', target: 'gene_B1', identity: 95.5 },
  { source: 'gene_A1', target: 'gene_C1', identity: 85.2 },
  { source: 'gene_B1', target: 'gene_C1', identity: 88.0 },
  { source: 'gene_A2', target: 'gene_B2', identity: 92.3 },
  { source: 'gene_A2', target: 'gene_C2', identity: 78.5 },
  { source: 'gene_B2', target: 'gene_C2', identity: 80.1 },
  { source: 'gene_A3', target: 'gene_B3', identity: 97.8 },
  { source: 'gene_A3', target: 'gene_C3', identity: 91.2 },
  { source: 'gene_B3', target: 'gene_C3', identity: 93.5 },
  { source: 'gene_A4', target: 'gene_B4', identity: 89.0 },
  { source: 'gene_A4', target: 'gene_C4', identity: 75.3 },
  { source: 'gene_B4', target: 'gene_C4', identity: 77.8 },
  { source: 'gene_A5', target: 'gene_B5', identity: 94.2 },
  { source: 'gene_A5', target: 'gene_C5', identity: 82.1 },
  { source: 'gene_B5', target: 'gene_C5', identity: 84.5 },
]

// Nucleotide links (DNA-level synteny)
const SAMPLE_NUCLEOTIDE_LINKS = [
  { source_seqid: 'genome_A', source_start: 1000, source_end: 4200, target_seqid: 'genome_B', target_start: 500, target_end: 3700, identity: 92.5 },
  { source_seqid: 'genome_A', source_start: 4500, source_end: 7800, target_seqid: 'genome_B', target_start: 4000, target_end: 7200, identity: 88.3 },
  { source_seqid: 'genome_A', source_start: 1000, source_end: 4200, target_seqid: 'genome_C', target_start: 800, target_end: 4000, identity: 85.1 },
  { source_seqid: 'genome_B', source_start: 500, source_end: 3700, target_seqid: 'genome_C', target_start: 800, target_end: 4000, identity: 90.2 },
]

// Domains (protein domain annotations)
const SAMPLE_DOMAINS = [
  { gene_id: 'gene_A2', domain_id: 'PF00005', start: 10, end: 200, source: 'pfam', evalue: 1e-50, coverage: 0.85 },
  { gene_id: 'gene_A2', domain_id: 'PF00664', start: 250, end: 400, source: 'pfam', evalue: 1e-30, coverage: 0.75 },
  { gene_id: 'gene_A3', domain_id: 'PF00271', start: 5, end: 180, source: 'pfam', evalue: 1e-45, coverage: 0.90 },
  { gene_id: 'gene_B2', domain_id: 'PF00005', start: 15, end: 205, source: 'pfam', evalue: 1e-48, coverage: 0.83 },
  { gene_id: 'gene_B2', domain_id: 'PF00664', start: 255, end: 405, source: 'pfam', evalue: 1e-28, coverage: 0.73 },
  { gene_id: 'gene_B3', domain_id: 'PF00271', start: 8, end: 183, source: 'pfam', evalue: 1e-42, coverage: 0.88 },
  { gene_id: 'gene_C2', domain_id: 'PF00005', start: 12, end: 202, source: 'pfam', evalue: 1e-45, coverage: 0.80 },
  { gene_id: 'gene_C3', domain_id: 'PF00271', start: 10, end: 185, source: 'pfam', evalue: 1e-40, coverage: 0.85 },
]

// Protein metadata (clusters for coloring)
const SAMPLE_PROTEIN_METADATA: Record<string, any> = {
  gene_A1: { product: 'Hypothetical protein', cluster: '1' },
  gene_A2: { product: 'ABC transporter', cluster: '2' },
  gene_A3: { product: 'DNA helicase', cluster: '3' },
  gene_A4: { product: 'Methyltransferase', cluster: '4' },
  gene_A5: { product: 'Restriction enzyme', cluster: '5' },
  gene_B1: { product: 'Hypothetical protein', cluster: '1' },
  gene_B2: { product: 'ABC transporter', cluster: '2' },
  gene_B3: { product: 'DNA helicase', cluster: '3' },
  gene_B4: { product: 'Methyltransferase', cluster: '4' },
  gene_B5: { product: 'Restriction enzyme', cluster: '5' },
  gene_C1: { product: 'Hypothetical protein', cluster: '1' },
  gene_C2: { product: 'ABC transporter', cluster: '2' },
  gene_C3: { product: 'DNA helicase', cluster: '3' },
  gene_C4: { product: 'Methyltransferase', cluster: '4' },
  gene_C5: { product: 'Restriction enzyme', cluster: '5' },
}

// Tree metadata (taxonomy for coloring)
const SAMPLE_TREE_METADATA: Record<string, any> = {
  genome_A: { species: 'Escherichia coli', phylum: 'Proteobacteria', class: 'Gammaproteobacteria' },
  genome_B: { species: 'Salmonella enterica', phylum: 'Proteobacteria', class: 'Gammaproteobacteria' },
  genome_C: { species: 'Pseudomonas aeruginosa', phylum: 'Proteobacteria', class: 'Gammaproteobacteria' },
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
  vizData,
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
        // Store the instance so we can destroy it on unmount
        if (type === 'dashboard') {
          // Dashboard mode: uses dataPaths to load parquet files
          const finalDataPaths = dataPaths || DEFAULT_DATA_PATHS
          instanceRef.current = window.HoodiniViz.createDashboard({
            container: containerRef.current,
            dataPaths: finalDataPaths,
            ...config
          })
        } else {
          // Viz mode: uses inline data (vizData prop)
          instanceRef.current = window.HoodiniViz.createViz({
            container: containerRef.current,
            ...vizData,
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
  }, [type, dataPaths, vizData, config, isVisible])

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

// ============================================================================
// HOODINIDASHBOARD DEMOS (with data loading from parquet files)
// ============================================================================

/** Full dashboard with all features and sidebar */
export function DashboardBasicDemo() {
  return <HoodiniDemo type="dashboard" />
}

/** Dashboard with custom color palettes */
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

/** Dashboard without sidebar (embedded mode) */
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

/** Dashboard highlighting protein and nucleotide links */
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

/** Dashboard highlighting protein domains */
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

/** Dashboard with tree metadata coloring */
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

// ============================================================================
// HOODINIVIZ DEMOS (incremental complexity with inline data)
// ============================================================================

/** 
 * 1. Genes Only - The simplest possible visualization
 * Just genes without tree, links, or domains
 */
export function VizGenesOnlyDemo() {
  return (
    <HoodiniDemo 
      type="viz"
      vizData={{
        gffFeatures: SAMPLE_GFF_FEATURES,
        hoods: SAMPLE_HOODS,
        proteinLinks: [],
        nucleotideLinks: [],
        domains: [],
      }}
      config={{
        showScrollbar: true,
        showRuler: true,
      }}
      height="400px"
    />
  )
}

/**
 * 2. Genes + Labels - Genes with protein metadata for labels
 */
export function VizGenesWithLabelsDemo() {
  return (
    <HoodiniDemo 
      type="viz"
      vizData={{
        gffFeatures: SAMPLE_GFF_FEATURES,
        hoods: SAMPLE_HOODS,
        proteinLinks: [],
        nucleotideLinks: [],
        domains: [],
        proteinMetadata: SAMPLE_PROTEIN_METADATA,
      }}
      config={{
        showScrollbar: true,
        showRuler: true,
        geneLabelSize: 14,
      }}
      height="450px"
    />
  )
}

/**
 * 3. Genes + Tree - Add phylogenetic tree
 */
export function VizWithTreeDemo() {
  return (
    <HoodiniDemo 
      type="viz"
      vizData={{
        newickStr: SAMPLE_NEWICK,
        gffFeatures: SAMPLE_GFF_FEATURES,
        hoods: SAMPLE_HOODS,
        proteinLinks: [],
        nucleotideLinks: [],
        domains: [],
      }}
      config={{
        showScrollbar: true,
        showRuler: true,
      }}
      height="450px"
    />
  )
}

/**
 * 4. With Protein Links - Show synteny between homologous genes
 */
export function VizWithProteinLinksDemo() {
  return (
    <HoodiniDemo 
      type="viz"
      vizData={{
        newickStr: SAMPLE_NEWICK,
        gffFeatures: SAMPLE_GFF_FEATURES,
        hoods: SAMPLE_HOODS,
        proteinLinks: SAMPLE_PROTEIN_LINKS,
        nucleotideLinks: [],
        domains: [],
        proteinMetadata: SAMPLE_PROTEIN_METADATA,
      }}
      config={{
        showScrollbar: true,
        showRuler: true,
        genePalette: { type: 'qualitative', name: 'Set2', numColors: 8, enabled: true },
        geneColorBy: 'cluster',
        proteinLinkConfig: { colorBy: 'source_gene', useAlpha: true, minAlpha: 0.1, maxAlpha: 0.5 },
      }}
      height="500px"
    />
  )
}

/**
 * 5. With Nucleotide Links - Show DNA-level synteny
 */
export function VizWithNucleotideLinksDemo() {
  return (
    <HoodiniDemo 
      type="viz"
      vizData={{
        newickStr: SAMPLE_NEWICK,
        gffFeatures: SAMPLE_GFF_FEATURES,
        hoods: SAMPLE_HOODS,
        proteinLinks: [],
        nucleotideLinks: SAMPLE_NUCLEOTIDE_LINKS,
        domains: [],
      }}
      config={{
        showScrollbar: true,
        showRuler: true,
        nucleotideLinkConfig: { colorBy: 'identity', useAlpha: true, minAlpha: 0.2, maxAlpha: 0.7 },
      }}
      height="500px"
    />
  )
}

/**
 * 6. With Domains - Show protein domain annotations
 */
export function VizWithDomainsDemo() {
  return (
    <HoodiniDemo 
      type="viz"
      vizData={{
        newickStr: SAMPLE_NEWICK,
        gffFeatures: SAMPLE_GFF_FEATURES,
        hoods: SAMPLE_HOODS,
        proteinLinks: [],
        nucleotideLinks: [],
        domains: SAMPLE_DOMAINS,
        proteinMetadata: SAMPLE_PROTEIN_METADATA,
      }}
      config={{
        showScrollbar: true,
        showRuler: true,
        geneHeight: 70,
        domainPalette: { type: 'qualitative', name: 'Prism', numColors: 10, enabled: true },
        domainColorBy: 'domainName',
      }}
      height="500px"
    />
  )
}

/**
 * 7. Full Viz - All features combined
 */
export function VizFullDemo() {
  return (
    <HoodiniDemo 
      type="viz"
      vizData={{
        newickStr: SAMPLE_NEWICK,
        gffFeatures: SAMPLE_GFF_FEATURES,
        hoods: SAMPLE_HOODS,
        proteinLinks: SAMPLE_PROTEIN_LINKS,
        nucleotideLinks: SAMPLE_NUCLEOTIDE_LINKS,
        domains: SAMPLE_DOMAINS,
        proteinMetadata: SAMPLE_PROTEIN_METADATA,
        treeMetadata: SAMPLE_TREE_METADATA,
      }}
      config={{
        showScrollbar: true,
        showRuler: true,
        geneHeight: 70,
        genePalette: { type: 'qualitative', name: 'Bold', numColors: 10, enabled: true },
        geneColorBy: 'cluster',
        domainPalette: { type: 'qualitative', name: 'Prism', numColors: 10, enabled: true },
        domainColorBy: 'domainName',
        proteinLinkConfig: { colorBy: 'source_gene', useAlpha: true, minAlpha: 0.1, maxAlpha: 0.5 },
      }}
      height="600px"
    />
  )
}

// ============================================================================
// LEGACY EXPORTS (for backwards compatibility with existing MDX pages)
// ============================================================================

/** @deprecated Use VizGenesOnlyDemo or VizWithTreeDemo */
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

/** @deprecated Use VizGenesOnlyDemo */
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

/** @deprecated Use VizFullDemo with compact config */
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
