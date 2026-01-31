import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import {
  HoodiniDemo,
  DashboardBasicDemo,
  DashboardCustomPaletteDemo,
  DashboardNoSidebarDemo,
  DashboardLinksDemo,
  DashboardDomainsDemo,
  DashboardTreeOnlyDemo,
  VizStandaloneDemo,
  VizMinimalDemo,
  VizWithTreeDemo,
  VizCompactDemo,
} from './app/components/HoodiniDemo'

const docsComponents = getDocsMDXComponents()

export function useMDXComponents(components?: Record<string, React.ComponentType>) {
  return {
    ...docsComponents,
    // Playground demos (UMD-based, no React conflicts)
    HoodiniDemo,
    DashboardBasicDemo,
    DashboardCustomPaletteDemo,
    DashboardNoSidebarDemo,
    DashboardLinksDemo,
    DashboardDomainsDemo,
    DashboardTreeOnlyDemo,
    VizStandaloneDemo,
    VizMinimalDemo,
    VizWithTreeDemo,
    VizCompactDemo,
    ...components
  }
}
