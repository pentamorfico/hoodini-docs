'use client'

import { HoodiniDemo } from '../../components/HoodiniDemo'

// Data paths for the Kongming defense system (KomB) example
const KONGMIN_DATA_PATHS = {
  newick: '/data/kongmin/tree.nwk',
  gffParquet: '/data/kongmin/parquet/gff.parquet',
  hoodsParquet: '/data/kongmin/parquet/hoods.parquet',
  proteinLinksParquet: '/data/kongmin/parquet/protein_links.parquet',
  nucleotideLinksParquet: '/data/kongmin/parquet/nucleotide_links.parquet',
  domainsParquet: '/data/kongmin/parquet/domains.parquet',
  proteinMetadataParquet: '/data/kongmin/parquet/protein_metadata.parquet',
  domainsMetadataParquet: '/data/kongmin/parquet/domains_metadata.parquet',
  treeMetadataParquet: '/data/kongmin/parquet/tree_metadata.parquet',
  ncRNAMetadataParquet: '/data/kongmin/parquet/ncrna_metadata.parquet',
}

// Paper info
const PAPER_INFO = {
  doi: '10.1126/science.ads6055',
  title: 'Base-modified nucleotides mediate immune signaling in bacteria',
  authors: 'Zeng Z, Hu Z, Zhao R, et al.',
  journal: 'Science',
  year: 2025,
  volume: '388',
  issue: '6745',
}

// System description
const SYSTEM_DESCRIPTION = `Kongming encodes three proteins: KomA, an adenosine deaminase; KomB, a modified HAM1-family purine pyrophosphatase; and KomC, a SIR2-like enzyme with NAD+-degrading activity. The system is activated by phage deoxynucleotide monophosphate kinases (DNKs), which are introduced by infecting phages. In the presence of Kongming, this phage enzyme contributes to the production of deoxyinosine triphosphate (dITP), a base-modified nucleotide that acts as an immune signal.

dITP binds to the KomBC complex, triggering the rapid depletion of NAD+, halting cellular activity and preventing phage replication. Structural analyses indicate that KomB has lost its original enzymatic function and now serves as a specialized dITP sensor.`

export default function KongminDemoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-transparent to-purple-500/10 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Kongming Defense System | KomB
                </h1>
                <a
                  href={`https://doi.org/${PAPER_INFO.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-amber-500 transition-colors"
                >
                  <img 
                    src="/images/science-favicon.ico" 
                    alt="Science" 
                    className="w-4 h-4"
                  />
                  <span>{PAPER_INFO.authors} ({PAPER_INFO.year}). <em>{PAPER_INFO.journal}</em></span>
                </a>
                <span className="flex items-center gap-1">
                  <a href="https://github.com/padlocbio/padloc" target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 text-xs font-medium hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors">PADLOC</a>
                  <a href="https://github.com/mdmparis/defense-finder" target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors">DefenseFinder</a>
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-4xl text-justify">
                {SYSTEM_DESCRIPTION}
              </p>
            </div>
            <a
              href="/gallery"
              className="text-sm text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 self-start"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Gallery
            </a>
          </div>
        </div>
      </div>
      
      {/* Demo container */}
      <div className="w-full" style={{ height: 'calc(100vh - 120px)' }}>
        <HoodiniDemo 
          type="dashboard"
          dataPaths={KONGMIN_DATA_PATHS}
          height="100%"
        />
      </div>
    </div>
  )
}
