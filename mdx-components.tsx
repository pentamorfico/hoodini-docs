import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import {
  HoodiniDemo,
  // Dashboard demos
  DashboardBasicDemo,
  DashboardNoSidebarDemo,
  // HoodiniViz demos (incremental complexity)
  VizGenesOnlyDemo,
  VizGenesWithLabelsDemo,
  VizWithTreeDemo,
  VizWithProteinLinksDemo,
  VizWithNucleotideLinksDemo,
  VizWithDomainsDemo,
  VizFullDemo,
  VizWithNcRNAsDemo,
  VizWithRegionsDemo,
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
    DashboardNoSidebarDemo,
    // HoodiniViz demos (incremental)
    VizGenesOnlyDemo,
    VizGenesWithLabelsDemo,
    VizWithTreeDemo,
    VizWithProteinLinksDemo,
    VizWithNucleotideLinksDemo,
    VizWithDomainsDemo,
    VizFullDemo,
    VizWithNcRNAsDemo,
    VizWithRegionsDemo,
    // Legacy
    VizStandaloneDemo,
    VizMinimalDemo,
    VizCompactDemo,
    ...components
  }
}
