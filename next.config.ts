import nextra from 'nextra'

const withNextra = nextra({
  contentDirBasePath: '/docs',
  defaultShowCopyCode: true
})

const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? '/hoodini-docs' : ''

export default withNextra({
  output: 'export', // Static export for GitHub Pages
  images: {
    unoptimized: true
  },
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  }
})
