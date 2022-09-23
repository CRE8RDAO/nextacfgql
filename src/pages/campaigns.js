import usePageMetadata from 'hooks/use-page-metadata';

import { getPaginatedCampaigns } from 'lib/campaigns';

import TemplateArchive from 'templates/archive-campaigns';

export default function Posts({ posts, pagination }) {
  const title = 'All Campaigns';
  const slug = 'campaigns';

  const { metadata } = usePageMetadata({
    metadata: {
      title,
      description: false,
    },
  });

  return <TemplateArchive title={title} campaigns={campaigns} slug={slug} pagination={pagination} metadata={metadata} />;
}

export async function getStaticProps() {
  const { campaigns, pagination } = await getPaginatedCampaigns({
    queryIncludes: 'archive',
  });
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
