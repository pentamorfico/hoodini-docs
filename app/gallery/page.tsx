'use client'

import { useState } from 'react'
import Link from 'next/link'

// Gallery items - replace placeholder images with real screenshots later
const galleryItems = [
  {
    id: 'cas9-crispr',
    title: 'CRISPR-Cas9 Systems',
    description: 'Comparative analysis of Cas9 neighborhoods across 150+ bacterial species, revealing conserved CRISPR array architectures.',
    image: '/images/gallery/cas9-placeholder.svg',
    tags: ['CRISPR', 'Defense Systems', 'Streptococcus'],
    demoUrl: 'https://storage.hoodini.bio/hoodini-demo.html',
    organisms: '156 genomes',
    treeMode: 'taxonomy',
  },
  {
    id: 'toxin-antitoxin',
    title: 'Toxin-Antitoxin Modules',
    description: 'Type II TA systems across Enterobacteriaceae, showing genomic context conservation and mobile element associations.',
    image: '/images/gallery/ta-placeholder.svg',
    tags: ['Toxin-Antitoxin', 'Mobile Elements', 'E. coli'],
    demoUrl: 'https://storage.hoodini.bio/hoodini-demo.html',
    organisms: '89 genomes',
    treeMode: 'aai_tree',
  },
  {
    id: 'phage-defense',
    title: 'Anti-Phage Defense Islands',
    description: 'Defense system clusters including CBASS, Thoeris, and Retrons in Pseudomonas aeruginosa clinical isolates.',
    image: '/images/gallery/defense-placeholder.svg',
    tags: ['Defense Islands', 'PADLOC', 'Pseudomonas'],
    demoUrl: 'https://storage.hoodini.bio/hoodini-demo.html',
    organisms: '234 genomes',
    treeMode: 'ani_tree',
  },
  {
    id: 'secretion-systems',
    title: 'Type VI Secretion Systems',
    description: 'T6SS gene clusters and their cargo effectors across pathogenic and environmental Vibrio species.',
    image: '/images/gallery/t6ss-placeholder.svg',
    tags: ['Secretion', 'Virulence', 'Vibrio'],
    demoUrl: 'https://storage.hoodini.bio/hoodini-demo.html',
    organisms: '312 genomes',
    treeMode: 'taxonomy',
  },
  {
    id: 'biosynthetic',
    title: 'Secondary Metabolite Clusters',
    description: 'NRPS and PKS biosynthetic gene clusters in Streptomyces, revealing novel natural product pathways.',
    image: '/images/gallery/bgc-placeholder.svg',
    tags: ['BGC', 'Natural Products', 'Streptomyces'],
    demoUrl: 'https://storage.hoodini.bio/hoodini-demo.html',
    organisms: '78 genomes',
    treeMode: 'neigh_similarity_tree',
  },
  {
    id: 'prophages',
    title: 'Prophage Integration Sites',
    description: 'Integrated prophages and their genomic neighborhoods in Salmonella enterica serovars.',
    image: '/images/gallery/prophage-placeholder.svg',
    tags: ['Prophage', 'geNomad', 'Salmonella'],
    demoUrl: 'https://storage.hoodini.bio/hoodini-demo.html',
    organisms: '445 genomes',
    treeMode: 'taxonomy',
  },
]

const tagColors: Record<string, string> = {
  'CRISPR': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Defense Systems': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Defense Islands': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Toxin-Antitoxin': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Mobile Elements': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Secretion': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Virulence': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'BGC': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Natural Products': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Prophage': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'PADLOC': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'geNomad': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  default: 'bg-gray-100 text-gray-700 dark:bg-[#1a1a1a] dark:text-gray-300',
}

function GalleryCard({ item, index }: { item: typeof galleryItems[0], index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <a
      href={item.demoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        relative overflow-hidden rounded-2xl border border-gray-200 dark:border-[#222]
        bg-white dark:bg-[#111]/50 backdrop-blur-sm
        transition-all duration-300 ease-out
        ${isHovered ? 'shadow-2xl shadow-amber-500/10 -translate-y-2 border-amber-400/50' : 'shadow-lg'}
      `}>
        {/* Image placeholder */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#111] dark:to-[#111]">
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
            {item.tags.map(tag => (
              <span
                key={tag}
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${tagColors[tag] || tagColors.default}`}
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 pt-3 border-t border-gray-100 dark:border-[#222]">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              {item.organisms}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              {item.treeMode}
            </span>
          </div>
        </div>
      </div>
    </a>
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
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Target genes highlighted
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                Conserved clusters
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gallery grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
