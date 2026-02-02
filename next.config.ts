import nextra from 'nextra'

const withNextra = nextra({
  contentDirBasePath: '/docs',
  defaultShowCopyCode: true
})

export default withNextra({
  output: 'export', // Static export for GitHub Pages
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/hoodini-docs' : ''
})
