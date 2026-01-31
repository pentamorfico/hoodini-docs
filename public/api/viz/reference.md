# hoodini-viz API Reference

Auto-generated API documentation.

## React Components

Main components exported by hoodini-viz for building genomic neighborhood visualizations.

### `<HoodiniDashboard />`

HoodiniDashboard - Complete genomic neighborhood visualization dashboard.

Provides:
- Automatic data loading (Parquet/TSV)
- Sidebar with all controls
- HoodiniViz visualization
- DataGrid for tabular views
- Full theme support
- Imperative API via ref

**Import:**
```typescript
import { HoodiniDashboard } from 'hoodini-viz';
```

**Optional Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children?` | `ReactNode` | - | Children to render inside the dashboard (overlays, etc). |
| `className?` | `string` | - | CSS class for the container. |
| `config?` | `Partial<VisualizationConfig>` | - | Master configuration object. Overrides DEFAULT_CONFIG values |
| `controlledState?` | `InitialState` | - | Controlled state - when provided, component is fully control |
| `data?` | `Partial<ParsedData>` | - | Pre-parsed data (bypass loading). Use this if you've already |
| `dataPaths?` | `DataPaths` | - | Paths to data files (Parquet and/or TSV). At minimum, provid |
| `disableThemeProvider?` | `boolean` | - | Disable the ThemeProvider wrapper (use if parent already pro |
| `initialState?` | `InitialState` | - | Initial state for all visualization settings. Use this for u |
| `onDataError?` | `object` | - | Called when data loading fails. |
| `onDataLoaded?` | `object` | - | Called when data loading completes. |
| `onLegendChange?` | `object` | - | Called when legend data updates. |
| `onLoadingChange?` | `object` | - | Called when loading state changes. |
| `onMetadataColumnsDetected?` | `object` | - | Called when metadata columns are detected from loaded data. |
| `onObjectClick?` | `object` | - | Called when a gene/object is clicked. |
| `onSelectionChange?` | `object` | - | Called when selection changes. |
| `onStateChange?` | `object` | - | Callback when any state changes (for controlled mode). |
| `preferParquet?` | `boolean` | - | Prefer Parquet files over text when both are available. |
| `showSidebar?` | `boolean` | - | Show the sidebar with controls. |
| `showToolbar?` | `boolean` | - | Show the toolbar (theme toggle, export button, table toggle) |
| `style?` | `CSSProperties` | - | Inline styles for the container. |
| `theme?` | `"light" \| "dark" \| "system"` | - | Theme mode override. |
| `toolbarExtra?` | `ReactNode` | - | Custom toolbar content to render alongside default buttons. |

### `<HoodiniViz />`

**Import:**
```typescript
import { HoodiniViz } from 'hoodini-viz';
```

**Optional Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `adjacencyN?` | `number` | - | Adjacency parameter for filtering (N neighbors). |
| `alignCluster?` | `string \| number` | - | Cluster ID to align all hoods by. When set, genes matching t |
| `alignLabels?` | `boolean` | - | Whether to align all phylo labels to the same X coordinate. |
| `arrowheadHeight?` | `number` | - | Height of the arrowhead tip. 0 = flat rectangle, >0 = arrow  |
| `colorBy?` | `string` | - | Field to color genes by. |
| `config?` | `object` | - | Master visualization configuration object. Contains all defa |
| `cropToGuides?` | `boolean` | - | Whether to crop SVG exports to the guide bounds (only export |
| `defaultAlign?` | `"start" \| "center" \| "end"` | - | Default alignment position when no alignCluster is set. |
| `domainColorBy?` | `string` | - | Field to color domains by. |
| `domainMetadata?` | `object[]` | - | Domain metadata with additional domain information. |
| `domainPalette?` | `PaletteConfig` | - | Palette configuration for domain coloring |
| `domainsByGene?` | `Record<string, object[]>` | - | Domain annotations organized by gene ID. |
| `domainSource?` | `string` | - | Filter domains by source. |
| `flashHood?` | `string \| number` | - | Hood ID to flash/highlight temporarily. |
| `forceUpdateCounter?` | `number` | - | Counter to force re-renders when external state changes. |
| `formatGuidePreset?` | `FormatPreset` | - | Selected format preset for guides. |
| `geneColorBy?` | `string` | - | Field to color genes by (alternative prop name). |
| `geneColors?` | `ColorMap` | - | Custom colors for genes, overriding palette assignment. |
| `geneHeight?` | `number` | - | Height of gene arrow shapes in pixels. |
| `geneLabelBy?` | `string` | - | Field to use for gene labels (alternative prop name). |
| `geneLabelPosition?` | `"center" \| "top" \| "bottom"` | - | Position of gene labels relative to genes. |
| `geneLabelSize?` | `number` | - | Font size for gene labels (pixels). |
| `genePalette?` | `PaletteConfig` | - | Palette configuration for gene coloring |
| `genomeXScale?` | `number` | - | X-axis scale for genome section (percentage). 100 = actual s |
| `gffFeatures?` | `GFFFeatureData[]` | - | Array of GFF features (genes) to display. Each feature shoul |
| `hiddenGeneIds?` | `Set<string>` | - | Set of hidden gene IDs. Takes precedence over visibleGeneIds |
| `hiddenHoodIds?` | `Set<string \| number>` | - | Set of hidden hood IDs. |
| `hoods?` | `HoodData[]` | - | Hood (genomic neighborhood) definitions. Each hood groups ge |
| `labelBy?` | `string` | - | Field to use for gene labels. |
| `ncRNAPalette?` | `PaletteConfig` | - | Palette configuration for ncRNA coloring |
| `newickStr?` | `string` | - | Newick format string for the phylogenetic tree. |
| `nucleotideLinkConfig?` | `NucleotideLinkConfig` | - | Configuration for nucleotide link visualization |
| `nucleotideLinks?` | `NucleotideLinkData[]` | - | Nucleotide-level synteny links between genomic regions. Used |
| `onLegendChange?` | `object` | - | Callback when legend data changes. |
| `onObjectClick?` | `object` | - | Callback when a visualization object is clicked. Receives th |
| `phyloColors?` | `ColorMap` | - | Custom colors for phylo labels, overriding palette assignmen |
| `phyloLabelPosition?` | `"after-tree" \| "after-tracks"` | - | Position of phylogenetic labels. |
| `phyloLabelSize?` | `number` | - | Font size for phylogenetic labels (pixels). |
| `phyloPalette?` | `PaletteConfig` | - | Palette configuration for phylogenetic label coloring |
| `proteinLinkConfig?` | `ProteinLinkConfig` | - | Configuration for protein link visualization |
| `proteinLinks?` | `ProteinLinkData[]` | - | Protein-protein homology links between genes. Used to draw c |
| `proteinMetadata?` | `Record<string, object>` | - | Protein metadata for additional gene information. Used for c |
| `regionPalette?` | `PaletteConfig` | - | Palette configuration for region coloring |
| `rulerLabelSize?` | `number` | - | Font size for ruler labels (pixels). |
| `scaleExportToFormat?` | `boolean` | - | Whether to scale SVG exports to match the format guide dimen |
| `scaleRulerWithCrop?` | `boolean` | - | Whether to scale ruler dimensions proportionally when croppi |
| `setGenomeViewRef?` | `object` | - | Callback to receive the GenomeView instance reference. |
| `showConnectingLines?` | `boolean` | - | Whether to show connecting lines between tree and tracks. |
| `showDomainLayer?` | `boolean` | - | Show/hide domain layer. |
| `showFormatGuides?` | `boolean` | - | Whether format guides are visible. |
| `showGeneLayer?` | `boolean` | - | Show/hide gene layer. |
| `showGeneTextLayer?` | `boolean` | - | Show/hide gene text labels. |
| `showNcRNALayer?` | `boolean` | - | Show/hide ncRNA layer. |
| `showNucleotideLinkLayer?` | `boolean` | - | Show/hide nucleotide link layer. |
| `showProteinLinkLayer?` | `boolean` | - | Show/hide protein link layer. |
| `showRegionsLayer?` | `boolean` | - | Show/hide regions layer. |
| `showRuler?` | `boolean` | - | Whether to show the ruler widget. |
| `showScrollbar?` | `boolean` | - | Whether to show the scrollbar widget. |
| `showSVGWidget?` | `boolean` | - | Whether to show the SVG export widget. |
| `showTreeLayer?` | `boolean` | - | Show/hide tree layer. |
| `showTreeTextLayer?` | `boolean` | - | Show/hide tree text labels. |
| `strokeLineWidth?` | `number` | - | Stroke/line width for edges (e.g., domains, genes). |
| `styleConfig?` | `StyleConfig` | - | Additional style configuration for layers. |
| `treeColorBy?` | `string` | - | Field to color tree labels by. |
| `treeLabelBy?` | `string` | - | Field to use for tree labels. |
| `treeMetadata?` | `Record<string, object>` | - | Tree leaf metadata for phylogenetic labels and coloring. Key |
| `treeXScale?` | `number` | - | X-axis scale factor for the phylogenetic tree (percentage).  |
| `ultrametric?` | `boolean` | - | Whether to render the tree as ultrametric (all leaves at sam |
| `useDefaultGeneAlignment?` | `boolean` | - | Whether to use each hood's default alignment gene (align_gen |
| `visibleGeneIds?` | `Set<string>` | - | Set of visible gene IDs. Null = show all genes. |
| `ySpacing?` | `number` | - | Vertical spacing between tree leaves (pixels). |

---

## Component Props

Prop interfaces for the React components.

### `HoodiniDashboardProps`

Props for HoodiniDashboard component

| Property | Type | Description |
|----------|------|-------------|
| `children` | `ReactNode` | Children to render inside the dashboard (overlays, etc). |
| `className` | `string` | CSS class for the container. |
| `config` | `Partial<VisualizationConfig>` | Master configuration object. Overrides DEFAULT_CONFIG values. |
| `controlledState` | `InitialState` | Controlled state - when provided, component is fully controlled. You must handle all state changes v |
| `data` | `Partial<ParsedData>` | Pre-parsed data (bypass loading). Use this if you've already loaded/parsed the data externally. |
| `dataPaths` | `DataPaths` | Paths to data files (Parquet and/or TSV). At minimum, provide gffParquet/gffText and hoodsParquet/ho |
| `disableThemeProvider` | `boolean` | Disable the ThemeProvider wrapper (use if parent already provides one). |
| `initialState` | `InitialState` | Initial state for all visualization settings. Use this for uncontrolled mode - values set once on mo |
| `onDataError` | `object` | Called when data loading fails. |
| `onDataLoaded` | `object` | Called when data loading completes. |
| `onLegendChange` | `object` | Called when legend data updates. |
| `onLoadingChange` | `object` | Called when loading state changes. |
| `onMetadataColumnsDetected` | `object` | Called when metadata columns are detected from loaded data. |
| `onObjectClick` | `object` | Called when a gene/object is clicked. |
| `onSelectionChange` | `object` | Called when selection changes. |
| `onStateChange` | `object` | Callback when any state changes (for controlled mode). |
| `preferParquet` | `boolean` | Prefer Parquet files over text when both are available. |
| `showSidebar` | `boolean` | Show the sidebar with controls. |
| `showToolbar` | `boolean` | Show the toolbar (theme toggle, export button, table toggle). |
| `style` | `CSSProperties` | Inline styles for the container. |
| `theme` | `"light" \| "dark" \| "system"` | Theme mode override. |
| `toolbarExtra` | `ReactNode` | Custom toolbar content to render alongside default buttons. |

### `HoodiniVizProps`

Props for the HoodiniViz component.

HoodiniViz is the core visualization component that renders phylogenetic trees,
genomic neighborhoods, protein domains, and homology links using deck.gl.

| Property | Type | Description |
|----------|------|-------------|
| `adjacencyN` | `number` | Adjacency parameter for filtering (N neighbors). |
| `alignCluster` | `string \| number` | Cluster ID to align all hoods by. When set, genes matching this cluster will be aligned vertically. |
| `alignLabels` | `boolean` | Whether to align all phylo labels to the same X coordinate. |
| `arrowheadHeight` | `number` | Height of the arrowhead tip. 0 = flat rectangle, >0 = arrow shape. |
| `colorBy` | `string` | Field to color genes by. |
| `config` | `object` | Master visualization configuration object. Contains all default values for tree, gene, domain, link, |
| `cropToGuides` | `boolean` | Whether to crop SVG exports to the guide bounds (only export content within guides). |
| `defaultAlign` | `"start" \| "center" \| "end"` | Default alignment position when no alignCluster is set. |
| `domainColorBy` | `string` | Field to color domains by. |
| `domainMetadata` | `object[]` | Domain metadata with additional domain information. |
| `domainPalette` | `PaletteConfig` | Palette configuration for domain coloring |
| `domainsByGene` | `Record<string, object[]>` | Domain annotations organized by gene ID. |
| `domainSource` | `string` | Filter domains by source. |
| `flashHood` | `string \| number` | Hood ID to flash/highlight temporarily. |
| `forceUpdateCounter` | `number` | Counter to force re-renders when external state changes. |
| `formatGuidePreset` | `FormatPreset` | Selected format preset for guides. |
| `geneColorBy` | `string` | Field to color genes by (alternative prop name). |
| `geneColors` | `ColorMap` | Custom colors for genes, overriding palette assignment. |
| `geneHeight` | `number` | Height of gene arrow shapes in pixels. |
| `geneLabelBy` | `string` | Field to use for gene labels (alternative prop name). |
| `geneLabelPosition` | `"center" \| "top" \| "bottom"` | Position of gene labels relative to genes. |
| `geneLabelSize` | `number` | Font size for gene labels (pixels). |
| `genePalette` | `PaletteConfig` | Palette configuration for gene coloring |
| `genomeXScale` | `number` | X-axis scale for genome section (percentage). 100 = actual size, 30 = compressed, >100 = stretched. |
| `gffFeatures` | `GFFFeatureData[]` | Array of GFF features (genes) to display. Each feature should have seqid, start, end, strand, and at |
| `hiddenGeneIds` | `Set<string>` | Set of hidden gene IDs. Takes precedence over visibleGeneIds. |
| `hiddenHoodIds` | `Set<string \| number>` | Set of hidden hood IDs. |
| `hoods` | `HoodData[]` | Hood (genomic neighborhood) definitions. Each hood groups genes from a contig/sequence. |
| `labelBy` | `string` | Field to use for gene labels. |
| `ncRNAPalette` | `PaletteConfig` | Palette configuration for ncRNA coloring |
| `newickStr` | `string` | Newick format string for the phylogenetic tree. |
| `nucleotideLinkConfig` | `NucleotideLinkConfig` | Configuration for nucleotide link visualization |
| `nucleotideLinks` | `NucleotideLinkData[]` | Nucleotide-level synteny links between genomic regions. Used to draw connecting polygons showing syn |
| `onLegendChange` | `object` | Callback when legend data changes. |
| `onObjectClick` | `object` | Callback when a visualization object is clicked. Receives the clicked object's data. |
| `phyloColors` | `ColorMap` | Custom colors for phylo labels, overriding palette assignment. |
| `phyloLabelPosition` | `"after-tree" \| "after-tracks"` | Position of phylogenetic labels. |
| `phyloLabelSize` | `number` | Font size for phylogenetic labels (pixels). |
| `phyloPalette` | `PaletteConfig` | Palette configuration for phylogenetic label coloring |
| `proteinLinkConfig` | `ProteinLinkConfig` | Configuration for protein link visualization |
| `proteinLinks` | `ProteinLinkData[]` | Protein-protein homology links between genes. Used to draw connecting curves between related genes. |
| `proteinMetadata` | `Record<string, object>` | Protein metadata for additional gene information. Used for coloring by cluster, labeling, etc. Keys  |
| `regionPalette` | `PaletteConfig` | Palette configuration for region coloring |
| `rulerLabelSize` | `number` | Font size for ruler labels (pixels). |
| `scaleExportToFormat` | `boolean` | Whether to scale SVG exports to match the format guide dimensions. |
| `scaleRulerWithCrop` | `boolean` | Whether to scale ruler dimensions proportionally when cropping to guides. When true, ruler will appe |
| `setGenomeViewRef` | `object` | Callback to receive the GenomeView instance reference. |
| `showConnectingLines` | `boolean` | Whether to show connecting lines between tree and tracks. |
| `showDomainLayer` | `boolean` | Show/hide domain layer. |
| `showFormatGuides` | `boolean` | Whether format guides are visible. |
| `showGeneLayer` | `boolean` | Show/hide gene layer. |
| `showGeneTextLayer` | `boolean` | Show/hide gene text labels. |
| `showNcRNALayer` | `boolean` | Show/hide ncRNA layer. |
| `showNucleotideLinkLayer` | `boolean` | Show/hide nucleotide link layer. |
| `showProteinLinkLayer` | `boolean` | Show/hide protein link layer. |
| `showRegionsLayer` | `boolean` | Show/hide regions layer. |
| `showRuler` | `boolean` | Whether to show the ruler widget. |
| `showScrollbar` | `boolean` | Whether to show the scrollbar widget. |
| `showSVGWidget` | `boolean` | Whether to show the SVG export widget. |
| `showTreeLayer` | `boolean` | Show/hide tree layer. |
| `showTreeTextLayer` | `boolean` | Show/hide tree text labels. |
| `strokeLineWidth` | `number` | Stroke/line width for edges (e.g., domains, genes). |
| `styleConfig` | `StyleConfig` | Additional style configuration for layers. |
| `treeColorBy` | `string` | Field to color tree labels by. |
| `treeLabelBy` | `string` | Field to use for tree labels. |
| `treeMetadata` | `Record<string, object>` | Tree leaf metadata for phylogenetic labels and coloring. Keys are leaf IDs/names from the Newick tre |
| `treeXScale` | `number` | X-axis scale factor for the phylogenetic tree (percentage). 100 = actual size, 50 = compressed, 200  |
| `ultrametric` | `boolean` | Whether to render the tree as ultrametric (all leaves at same X). |
| `useDefaultGeneAlignment` | `boolean` | Whether to use each hood's default alignment gene (align_gene column). When true, each hood aligns b |
| `visibleGeneIds` | `Set<string>` | Set of visible gene IDs. Null = show all genes. |
| `ySpacing` | `number` | Vertical spacing between tree leaves (pixels). |

---

## Configuration

Configuration interfaces for customizing visualization behavior.

### `DashboardPaletteConfig`

Palette configuration

| Property | Type | Description |
|----------|------|-------------|
| `alphaRange` | `[number, number]` |  |
| `enabled` | `boolean` |  |
| `name` | `string` |  |
| `numColors` | `number` |  |
| `reverse` | `boolean` |  |
| `type` | `"sequential" \| "qualitative" \| "diverging"` |  |

### `NucleotideLinkConfig`

Nucleotide link visualization config

| Property | Type | Description |
|----------|------|-------------|
| `colorBy` | `"solid" \| "identity_gradient"` |  |
| `maxAlpha` | `number` |  |
| `minAlpha` | `number` |  |
| `oppositeStrandColor` | `RGBAColor` |  |
| `sameStrandColor` | `RGBAColor` |  |
| `solidColor` | `RGBAColor` |  |
| `strandColoring` | `boolean` |  |
| `useAlpha` | `boolean` |  |

### `ProteinLinkConfig`

Protein link visualization config

| Property | Type | Description |
|----------|------|-------------|
| `colorBy` | `"source_gene" \| "target_gene" \| "identity_solid" \| "identity_gradient"` |  |
| `maxAlpha` | `number` |  |
| `minAlpha` | `number` |  |
| `palette` | `PaletteConfig` |  |
| `solidColor` | `RGBAColor` |  |
| `useAlpha` | `boolean` |  |

### `StyleConfig`

Style configuration for visual layers

| Property | Type | Description |
|----------|------|-------------|
| `gene` | `object` | Gene layer styles |
| `tree` | `object` | Tree layer styles |

### `VizNucleotideLinkConfig`

Configuration for nucleotide link visualization

| Property | Type | Description |
|----------|------|-------------|
| `colorBy` | `"solid" \| "identity_gradient"` | How to color links: 'solid' or 'identity_gradient' |
| `maxAlpha` | `number` | Maximum alpha value (0-1) |
| `minAlpha` | `number` | Minimum alpha value (0-1) |
| `oppositeStrandColor` | `RGBAColor` | Color for opposite-strand alignments |
| `sameStrandColor` | `RGBAColor` | Color for same-strand alignments |
| `solidColor` | `RGBAColor` | Solid color for links |
| `strandColoring` | `boolean` | Whether to use strand-based coloring |
| `useAlpha` | `boolean` | Whether to use alpha transparency |

### `VizPaletteConfig`

Palette configuration for coloring

| Property | Type | Description |
|----------|------|-------------|
| `enabled` | `boolean` | Whether palette coloring is enabled |
| `name` | `string` | Name of the palette (e.g., 'Set1', 'Blues', 'RdBu') |
| `numColors` | `number` | Number of colors to use from the palette |
| `reverse` | `boolean` | Whether to reverse the palette order |
| `type` | `"sequential" \| "qualitative" \| "diverging"` | Palette type: 'qualitative', 'sequential', or 'diverging' |

### `VizProteinLinkConfig`

Configuration for protein link visualization

| Property | Type | Description |
|----------|------|-------------|
| `colorBy` | `"source_gene" \| "target_gene" \| "identity_solid" \| "identity_gradient"` | How to color links: 'source_gene', 'target_gene', 'identity_solid', 'identity_gradient' |
| `maxAlpha` | `number` | Maximum alpha value (0-1) |
| `minAlpha` | `number` | Minimum alpha value (0-1) |
| `palette` | `PaletteConfig` | Palette for gradient coloring |
| `solidColor` | `RGBAColor` | Solid color when colorBy is 'identity_solid' |
| `useAlpha` | `boolean` | Whether to use alpha transparency |

---

## Data Types

Data structures for passing genomic data to components.

### `DataPaths`

Data paths for loading genomic data.
Supports both Parquet and TSV/text formats.
If a parquet path fails, will try the corresponding text path.

| Property | Type | Description |
|----------|------|-------------|
| `domainsMetadataParquet` | `string` | Path to domain metadata parquet file |
| `domainsMetadataText` | `string` | Path to domain metadata TSV file |
| `domainsParquet` | `string` | Path to domains parquet file |
| `domainsText` | `string` | Path to domains TSV file |
| `gffParquet` | `string` | Path to GFF features parquet file |
| `gffText` | `string` | Path to GFF features text file |
| `hoodsParquet` | `string` | Path to hoods parquet file |
| `hoodsText` | `string` | Path to hoods TSV file |
| `ncRNAMetadataParquet` | `string` | Path to ncRNA metadata parquet file |
| `ncRNAMetadataText` | `string` | Path to ncRNA metadata TSV file (seqid, start, end, type, sequence, structure) |
| `newick` | `string` | Path to Newick tree file |
| `nucleotideLinksParquet` | `string` | Path to nucleotide links parquet file |
| `nucleotideLinksText` | `string` | Path to nucleotide links TSV file |
| `proteinLinksParquet` | `string` | Path to protein links parquet file |
| `proteinLinksText` | `string` | Path to protein links TSV file |
| `proteinMetadataParquet` | `string` | Path to protein metadata parquet file |
| `proteinMetadataText` | `string` | Path to protein metadata TSV file |
| `treeMetadataParquet` | `string` | Path to tree metadata parquet file |
| `treeMetadataText` | `string` | Path to tree metadata TSV file |

### `GFFFeatureData`

GFF Feature representing a gene or genomic feature

| Property | Type | Description |
|----------|------|-------------|
| `attributes` | `Record<string, string>` |  |
| `end` | `number` |  |
| `seqid` | `string` |  |
| `start` | `number` |  |
| `strand` | `"+" \| "-"` |  |
| `type` | `string` |  |

### `HoodData`

Hood (genomic neighborhood) definition

| Property | Type | Description |
|----------|------|-------------|
| `align_gene` | `string` |  |
| `end` | `number` |  |
| `hood_id` | `string \| number` |  |
| `hoodId` | `string \| number` |  |
| `seqid` | `string` |  |
| `start` | `number` |  |

### `NucleotideLinkData`

Nucleotide-level synteny link

| Property | Type | Description |
|----------|------|-------------|
| `endA` | `number` |  |
| `endB` | `number` |  |
| `seqidA` | `string` |  |
| `seqidB` | `string` |  |
| `similarity` | `number` |  |
| `startA` | `number` |  |
| `startB` | `number` |  |

### `ParsedData`

Parsed data available after loading

| Property | Type | Description |
|----------|------|-------------|
| `domainMetadata` | `Record<string, any>` |  |
| `domainsByGene` | `Record<string, any[]>` |  |
| `gffFeatures` | `any[]` |  |
| `hoods` | `any[]` |  |
| `ncRNAMetadata` | `Record<string, any>` |  |
| `newickStr` | `string` |  |
| `nucleotideLinks` | `any[]` |  |
| `proteinLinks` | `any[]` |  |
| `proteinMetadata` | `Record<string, any>` |  |
| `treeMetadata` | `Record<string, any>` |  |

### `ProteinLinkData`

Protein-protein homology link

| Property | Type | Description |
|----------|------|-------------|
| `gAId` | `string` |  |
| `gBId` | `string` |  |
| `similarity` | `number` |  |

---

## Other Interfaces

### `FormatPreset`

| Property | Type | Description |
|----------|------|-------------|
| `category` | `"print" \| "screen" \| "presentation"` |  |
| `height` | `number` |  |
| `id` | `string` |  |
| `name` | `string` |  |
| `unit` | `"mm" \| "px"` |  |
| `width` | `number` |  |

### `HoodiniDashboardRef`

Methods exposed via ref

| Property | Type | Description |
|----------|------|-------------|
| `alignByCluster` | `object` | Align all hoods by a cluster |
| `exportSVG` | `object` | Export current view to SVG |
| `focusGeneById` | `object` | Focus on a specific gene by ID |
| `focusHoodById` | `object` | Focus on a specific hood by ID |
| `focusTreeLeafById` | `object` | Focus on a tree leaf by ID |
| `getGenomeView` | `object` | Get the GenomeView instance |
| `getLegendData` | `object` | Get current legend data |
| `getParsedData` | `object` | Get parsed data |
| `getPhyloTree` | `object` | Get the PhyloTree instance |
| `getState` | `object` | Get current state (all settings) |
| `resetAlignment` | `object` | Reset alignment to defaults |
| `setState` | `object` | Set state (partial update) |
| `vizRef` | `RefObject<any>` | Direct access to HoodiniViz ref |

### `InitialState`

Initial state configuration

| Property | Type | Description |
|----------|------|-------------|
| `alignCluster` | `string \| number` |  |
| `alignLabels` | `boolean` |  |
| `arrowheadHeight` | `number` |  |
| `cropToGuides` | `boolean` |  |
| `defaultAlign` | `"start" \| "center" \| "end"` |  |
| `domainColorBy` | `string` |  |
| `domainPalette` | `PaletteConfig` |  |
| `domainSource` | `string` |  |
| `formatGuidePreset` | `FormatPreset` |  |
| `geneColorBy` | `string` |  |
| `geneHeight` | `number` |  |
| `geneLabelBy` | `string` |  |
| `geneLabelPosition` | `"center" \| "top" \| "bottom"` |  |
| `geneLabelSize` | `number` |  |
| `genePalette` | `PaletteConfig` |  |
| `genomeXScale` | `number` |  |
| `ncRNAPalette` | `PaletteConfig` |  |
| `nucleotideLinkConfig` | `NucleotideLinkConfig` |  |
| `phyloLabelPosition` | `"after-tree" \| "after-tracks"` |  |
| `phyloLabelSize` | `number` |  |
| `phyloPalette` | `PaletteConfig` |  |
| `proteinLinkConfig` | `ProteinLinkConfig` |  |
| `regionPalette` | `PaletteConfig` |  |
| `rulerLabelSize` | `number` |  |
| `scaleExportToFormat` | `boolean` |  |
| `scaleRulerWithCrop` | `boolean` |  |
| `showConnectingLines` | `boolean` |  |
| `showDataTable` | `boolean` |  |
| `showDomainLayer` | `boolean` |  |
| `showFormatGuides` | `boolean` |  |
| `showGeneLayer` | `boolean` |  |
| `showGeneTextLayer` | `boolean` |  |
| `showNcRNALayer` | `boolean` |  |
| `showNucleotideLinkLayer` | `boolean` |  |
| `showProteinLinkLayer` | `boolean` |  |
| `showRegionsLayer` | `boolean` |  |
| `showRuler` | `boolean` |  |
| `showScrollbar` | `boolean` |  |
| `showTreeLayer` | `boolean` |  |
| `showTreeTextLayer` | `boolean` |  |
| `strokeLineWidth` | `number` |  |
| `treeColorBy` | `string` |  |
| `treeLabelBy` | `string` |  |
| `treeXScale` | `number` |  |
| `ultrametric` | `boolean` |  |
| `useDefaultGeneAlignment` | `boolean` |  |
| `ySpacing` | `number` |  |

---

## Type Aliases

### `ColorMap`

Color map for entities - maps entity ID to RGBA color

```typescript
type ColorMap = Record<string, RGBAColor> | Map<string, RGBAColor> | None
```

### `RGBAColor`

RGBA color as [r, g, b, a] where each value is 0-255

```typescript
type RGBAColor = [number, number, number, number]
```

### `VisualizationConfig`

Type for the complete visualization configuration

```typescript
type VisualizationConfig = any
```

### `VizRGBAColor`

RGBA color as [r, g, b, a] where each value is 0-255

```typescript
type VizRGBAColor = [number, number, number, number]
```

---

## Model Classes

Internal model classes for representing genomic data structures.

### `Domain`

**Methods:**

- `createDomainPolygon()`
  ```typescript
  function createDomainPolygon(g: any, domainStart: any, domainEnd: any): any[][]
  ```

- `getConvexGenePolygon()`
  ```typescript
  function getConvexGenePolygon(g: any): any[][]
  ```

- `interpolateOnLine()`
  ```typescript
  function interpolateOnLine(line: any, t: any): any[]
  ```

- `normalize()`
  ```typescript
  function normalize(v: any): number[]
  ```

- `perpVector()`
  ```typescript
  function perpVector(p0: any, p1: any): number[]
  ```

- `setParentGene()`
  ```typescript
  function setParentGene(gene: any): void
  ```

- `updatePolygon()`
  ```typescript
  function updatePolygon(): void
  ```

### `Gene`

**Methods:**

- `addDomain()`
  ```typescript
  function addDomain(domain: any): void
  ```

- `computeCenterLine()`
  ```typescript
  function computeCenterLine(): any[]
  ```

- `setTrackY()`
  ```typescript
  function setTrackY(y: any): void
  ```

- `updatePolygon()`
  ```typescript
  function updatePolygon(): void
  ```

### `GenomeView`

**Methods:**

- `addDomainMetadata()`
  ```typescript
  function addDomainMetadata(domainMetadata: any): void
  ```

- `addDomains()`
  ```typescript
  function addDomains(domainsByGene: any): void
  ```

- `addFeatures()`
  ```typescript
  function addFeatures(gffFeatures: any): void
  ```

- `addNucleotideLinks()`
  ```typescript
  function addNucleotideLinks(links: any, color: number[], adjacencyN: number): void
  ```

- `addProteinLinks()`
  ```typescript
  function addProteinLinks(links: any, color: number[], adjacencyN: number): void
  ```

- `alignAllToCenter()`
  ```typescript
  function alignAllToCenter(): void
  ```

- `alignAllToEnd()`
  ```typescript
  function alignAllToEnd(): void
  ```

- `alignAllToStart()`
  ```typescript
  function alignAllToStart(): void
  ```

- `alignByDefaultGenes()`
  ```typescript
  function alignByDefaultGenes(): void
  ```

- `alignCluster()`
  ```typescript
  function alignCluster(clusterId: any): void
  ```

- `applyDomainPalette()`
  ```typescript
  function applyDomainPalette(paletteConfig: any): void
  ```

- `applyHoods()`
  ```typescript
  function applyHoods(hoods: any): void
  ```

- `applyNucleotideLinkColors()`
  ```typescript
  function applyNucleotideLinkColors(colorConfig: any): void
  ```

- `applyProteinLinkColors()`
  ```typescript
  function applyProteinLinkColors(colorConfig: any): void
  ```

- `buildEdgesWithMetadata()`
  ```typescript
  function buildEdgesWithMetadata(): any
  ```

- `buildNodePoints()`
  ```typescript
  function buildNodePoints(selectedNode: any, colorLeavesBy: any): any
  ```

- `buildPhyloLabels()`
  ```typescript
  function buildPhyloLabels(phyloLabelPosition: string): any
  ```

- `buildScaleBar()`
  ```typescript
  function buildScaleBar(): any[]
  ```

- `computeGenePrevalence()`
  ```typescript
  function computeGenePrevalence(categoryField: string): Map<any, any>
  ```

- `computeTrackPositions()`
  ```typescript
  function computeTrackPositions(): void
  ```

- `fadeColor()`
  ```typescript
  function fadeColor(color: any, factor: any): any[]
  ```

- `filterBySelectedNode()`
  ```typescript
  function filterBySelectedNode(selectedNode: any): object
  ```

- `flipTrack()`
  ```typescript
  function flipTrack(hood_id: any): void
  ```

- `flipTrackState()`
  ```typescript
  function flipTrackState(hood_id: any): void
  ```

- `flipTrackStateWithCentering()`
  ```typescript
  function flipTrackStateWithCentering(hood_id: any): void
  ```

- `flipTrackToggle()`
  ```typescript
  function flipTrackToggle(hood_id: any): void
  ```

- `getAllDomains()`
  ```typescript
  function getAllDomains(): any
  ```

- `getAllNcRNAs()`
  ```typescript
  function getAllNcRNAs(): unknown[]
  ```

- `getAllNonCodingFeatures()`
  ```typescript
  function getAllNonCodingFeatures(): unknown[]
  ```

- `getAllRegions()`
  ```typescript
  function getAllRegions(): unknown[]
  ```

- `getClusterSummary()`
  ```typescript
  function getClusterSummary(): any
  ```

- `getGeneIdFromAttributes()`
  ```typescript
  function getGeneIdFromAttributes(attrs: any): any
  ```

- `getHoodIdFromSeqid()`
  ```typescript
  function getHoodIdFromSeqid(seqid: any): any
  ```

- `getHoodIdsFromSeqid()`
  ```typescript
  function getHoodIdsFromSeqid(seqid: any): any
  ```

- `getNodeDescendantLeaves()`
  ```typescript
  function getNodeDescendantLeaves(node: any): any
  ```

- `getNucleotidePolygons()`
  ```typescript
  function getNucleotidePolygons(): any[]
  ```

- `getProteinPolygons()`
  ```typescript
  function getProteinPolygons(): any[]
  ```

- `getRegionPolygons()`
  ```typescript
  function getRegionPolygons(): any[]
  ```

- `getSeqidFromHoodId()`
  ```typescript
  function getSeqidFromHoodId(hood_id: any): any
  ```

- `getTrackAnchor()`
  ```typescript
  function getTrackAnchor(hood_id: any): number
  ```

- `getTrackY()`
  ```typescript
  function getTrackY(seqid: any): any
  ```

- `getTrackYByHoodId()`
  ```typescript
  function getTrackYByHoodId(hood_id: any): any
  ```

- `initGenes()`
  ```typescript
  function initGenes(): void
  ```

- `setNcRNAColorsWithPalette()`
  ```typescript
  function setNcRNAColorsWithPalette(paletteConfig: any): void
  ```

- `setProteinClusters()`
  ```typescript
  function setProteinClusters(clusterMap: any): void
  ```

- `setProteinClustersWithPalette()`
  ```typescript
  function setProteinClustersWithPalette(clusterMap: any, paletteConfig: any): void
  ```

- `setRegionColorsWithPalette()`
  ```typescript
  function setRegionColorsWithPalette(paletteConfig: any): void
  ```

- `shiftTrack()`
  ```typescript
  function shiftTrack(hood_id: any, delta: any): void
  ```

- `shiftTrackMinus1kb()`
  ```typescript
  function shiftTrackMinus1kb(hood_id: any): void
  ```

- `shiftTrackPlus1kb()`
  ```typescript
  function shiftTrackPlus1kb(hood_id: any): void
  ```

- `toggleTrackFlip()`
  ```typescript
  function toggleTrackFlip(hood_id: any): void
  ```

- `updateGlobalBounds()`
  ```typescript
  function updateGlobalBounds(): void
  ```

- `updateLinkPositions()`
  ```typescript
  function updateLinkPositions(): void
  ```

- `flipCoordinate()`
  ```typescript
  function flipCoordinate(x: any, anchor: any): number
  ```

- `getGeneVisualX()`
  ```typescript
  function getGeneVisualX(gene: any, genomeView: any): number
  ```

- `getTransformedXUnified()`
  ```typescript
  function getTransformedXUnified(x: any, anchor: any, offset: any, flipped: any): any
  ```

### `PhyloNode`

**Methods:**

- `getLeaves()`
  ```typescript
  function getLeaves(): any
  ```

### `PhyloTree`

**Methods:**

- `assignInternalX()`
  ```typescript
  function assignInternalX(node: any): any
  ```

- `assignX()`
  ```typescript
  function assignX(leaves: any): void
  ```

- `buildEdges()`
  ```typescript
  function buildEdges(): any[]
  ```

- `collectAll()`
  ```typescript
  function collectAll(): void
  ```

- `computeDistances()`
  ```typescript
  function computeDistances(): void
  ```

- `getLeafNodes()`
  ```typescript
  function getLeafNodes(): any
  ```

- `ladderize()`
  ```typescript
  function ladderize(ascending: boolean): void
  ```
  Ladderize the tree by sorting branches at each node by the number of descendant leaves.
This produces a cleaner visual representation matching Taxonium's algorithm exactly.
Uses iterative traversal to avoid stack overflow on large trees.

- `layout()`
  ```typescript
  function layout(leavesOrder: any): void
  ```

- `makeUltrametric()`
  ```typescript
  function makeUltrametric(): void
  ```
  Convert tree to ultrametric format where all leaves are equidistant from the root
This adjusts branch lengths to make the tree ultrametric while preserving topology

- `parseNewick()`
  ```typescript
  function parseNewick(s: any): PhyloNode
  ```

- `scaleY()`
  ```typescript
  function scaleY(): void
  ```

- `setParents()`
  ```typescript
  function setParents(): void
  ```

---

## Utility Functions

### `getPaletteColors`

```typescript
function getPaletteColors(paletteName: any, numColors: any, reverse: boolean): any
```

### `getQualitativePalettes`

```typescript
function getQualitativePalettes(minColors: number, maxColors: number): any
```

### `getSequentialPalettes`

```typescript
function getSequentialPalettes(minColors: number, maxColors: number): any
```

---

## Constants

### `DEFAULT_CONFIG`

```typescript
const DEFAULT_CONFIG: object
```

### `FORMAT_PRESETS`

```typescript
const FORMAT_PRESETS: FormatPreset[]
```
