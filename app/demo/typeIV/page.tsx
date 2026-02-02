'use client'

import { HoodiniDemo } from '../../components/HoodiniDemo'
import { basePath } from '../../config'

// Data paths for the Type IV CRISPR example
const TYPEIV_DATA_PATHS = {
  newick: `${basePath}/data/typeIV/tree.nwk`,
  gffParquet: `${basePath}/data/typeIV/parquet/gff.parquet`,
  hoodsParquet: `${basePath}/data/typeIV/parquet/hoods.parquet`,
  proteinLinksParquet: `${basePath}/data/typeIV/parquet/protein_links.parquet`,
  nucleotideLinksParquet: `${basePath}/data/typeIV/parquet/nucleotide_links.parquet`,
  domainsParquet: `${basePath}/data/typeIV/parquet/domains.parquet`,
  proteinMetadataParquet: `${basePath}/data/typeIV/parquet/protein_metadata.parquet`,
  domainsMetadataParquet: `${basePath}/data/typeIV/parquet/domains_metadata.parquet`,
  treeMetadataParquet: `${basePath}/data/typeIV/parquet/tree_metadata.parquet`,
  ncRNAMetadataParquet: `${basePath}/data/typeIV/parquet/ncrna_metadata.parquet`,
}

// Paper info
const PAPER_INFO = {
  doi: '10.1016/j.chom.2024.04.016',
  title: 'Type IV-A3 CRISPR-Cas systems drive inter-plasmid conflicts by acquiring spacers in trans',
  authors: 'Benz F, Camara-Wilpert S, Russel J, et al.',
  journal: 'Cell Host Microbe',
  year: 2024,
  volume: '32',
  issue: '6',
}

// System description
const SYSTEM_DESCRIPTION = `Type IV CRISPR-Cas systems are uniquely encoded on plasmids rather than bacterial chromosomes. Unlike other CRISPR systems that provide immunity against foreign genetic elements, Type IV-A3 systems mediate inter-plasmid conflicts through a distinct mechanism: they acquire spacers in trans from competing plasmids, leading to plasmid elimination during conjugation.

This visualization explores the genomic neighborhoods of Type IV-A3 CRISPR-Cas loci across diverse plasmids, revealing the conserved association with the DinG helicase and the unique organization of these plasmid-encoded defense systems.`

export default function TypeIVDemoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Type IV-A3 CRISPR-Cas | DinG
                </h1>
                <a
                  href={`https://doi.org/${PAPER_INFO.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <img 
                    src={`${basePath}/images/cell-favicon.ico`}
                    alt="Cell Host Microbe" 
                    className="w-4 h-4"
                  />
                  <span>{PAPER_INFO.authors} ({PAPER_INFO.year}). <em>{PAPER_INFO.journal}</em></span>
                </a>
                <span className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium">CRISPR</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-medium">Plasmids</span>
                  <a href="https://github.com/Russel88/CRISPRCasTyper" target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 text-xs font-medium hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-colors">CCtyper</a>
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-4xl text-justify">
                {SYSTEM_DESCRIPTION}
              </p>
            </div>
            <a
              href={`${basePath}/gallery`}
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
          dataPaths={TYPEIV_DATA_PATHS} 
          config={{
            initialState: {
              geneColorBy: 'cctyper_gene'
            }
          }}
        />
      </div>
    </div>
  )
}
