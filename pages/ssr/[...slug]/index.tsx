import { getAlgoliaCourseBySlug } from '@/lib/algolia';
import { getDiscoveryCourseByUUID } from '@/lib/discovery';
import type { GetServerSideProps } from 'next';

type Repo = {
  name: string;
  stargazers_count: number;
};

export const getServerSideProps:GetServerSideProps = (async ({ params }) => {
  const slug = Array.isArray(params?.slug)
    ? params?.slug?.join('/')
    : params?.slug ?? 'noslug';
  const algoliaCourse = await getAlgoliaCourseBySlug(slug);
  const discoveryCourse = await getDiscoveryCourseByUUID(algoliaCourse?.uuid);
  return {
    props: {
      algoliaCourse,
      discoveryCourse,
    },
  };
});

export default function Page(props: any) {
  return (
    <div>
      <h1>Next.js SSR Page</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
}
