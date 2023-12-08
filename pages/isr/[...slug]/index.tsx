import { getAlgoliaCourseBySlug } from "@/lib/algolia"
import { getDiscoveryCourseByUUID } from "@/lib/discovery"
import { GetStaticProps } from "next"

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = Array.isArray(params?.slug) ? params?.slug?.join('/') : params?.slug ?? 'noslug';
  const algoliaCourse = await getAlgoliaCourseBySlug(slug)
  const discoveryCourse = await getDiscoveryCourseByUUID(algoliaCourse?.uuid)
  return {
    props: {
      algoliaCourse,
      discoveryCourse,
    },
    revalidate: 5,
  }
}

export default function Page(props: any) {
  return (
    <main>
      <h1>Next.js ISR Page</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </main>
  )
}
