import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import {
  HoodiniDemo,
  // Dashboard demos
  DashboardBasicDemo,
  DashboardCustomPaletteDemo,
  DashboardNoSidebarDemo,
  DashboardLinksDemo,
  DashboardDomainsDemo,
  DashboardTreeOnlyDemo,
  // HoodiniViz demos (incremental complexity)
  VizGenesOnlyDemo,
  VizGenesWithLabelsDemo,
  VizWithTreeDemo,
  VizWithProteinLinksDemo,
  VizWithNucleotideLinksDemo,
  VizWithDomainsDemo,
  VizFullDemo,
  // Legacy exports
  VizStandaloneDemo,
  VizMinimalDemo,
  VizCompactDemo,
} from './app/components/HoodiniDemo'

const docsComponents = getDocsMDXComponents()

export function useMDXComponents(components?: Record<string, React.ComponentType>) {
  return {
    ...docsComponents,
    // Base component
    HoodiniDemo,
    // Dashboard demos
    DashboardBasicDemo,
    DashboardCustomPaletteDemo,
    DashboardNoSidebarDemo,
    DashboardLinksDemo,
    DashboardDomainsDemo,
    DashboardTreeOnlyDemo,
    // HoodiniViz demos (incremental)
    VizGenesOnlyDemo,
    VizGenesWithLabelsDemo,
    VizWithTreeDemo,
    VizWithProteinLinksDemo,
    VizWithNucleotideLinksDemo,
    VizWithDomainsDemo,
    VizFullDemo,
    // Legacy
    VizStandaloneDemo,
    VizMinimalDemo,
    VizCompactDemo,
    ...components
  }
}
