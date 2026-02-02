'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { basePath } from '../config'

// Gallery items - replace placeholder images with real screenshots later
const galleryItems = [
  {
    id: 'kongmin-komb',
    title: 'Kongming Defense System | KomB',
    description: 'Genomic neighborhoods of KomB, a modified HAM1-family purine pyrophosphatase that acts as a dITP sensor in the Kongming bacterial immune system.',
    image: '/images/gallery/sir2-placeholder.svg',
    tags: ['PADLOC', 'DefenseFinder', 'Defense Systems'],
    demoUrl: '/demo/kongmin',
    organisms: '69 genomes',
    treeMode: '',
    isReal: true,
    paper: {
      doi: '10.1126/science.ads6055',
      title: 'Base-modified nucleotides mediate immune signaling in bacteria',
      authors: 'Zeng Z, Hu Z, Zhao R, et al.',
      journal: 'Science',
      year: 2025,
    },
  },
  {
    id: 'basel-phages',
    title: 'BASEL Phage Collection | E. coli',
    description: 'Complete collection of 106 E. coli phages from over 30 genera, deeply characterized for host receptors, defense system sensitivity, and host range.',
    image: '/images/gallery/phage-placeholder.svg',
    tags: ['Bacteriophages', 'E. coli', 'PHROG'],
    demoUrl: '/demo/basel',
    organisms: '114 phages',
    treeMode: '',
    isReal: true,
    paper: {
      doi: '10.1371/journal.pbio.3003063',
      title: 'Completing the BASEL phage collection to unlock hidden diversity for systematic exploration of phage–host interactions',
      authors: 'Humolli D, Piel D, Maffei E, et al.',
      journal: 'PLOS Biology',
      year: 2025,
    },
  },
  {
    id: 'cas9-crispr',
    title: 'Type II CRISPR-Cas | Cas9',
    description: 'Comprehensive analysis of Type II CRISPR-Cas9 systems across diverse bacterial phyla, exploring the genomic context of the revolutionary gene-editing nuclease.',
    image: '/images/gallery/cas9-placeholder.svg',
    tags: ['CRISPR', 'CCtyper', 'ncRNA'],
    demoUrl: '/demo/cas9',
    organisms: '268 genomes',
    treeMode: 'taxonomy',
    isReal: true,
    paper: {
      doi: '10.1038/nrmicro2577',
      title: 'Evolution and classification of the CRISPR–Cas systems',
      authors: 'Makarova KS, Haft DH, Barrangou R, et al.',
      journal: 'Nature Reviews Microbiology',
      year: 2011,
    },
  },
  {
    id: 'aca5-acr',
    title: 'Anti-CRISPR Loci | Aca5',
    description: 'Discovery of multiple anti-CRISPR proteins by leveraging aca5 as a marker gene, revealing anti-defense gene clustering in mobile genetic elements.',
    image: '/images/gallery/acr-placeholder.svg',
    tags: ['Anti-CRISPR', 'Antidefense Finder'],
    demoUrl: '/demo/aca5',
    organisms: '76 genomes',
    treeMode: '',
    isReal: true,
    paper: {
      doi: '10.1038/s41467-020-19415-3',
      title: 'Discovery of multiple anti-CRISPRs highlights anti-defense gene clustering in mobile genetic elements',
      authors: 'Pinilla-Redondo R, Shehreen S, Marino ND, et al.',
      journal: 'Nature Communications',
      year: 2020,
    },
  },
  {
    id: 'typeiv-crispr',
    title: 'Type IV-A3 CRISPR-Cas | DinG',
    description: 'Plasmid-encoded Type IV-A3 CRISPR-Cas systems that drive inter-plasmid conflicts by acquiring spacers in trans, leading to plasmid elimination.',
    image: '/images/gallery/typeiv-placeholder.svg',
    tags: ['CRISPR', 'Plasmids', 'CCtyper'],
    demoUrl: '/demo/typeIV',
    organisms: '198 genomes',
    treeMode: '',
    isReal: true,
    paper: {
      doi: '10.1016/j.chom.2024.04.016',
      title: 'Type IV-A3 CRISPR-Cas systems drive inter-plasmid conflicts by acquiring spacers in trans',
      authors: 'Benz F, Camara-Wilpert S, Russel J, et al.',
      journal: 'Cell Host Microbe',
      year: 2024,
    },
  },
  {
    id: 'typevi-retrons',
    title: 'Type VI Retrons | RT',
    description: 'Non-canonical Type VI retrons that produce msDNA only upon phage infection, derepressing translation of an antiviral toxin through a hybrid RNA mechanism.',
    image: '/images/gallery/retron-placeholder.svg',
    tags: ['PADLOC', 'DefenseFinder', 'Defense Systems', 'sORFs'],
    demoUrl: '/demo/typeVI',
    organisms: '1,490 genomes',
    treeMode: '',
    isReal: true,
    paper: {
      doi: '10.1101/2025.10.22.683967',
      title: 'Reverse transcribed ssDNA derepresses translation of a retron antiviral protein',
      authors: 'Zhang K, Rojas-Montero M, Poola D, et al.',
      journal: 'bioRxiv',
      year: 2025,
    },
  },
]

const tagColors: Record<string, string> = {
  'CRISPR': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  'Anti-CRISPR': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  'CCtyper': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Defense Systems': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Defense Islands': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'DefenseFinder': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'PADLOC': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'Retrons': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  'Antidefense Finder': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'sORFs': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Toxin-Antitoxin': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Mobile Elements': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Plasmids': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Secretion': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Virulence': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'BGC': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Natural Products': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Prophage': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'geNomad': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'SIR2': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  'NAD-dependent': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  'Proteobacteria': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Bacteriophages': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  'E. coli': 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300',
  'Host Range': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  'PHROG': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
  'ncRNA': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  default: 'bg-gray-100 text-gray-700 dark:bg-[#1a1a1a] dark:text-gray-300',
}

// Tag links for tools/databases
const tagLinks: Record<string, string> = {
  'CCtyper': 'https://github.com/Russel88/CRISPRCasTyper',
  'PHROG': 'https://academic.oup.com/nargab/article/3/3/lqab067/6342220',
  'PADLOC': 'https://github.com/padlocbio/padloc',
  'DefenseFinder': 'https://github.com/mdmparis/defense-finder',
  'geNomad': 'https://github.com/apcamargo/genomad',
  'Antidefense Finder': 'https://academic.oup.com/nar/article/53/1/gkae1171/7919512',
}

function GalleryCard({ item, index }: { item: typeof galleryItems[0], index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const isReal = 'isReal' in item && item.isReal
  
  // Use Link for internal routes, <a> for external
  const CardWrapper = isReal ? Link : 'a'
  const linkProps = isReal 
    ? { href: item.demoUrl }
    : { href: item.demoUrl, target: '_blank', rel: 'noopener noreferrer' }
  
  return (
    <CardWrapper
      {...linkProps}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`
          relative overflow-hidden rounded-2xl border border-gray-200 dark:border-[#222]
          bg-white dark:bg-[#111]/50 backdrop-blur-sm
          transition-all duration-300 ease-out
          ${isHovered ? 'shadow-2xl shadow-amber-500/10 -translate-y-2 border-amber-400/50' : 'shadow-lg'}
        `}
        style={{ contain: 'layout' }}
      >
        {/* Image placeholder */}
        <div 
          className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#111] dark:to-[#111]"
          style={{ aspectRatio: '16/10' }}
        >
          {/* Decorative visualization mockup */}
          <div className="absolute inset-0 p-4">
            <GalleryPlaceholder index={index} title={item.title} />
          </div>
          
          {/* Hover overlay */}
          <div className={`
            absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent
            flex items-end justify-center pb-6
            transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}>
            <span className="px-4 py-2 bg-amber-400 text-gray-900 rounded-full font-semibold text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Interactive
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-amber-500 transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {item.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map(tag => {
              const hasLink = tag in tagLinks
              const TagComponent = hasLink ? 'a' : 'span'
              const tagProps = hasLink ? {
                href: tagLinks[tag],
                target: '_blank',
                rel: 'noopener noreferrer',
                onClick: (e: React.MouseEvent) => e.stopPropagation(),
              } : {}
              return (
                <TagComponent
                  key={tag}
                  {...tagProps}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${tagColors[tag] || tagColors.default} ${hasLink ? 'hover:opacity-80 transition-opacity cursor-pointer' : ''}`}
                >
                  {tag}
                </TagComponent>
              )
            })}
          </div>
          
          {/* Paper citation (if available) */}
          {'paper' in item && item.paper && (
            <div className="mb-4 p-2 bg-gray-50 dark:bg-[#0a0a0a] rounded-lg border border-gray-100 dark:border-[#222]">
              <a 
                href={`https://doi.org/${item.paper.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start gap-2">
                  {item.paper.journal === 'Science' ? (
                    <img 
                      src={`${basePath}/images/science-favicon.ico`}
                      alt="Science" 
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                    />
                  ) : item.paper.journal === 'PLOS Biology' ? (
                    <img 
                      src={`${basePath}/images/plos-favicon.ico`}
                      alt="PLOS Biology" 
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                    />
                  ) : item.paper.journal === 'Nature Reviews Microbiology' || item.paper.journal === 'Nature Communications' ? (
                    <img 
                      src={`${basePath}/images/nature-favicon.ico`}
                      alt={item.paper.journal} 
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                    />
                  ) : item.paper.journal === 'Cell Host Microbe' ? (
                    <img 
                      src={`${basePath}/images/cell-favicon.ico`}
                      alt="Cell Host Microbe" 
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                    />
                  ) : item.paper.journal === 'bioRxiv' ? (
                    <img 
                      src={`${basePath}/images/biorxiv-favicon.ico`}
                      alt="bioRxiv" 
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                    />
                  ) : (
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700 dark:text-gray-300 line-clamp-2">{item.paper.title}</span>
                    <span className="text-gray-500 dark:text-gray-500 mt-0.5">
                      {item.paper.authors} ({item.paper.year}). <em>{item.paper.journal}</em>
                    </span>
                  </div>
                </div>
              </a>
            </div>
          )}
          
          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 pt-3 border-t border-gray-100 dark:border-[#222]">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              {item.organisms}
            </span>
            {item.treeMode && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                {item.treeMode}
              </span>
            )}
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}

// Decorative placeholder that looks like a gene neighborhood visualization
function GalleryPlaceholder({ index, title }: { index: number, title: string }) {
  const colors = [
    ['#3B82F6', '#60A5FA', '#93C5FD', '#FBBF24', '#F59E0B'],
    ['#8B5CF6', '#A78BFA', '#C4B5FD', '#EC4899', '#F472B6'],
    ['#10B981', '#34D399', '#6EE7B7', '#F59E0B', '#FBBF24'],
    ['#EF4444', '#F87171', '#FCA5A5', '#3B82F6', '#60A5FA'],
    ['#F59E0B', '#FBBF24', '#FCD34D', '#10B981', '#34D399'],
    ['#EC4899', '#F472B6', '#F9A8D4', '#8B5CF6', '#A78BFA'],
  ]
  const palette = colors[index % colors.length]
  
  return (
    <div className="w-full h-full flex flex-col">
      {/* Mini tree on the left */}
      <div className="flex h-full">
        <div className="w-16 h-full flex flex-col justify-center gap-1 pr-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-0.5">
              <div className="w-3 h-px bg-gray-400/50"></div>
              <div className="w-1 h-1 rounded-full bg-gray-400/50"></div>
            </div>
          ))}
        </div>
        
        {/* Gene arrows visualization */}
        <div className="flex-1 flex flex-col justify-center gap-1.5">
          {[...Array(8)].map((_, row) => (
            <div key={row} className="flex items-center gap-0.5 h-4">
              {[...Array(12)].map((_, col) => {
                const isTarget = col === 5 || col === 6
                const color = isTarget ? '#FBBF24' : palette[(row + col) % palette.length]
                const width = 16 + Math.random() * 24
                const direction = Math.random() > 0.5
                
                return (
                  <div
                    key={col}
                    className="h-full flex items-center"
                    style={{ width: `${width}px` }}
                  >
                    <svg viewBox="0 0 40 16" className="w-full h-full" preserveAspectRatio="none">
                      {direction ? (
                        <polygon
                          points="0,3 32,3 40,8 32,13 0,13"
                          fill={color}
                          opacity={isTarget ? 1 : 0.7}
                        />
                      ) : (
                        <polygon
                          points="8,3 40,3 40,13 8,13 0,8"
                          fill={color}
                          opacity={isTarget ? 1 : 0.7}
                        />
                      )}
                    </svg>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function GalleryPage() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-[#111]">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-purple-500/10"></div>
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Example{' '}
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Gallery
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Explore interactive gene neighborhood visualizations from published studies and example datasets. 
              Click any card to open the full interactive viewer.
            </p>
          </div>
        </div>
      </div>
      
      {/* Gallery grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div 
          className="gap-6 transition-opacity duration-300"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))',
            opacity: mounted ? 1 : 0
          }}
        >
          {galleryItems.map((item, index) => (
            <GalleryCard key={item.id} item={item} index={index} />
          ))}
        </div>
        
        {/* CTA section */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center p-8 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-[#111]/50 dark:to-[#111]/50 border border-gray-200 dark:border-[#222]">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Create your own visualization
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Run Hoodini on your proteins of interest and generate interactive neighborhood comparisons.
            </p>
            <div className="flex gap-4">
              <Link
                href="/docs/hoodini/tutorial"
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-full font-semibold transition-colors"
              >
                Get Started
              </Link>
              <a
                href="https://colab.research.google.com/github/pentamorfico/hoodini-colab/blob/main/hoodini_colab.ipynb"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-white dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-full font-semibold border border-gray-200 dark:border-gray-700 transition-colors flex items-center gap-2"
              >
                <img 
                  src="https://colab.research.google.com/img/colab_favicon_256px.png" 
                  alt="Google Colab" 
                  className="w-5 h-5"
                />
                Try in Colab
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
