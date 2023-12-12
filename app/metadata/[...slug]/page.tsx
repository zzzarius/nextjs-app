import { getAlgoliaCourseBySlug, getAlgoliaCourseSlugs } from '@/lib/algolia';
import { getDiscoveryCourseByUUID } from '@/lib/discovery';
import type { Metadata } from 'next'


export async function generateStaticParams() {
  const slugs = await getAlgoliaCourseSlugs();
  return slugs.map((slug) => ({ slug: slug.split('/') }));
}

export async function generateMetadata(props: any): Promise<Metadata> {
  const slug = Array.isArray(props.params?.slug)
  ? props.params?.slug?.join('/')
  : props.params?.slug ?? 'noslug';
  const algoliaCourse = await getAlgoliaCourseBySlug(slug);
  const discoveryCourse = await getDiscoveryCourseByUUID(algoliaCourse?.uuid);
  return {
    title: algoliaCourse?.title,
    description: discoveryCourse?.short_description,
  }
}

export default async function Page(props: any) {
  const slug = Array.isArray(props.params?.slug)
    ? props.params?.slug?.join('/')
    : props.params?.slug ?? 'noslug';
  const algoliaCourse = await getAlgoliaCourseBySlug(slug);
  const discoveryCourse = await getDiscoveryCourseByUUID(algoliaCourse?.uuid);
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@id': algoliaCourse?.marketing_url,
    '@type': 'Course',
    name: algoliaCourse?.title,
    description: discoveryCourse?.short_description,
    publisher: {
      '@type': 'Organization',
      name: discoveryCourse?.owners?.at(0)?.name,
      url: discoveryCourse?.owners?.at(0)?.marketing_url,
    },
    provider: {
      '@type': 'Organization',
      name: discoveryCourse?.owners?.at(0)?.name,
      url: discoveryCourse?.owners?.at(0)?.marketing_url,
    },
    image: discoveryCourse?.owners?.at(0)?.logo_image_url,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4,
      ratingCount: 1234,
      reviewCount: 450,
    },
    offers: [
      {
        '@type': 'Offer',
        category: 'Paid',
        priceCurrency: 'EUR',
        price: 10.99,
      },
    ],
    totalHistoricalEnrollment: 12345,
    datePublished: '2019-03-21',
    educationalLevel: 'Advanced',
    about: ['C++ Coding', 'Backend Engineering'],
    teaches: [
      'Practice and apply systems thinking to plan for change',
      'Understand how memory allocation works.',
    ],
    financialAidEligible: 'Scholarship Available',
    inLanguage: 'en',
    availableLanguage: ['fr', 'es'],
    syllabusSections: [
      {
        '@type': 'Syllabus',
        name: 'Memory Allocation',
        description:
          'Learn how memory is allocated when creating C++ variables.',
        timeRequired: 'PT6H',
      },
      {
        '@type': 'Syllabus',
        name: 'C++ Pointers',
        description: 'Learn what a C++ pointer is and when they are used.',
        timeRequired: 'PT11H',
      },
    ],
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Lou S.',
        },
        datePublished: '2020-08-31',
        reviewBody: 'My C++ skills improved, but the pace was too fast.',
        reviewRating: {
          '@type': 'Rating',
          bestRating: 10,
          ratingValue: 6,
        },
      },
    ],
    coursePrerequisites: [
      'Basic understanding of C++ up to arrays and functions.',
      'https://www.example.com/beginnerCpp',
    ],
    educationalCredentialAwarded: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'CourseProvider Certificate',
        url: 'www.example.com',
        credentialCategory: 'Certificate',
        // offers only needed if the credential costs extra money.
        offers: [
          {
            '@type': 'Offer',
            category: 'Paid',
            price: 5,
            priceCurrency: 'USD',
          },
        ],
      },
    ],
    video: {
      '@type': 'VideoObject',
      name: 'Video name',
      description: 'A video previewing this course.',
      uploadDate: '2022-03-28',
      contentUrl: 'www.example.come/mp4',
      thumbnailUrl: 'www.example.com/thumbnailurl.jpg',
    },
    hasCourseInstance: [
      {
        // Blended, instructor-led course meeting 3 hours per day in July.
        '@type': 'CourseInstance',
        courseMode: 'Blended',
        location: 'Example University',
        courseSchedule: {
          '@type': 'Schedule',
          duration: 'PT3H',
          repeatFrequency: 'Daily',
          repeatCount: 31,
          startDate: '2023-07-01',
          endDate: '2023-07-31',
        },
        instructor: [
          {
            '@type': 'Person',
            name: 'Ira D.',
            description: 'Professor at X-University',
            image: 'http://example.com/person.jpg',
          },
        ],
      },
      {
        // Online self-paced course that takes 2 days to complete.
        '@type': 'CourseInstance',
        courseMode: 'Online',
        courseWorkload: 'P2D',
      },
    ],
    // Only required for course programs that link to child courses.
    hasPart: [
      {
        '@type': 'Course',
        name: 'C++ Algorithms',
        url: 'https://www.example.com/cpp-algorithms',
        description: 'Learn how to code base algorithms in c++.',
      },
      {
        '@type': 'Course',
        name: 'C++ Data Structures',
        url: 'https://www.example.com/cpp-data-structures',
        description: 'Learn about core c++ data structures.',
      },
    ],
  };
  return (
    <div>
      <h1>
        Metadata, check the source or scan it on{' '}
        <a href="https://search.google.com/test/rich-results">
          Rich results test
        </a>
      </h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
      />
    </div>
  );
}
