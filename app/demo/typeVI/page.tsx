'use client'

import { HoodiniDemo } from '../../components/HoodiniDemo'
import { basePath } from '../../config'

// Data paths for the Type VI Retrons example
const TYPEVI_DATA_PATHS = {
  newick: `${basePath}/data/typeVI/tree.nwk`,
  gffParquet: `${basePath}/data/typeVI/parquet/gff.parquet`,
  hoodsParquet: `${basePath}/data/typeVI/parquet/hoods.parquet`,
  proteinLinksParquet: `${basePath}/data/typeVI/parquet/protein_links.parquet`,
  nucleotideLinksParquet: `${basePath}/data/typeVI/parquet/nucleotide_links.parquet`,
  domainsParquet: `${basePath}/data/typeVI/parquet/domains.parquet`,
  proteinMetadataParquet: `${basePath}/data/typeVI/parquet/protein_metadata.parquet`,
  domainsMetadataParquet: `${basePath}/data/typeVI/parquet/domains_metadata.parquet`,
  treeMetadataParquet: `${basePath}/data/typeVI/parquet/tree_metadata.parquet`,
  ncRNAMetadataParquet: `${basePath}/data/typeVI/parquet/ncrna_metadata.parquet`,
}

// Paper info
const PAPER_INFO = {
  doi: '10.1101/2025.10.22.683967',
  title: 'Reverse transcribed ssDNA derepresses translation of a retron antiviral protein',
  authors: 'Zhang K, Rojas-Montero M, Poola D, et al.',
  journal: 'bioRxiv',
  year: 2025,
}

// System description
const SYSTEM_DESCRIPTION = `Type VI retrons are bacterial immune systems with a non-canonical mechanism of defense. Unlike other retrons that constitutively produce multicopy single-stranded DNA (msDNA), Type VI retrons only generate msDNA upon phage infection. The system contains a hybrid RNA (hyRNA) that combines the reverse transcription template with a translationally repressed toxic effector.

Upon phage infection, the accumulation of msDNA derepresses translation of the antiviral toxin, triggering cell death and preventing phage spread. This visualization explores the genomic neighborhoods of Type VI retrons, together with other members from the same RT clade such as Type IV and Type V.`

export default function TypeVIDemoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Type VI Retrons | RT
                </h1>
                <a
                  href={`https://doi.org/${PAPER_INFO.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <img 
                    src={`${basePath}/images/biorxiv-favicon.ico`}
                    alt="bioRxiv" 
                    className="w-4 h-4"
                  />
                  <span>{PAPER_INFO.authors} ({PAPER_INFO.year}). <em>{PAPER_INFO.journal}</em></span>
                </a>
                <span className="flex items-center gap-1">
                  <a href="https://github.com/padlocbio/padloc" target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 text-xs font-medium hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors">PADLOC</a>
                  <a href="https://github.com/mdmparis/defense-finder" target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors">DefenseFinder</a>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-medium">Defense Systems</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-xs font-medium">sORFs</span>
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

      {/* Main content */}
      <div className="h-[calc(100vh-120px)]">
        <HoodiniDemo 
          dataPaths={TYPEVI_DATA_PATHS} 
          config={{
            initialState: {
              geneColorBy: 'padloc_system',
              treeColorBy: 'retron_classification',
              treeLabelBy: ['species', 'retron_classification']
            }
          }}
        />
      </div>
    </div>
  )
}
