'use client'

import { HoodiniDemo } from '../../components/HoodiniDemo'
import { basePath } from '../../config'

// Data paths for the CRISPR-Cas9 example
const CAS9_DATA_PATHS = {
  newick: '/data/cas9/tree.nwk',
  gffParquet: '/data/cas9/parquet/gff.parquet',
  hoodsParquet: '/data/cas9/parquet/hoods.parquet',
  proteinLinksParquet: '/data/cas9/parquet/protein_links.parquet',
  nucleotideLinksParquet: '/data/cas9/parquet/nucleotide_links.parquet',
  domainsParquet: '/data/cas9/parquet/domains.parquet',
  proteinMetadataParquet: '/data/cas9/parquet/protein_metadata.parquet',
  domainsMetadataParquet: '/data/cas9/parquet/domains_metadata.parquet',
  treeMetadataParquet: '/data/cas9/parquet/tree_metadata.parquet',
  ncRNAMetadataParquet: '/data/cas9/parquet/ncrna_metadata.parquet',
}

// Paper info
const PAPER_INFO = {
  doi: '10.1038/nrmicro2577',
  title: 'Evolution and classification of the CRISPR–Cas systems',
  authors: 'Makarova KS, Haft DH, Barrangou R, et al.',
  journal: 'Nature Reviews Microbiology',
  year: 2011,
  volume: '9',
  issue: '6',
}

// System description
const SYSTEM_DESCRIPTION = `CRISPR-Cas systems provide bacteria and archaea with adaptive immunity against invading genetic elements such as phages and plasmids. The Type II CRISPR-Cas9 system, found primarily in pathogenic bacteria, uses a single multidomain protein (Cas9) for interference. Cas9, guided by CRISPR RNA (crRNA) and trans-activating crRNA (tracrRNA), recognizes and cleaves foreign DNA at specific sequences adjacent to PAM motifs.

This visualization explores the genomic neighborhoods of Cas9 orthologs across 268 diverse bacterial genomes, revealing the conserved architecture of Type II CRISPR loci including the signature genes cas1, cas2, and csn2, as well as the associated CRISPR arrays. The revolutionary gene-editing capabilities of Cas9 have made it one of the most important biotechnological tools of the 21st century.`

export default function Cas9DemoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Type II CRISPR-Cas | Cas9
                </h1>
                <a
                  href={`https://doi.org/${PAPER_INFO.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <img 
                    src="/images/nature-favicon.ico" 
                    alt="Nature" 
                    className="w-4 h-4"
                  />
                  <span>{PAPER_INFO.authors} ({PAPER_INFO.year}). <em>{PAPER_INFO.journal}</em></span>
                </a>
                <span className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 text-xs font-medium">CRISPR</span>
                  <a href="https://github.com/Russel88/CRISPRCasTyper" target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">CCtyper</a>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 text-xs font-medium">ncRNA</span>
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
          dataPaths={CAS9_DATA_PATHS}
          height="100%"
        />
      </div>
    </div>
  )
}
