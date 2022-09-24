import { getPaginatedCampaigns } from 'lib/campaigns';
import usePageMetadata from 'hooks/use-page-metadata';

import TemplateArchive from 'templates/archive';

export default function Campaigns({ campaigns, pagination }) {
  const title = `All Campaigns`;
  const slug = 'campaigns';

  const { metadata } = usePageMetadata({
    metadata: {
      title,
      description: `Page ${pagination.currentPage}`,
    },
  });

  return <TemplateArchive title={title} campaigns={campaigns} slug={slug} pagination={pagination} metadata={metadata} />;
}

export async function getStaticProps({ params = {} } = {}) {
  const { campaigns, pagination } = await getPaginatedCampaigns({
    currentPage: params?.page,
    queryIncludes: 'archive',
  });

  if (!pagination.currentPage) {
    return {
      props: {},
      notFound: true,
    };
  }

  return {
    props: {
      campaigns,
      pagination: {
        ...pagination,
        basePath: '/campaigns',
      },
    },
  };
}

export async function getStaticPaths() {
  // By default, we don't render any Pagination pages as
  // we're considering them non-critical pages

  // To enable pre-rendering of Category pages:

  // 1. Add import to the top of the file
  //
  // import { getAllCampaigns, getPagesCount } from 'lib/campaigns';

  // 2. Uncomment the below
  //
  // const { campaigns } = await getAllCampaigns({
  //   queryIncludes: 'index',
  // });
  // const pagesCount = await getPagesCount(campaigns);

  // const paths = [...new Array(pagesCount)].map((_, i) => {
  //   return { params: { page: String(i + 1) } };
  // });

  // 3. Update `paths` in the return statement below to reference the `paths` constant above

  return {
    paths: [],
    fallback: 'blocking',
  };
}
