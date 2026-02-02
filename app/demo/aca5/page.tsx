'use client'

import { HoodiniDemo } from '../../components/HoodiniDemo'
import { basePath } from '../../config'

// Data paths for the Aca5 anti-CRISPR example
const ACA5_DATA_PATHS = {
  newick: '/data/aca5/tree.nwk',
  gffParquet: '/data/aca5/parquet/gff.parquet',
  hoodsParquet: '/data/aca5/parquet/hoods.parquet',
  proteinLinksParquet: '/data/aca5/parquet/protein_links.parquet',
  nucleotideLinksParquet: '/data/aca5/parquet/nucleotide_links.parquet',
  domainsParquet: '/data/aca5/parquet/domains.parquet',
  proteinMetadataParquet: '/data/aca5/parquet/protein_metadata.parquet',
  domainsMetadataParquet: '/data/aca5/parquet/domains_metadata.parquet',
  treeMetadataParquet: '/data/aca5/parquet/tree_metadata.parquet',
  ncRNAMetadataParquet: '/data/aca5/parquet/ncrna_metadata.parquet',
}

// Paper info
const PAPER_INFO = {
  doi: '10.1038/s41467-020-19415-3',
  title: 'Discovery of multiple anti-CRISPRs highlights anti-defense gene clustering in mobile genetic elements',
  authors: 'Pinilla-Redondo R, Shehreen S, Marino ND, et al.',
  journal: 'Nature Communications',
  year: 2020,
  volume: '11',
  issue: '5652',
}

// System description
const SYSTEM_DESCRIPTION = `Anti-CRISPR (Acr) proteins are phage-encoded inhibitors that allow mobile genetic elements to evade CRISPR-Cas immunity. Aca5 is an Acr-associated protein found downstream of acr loci that serves as a marker for discovering new anti-CRISPR genes in Enterobacteriaceae.

This visualization explores the genomic neighborhoods of Aca5 homologs, revealing the clustering of multiple anti-defense genes within prophages and conjugative elements. The study uncovered 11 new type I-F and I-E anti-CRISPR families, demonstrating how MGEs accumulate diverse immune evasion strategies in "anti-defense islands."`

export default function Aca5DemoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Anti-CRISPR Loci | Aca5
                </h1>
                <a
                  href={`https://doi.org/${PAPER_INFO.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <img 
                    src={`${basePath}/images/nature-favicon.ico`}
                    alt="Nature Communications" 
                    className="w-4 h-4"
                  />
                  <span>{PAPER_INFO.authors} ({PAPER_INFO.year}). <em>{PAPER_INFO.journal}</em></span>
                </a>
                <span className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 text-xs font-medium">Anti-CRISPR</span>
                  <a href="https://academic.oup.com/nar/article/53/1/gkae1171/7919512" target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-xs font-medium hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">Antidefense Finder</a>
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-4xl text-justify">
                {SYSTEM_DESCRIPTION}
              </p>
            </div>
            <a
              href="/gallery"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start"
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
          dataPaths={ACA5_DATA_PATHS}
          config={{
            initialState: {
              geneColorBy: 'deffinder_gene',
            }
          }}
          height="100%"
        />
      </div>
    </div>
  )
}
