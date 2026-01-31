import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  const mdxPath = params.mdxPath ?? []
  const { metadata } = await importPage(mdxPath)
  return metadata
}

type PageProps = {
  params: Promise<{ mdxPath: string[] }>
}

const Wrapper = getMDXComponents().wrapper!

export default async function Page(props: PageProps) {
  const params = await props.params
  const mdxPath = params.mdxPath ?? []
  const result = await importPage(mdxPath)
  const { default: MDXContent, toc, metadata, sourceCode } = result

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent params={params} />
    </Wrapper>
  )
}
