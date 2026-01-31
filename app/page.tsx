'use client'

import Link from 'next/link'
import GlowEffect from './components/GlowEffect'
import { HoodiniDemo } from './components/HoodiniDemo'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <GlowEffect />
      {/* Hero */}
      <section className="min-h-[90vh] flex items-center justify-center px-6 text-center">
        <div className="max-w-2xl">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <span className="text-7xl block">🦉</span>
              <span className="text-5xl absolute -top-10 animate-hat-float" style={{ left: 'calc(50% - 1px)' }}>🎩</span>
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
            Hoodini
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">
            Large-scale gene neighborhood analysis and visualization that feel like magic.
          </p>
          
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="badge badge-yellow">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              High-throughput
            </span>
            <span className="badge badge-green">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              GPU interactive visualization
            </span>
            <span className="badge badge-blue">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
              Publication-ready figures
            </span>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto">
            A modern toolkit for gene-centric comparative genomics that does everything for you.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/docs/hoodini/quickstart" 
              className="btn btn-primary glow-btn"
            >
              Get Started
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <a 
              href="https://colab.research.google.com/github/pentamorfico/hoodini-colab/blob/main/hoodini_colab.ipynb"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary glow-btn"
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
      </section>

      {/* Visual Preview */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-[#222] bg-white dark:bg-[#0a0a0a]">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
                <span className="text-sm text-gray-500 font-mono">hoodini-visualization</span>
              </div>
              <Link 
                href="/docs/viz"
                className="text-xs text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-1"
              >
                View documentation
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </Link>
            </div>
            <div className="relative w-full" style={{ height: '600px' }}>
              <HoodiniDemo 
                type="dashboard"
                height="100%"
                lazy={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="glow-card flex items-center gap-4 p-5 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl transition-colors">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge badge-yellow">Settings</span>
              <span className="text-gray-600 dark:text-gray-400">Configure tree and gene display</span>
            </div>
          </div>
          <div className="glow-card flex items-center gap-4 p-5 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl transition-colors">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge badge-green">Palette</span>
              <span className="text-gray-600 dark:text-gray-400">Customize colors and styling</span>
            </div>
          </div>
          <div className="glow-card flex items-center gap-4 p-5 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-xl transition-colors">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge badge-red">Legend</span>
              <span className="text-gray-600 dark:text-gray-400">Understand visualization elements</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge badge-yellow mb-4">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Built for researchers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Everything you need to analyze genomic context, from data retrieval to publication.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📦', title: 'Automated & fast retrieval', desc: 'Fetch assemblies and annotations directly from NCBI. Just provide protein or nucleotide IDs. Analyze thousands of neighborhoods in minutes with optimized pipelines', color: 'amber' },
              { icon: '🛡️', title: 'Rich annotations', desc: 'Run external tools such as PADLOC, DefenseFinder, CRISPR-Cas typer, and geNomad annotations to retrieve informative annotations.', color: 'emerald' },
              { icon: '📊', title: 'Publication ready', desc: 'Export high-resolution SVG figures with highly customizable styling.', color: 'purple' },
            ].map((feature, i) => (
              <div key={i} className="glow-card p-6 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl hover:-translate-y-1 transition-all">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge badge-yellow mb-4">Ecosystem</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Three tools, one ecosystem
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Choose the right tool for your workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/docs/hoodini" className="glow-card group p-7 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl transition-all">
              <span className="badge badge-yellow mb-4">CLI</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Hoodini</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                Python command-line tool. The computational backbone for data processing, analysis, and portable HTML generation.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-full text-xs font-mono text-gray-600 dark:text-gray-400">Python</span>
              </div>
              <span className="text-amber-600 dark:text-amber-400 text-sm font-medium group-hover:underline">Learn more →</span>
            </Link>

            <Link href="/docs/viz" className="glow-card group p-7 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl transition-all">
              <span className="badge badge-blue mb-4">WEB</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Hoodini Viz</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                React visualization library with GPU acceleration. Build custom apps and integrate Hoodini-viz.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-full text-xs font-mono text-gray-600 dark:text-gray-400">TypeScript</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-full text-xs font-mono text-gray-600 dark:text-gray-400">React</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-full text-xs font-mono text-gray-600 dark:text-gray-400">deck.gl</span>
              </div>
              <span className="text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:underline">Learn more →</span>
            </Link>

            <Link href="/docs/colab" className="glow-card group p-7 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-2xl transition-all">
              <span className="badge badge-green mb-4">DIY</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Hoodini Colab</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                Interactive widget for Google Colab. Run analyses in the Google Colab cloud with zero setup required.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-full text-xs font-mono text-gray-600 dark:text-gray-400">Python</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-full text-xs font-mono text-gray-600 dark:text-gray-400">Jupyter</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-full text-xs font-mono text-gray-600 dark:text-gray-400">Google Colab</span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium group-hover:underline">Learn more →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="px-6 py-24 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-yellow mb-4">Quick Start</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple by design
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              From ID to visualization in one command.
            </p>
          </div>
          
          <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden border border-gray-700">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700 bg-[#2d2d2d]">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
              <span className="text-sm text-gray-500 font-mono">terminal</span>
            </div>
            <pre className="p-6 overflow-x-auto">
              <code className="text-sm text-gray-300 font-mono leading-loose">{`
# Run with default options
hoodini run --input WP_012345678.1
            `}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="max-w-xl mx-auto">
          <div className="text-center p-12 bg-amber-50 dark:bg-amber-950/30 rounded-3xl border border-amber-200 dark:border-amber-900/50">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Start analyzing today
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Fully open source. Free forever. Built for the research community.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link 
                href="/docs/hoodini/installation" 
                className="btn btn-primary btn-lg"
              >
                Read the documentation
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a 
                href="https://colab.research.google.com/github/pentamorfico/hoodini-colab/blob/main/hoodini_colab.ipynb"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Try in Google Colab →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
