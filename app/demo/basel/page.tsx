'use client'

import { HoodiniDemo } from '../../components/HoodiniDemo'
import { basePath } from '../../config'

// Data paths for the BASEL phage collection
const BASEL_DATA_PATHS = {
  newick: '/data/basel/tree.nwk',
  gffParquet: '/data/basel/parquet/gff.parquet',
  hoodsParquet: '/data/basel/parquet/hoods.parquet',
  proteinLinksParquet: '/data/basel/parquet/protein_links.parquet',
  nucleotideLinksParquet: '/data/basel/parquet/nucleotide_links.parquet',
  domainsParquet: '/data/basel/parquet/domains.parquet',
  proteinMetadataParquet: '/data/basel/parquet/protein_metadata.parquet',
  domainsMetadataParquet: '/data/basel/parquet/domains_metadata.parquet',
  treeMetadataParquet: '/data/basel/parquet/tree_metadata.parquet',
  ncRNAMetadataParquet: '/data/basel/parquet/ncrna_metadata.parquet',
}

// Paper info
const PAPER_INFO = {
  doi: '10.1371/journal.pbio.3003063',
  title: 'Completing the BASEL phage collection to unlock hidden diversity for systematic exploration of phage–host interactions',
  authors: 'Humolli D, Piel D, Maffei E, et al.',
  journal: 'PLOS Biology',
  year: 2025,
}

// System description
const SYSTEM_DESCRIPTION = `The BASEL (BActeriophage SElection for your Laboratory) collection comprises 106 well-characterized E. coli phages representing over 30 genera. This completed collection includes 37 newly isolated phages that were previously inaccessible due to the lack of O-antigen glycans and resident bacterial immunity in standard E. coli K-12 laboratory strains.

The collection includes diverse viral groups such as Kagunavirus, Nonanavirus, Gordonclarkvirinae, Gamaleyavirus, and Wifcevirus. These phages have been deeply characterized genomically and phenotypically regarding host receptors, sensitivity to antiviral defense systems, and host range, providing a valuable resource for studying phage-host interactions and their molecular mechanisms.`

export default function BaselDemoPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-transparent to-purple-500/10 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  BASEL Phage Collection | E. coli Phages
                </h1>
                <a
                  href={`https://doi.org/${PAPER_INFO.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-amber-500 transition-colors"
                >
                  <img 
                    src={`${basePath}/images/plos-favicon.ico`}
                    alt="PLOS Biology" 
                    className="w-4 h-4"
                  />
                  <span>{PAPER_INFO.authors} ({PAPER_INFO.year}). <em>{PAPER_INFO.journal}</em></span>
                </a>
                <span className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 text-xs font-medium">Bacteriophages</span>
                  <span className="px-2 py-0.5 rounded-full bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300 text-xs font-medium">E. coli</span>
                  <a href="https://academic.oup.com/nargab/article/3/3/lqab067/6342220" target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 text-xs font-medium hover:bg-fuchsia-200 dark:hover:bg-fuchsia-900/50 transition-colors">PHROG</a>
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
          dataPaths={BASEL_DATA_PATHS}
          config={{
            initialState: {
              domainSource: 'phrog',
              domainColorBy: 'L1_phrog',
              domainPalette: { type: 'qualitative', name: 'RPRlab', numColors: 12, enabled: true },
              treeLabelBy: ['species', 'ICTV genus', 'Bas##'],
        treeColorBy: 'ICTV genus',
              genePalette: { enabled: false },
            }
          }}
          height="100%"
        />
      </div>
    </div>
  )
}
