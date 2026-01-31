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
    domainsByGene?: Record<string, any[]>
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
// SAMPLE DATA for HoodiniViz demos (realistic bacterial genomic neighborhood)
// ============================================================================

// Phylogenetic tree with 8 genomes - realistic bacterial phylogeny
const SAMPLE_NEWICK = '(((ECO_K12:0.02,ECO_O157:0.025):0.03,(SEN_LT2:0.028,SEN_Typ:0.032):0.025):0.05,((KPN_MGH:0.04,KPN_HS11:0.038):0.045,(PAE_PA01:0.06,PAE_PA14:0.055):0.05):0.04);'

// Gene products - realistic bacterial proteins in a typical defense island neighborhood
const PRODUCTS = {
  repA: 'Replication initiation protein RepA',
  traT: 'Conjugal transfer surface exclusion protein TraT', 
  hsdR: 'Type I restriction enzyme HsdR',
  hsdM: 'Type I restriction enzyme HsdM (methyltransferase)',
  hsdS: 'Type I restriction enzyme HsdS (specificity subunit)',
  recB: 'Exodeoxyribonuclease V subunit beta',
  recC: 'Exodeoxyribonuclease V subunit gamma',
  recD: 'Exodeoxyribonuclease V subunit alpha',
  ssb: 'Single-stranded DNA-binding protein',
  dnaB: 'Replicative DNA helicase DnaB',
  dnaG: 'DNA primase DnaG',
  cas1: 'CRISPR-associated endonuclease Cas1',
  cas2: 'CRISPR-associated protein Cas2',
  cas3: 'CRISPR-associated helicase/nuclease Cas3',
  hyp1: 'Hypothetical protein',
  hyp2: 'Hypothetical protein YjgB',
  int: 'Phage integrase family protein',
  trans: 'IS200/IS605 family transposase',
}

// Realistic GFF features - 8 genomes with ~12-15 genes each
const SAMPLE_GFF_FEATURES = [
  // ECO_K12 - E. coli K-12 (reference, 14 genes)
  { seqid: 'ECO_K12', source: 'Prokka', type: 'CDS', start: 500, end: 1800, strand: '+', attributes: { ID: 'ECO_K12_001', Name: 'repA', product: PRODUCTS.repA, locus_tag: 'ECO_K12_001' } },
  { seqid: 'ECO_K12', source: 'Prokka', type: 'CDS', start: 1900, end: 2600, strand: '+', attributes: { ID: 'ECO_K12_002', Name: 'traT', product: PRODUCTS.traT, locus_tag: 'ECO_K12_002' } },
  { seqid: 'ECO_K12', source: 'Prokka', type: 'CDS', start: 2700, end: 5800, strand: '+', attributes: { ID: 'ECO_K12_003', Name: 'hsdR', product: PRODUCTS.hsdR, locus_tag: 'ECO_K12_003' } },
  { seqid: 'ECO_K12', source: 'Prokka', type: 'CDS', start: 5900, end: 7500, strand: '+', attributes: { ID: 'ECO_K12_004', Name: 'hsdM', product: PRODUCTS.hsdM, locus_tag: 'ECO_K12_004' } },
  { seqid: 'ECO_K12', source: 'Prokka', type: 'CDS', start: 7600, end: 9000, strand: '+', attributes: { ID: 'ECO_K12_005', Name: 'hsdS', product: PRODUCTS.hsdS, locus_tag: 'ECO_K12_005' } },
  { seqid: 'ECO_K12', source: 'Prokka', type: 'CDS', start: 9200, end: 10500, strand: '-', attributes: { ID: 'ECO_K12_006', Name: 'hyp1', product: PRODUCTS.hyp1, locus_tag: 'ECO_K12_006' } },
  { seqid: 'ECO_K12', source: 'Prokka', type: 'CDS', start: 10700, end: 14200, strand: '+', attributes: { ID: 'ECO_K12_007', Name: 'recB', product: PRODUCTS.recB, locus_tag: 'ECO_K12_007' } },
  { seqid: 'ECO_K12', source: 'Prokka', type: 'CDS', start: 14300, end: 17800, strand: '+', attributes: { ID: 'ECO_K12_008', Name: 'recC', product: PRODUCTS.recC, locus_tag: 'ECO_K12_008' } },
  { seqid: 'ECO_K12', source: 'Prokka', type: 'CDS', start: 17900, end: 21400, strand: '+', attributes: { ID: 'ECO_K12_009', Name: 'recD', product: PRODUCTS.recD, locus_tag: 'ECO_K12_009' } },
  { seqid: 'ECO_K12', source: 'Prokka', type: 'CDS', start: 21600, end: 22200, strand: '+', attributes: { ID: 'ECO_K12_010', Name: 'ssb', product: PRODUCTS.ssb, locus_tag: 'ECO_K12_010' } },
  { seqid: 'ECO_K12', source: 'Prokka', type: 'CDS', start: 22400, end: 23800, strand: '+', attributes: { ID: 'ECO_K12_011', Name: 'dnaB', product: PRODUCTS.dnaB, locus_tag: 'ECO_K12_011' } },
  { seqid: 'ECO_K12', source: 'Prokka', type: 'CDS', start: 24000, end: 25800, strand: '+', attributes: { ID: 'ECO_K12_012', Name: 'dnaG', product: PRODUCTS.dnaG, locus_tag: 'ECO_K12_012' } },
  { seqid: 'ECO_K12', source: 'Prokka', type: 'CDS', start: 26000, end: 27200, strand: '-', attributes: { ID: 'ECO_K12_013', Name: 'int', product: PRODUCTS.int, locus_tag: 'ECO_K12_013' } },
  { seqid: 'ECO_K12', source: 'Prokka', type: 'CDS', start: 27400, end: 28100, strand: '-', attributes: { ID: 'ECO_K12_014', Name: 'hyp2', product: PRODUCTS.hyp2, locus_tag: 'ECO_K12_014' } },

  // ECO_O157 - E. coli O157:H7 (pathogenic, 13 genes - slight variation)
  { seqid: 'ECO_O157', source: 'Prokka', type: 'CDS', start: 600, end: 1900, strand: '+', attributes: { ID: 'ECO_O157_001', Name: 'repA', product: PRODUCTS.repA, locus_tag: 'ECO_O157_001' } },
  { seqid: 'ECO_O157', source: 'Prokka', type: 'CDS', start: 2000, end: 2700, strand: '+', attributes: { ID: 'ECO_O157_002', Name: 'traT', product: PRODUCTS.traT, locus_tag: 'ECO_O157_002' } },
  { seqid: 'ECO_O157', source: 'Prokka', type: 'CDS', start: 2850, end: 5950, strand: '+', attributes: { ID: 'ECO_O157_003', Name: 'hsdR', product: PRODUCTS.hsdR, locus_tag: 'ECO_O157_003' } },
  { seqid: 'ECO_O157', source: 'Prokka', type: 'CDS', start: 6050, end: 7650, strand: '+', attributes: { ID: 'ECO_O157_004', Name: 'hsdM', product: PRODUCTS.hsdM, locus_tag: 'ECO_O157_004' } },
  { seqid: 'ECO_O157', source: 'Prokka', type: 'CDS', start: 7750, end: 9150, strand: '+', attributes: { ID: 'ECO_O157_005', Name: 'hsdS', product: PRODUCTS.hsdS, locus_tag: 'ECO_O157_005' } },
  { seqid: 'ECO_O157', source: 'Prokka', type: 'CDS', start: 9300, end: 12800, strand: '+', attributes: { ID: 'ECO_O157_006', Name: 'recB', product: PRODUCTS.recB, locus_tag: 'ECO_O157_006' } },
  { seqid: 'ECO_O157', source: 'Prokka', type: 'CDS', start: 12900, end: 16400, strand: '+', attributes: { ID: 'ECO_O157_007', Name: 'recC', product: PRODUCTS.recC, locus_tag: 'ECO_O157_007' } },
  { seqid: 'ECO_O157', source: 'Prokka', type: 'CDS', start: 16500, end: 20000, strand: '+', attributes: { ID: 'ECO_O157_008', Name: 'recD', product: PRODUCTS.recD, locus_tag: 'ECO_O157_008' } },
  { seqid: 'ECO_O157', source: 'Prokka', type: 'CDS', start: 20200, end: 20800, strand: '+', attributes: { ID: 'ECO_O157_009', Name: 'ssb', product: PRODUCTS.ssb, locus_tag: 'ECO_O157_009' } },
  { seqid: 'ECO_O157', source: 'Prokka', type: 'CDS', start: 21000, end: 22400, strand: '+', attributes: { ID: 'ECO_O157_010', Name: 'dnaB', product: PRODUCTS.dnaB, locus_tag: 'ECO_O157_010' } },
  { seqid: 'ECO_O157', source: 'Prokka', type: 'CDS', start: 22600, end: 24400, strand: '+', attributes: { ID: 'ECO_O157_011', Name: 'dnaG', product: PRODUCTS.dnaG, locus_tag: 'ECO_O157_011' } },
  { seqid: 'ECO_O157', source: 'Prokka', type: 'CDS', start: 24600, end: 25800, strand: '-', attributes: { ID: 'ECO_O157_012', Name: 'int', product: PRODUCTS.int, locus_tag: 'ECO_O157_012' } },
  { seqid: 'ECO_O157', source: 'Prokka', type: 'CDS', start: 26000, end: 26700, strand: '-', attributes: { ID: 'ECO_O157_013', Name: 'trans', product: PRODUCTS.trans, locus_tag: 'ECO_O157_013' } },

  // SEN_LT2 - Salmonella enterica LT2 (14 genes)
  { seqid: 'SEN_LT2', source: 'Prokka', type: 'CDS', start: 400, end: 1700, strand: '+', attributes: { ID: 'SEN_LT2_001', Name: 'repA', product: PRODUCTS.repA, locus_tag: 'SEN_LT2_001' } },
  { seqid: 'SEN_LT2', source: 'Prokka', type: 'CDS', start: 1850, end: 2550, strand: '+', attributes: { ID: 'SEN_LT2_002', Name: 'traT', product: PRODUCTS.traT, locus_tag: 'SEN_LT2_002' } },
  { seqid: 'SEN_LT2', source: 'Prokka', type: 'CDS', start: 2700, end: 5750, strand: '+', attributes: { ID: 'SEN_LT2_003', Name: 'hsdR', product: PRODUCTS.hsdR, locus_tag: 'SEN_LT2_003' } },
  { seqid: 'SEN_LT2', source: 'Prokka', type: 'CDS', start: 5850, end: 7450, strand: '+', attributes: { ID: 'SEN_LT2_004', Name: 'hsdM', product: PRODUCTS.hsdM, locus_tag: 'SEN_LT2_004' } },
  { seqid: 'SEN_LT2', source: 'Prokka', type: 'CDS', start: 7550, end: 8950, strand: '+', attributes: { ID: 'SEN_LT2_005', Name: 'hsdS', product: PRODUCTS.hsdS, locus_tag: 'SEN_LT2_005' } },
  { seqid: 'SEN_LT2', source: 'Prokka', type: 'CDS', start: 9100, end: 10100, strand: '-', attributes: { ID: 'SEN_LT2_006', Name: 'hyp1', product: PRODUCTS.hyp1, locus_tag: 'SEN_LT2_006' } },
  { seqid: 'SEN_LT2', source: 'Prokka', type: 'CDS', start: 10300, end: 13800, strand: '+', attributes: { ID: 'SEN_LT2_007', Name: 'recB', product: PRODUCTS.recB, locus_tag: 'SEN_LT2_007' } },
  { seqid: 'SEN_LT2', source: 'Prokka', type: 'CDS', start: 13900, end: 17400, strand: '+', attributes: { ID: 'SEN_LT2_008', Name: 'recC', product: PRODUCTS.recC, locus_tag: 'SEN_LT2_008' } },
  { seqid: 'SEN_LT2', source: 'Prokka', type: 'CDS', start: 17500, end: 21000, strand: '+', attributes: { ID: 'SEN_LT2_009', Name: 'recD', product: PRODUCTS.recD, locus_tag: 'SEN_LT2_009' } },
  { seqid: 'SEN_LT2', source: 'Prokka', type: 'CDS', start: 21200, end: 21800, strand: '+', attributes: { ID: 'SEN_LT2_010', Name: 'ssb', product: PRODUCTS.ssb, locus_tag: 'SEN_LT2_010' } },
  { seqid: 'SEN_LT2', source: 'Prokka', type: 'CDS', start: 22000, end: 23400, strand: '+', attributes: { ID: 'SEN_LT2_011', Name: 'dnaB', product: PRODUCTS.dnaB, locus_tag: 'SEN_LT2_011' } },
  { seqid: 'SEN_LT2', source: 'Prokka', type: 'CDS', start: 23600, end: 25400, strand: '+', attributes: { ID: 'SEN_LT2_012', Name: 'dnaG', product: PRODUCTS.dnaG, locus_tag: 'SEN_LT2_012' } },
  { seqid: 'SEN_LT2', source: 'Prokka', type: 'CDS', start: 25600, end: 26800, strand: '-', attributes: { ID: 'SEN_LT2_013', Name: 'int', product: PRODUCTS.int, locus_tag: 'SEN_LT2_013' } },
  { seqid: 'SEN_LT2', source: 'Prokka', type: 'CDS', start: 27000, end: 27700, strand: '-', attributes: { ID: 'SEN_LT2_014', Name: 'hyp2', product: PRODUCTS.hyp2, locus_tag: 'SEN_LT2_014' } },

  // SEN_Typ - Salmonella enterica Typhi (12 genes - missing some)
  { seqid: 'SEN_Typ', source: 'Prokka', type: 'CDS', start: 550, end: 1850, strand: '+', attributes: { ID: 'SEN_Typ_001', Name: 'repA', product: PRODUCTS.repA, locus_tag: 'SEN_Typ_001' } },
  { seqid: 'SEN_Typ', source: 'Prokka', type: 'CDS', start: 2000, end: 5050, strand: '+', attributes: { ID: 'SEN_Typ_002', Name: 'hsdR', product: PRODUCTS.hsdR, locus_tag: 'SEN_Typ_002' } },
  { seqid: 'SEN_Typ', source: 'Prokka', type: 'CDS', start: 5150, end: 6750, strand: '+', attributes: { ID: 'SEN_Typ_003', Name: 'hsdM', product: PRODUCTS.hsdM, locus_tag: 'SEN_Typ_003' } },
  { seqid: 'SEN_Typ', source: 'Prokka', type: 'CDS', start: 6850, end: 8250, strand: '+', attributes: { ID: 'SEN_Typ_004', Name: 'hsdS', product: PRODUCTS.hsdS, locus_tag: 'SEN_Typ_004' } },
  { seqid: 'SEN_Typ', source: 'Prokka', type: 'CDS', start: 8400, end: 11900, strand: '+', attributes: { ID: 'SEN_Typ_005', Name: 'recB', product: PRODUCTS.recB, locus_tag: 'SEN_Typ_005' } },
  { seqid: 'SEN_Typ', source: 'Prokka', type: 'CDS', start: 12000, end: 15500, strand: '+', attributes: { ID: 'SEN_Typ_006', Name: 'recC', product: PRODUCTS.recC, locus_tag: 'SEN_Typ_006' } },
  { seqid: 'SEN_Typ', source: 'Prokka', type: 'CDS', start: 15600, end: 19100, strand: '+', attributes: { ID: 'SEN_Typ_007', Name: 'recD', product: PRODUCTS.recD, locus_tag: 'SEN_Typ_007' } },
  { seqid: 'SEN_Typ', source: 'Prokka', type: 'CDS', start: 19300, end: 19900, strand: '+', attributes: { ID: 'SEN_Typ_008', Name: 'ssb', product: PRODUCTS.ssb, locus_tag: 'SEN_Typ_008' } },
  { seqid: 'SEN_Typ', source: 'Prokka', type: 'CDS', start: 20100, end: 21500, strand: '+', attributes: { ID: 'SEN_Typ_009', Name: 'dnaB', product: PRODUCTS.dnaB, locus_tag: 'SEN_Typ_009' } },
  { seqid: 'SEN_Typ', source: 'Prokka', type: 'CDS', start: 21700, end: 23500, strand: '+', attributes: { ID: 'SEN_Typ_010', Name: 'dnaG', product: PRODUCTS.dnaG, locus_tag: 'SEN_Typ_010' } },
  { seqid: 'SEN_Typ', source: 'Prokka', type: 'CDS', start: 23700, end: 24900, strand: '-', attributes: { ID: 'SEN_Typ_011', Name: 'int', product: PRODUCTS.int, locus_tag: 'SEN_Typ_011' } },
  { seqid: 'SEN_Typ', source: 'Prokka', type: 'CDS', start: 25100, end: 25800, strand: '-', attributes: { ID: 'SEN_Typ_012', Name: 'trans', product: PRODUCTS.trans, locus_tag: 'SEN_Typ_012' } },

  // KPN_MGH - Klebsiella pneumoniae MGH (15 genes - with CRISPR)
  { seqid: 'KPN_MGH', source: 'Prokka', type: 'CDS', start: 300, end: 1600, strand: '+', attributes: { ID: 'KPN_MGH_001', Name: 'repA', product: PRODUCTS.repA, locus_tag: 'KPN_MGH_001' } },
  { seqid: 'KPN_MGH', source: 'Prokka', type: 'CDS', start: 1750, end: 2450, strand: '+', attributes: { ID: 'KPN_MGH_002', Name: 'traT', product: PRODUCTS.traT, locus_tag: 'KPN_MGH_002' } },
  { seqid: 'KPN_MGH', source: 'Prokka', type: 'CDS', start: 2600, end: 5650, strand: '+', attributes: { ID: 'KPN_MGH_003', Name: 'hsdR', product: PRODUCTS.hsdR, locus_tag: 'KPN_MGH_003' } },
  { seqid: 'KPN_MGH', source: 'Prokka', type: 'CDS', start: 5750, end: 7350, strand: '+', attributes: { ID: 'KPN_MGH_004', Name: 'hsdM', product: PRODUCTS.hsdM, locus_tag: 'KPN_MGH_004' } },
  { seqid: 'KPN_MGH', source: 'Prokka', type: 'CDS', start: 7450, end: 8850, strand: '+', attributes: { ID: 'KPN_MGH_005', Name: 'hsdS', product: PRODUCTS.hsdS, locus_tag: 'KPN_MGH_005' } },
  { seqid: 'KPN_MGH', source: 'Prokka', type: 'CDS', start: 9000, end: 10000, strand: '-', attributes: { ID: 'KPN_MGH_006', Name: 'cas1', product: PRODUCTS.cas1, locus_tag: 'KPN_MGH_006' } },
  { seqid: 'KPN_MGH', source: 'Prokka', type: 'CDS', start: 10100, end: 10500, strand: '-', attributes: { ID: 'KPN_MGH_007', Name: 'cas2', product: PRODUCTS.cas2, locus_tag: 'KPN_MGH_007' } },
  { seqid: 'KPN_MGH', source: 'Prokka', type: 'CDS', start: 10600, end: 13200, strand: '-', attributes: { ID: 'KPN_MGH_008', Name: 'cas3', product: PRODUCTS.cas3, locus_tag: 'KPN_MGH_008' } },
  { seqid: 'KPN_MGH', source: 'Prokka', type: 'CDS', start: 13400, end: 16900, strand: '+', attributes: { ID: 'KPN_MGH_009', Name: 'recB', product: PRODUCTS.recB, locus_tag: 'KPN_MGH_009' } },
  { seqid: 'KPN_MGH', source: 'Prokka', type: 'CDS', start: 17000, end: 20500, strand: '+', attributes: { ID: 'KPN_MGH_010', Name: 'recC', product: PRODUCTS.recC, locus_tag: 'KPN_MGH_010' } },
  { seqid: 'KPN_MGH', source: 'Prokka', type: 'CDS', start: 20600, end: 24100, strand: '+', attributes: { ID: 'KPN_MGH_011', Name: 'recD', product: PRODUCTS.recD, locus_tag: 'KPN_MGH_011' } },
  { seqid: 'KPN_MGH', source: 'Prokka', type: 'CDS', start: 24300, end: 24900, strand: '+', attributes: { ID: 'KPN_MGH_012', Name: 'ssb', product: PRODUCTS.ssb, locus_tag: 'KPN_MGH_012' } },
  { seqid: 'KPN_MGH', source: 'Prokka', type: 'CDS', start: 25100, end: 26500, strand: '+', attributes: { ID: 'KPN_MGH_013', Name: 'dnaB', product: PRODUCTS.dnaB, locus_tag: 'KPN_MGH_013' } },
  { seqid: 'KPN_MGH', source: 'Prokka', type: 'CDS', start: 26700, end: 28500, strand: '+', attributes: { ID: 'KPN_MGH_014', Name: 'dnaG', product: PRODUCTS.dnaG, locus_tag: 'KPN_MGH_014' } },
  { seqid: 'KPN_MGH', source: 'Prokka', type: 'CDS', start: 28700, end: 29900, strand: '-', attributes: { ID: 'KPN_MGH_015', Name: 'int', product: PRODUCTS.int, locus_tag: 'KPN_MGH_015' } },

  // KPN_HS11 - Klebsiella pneumoniae HS11 (14 genes)
  { seqid: 'KPN_HS11', source: 'Prokka', type: 'CDS', start: 450, end: 1750, strand: '+', attributes: { ID: 'KPN_HS11_001', Name: 'repA', product: PRODUCTS.repA, locus_tag: 'KPN_HS11_001' } },
  { seqid: 'KPN_HS11', source: 'Prokka', type: 'CDS', start: 1900, end: 2600, strand: '+', attributes: { ID: 'KPN_HS11_002', Name: 'traT', product: PRODUCTS.traT, locus_tag: 'KPN_HS11_002' } },
  { seqid: 'KPN_HS11', source: 'Prokka', type: 'CDS', start: 2750, end: 5800, strand: '+', attributes: { ID: 'KPN_HS11_003', Name: 'hsdR', product: PRODUCTS.hsdR, locus_tag: 'KPN_HS11_003' } },
  { seqid: 'KPN_HS11', source: 'Prokka', type: 'CDS', start: 5900, end: 7500, strand: '+', attributes: { ID: 'KPN_HS11_004', Name: 'hsdM', product: PRODUCTS.hsdM, locus_tag: 'KPN_HS11_004' } },
  { seqid: 'KPN_HS11', source: 'Prokka', type: 'CDS', start: 7600, end: 9000, strand: '+', attributes: { ID: 'KPN_HS11_005', Name: 'hsdS', product: PRODUCTS.hsdS, locus_tag: 'KPN_HS11_005' } },
  { seqid: 'KPN_HS11', source: 'Prokka', type: 'CDS', start: 9150, end: 10150, strand: '-', attributes: { ID: 'KPN_HS11_006', Name: 'cas1', product: PRODUCTS.cas1, locus_tag: 'KPN_HS11_006' } },
  { seqid: 'KPN_HS11', source: 'Prokka', type: 'CDS', start: 10250, end: 10650, strand: '-', attributes: { ID: 'KPN_HS11_007', Name: 'cas2', product: PRODUCTS.cas2, locus_tag: 'KPN_HS11_007' } },
  { seqid: 'KPN_HS11', source: 'Prokka', type: 'CDS', start: 10750, end: 14250, strand: '+', attributes: { ID: 'KPN_HS11_008', Name: 'recB', product: PRODUCTS.recB, locus_tag: 'KPN_HS11_008' } },
  { seqid: 'KPN_HS11', source: 'Prokka', type: 'CDS', start: 14350, end: 17850, strand: '+', attributes: { ID: 'KPN_HS11_009', Name: 'recC', product: PRODUCTS.recC, locus_tag: 'KPN_HS11_009' } },
  { seqid: 'KPN_HS11', source: 'Prokka', type: 'CDS', start: 17950, end: 21450, strand: '+', attributes: { ID: 'KPN_HS11_010', Name: 'recD', product: PRODUCTS.recD, locus_tag: 'KPN_HS11_010' } },
  { seqid: 'KPN_HS11', source: 'Prokka', type: 'CDS', start: 21650, end: 22250, strand: '+', attributes: { ID: 'KPN_HS11_011', Name: 'ssb', product: PRODUCTS.ssb, locus_tag: 'KPN_HS11_011' } },
  { seqid: 'KPN_HS11', source: 'Prokka', type: 'CDS', start: 22450, end: 23850, strand: '+', attributes: { ID: 'KPN_HS11_012', Name: 'dnaB', product: PRODUCTS.dnaB, locus_tag: 'KPN_HS11_012' } },
  { seqid: 'KPN_HS11', source: 'Prokka', type: 'CDS', start: 24050, end: 25850, strand: '+', attributes: { ID: 'KPN_HS11_013', Name: 'dnaG', product: PRODUCTS.dnaG, locus_tag: 'KPN_HS11_013' } },
  { seqid: 'KPN_HS11', source: 'Prokka', type: 'CDS', start: 26050, end: 27250, strand: '-', attributes: { ID: 'KPN_HS11_014', Name: 'int', product: PRODUCTS.int, locus_tag: 'KPN_HS11_014' } },

  // PAE_PA01 - Pseudomonas aeruginosa PA01 (13 genes - different gene order)
  { seqid: 'PAE_PA01', source: 'Prokka', type: 'CDS', start: 200, end: 1500, strand: '-', attributes: { ID: 'PAE_PA01_001', Name: 'int', product: PRODUCTS.int, locus_tag: 'PAE_PA01_001' } },
  { seqid: 'PAE_PA01', source: 'Prokka', type: 'CDS', start: 1700, end: 3500, strand: '+', attributes: { ID: 'PAE_PA01_002', Name: 'dnaG', product: PRODUCTS.dnaG, locus_tag: 'PAE_PA01_002' } },
  { seqid: 'PAE_PA01', source: 'Prokka', type: 'CDS', start: 3700, end: 5100, strand: '+', attributes: { ID: 'PAE_PA01_003', Name: 'dnaB', product: PRODUCTS.dnaB, locus_tag: 'PAE_PA01_003' } },
  { seqid: 'PAE_PA01', source: 'Prokka', type: 'CDS', start: 5300, end: 5900, strand: '+', attributes: { ID: 'PAE_PA01_004', Name: 'ssb', product: PRODUCTS.ssb, locus_tag: 'PAE_PA01_004' } },
  { seqid: 'PAE_PA01', source: 'Prokka', type: 'CDS', start: 6100, end: 9600, strand: '-', attributes: { ID: 'PAE_PA01_005', Name: 'recD', product: PRODUCTS.recD, locus_tag: 'PAE_PA01_005' } },
  { seqid: 'PAE_PA01', source: 'Prokka', type: 'CDS', start: 9700, end: 13200, strand: '-', attributes: { ID: 'PAE_PA01_006', Name: 'recC', product: PRODUCTS.recC, locus_tag: 'PAE_PA01_006' } },
  { seqid: 'PAE_PA01', source: 'Prokka', type: 'CDS', start: 13300, end: 16800, strand: '-', attributes: { ID: 'PAE_PA01_007', Name: 'recB', product: PRODUCTS.recB, locus_tag: 'PAE_PA01_007' } },
  { seqid: 'PAE_PA01', source: 'Prokka', type: 'CDS', start: 17000, end: 18400, strand: '+', attributes: { ID: 'PAE_PA01_008', Name: 'hsdS', product: PRODUCTS.hsdS, locus_tag: 'PAE_PA01_008' } },
  { seqid: 'PAE_PA01', source: 'Prokka', type: 'CDS', start: 18500, end: 20100, strand: '+', attributes: { ID: 'PAE_PA01_009', Name: 'hsdM', product: PRODUCTS.hsdM, locus_tag: 'PAE_PA01_009' } },
  { seqid: 'PAE_PA01', source: 'Prokka', type: 'CDS', start: 20200, end: 23250, strand: '+', attributes: { ID: 'PAE_PA01_010', Name: 'hsdR', product: PRODUCTS.hsdR, locus_tag: 'PAE_PA01_010' } },
  { seqid: 'PAE_PA01', source: 'Prokka', type: 'CDS', start: 23400, end: 24100, strand: '+', attributes: { ID: 'PAE_PA01_011', Name: 'traT', product: PRODUCTS.traT, locus_tag: 'PAE_PA01_011' } },
  { seqid: 'PAE_PA01', source: 'Prokka', type: 'CDS', start: 24250, end: 25550, strand: '+', attributes: { ID: 'PAE_PA01_012', Name: 'repA', product: PRODUCTS.repA, locus_tag: 'PAE_PA01_012' } },
  { seqid: 'PAE_PA01', source: 'Prokka', type: 'CDS', start: 25700, end: 26400, strand: '-', attributes: { ID: 'PAE_PA01_013', Name: 'hyp1', product: PRODUCTS.hyp1, locus_tag: 'PAE_PA01_013' } },

  // PAE_PA14 - Pseudomonas aeruginosa PA14 (14 genes)
  { seqid: 'PAE_PA14', source: 'Prokka', type: 'CDS', start: 250, end: 1550, strand: '-', attributes: { ID: 'PAE_PA14_001', Name: 'int', product: PRODUCTS.int, locus_tag: 'PAE_PA14_001' } },
  { seqid: 'PAE_PA14', source: 'Prokka', type: 'CDS', start: 1750, end: 3550, strand: '+', attributes: { ID: 'PAE_PA14_002', Name: 'dnaG', product: PRODUCTS.dnaG, locus_tag: 'PAE_PA14_002' } },
  { seqid: 'PAE_PA14', source: 'Prokka', type: 'CDS', start: 3750, end: 5150, strand: '+', attributes: { ID: 'PAE_PA14_003', Name: 'dnaB', product: PRODUCTS.dnaB, locus_tag: 'PAE_PA14_003' } },
  { seqid: 'PAE_PA14', source: 'Prokka', type: 'CDS', start: 5350, end: 5950, strand: '+', attributes: { ID: 'PAE_PA14_004', Name: 'ssb', product: PRODUCTS.ssb, locus_tag: 'PAE_PA14_004' } },
  { seqid: 'PAE_PA14', source: 'Prokka', type: 'CDS', start: 6150, end: 9650, strand: '-', attributes: { ID: 'PAE_PA14_005', Name: 'recD', product: PRODUCTS.recD, locus_tag: 'PAE_PA14_005' } },
  { seqid: 'PAE_PA14', source: 'Prokka', type: 'CDS', start: 9750, end: 13250, strand: '-', attributes: { ID: 'PAE_PA14_006', Name: 'recC', product: PRODUCTS.recC, locus_tag: 'PAE_PA14_006' } },
  { seqid: 'PAE_PA14', source: 'Prokka', type: 'CDS', start: 13350, end: 16850, strand: '-', attributes: { ID: 'PAE_PA14_007', Name: 'recB', product: PRODUCTS.recB, locus_tag: 'PAE_PA14_007' } },
  { seqid: 'PAE_PA14', source: 'Prokka', type: 'CDS', start: 17050, end: 17950, strand: '-', attributes: { ID: 'PAE_PA14_008', Name: 'hyp2', product: PRODUCTS.hyp2, locus_tag: 'PAE_PA14_008' } },
  { seqid: 'PAE_PA14', source: 'Prokka', type: 'CDS', start: 18100, end: 19500, strand: '+', attributes: { ID: 'PAE_PA14_009', Name: 'hsdS', product: PRODUCTS.hsdS, locus_tag: 'PAE_PA14_009' } },
  { seqid: 'PAE_PA14', source: 'Prokka', type: 'CDS', start: 19600, end: 21200, strand: '+', attributes: { ID: 'PAE_PA14_010', Name: 'hsdM', product: PRODUCTS.hsdM, locus_tag: 'PAE_PA14_010' } },
  { seqid: 'PAE_PA14', source: 'Prokka', type: 'CDS', start: 21300, end: 24350, strand: '+', attributes: { ID: 'PAE_PA14_011', Name: 'hsdR', product: PRODUCTS.hsdR, locus_tag: 'PAE_PA14_011' } },
  { seqid: 'PAE_PA14', source: 'Prokka', type: 'CDS', start: 24500, end: 25200, strand: '+', attributes: { ID: 'PAE_PA14_012', Name: 'traT', product: PRODUCTS.traT, locus_tag: 'PAE_PA14_012' } },
  { seqid: 'PAE_PA14', source: 'Prokka', type: 'CDS', start: 25350, end: 26650, strand: '+', attributes: { ID: 'PAE_PA14_013', Name: 'repA', product: PRODUCTS.repA, locus_tag: 'PAE_PA14_013' } },
  { seqid: 'PAE_PA14', source: 'Prokka', type: 'CDS', start: 26800, end: 27500, strand: '-', attributes: { ID: 'PAE_PA14_014', Name: 'trans', product: PRODUCTS.trans, locus_tag: 'PAE_PA14_014' } },
]

// Hoods (genomic neighborhoods) - aligned on recB/recC region
const SAMPLE_HOODS = [
  { hood_id: 'hood_1', seqid: 'ECO_K12', start: 0, end: 30000, align_gene: 'ECO_K12_007' },
  { hood_id: 'hood_2', seqid: 'ECO_O157', start: 0, end: 28000, align_gene: 'ECO_O157_006' },
  { hood_id: 'hood_3', seqid: 'SEN_LT2', start: 0, end: 29000, align_gene: 'SEN_LT2_007' },
  { hood_id: 'hood_4', seqid: 'SEN_Typ', start: 0, end: 27000, align_gene: 'SEN_Typ_005' },
  { hood_id: 'hood_5', seqid: 'KPN_MGH', start: 0, end: 31000, align_gene: 'KPN_MGH_009' },
  { hood_id: 'hood_6', seqid: 'KPN_HS11', start: 0, end: 28500, align_gene: 'KPN_HS11_008' },
  { hood_id: 'hood_7', seqid: 'PAE_PA01', start: 0, end: 28000, align_gene: 'PAE_PA01_007' },
  { hood_id: 'hood_8', seqid: 'PAE_PA14', start: 0, end: 29000, align_gene: 'PAE_PA14_007' },
]

// Protein links (homology between genes across genomes)
const SAMPLE_PROTEIN_LINKS = [
  // repA cluster (cluster 1)
  { gAId: 'ECO_K12_001', gBId: 'ECO_O157_001', similarity: 98.5 },
  { gAId: 'ECO_K12_001', gBId: 'SEN_LT2_001', similarity: 92.3 },
  { gAId: 'ECO_K12_001', gBId: 'SEN_Typ_001', similarity: 91.8 },
  { gAId: 'ECO_K12_001', gBId: 'KPN_MGH_001', similarity: 85.2 },
  { gAId: 'ECO_K12_001', gBId: 'KPN_HS11_001', similarity: 84.9 },
  { gAId: 'ECO_K12_001', gBId: 'PAE_PA01_012', similarity: 72.4 },
  { gAId: 'ECO_K12_001', gBId: 'PAE_PA14_013', similarity: 71.8 },
  { gAId: 'SEN_LT2_001', gBId: 'SEN_Typ_001', similarity: 97.2 },
  { gAId: 'KPN_MGH_001', gBId: 'KPN_HS11_001', similarity: 96.8 },
  { gAId: 'PAE_PA01_012', gBId: 'PAE_PA14_013', similarity: 98.1 },

  // hsdR cluster (cluster 2)
  { gAId: 'ECO_K12_003', gBId: 'ECO_O157_003', similarity: 97.8 },
  { gAId: 'ECO_K12_003', gBId: 'SEN_LT2_003', similarity: 88.5 },
  { gAId: 'ECO_K12_003', gBId: 'SEN_Typ_002', similarity: 87.9 },
  { gAId: 'ECO_K12_003', gBId: 'KPN_MGH_003', similarity: 82.1 },
  { gAId: 'ECO_K12_003', gBId: 'KPN_HS11_003', similarity: 81.5 },
  { gAId: 'ECO_K12_003', gBId: 'PAE_PA01_010', similarity: 68.3 },
  { gAId: 'ECO_K12_003', gBId: 'PAE_PA14_011', similarity: 67.9 },
  { gAId: 'SEN_LT2_003', gBId: 'SEN_Typ_002', similarity: 95.4 },
  { gAId: 'KPN_MGH_003', gBId: 'KPN_HS11_003', similarity: 95.8 },
  { gAId: 'PAE_PA01_010', gBId: 'PAE_PA14_011', similarity: 97.5 },

  // hsdM cluster (cluster 3)
  { gAId: 'ECO_K12_004', gBId: 'ECO_O157_004', similarity: 96.2 },
  { gAId: 'ECO_K12_004', gBId: 'SEN_LT2_004', similarity: 85.7 },
  { gAId: 'ECO_K12_004', gBId: 'SEN_Typ_003', similarity: 85.1 },
  { gAId: 'ECO_K12_004', gBId: 'KPN_MGH_004', similarity: 79.8 },
  { gAId: 'ECO_K12_004', gBId: 'PAE_PA01_009', similarity: 65.4 },

  // recB cluster (cluster 4) - highly conserved
  { gAId: 'ECO_K12_007', gBId: 'ECO_O157_006', similarity: 99.1 },
  { gAId: 'ECO_K12_007', gBId: 'SEN_LT2_007', similarity: 95.6 },
  { gAId: 'ECO_K12_007', gBId: 'SEN_Typ_005', similarity: 95.2 },
  { gAId: 'ECO_K12_007', gBId: 'KPN_MGH_009', similarity: 90.3 },
  { gAId: 'ECO_K12_007', gBId: 'KPN_HS11_008', similarity: 89.8 },
  { gAId: 'ECO_K12_007', gBId: 'PAE_PA01_007', similarity: 78.5 },
  { gAId: 'ECO_K12_007', gBId: 'PAE_PA14_007', similarity: 78.1 },
  { gAId: 'SEN_LT2_007', gBId: 'SEN_Typ_005', similarity: 98.4 },
  { gAId: 'KPN_MGH_009', gBId: 'KPN_HS11_008', similarity: 97.9 },
  { gAId: 'PAE_PA01_007', gBId: 'PAE_PA14_007', similarity: 99.2 },

  // recC cluster (cluster 5)
  { gAId: 'ECO_K12_008', gBId: 'ECO_O157_007', similarity: 98.7 },
  { gAId: 'ECO_K12_008', gBId: 'SEN_LT2_008', similarity: 94.2 },
  { gAId: 'ECO_K12_008', gBId: 'KPN_MGH_010', similarity: 88.9 },
  { gAId: 'ECO_K12_008', gBId: 'PAE_PA01_006', similarity: 76.8 },
  { gAId: 'PAE_PA01_006', gBId: 'PAE_PA14_006', similarity: 98.9 },

  // recD cluster (cluster 6)
  { gAId: 'ECO_K12_009', gBId: 'ECO_O157_008', similarity: 97.9 },
  { gAId: 'ECO_K12_009', gBId: 'SEN_LT2_009', similarity: 93.5 },
  { gAId: 'ECO_K12_009', gBId: 'KPN_MGH_011', similarity: 87.2 },
  { gAId: 'ECO_K12_009', gBId: 'PAE_PA01_005', similarity: 75.4 },
  { gAId: 'PAE_PA01_005', gBId: 'PAE_PA14_005', similarity: 98.6 },

  // ssb cluster (cluster 7)
  { gAId: 'ECO_K12_010', gBId: 'ECO_O157_009', similarity: 99.5 },
  { gAId: 'ECO_K12_010', gBId: 'SEN_LT2_010', similarity: 96.8 },
  { gAId: 'ECO_K12_010', gBId: 'KPN_MGH_012', similarity: 94.2 },
  { gAId: 'ECO_K12_010', gBId: 'PAE_PA01_004', similarity: 88.5 },

  // dnaB cluster (cluster 8)
  { gAId: 'ECO_K12_011', gBId: 'ECO_O157_010', similarity: 98.8 },
  { gAId: 'ECO_K12_011', gBId: 'SEN_LT2_011', similarity: 94.5 },
  { gAId: 'ECO_K12_011', gBId: 'KPN_MGH_013', similarity: 89.7 },
  { gAId: 'ECO_K12_011', gBId: 'PAE_PA01_003', similarity: 82.3 },

  // cas1 cluster (cluster 9) - only in Klebsiella
  { gAId: 'KPN_MGH_006', gBId: 'KPN_HS11_006', similarity: 95.4 },

  // cas2 cluster (cluster 10)
  { gAId: 'KPN_MGH_007', gBId: 'KPN_HS11_007', similarity: 96.1 },
]

// Nucleotide links (DNA-level synteny blocks)
const SAMPLE_NUCLEOTIDE_LINKS = [
  // E. coli K-12 vs O157
  { seqidA: 'ECO_K12', startA: 500, endA: 9500, seqidB: 'ECO_O157', startB: 600, endB: 9600, similarity: 96.5 },
  { seqidA: 'ECO_K12', startA: 10700, endA: 26000, seqidB: 'ECO_O157', startB: 9300, endB: 25000, similarity: 95.8 },
  
  // E. coli vs Salmonella
  { seqidA: 'ECO_K12', startA: 2700, endA: 9000, seqidB: 'SEN_LT2', startB: 2700, endB: 8950, similarity: 88.2 },
  { seqidA: 'ECO_K12', startA: 10700, endA: 22200, seqidB: 'SEN_LT2', startB: 10300, endB: 21800, similarity: 87.5 },
  
  // Salmonella LT2 vs Typhi
  { seqidA: 'SEN_LT2', startA: 400, endA: 8950, seqidB: 'SEN_Typ', startB: 550, endB: 8250, similarity: 94.8 },
  { seqidA: 'SEN_LT2', startA: 10300, endA: 25400, seqidB: 'SEN_Typ', startB: 8400, endB: 23500, similarity: 93.5 },
  
  // Klebsiella MGH vs HS11
  { seqidA: 'KPN_MGH', startA: 300, endA: 13200, seqidB: 'KPN_HS11', startB: 450, endB: 10650, similarity: 94.2 },
  { seqidA: 'KPN_MGH', startA: 13400, endA: 29900, seqidB: 'KPN_HS11', startB: 10750, endB: 27250, similarity: 93.8 },
  
  // Pseudomonas PA01 vs PA14
  { seqidA: 'PAE_PA01', startA: 200, endA: 16800, seqidB: 'PAE_PA14', startB: 250, endB: 16850, similarity: 97.1 },
  { seqidA: 'PAE_PA01', startA: 17000, endA: 26400, seqidB: 'PAE_PA14', startB: 18100, endB: 27500, similarity: 96.5 },
  
  // E. coli vs Klebsiella (more divergent)
  { seqidA: 'ECO_K12', startA: 10700, endA: 22200, seqidB: 'KPN_MGH', startB: 13400, endB: 24900, similarity: 78.3 },
]

// Protein domains - realistic Pfam annotations
const SAMPLE_DOMAINS_BY_GENE: Record<string, any[]> = {
  // hsdR - Type I restriction enzyme (multi-domain)
  ECO_K12_003: [
    { domainId: 'PF04851', start: 50, end: 280, source: 'pfam', evalue: 1e-85, name: 'ResIII', description: 'Type I restriction enzyme R protein N terminus' },
    { domainId: 'PF00580', start: 320, end: 520, source: 'pfam', evalue: 1e-72, name: 'UvrD_helicase', description: 'UvrD/REP helicase N-terminal domain' },
    { domainId: 'PF13361', start: 580, end: 820, source: 'pfam', evalue: 1e-65, name: 'UvrD_helicase_C', description: 'Helicase C-terminal domain' },
  ],
  ECO_O157_003: [
    { domainId: 'PF04851', start: 52, end: 282, source: 'pfam', evalue: 1e-83, name: 'ResIII', description: 'Type I restriction enzyme R protein N terminus' },
    { domainId: 'PF00580', start: 322, end: 522, source: 'pfam', evalue: 1e-70, name: 'UvrD_helicase', description: 'UvrD/REP helicase N-terminal domain' },
    { domainId: 'PF13361', start: 582, end: 822, source: 'pfam', evalue: 1e-63, name: 'UvrD_helicase_C', description: 'Helicase C-terminal domain' },
  ],
  SEN_LT2_003: [
    { domainId: 'PF04851', start: 48, end: 278, source: 'pfam', evalue: 1e-80, name: 'ResIII', description: 'Type I restriction enzyme R protein N terminus' },
    { domainId: 'PF00580', start: 318, end: 518, source: 'pfam', evalue: 1e-68, name: 'UvrD_helicase', description: 'UvrD/REP helicase N-terminal domain' },
  ],
  KPN_MGH_003: [
    { domainId: 'PF04851', start: 45, end: 275, source: 'pfam', evalue: 1e-75, name: 'ResIII', description: 'Type I restriction enzyme R protein N terminus' },
    { domainId: 'PF00580', start: 315, end: 515, source: 'pfam', evalue: 1e-65, name: 'UvrD_helicase', description: 'UvrD/REP helicase N-terminal domain' },
  ],
  
  // hsdM - Methyltransferase
  ECO_K12_004: [
    { domainId: 'PF02384', start: 30, end: 180, source: 'pfam', evalue: 1e-55, name: 'N6_Mtase', description: 'N-6 DNA Methylase' },
    { domainId: 'PF12161', start: 220, end: 380, source: 'pfam', evalue: 1e-42, name: 'HsdM_N', description: 'HsdM N-terminal domain' },
  ],
  ECO_O157_004: [
    { domainId: 'PF02384', start: 32, end: 182, source: 'pfam', evalue: 1e-53, name: 'N6_Mtase', description: 'N-6 DNA Methylase' },
    { domainId: 'PF12161', start: 222, end: 382, source: 'pfam', evalue: 1e-40, name: 'HsdM_N', description: 'HsdM N-terminal domain' },
  ],
  SEN_LT2_004: [
    { domainId: 'PF02384', start: 28, end: 178, source: 'pfam', evalue: 1e-50, name: 'N6_Mtase', description: 'N-6 DNA Methylase' },
    { domainId: 'PF12161', start: 218, end: 378, source: 'pfam', evalue: 1e-38, name: 'HsdM_N', description: 'HsdM N-terminal domain' },
  ],
  
  // recB - Exodeoxyribonuclease V (large multi-domain)
  ECO_K12_007: [
    { domainId: 'PF04313', start: 20, end: 250, source: 'pfam', evalue: 1e-90, name: 'RecB_nuclease', description: 'RecB family nuclease' },
    { domainId: 'PF00580', start: 300, end: 550, source: 'pfam', evalue: 1e-78, name: 'UvrD_helicase', description: 'UvrD/REP helicase N-terminal domain' },
    { domainId: 'PF13361', start: 600, end: 850, source: 'pfam', evalue: 1e-72, name: 'UvrD_helicase_C', description: 'Helicase C-terminal domain' },
    { domainId: 'PF04255', start: 900, end: 1050, source: 'pfam', evalue: 1e-45, name: 'RecB_C', description: 'RecB family C-terminal domain' },
  ],
  ECO_O157_006: [
    { domainId: 'PF04313', start: 22, end: 252, source: 'pfam', evalue: 1e-88, name: 'RecB_nuclease', description: 'RecB family nuclease' },
    { domainId: 'PF00580', start: 302, end: 552, source: 'pfam', evalue: 1e-76, name: 'UvrD_helicase', description: 'UvrD/REP helicase N-terminal domain' },
    { domainId: 'PF13361', start: 602, end: 852, source: 'pfam', evalue: 1e-70, name: 'UvrD_helicase_C', description: 'Helicase C-terminal domain' },
    { domainId: 'PF04255', start: 902, end: 1052, source: 'pfam', evalue: 1e-43, name: 'RecB_C', description: 'RecB family C-terminal domain' },
  ],
  SEN_LT2_007: [
    { domainId: 'PF04313', start: 18, end: 248, source: 'pfam', evalue: 1e-85, name: 'RecB_nuclease', description: 'RecB family nuclease' },
    { domainId: 'PF00580', start: 298, end: 548, source: 'pfam', evalue: 1e-74, name: 'UvrD_helicase', description: 'UvrD/REP helicase N-terminal domain' },
    { domainId: 'PF13361', start: 598, end: 848, source: 'pfam', evalue: 1e-68, name: 'UvrD_helicase_C', description: 'Helicase C-terminal domain' },
  ],
  KPN_MGH_009: [
    { domainId: 'PF04313', start: 25, end: 255, source: 'pfam', evalue: 1e-82, name: 'RecB_nuclease', description: 'RecB family nuclease' },
    { domainId: 'PF00580', start: 305, end: 555, source: 'pfam', evalue: 1e-71, name: 'UvrD_helicase', description: 'UvrD/REP helicase N-terminal domain' },
  ],
  PAE_PA01_007: [
    { domainId: 'PF04313', start: 30, end: 260, source: 'pfam', evalue: 1e-75, name: 'RecB_nuclease', description: 'RecB family nuclease' },
    { domainId: 'PF00580', start: 310, end: 560, source: 'pfam', evalue: 1e-65, name: 'UvrD_helicase', description: 'UvrD/REP helicase N-terminal domain' },
  ],
  
  // cas1 - CRISPR associated (Klebsiella only)
  KPN_MGH_006: [
    { domainId: 'PF01867', start: 15, end: 280, source: 'pfam', evalue: 1e-95, name: 'Cas1_AcylT', description: 'CRISPR associated protein Cas1' },
  ],
  KPN_HS11_006: [
    { domainId: 'PF01867', start: 18, end: 283, source: 'pfam', evalue: 1e-93, name: 'Cas1_AcylT', description: 'CRISPR associated protein Cas1' },
  ],
  
  // cas3 - CRISPR helicase/nuclease
  KPN_MGH_008: [
    { domainId: 'PF01930', start: 10, end: 180, source: 'pfam', evalue: 1e-70, name: 'Cas3_HD', description: 'Cas3 HD nuclease domain' },
    { domainId: 'PF00271', start: 220, end: 480, source: 'pfam', evalue: 1e-85, name: 'Helicase_C', description: 'Helicase C-terminal domain' },
    { domainId: 'PF13245', start: 520, end: 720, source: 'pfam', evalue: 1e-55, name: 'AAA_19', description: 'AAA ATPase domain' },
  ],
  
  // dnaB - Replicative helicase
  ECO_K12_011: [
    { domainId: 'PF00772', start: 20, end: 150, source: 'pfam', evalue: 1e-65, name: 'DnaB_N', description: 'DnaB helicase N-terminal domain' },
    { domainId: 'PF03796', start: 180, end: 380, source: 'pfam', evalue: 1e-88, name: 'DnaB_C', description: 'DnaB helicase C-terminal domain' },
  ],
  SEN_LT2_011: [
    { domainId: 'PF00772', start: 22, end: 152, source: 'pfam', evalue: 1e-63, name: 'DnaB_N', description: 'DnaB helicase N-terminal domain' },
    { domainId: 'PF03796', start: 182, end: 382, source: 'pfam', evalue: 1e-86, name: 'DnaB_C', description: 'DnaB helicase C-terminal domain' },
  ],
  KPN_MGH_013: [
    { domainId: 'PF00772', start: 18, end: 148, source: 'pfam', evalue: 1e-60, name: 'DnaB_N', description: 'DnaB helicase N-terminal domain' },
    { domainId: 'PF03796', start: 178, end: 378, source: 'pfam', evalue: 1e-83, name: 'DnaB_C', description: 'DnaB helicase C-terminal domain' },
  ],
  
  // integrase
  ECO_K12_013: [
    { domainId: 'PF00589', start: 10, end: 180, source: 'pfam', evalue: 1e-75, name: 'Phage_integrase', description: 'Phage integrase family' },
    { domainId: 'PF13102', start: 220, end: 350, source: 'pfam', evalue: 1e-45, name: 'Phage_int_SAM_3', description: 'Phage integrase SAM-like domain' },
  ],
}

// Protein metadata (for coloring by cluster)
const SAMPLE_PROTEIN_METADATA: Record<string, any> = {
  // Cluster assignments based on gene function
  ECO_K12_001: { product: PRODUCTS.repA, cluster: 'repA' },
  ECO_K12_002: { product: PRODUCTS.traT, cluster: 'traT' },
  ECO_K12_003: { product: PRODUCTS.hsdR, cluster: 'hsdR' },
  ECO_K12_004: { product: PRODUCTS.hsdM, cluster: 'hsdM' },
  ECO_K12_005: { product: PRODUCTS.hsdS, cluster: 'hsdS' },
  ECO_K12_006: { product: PRODUCTS.hyp1, cluster: 'hyp' },
  ECO_K12_007: { product: PRODUCTS.recB, cluster: 'recB' },
  ECO_K12_008: { product: PRODUCTS.recC, cluster: 'recC' },
  ECO_K12_009: { product: PRODUCTS.recD, cluster: 'recD' },
  ECO_K12_010: { product: PRODUCTS.ssb, cluster: 'ssb' },
  ECO_K12_011: { product: PRODUCTS.dnaB, cluster: 'dnaB' },
  ECO_K12_012: { product: PRODUCTS.dnaG, cluster: 'dnaG' },
  ECO_K12_013: { product: PRODUCTS.int, cluster: 'integrase' },
  ECO_K12_014: { product: PRODUCTS.hyp2, cluster: 'hyp' },
  
  ECO_O157_001: { product: PRODUCTS.repA, cluster: 'repA' },
  ECO_O157_002: { product: PRODUCTS.traT, cluster: 'traT' },
  ECO_O157_003: { product: PRODUCTS.hsdR, cluster: 'hsdR' },
  ECO_O157_004: { product: PRODUCTS.hsdM, cluster: 'hsdM' },
  ECO_O157_005: { product: PRODUCTS.hsdS, cluster: 'hsdS' },
  ECO_O157_006: { product: PRODUCTS.recB, cluster: 'recB' },
  ECO_O157_007: { product: PRODUCTS.recC, cluster: 'recC' },
  ECO_O157_008: { product: PRODUCTS.recD, cluster: 'recD' },
  ECO_O157_009: { product: PRODUCTS.ssb, cluster: 'ssb' },
  ECO_O157_010: { product: PRODUCTS.dnaB, cluster: 'dnaB' },
  ECO_O157_011: { product: PRODUCTS.dnaG, cluster: 'dnaG' },
  ECO_O157_012: { product: PRODUCTS.int, cluster: 'integrase' },
  ECO_O157_013: { product: PRODUCTS.trans, cluster: 'transposase' },

  SEN_LT2_001: { product: PRODUCTS.repA, cluster: 'repA' },
  SEN_LT2_002: { product: PRODUCTS.traT, cluster: 'traT' },
  SEN_LT2_003: { product: PRODUCTS.hsdR, cluster: 'hsdR' },
  SEN_LT2_004: { product: PRODUCTS.hsdM, cluster: 'hsdM' },
  SEN_LT2_005: { product: PRODUCTS.hsdS, cluster: 'hsdS' },
  SEN_LT2_006: { product: PRODUCTS.hyp1, cluster: 'hyp' },
  SEN_LT2_007: { product: PRODUCTS.recB, cluster: 'recB' },
  SEN_LT2_008: { product: PRODUCTS.recC, cluster: 'recC' },
  SEN_LT2_009: { product: PRODUCTS.recD, cluster: 'recD' },
  SEN_LT2_010: { product: PRODUCTS.ssb, cluster: 'ssb' },
  SEN_LT2_011: { product: PRODUCTS.dnaB, cluster: 'dnaB' },
  SEN_LT2_012: { product: PRODUCTS.dnaG, cluster: 'dnaG' },
  SEN_LT2_013: { product: PRODUCTS.int, cluster: 'integrase' },
  SEN_LT2_014: { product: PRODUCTS.hyp2, cluster: 'hyp' },

  SEN_Typ_001: { product: PRODUCTS.repA, cluster: 'repA' },
  SEN_Typ_002: { product: PRODUCTS.hsdR, cluster: 'hsdR' },
  SEN_Typ_003: { product: PRODUCTS.hsdM, cluster: 'hsdM' },
  SEN_Typ_004: { product: PRODUCTS.hsdS, cluster: 'hsdS' },
  SEN_Typ_005: { product: PRODUCTS.recB, cluster: 'recB' },
  SEN_Typ_006: { product: PRODUCTS.recC, cluster: 'recC' },
  SEN_Typ_007: { product: PRODUCTS.recD, cluster: 'recD' },
  SEN_Typ_008: { product: PRODUCTS.ssb, cluster: 'ssb' },
  SEN_Typ_009: { product: PRODUCTS.dnaB, cluster: 'dnaB' },
  SEN_Typ_010: { product: PRODUCTS.dnaG, cluster: 'dnaG' },
  SEN_Typ_011: { product: PRODUCTS.int, cluster: 'integrase' },
  SEN_Typ_012: { product: PRODUCTS.trans, cluster: 'transposase' },

  KPN_MGH_001: { product: PRODUCTS.repA, cluster: 'repA' },
  KPN_MGH_002: { product: PRODUCTS.traT, cluster: 'traT' },
  KPN_MGH_003: { product: PRODUCTS.hsdR, cluster: 'hsdR' },
  KPN_MGH_004: { product: PRODUCTS.hsdM, cluster: 'hsdM' },
  KPN_MGH_005: { product: PRODUCTS.hsdS, cluster: 'hsdS' },
  KPN_MGH_006: { product: PRODUCTS.cas1, cluster: 'cas1' },
  KPN_MGH_007: { product: PRODUCTS.cas2, cluster: 'cas2' },
  KPN_MGH_008: { product: PRODUCTS.cas3, cluster: 'cas3' },
  KPN_MGH_009: { product: PRODUCTS.recB, cluster: 'recB' },
  KPN_MGH_010: { product: PRODUCTS.recC, cluster: 'recC' },
  KPN_MGH_011: { product: PRODUCTS.recD, cluster: 'recD' },
  KPN_MGH_012: { product: PRODUCTS.ssb, cluster: 'ssb' },
  KPN_MGH_013: { product: PRODUCTS.dnaB, cluster: 'dnaB' },
  KPN_MGH_014: { product: PRODUCTS.dnaG, cluster: 'dnaG' },
  KPN_MGH_015: { product: PRODUCTS.int, cluster: 'integrase' },

  KPN_HS11_001: { product: PRODUCTS.repA, cluster: 'repA' },
  KPN_HS11_002: { product: PRODUCTS.traT, cluster: 'traT' },
  KPN_HS11_003: { product: PRODUCTS.hsdR, cluster: 'hsdR' },
  KPN_HS11_004: { product: PRODUCTS.hsdM, cluster: 'hsdM' },
  KPN_HS11_005: { product: PRODUCTS.hsdS, cluster: 'hsdS' },
  KPN_HS11_006: { product: PRODUCTS.cas1, cluster: 'cas1' },
  KPN_HS11_007: { product: PRODUCTS.cas2, cluster: 'cas2' },
  KPN_HS11_008: { product: PRODUCTS.recB, cluster: 'recB' },
  KPN_HS11_009: { product: PRODUCTS.recC, cluster: 'recC' },
  KPN_HS11_010: { product: PRODUCTS.recD, cluster: 'recD' },
  KPN_HS11_011: { product: PRODUCTS.ssb, cluster: 'ssb' },
  KPN_HS11_012: { product: PRODUCTS.dnaB, cluster: 'dnaB' },
  KPN_HS11_013: { product: PRODUCTS.dnaG, cluster: 'dnaG' },
  KPN_HS11_014: { product: PRODUCTS.int, cluster: 'integrase' },

  PAE_PA01_001: { product: PRODUCTS.int, cluster: 'integrase' },
  PAE_PA01_002: { product: PRODUCTS.dnaG, cluster: 'dnaG' },
  PAE_PA01_003: { product: PRODUCTS.dnaB, cluster: 'dnaB' },
  PAE_PA01_004: { product: PRODUCTS.ssb, cluster: 'ssb' },
  PAE_PA01_005: { product: PRODUCTS.recD, cluster: 'recD' },
  PAE_PA01_006: { product: PRODUCTS.recC, cluster: 'recC' },
  PAE_PA01_007: { product: PRODUCTS.recB, cluster: 'recB' },
  PAE_PA01_008: { product: PRODUCTS.hsdS, cluster: 'hsdS' },
  PAE_PA01_009: { product: PRODUCTS.hsdM, cluster: 'hsdM' },
  PAE_PA01_010: { product: PRODUCTS.hsdR, cluster: 'hsdR' },
  PAE_PA01_011: { product: PRODUCTS.traT, cluster: 'traT' },
  PAE_PA01_012: { product: PRODUCTS.repA, cluster: 'repA' },
  PAE_PA01_013: { product: PRODUCTS.hyp1, cluster: 'hyp' },

  PAE_PA14_001: { product: PRODUCTS.int, cluster: 'integrase' },
  PAE_PA14_002: { product: PRODUCTS.dnaG, cluster: 'dnaG' },
  PAE_PA14_003: { product: PRODUCTS.dnaB, cluster: 'dnaB' },
  PAE_PA14_004: { product: PRODUCTS.ssb, cluster: 'ssb' },
  PAE_PA14_005: { product: PRODUCTS.recD, cluster: 'recD' },
  PAE_PA14_006: { product: PRODUCTS.recC, cluster: 'recC' },
  PAE_PA14_007: { product: PRODUCTS.recB, cluster: 'recB' },
  PAE_PA14_008: { product: PRODUCTS.hyp2, cluster: 'hyp' },
  PAE_PA14_009: { product: PRODUCTS.hsdS, cluster: 'hsdS' },
  PAE_PA14_010: { product: PRODUCTS.hsdM, cluster: 'hsdM' },
  PAE_PA14_011: { product: PRODUCTS.hsdR, cluster: 'hsdR' },
  PAE_PA14_012: { product: PRODUCTS.traT, cluster: 'traT' },
  PAE_PA14_013: { product: PRODUCTS.repA, cluster: 'repA' },
  PAE_PA14_014: { product: PRODUCTS.trans, cluster: 'transposase' },
}

// Tree metadata (taxonomy for phylogenetic tree coloring)
const SAMPLE_TREE_METADATA: Record<string, any> = {
  ECO_K12: { species: 'Escherichia coli K-12', strain: 'MG1655', phylum: 'Proteobacteria', class: 'Gammaproteobacteria', order: 'Enterobacterales', family: 'Enterobacteriaceae' },
  ECO_O157: { species: 'Escherichia coli O157:H7', strain: 'EDL933', phylum: 'Proteobacteria', class: 'Gammaproteobacteria', order: 'Enterobacterales', family: 'Enterobacteriaceae' },
  SEN_LT2: { species: 'Salmonella enterica', strain: 'LT2', phylum: 'Proteobacteria', class: 'Gammaproteobacteria', order: 'Enterobacterales', family: 'Enterobacteriaceae' },
  SEN_Typ: { species: 'Salmonella enterica', strain: 'Typhi CT18', phylum: 'Proteobacteria', class: 'Gammaproteobacteria', order: 'Enterobacterales', family: 'Enterobacteriaceae' },
  KPN_MGH: { species: 'Klebsiella pneumoniae', strain: 'MGH 78578', phylum: 'Proteobacteria', class: 'Gammaproteobacteria', order: 'Enterobacterales', family: 'Enterobacteriaceae' },
  KPN_HS11: { species: 'Klebsiella pneumoniae', strain: 'HS11286', phylum: 'Proteobacteria', class: 'Gammaproteobacteria', order: 'Enterobacterales', family: 'Enterobacteriaceae' },
  PAE_PA01: { species: 'Pseudomonas aeruginosa', strain: 'PAO1', phylum: 'Proteobacteria', class: 'Gammaproteobacteria', order: 'Pseudomonadales', family: 'Pseudomonadaceae' },
  PAE_PA14: { species: 'Pseudomonas aeruginosa', strain: 'PA14', phylum: 'Proteobacteria', class: 'Gammaproteobacteria', order: 'Pseudomonadales', family: 'Pseudomonadaceae' },
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

  // Load hoodini-viz when visible
  useEffect(() => {
    if (!isVisible) return
    if (initializedRef.current) return
    
    initializedRef.current = true
    let unmounted = false

    const loadHoodiniViz = async () => {
      try {
        // Load CSS with override to prevent body pollution
        if (!document.getElementById('hoodini-viz-css')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.id = 'hoodini-viz-css'
          link.href = 'https://unpkg.com/hoodini-viz@0.2.3/dist/hoodini-viz.css'
          document.head.appendChild(link)
          
          // Add override styles AFTER hoodini-viz CSS to fix body pollution
          // This ensures our overrides have higher specificity
          const override = document.createElement('style')
          override.id = 'hoodini-viz-override'
          override.textContent = `
            /* Override hoodini-viz global body styles */
            html body {
              font-size: 1rem !important;
              font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif !important;
            }
            /* Scope hoodini styles to demo container */
            .hoodini-demo-container {
              font-size: 11px;
              font-family: "Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
          `
          document.head.appendChild(override)
        }

        // Check if UMD script already loaded
        if (window.HoodiniViz) {
          if (!unmounted) initializeDemo()
          return
        }

        // Load UMD script (this goes in document, not shadow DOM)
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/hoodini-viz@0.2.6/dist/hoodini-viz.umd.js'
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
          console.log('[HoodiniDemo] createViz config:', { ...vizData, ...config })
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
          display: (loading || !isVisible) ? 'none' : 'block',
          width: '100%',
          height: '100%',
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
        domainsByGene: {},
      }}
      config={{
        showScrollbar: true,
        showRuler: true,
        geneLabelBy: 'ID',
      }}
      height="700px"
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
        domainsByGene: {},
        proteinMetadata: SAMPLE_PROTEIN_METADATA,
      }}
      config={{
        showScrollbar: true,
        showRuler: true,
        geneLabelBy: 'cluster',
        geneLabelSize: 14,
      }}
      height="700px"
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
        domainsByGene: {},
      }}
      config={{
        showScrollbar: true,
        showRuler: true,
        geneLabelBy: 'ID',
      }}
      height="700px"
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
        domainsByGene: {},
        proteinMetadata: SAMPLE_PROTEIN_METADATA,
      }}
      config={{
        showScrollbar: true,
        showRuler: true,
        geneLabelBy: 'ID',
        genePalette: { type: 'qualitative', name: 'Set2', numColors: 12, enabled: true },
        geneColorBy: 'cluster',
        proteinLinkConfig: { colorBy: 'source_gene', useAlpha: true, minAlpha: 0.1, maxAlpha: 0.5 },
      }}
      height="750px"
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
        domainsByGene: {},
      }}
      config={{
        showScrollbar: true,
        showRuler: true,
        geneLabelBy: 'ID',
        nucleotideLinkConfig: { colorBy: 'identity', useAlpha: true, minAlpha: 0.2, maxAlpha: 0.7 },
      }}
      height="750px"
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
        domainsByGene: SAMPLE_DOMAINS_BY_GENE,
        proteinMetadata: SAMPLE_PROTEIN_METADATA,
      }}
      config={{
        showScrollbar: true,
        showRuler: true,
        geneLabelBy: 'ID',
        geneHeight: 70,
        domainPalette: { type: 'qualitative', name: 'Prism', numColors: 12, enabled: true },
        domainColorBy: 'domainName',
      }}
      height="800px"
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
        domainsByGene: SAMPLE_DOMAINS_BY_GENE,
        proteinMetadata: SAMPLE_PROTEIN_METADATA,
        treeMetadata: SAMPLE_TREE_METADATA,
      }}
      config={{
        showScrollbar: true,
        showRuler: true,
        geneLabelBy: 'ID',
        geneHeight: 70,
        genePalette: { type: 'qualitative', name: 'Bold', numColors: 15, enabled: true },
        geneColorBy: 'cluster',
        domainPalette: { type: 'qualitative', name: 'Prism', numColors: 12, enabled: true },
        domainColorBy: 'domainName',
        proteinLinkConfig: { colorBy: 'source_gene', useAlpha: true, minAlpha: 0.1, maxAlpha: 0.5 },
      }}
      height="850px"
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
