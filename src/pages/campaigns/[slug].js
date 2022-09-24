import Link from 'next/link';
import { Helmet } from 'react-helmet';

//import { getPostBySlug, getRecentPosts, getRelatedPosts, campaignPathBySlug } from 'lib/campaigns';
import { getCampaignBySlug, getRecentCampaigns, getRelatedCampaigns, campaignPathBySlug   } from 'lib/campaigns';
import { categoryPathBySlug } from 'lib/categories';
import { formatDate } from 'lib/datetime';
import { ArticleJsonLd } from 'lib/json-ld';
import { helmetSettingsFromMetadata } from 'lib/site';
import useSite from 'hooks/use-site';
import usePageMetadata from 'hooks/use-page-metadata';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';
import Content from 'components/Content';
import Metadata from 'components/Metadata';
import FeaturedImage from 'components/FeaturedImage';

import styles from 'styles/pages/Post.module.scss';

export default function Post({ campaign, socialImage, related }) {
  const {
    title,
    metaTitle,
    description,
    content,
    date,
    author,
    categories,
    modified,
    featuredImage,
    isSticky = false,
  } = campaign;

  const { metadata: siteMetadata = {}, homepage } = useSite();

  if (!campaign.og) {
    campaign.og = {};
  }

  campaign.og.imageUrl = `${homepage}${socialImage}`;
  campaign.og.imageSecureUrl = campaign.og.imageUrl;
  campaign.og.imageWidth = 2000;
  campaign.og.imageHeight = 1000;

  const { metadata } = usePageMetadata({
    metadata: {
      ...campaign,
      title: metaTitle,
      description: description || campaign.og?.description || `Read more about ${title}`,
    },
  });

  if (process.env.WORDPRESS_PLUGIN_SEO !== true) {
    metadata.title = `${title} - ${siteMetadata.title}`;
    metadata.og.title = metadata.title;
    metadata.twitter.title = metadata.title;
  }

  const metadataOptions = {
    compactCategories: false,
  };

  const { campaigns: relatedPostsList, title: relatedPostsTitle } = related || {};

  const helmetSettings = helmetSettingsFromMetadata(metadata);

  return (
    <Layout>
      <Helmet {...helmetSettings} />

      <ArticleJsonLd campaign={campaign} siteTitle={siteMetadata.title} />

      <Header>
        {featuredImage && (
          <FeaturedImage
            {...featuredImage}
            src={featuredImage.sourceUrl}
            dangerouslySetInnerHTML={featuredImage.caption}
          />
        )}
        <h1
          className={styles.title}
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
        <Metadata
          className={styles.campaignMetadata}
          date={date}
          author={author}
          categories={categories}
          options={metadataOptions}
          isSticky={isSticky}
        />
      </Header>

      <Content>
        <Section>
          <Container>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          </Container>
        </Section>
      </Content>

      <Section className={styles.campaignFooter}>
        <Container>
          <p className={styles.campaignModified}>Last updated on {formatDate(modified)}.</p>
          {Array.isArray(relatedPostsList) && relatedPostsList.length > 0 && (
            <div className={styles.relatedPosts}>
              {relatedPostsTitle.name ? (
                <span>
                  More from{' '}
                  <Link href={relatedPostsTitle.link}>
                    <a>{relatedPostsTitle.name}</a>
                  </Link>
                </span>
              ) : (
                <span>More Posts</span>
              )}
              <ul>
                {relatedPostsList.map((campaign) => (
                  <li key={campaign.title}>
                    <Link href={campaignPathBySlug(campaign.slug)}>
                      <a>{campaign.title}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps({ params = {} } = {}) {
  const { campaign } = await getPostBySlug(params?.slug);

  if (!campaign) {
    return {
      props: {},
      notFound: true,
    };
  }

  const { categories, databaseId: campaignId } = campaign;

  const props = {
    campaign,
    socialImage: `${process.env.OG_IMAGE_DIRECTORY}/${params?.slug}.png`,
  };

  const { category: relatedCategory, campaigns: relatedCampaigns } = (await getRelatedCampaigns(categories, campaignId)) || {};
  const hasRelated = relatedCategory && Array.isArray(relatedPosts) && relatedPosts.length;

  if (hasRelated) {
    props.related = {
      campaigns: relatedCampaigns,
      title: {
        name: relatedCategory.name || null,
        link: categoryPathBySlug(relatedCategory.slug),
      },
    };
  }

  return {
    props,
  };
}

export async function getStaticPaths() {
  // Only render the most recent campaigns to avoid spending unecessary time
  // querying every single campaign from WordPress

  // Tip: this can be customized to use data or analytitcs to determine the
  // most popular campaigns and render those instead

  const { campaigns } = await getRecentCampaigns({
    count: process.env.POSTS_PRERENDER_COUNT, // Update this value in next.config.js!
    queryIncludes: 'index',
  });

  const paths = campaigns
    .filter(({ slug }) => typeof slug === 'string')
    .map(({ slug }) => ({
      params: {
        slug,
      },
    }));

  return {
    paths,
    fallback: 'blocking',
  };
}
