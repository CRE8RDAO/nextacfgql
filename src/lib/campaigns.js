import { getApolloClient } from 'lib/apollo-client';

import { updateUserAvatar } from 'lib/users';
import { sortObjectsByDate } from 'lib/datetime';

import {
  QUERY_ALL_CAMPAIGNS_INDEX,
  QUERY_ALL_CAMPAIGNS_ARCHIVE,
  QUERY_ALL_CAMPAIGNS,
  QUERY_CAMPAIGN_BY_SLUG,
  
} from 'data/campaigns';

/**
 * campaignPathBySlug
 */

export function campaignPathBySlug(slug) {
  return `/campaigns/${slug}`; //
}
console.log("dunks411", "a fish")
/**
 * getCampaignBySlug
 */

export async function getCampaignBySlug(slug) {
  const apolloClient = getApolloClient();
  const apiHost = new URL(process.env.WORDPRESS_GRAPHQL_ENDPOINT).host;

  let campaignData;
  let seoData;

  try {
    campaignData = await apolloClient.query({
      query: QUERY_CAMPAIGN_BY_SLUG,
      variables: {
        slug,
      },
    });
  } catch (e) {
    console.log(`[campaigns][getCampaignBySlug] Failed to query campaign data: ${e.message}`);
    throw e;
  }
  console.log(`[campaigns][getCampaignBySlug]`);
  if (!campaignData?.data.campaign) return { campaign: undefined };

  const campaign = [campaignData?.data.campaign].map(mapCampaignData)[0];

  // If the SEO plugin is enabled, look up the data
  // and apply it to the default settings

  if (process.env.WORDPRESS_PLUGIN_SEO === true) {
    try {
      seoData = await apolloClient.query({
        query: QUERY_CAMPAIGN_SEO_BY_SLUG,
        variables: {
          slug,
        },
      });
    } catch (e) {
      console.log(`[campaigns][getCampaignBySlug] Failed to query SEO plugin: ${e.message}`);
      console.log('Is the SEO Plugin installed? If not, disable WORDPRESS_PLUGIN_SEO in next.config.js.');
      throw e;
    }

    const { seo = {} } = seoData?.data?.campaign || {};

    campaign.metaTitle = seo.title;
    campaign.metaDescription = seo.metaDesc;
    campaign.readingTime = seo.readingTime;

    // The SEO plugin by default includes a canonical link, but we don't want to use that
    // because it includes the WordPress host, not the site host. We manage the canonical
    // link along with the other metadata, but explicitly check if there's a custom one
    // in here by looking for the API's host in the provided canonical link

    if (seo.canonical && !seo.canonical.includes(apiHost)) {
      campaign.canonical = seo.canonical;
    }

    campaign.og = {
      author: seo.opengraphAuthor,
      description: seo.opengraphDescription,
      image: seo.opengraphImage,
      modifiedTime: seo.opengraphModifiedTime,
      publishedTime: seo.opengraphPublishedTime,
      publisher: seo.opengraphPublisher,
      title: seo.opengraphTitle,
      type: seo.opengraphType,
    };

    campaign.article = {
      author: campaign.og.author,
      modifiedTime: campaign.og.modifiedTime,
      publishedTime: campaign.og.publishedTime,
      publisher: campaign.og.publisher,
    };

    campaign.robots = {
      nofollow: seo.metaRobotsNofollow,
      noindex: seo.metaRobotsNoindex,
    };

    campaign.twitter = {
      description: seo.twitterDescription,
      image: seo.twitterImage,
      title: seo.twitterTitle,
    };
  }

  return {
    campaign,
  };
}
/**
 * getRecentCampaigns
 */

 export async function getRecentCampaigns({ count, ...options }) {
  const { campaigns } = await getAllCampaigns(options);
  const sorted = sortObjectsByDate(campaigns);
  return {
    campaigns: sorted.slice(0, count),
  };
}

/**
 * getAllCampaigns
 */

const allCampaignsIncludesTypes = {
  all: QUERY_ALL_CAMPAIGNS,
  archive: QUERY_ALL_CAMPAIGNS_ARCHIVE,
  index: QUERY_ALL_CAMPAIGNS_INDEX
};

export async function getAllCampaigns(options = {}) {
  const { queryIncludes = 'index' } = options;

  const apolloClient = getApolloClient();

  const data = await apolloClient.query({
    query: allCampaignsIncludesTypes[queryIncludes],
  });
  console.log("dunks411",data)
 // const campaigns = data?.data.ampliFiCampaigns.edges.map(({ node = {} }) => node);

//  console.log("dunks411",campaigns)

  return {
    campaigns: Array.isArray(campaigns) && campaigns.map(mapCampaignData),
  };
}







/**
 * sanitizeExcerpt
 */

export function sanitizeExcerpt(excerpt) {
  if (typeof excerpt !== 'string') {
    throw new Error(`Failed to sanitize excerpt: invalid type ${typeof excerpt}`);
  }

  let sanitized = excerpt;

  // If the theme includes [...] as the more indication, clean it up to just ...

  sanitized = sanitized.replace(/\s?\[&hellip;\]/, '&hellip;');

  // If after the above replacement, the ellipsis includes 4 dots, it's
  // the end of a setence

  sanitized = sanitized.replace('....', '.');
  sanitized = sanitized.replace('.&hellip;', '.');

  // If the theme is including a "Continue..." link, remove it

  sanitized = sanitized.replace(/\w*<a class="more-link".*<\/a>/, '');

  return sanitized;
}

/**
 * mapCampaignData
 */

export function mapCampaignData(ampliFiCampaign = {}) {
  const data = { ...ampliFiCampaign };

  // Clean up the author object to avoid someone having to look an extra
  // level deeper into the node

  if (data.author) {
    data.author = {
      ...data.author.node,
    };
  }

  // The URL by default that comes from Gravatar / WordPress is not a secure
  // URL. This ends up redirecting to https, but it gives mixed content warnings
  // as the HTML shows it as http. Replace the url to avoid those warnings
  // and provide a secure URL by default

  if (data.author?.avatar) {
    data.author.avatar = updateUserAvatar(data.author.avatar);
  }

  // Clean up the categories to make them more easy to access

  if (data.categories) {
    data.categories = data.categories.edges.map(({ node }) => {
      return {
        ...node,
      };
    });
  }

  // Clean up the featured image to make them more easy to access

  if (data.featuredImage) {
    data.featuredImage = data.featuredImage.node;
  }

  return data;
}

/**
 * getRelatedCampaigns
 */

export async function getRelatedCampaigns(categories, campaignId, count = 5) {
  if (!Array.isArray(categories) || categories.length === 0) return;

  let related = {
    category: categories && categories.shift(),
  };

  if (related.category) {
    const { campaigns } = await getCampaignsByCategoryId({
      categoryId: related.category.databaseId,
      queryIncludes: 'archive',
    });

    const filtered = campaigns.filter(({ campaignId: id }) => id !== campaignId);
    const sorted = sortObjectsByDate(filtered);

    related.campaigns = sorted.map((campaign) => ({ title: campaign.title, slug: campaign.slug }));
  }

  if (!Array.isArray(related.campaigns) || related.campaigns.length === 0) {
    const relatedCampaigns = await getRelatedCampaigns(categories, campaignId, count);
    related = relatedCampaigns || related;
  }

  if (Array.isArray(related.campaigns) && related.campaigns.length > count) {
    return related.campaigns.slice(0, count);
  }

  return related;
}

/**
 * sortStickyCampaigns
 */

export function sortStickyCampaigns(campaigns) {
  return [...campaigns].sort((campaign) => (campaign.isSticky ? -1 : 1));
}

/**
 * getCampaignsPerPage
 */

export async function getCampaignsPerPage() {
  //If POST_PER_PAGE is defined at next.config.js
  if (process.env.CAMPAIGNS_PER_PAGE) {
    console.warn(
      'You are using the deprecated POST_PER_PAGE variable. Use your WordPress instance instead to set this value ("Settings" > "Reading" > "Blog pages show at most").'
    );
    return Number(process.env.CAMPAIGNS_PER_PAGE);
  }

  try {
    const apolloClient = getApolloClient();

    const { data } = await apolloClient.query({
      query: QUERY_POST_PER_PAGE,
    });

    return Number(data.allSettings.readingSettingsCampaignsPerPage);
  } catch (e) {
    console.log(`Failed to query campaign per page data: ${e.message}`);
    throw e;
  }
}

/**
 * getPageCount
 */

export async function getPagesCount(campaigns, campaignsPerPage) {
  const _campaignsPerPage = campaignsPerPage ?? (await getCampaignsPerPage());
  return Math.ceil(campaigns.length / _campaignsPerPage);
}

/**
 * getPaginatedCampaigns
 */

export async function getPaginatedCampaigns({ currentPage = 1, ...options } = {}) {
  const { campaigns } = await getAllCampaigns(options);
  const campaignsPerPage = await getCampaignsPerPage();
  const pagesCount = await getPagesCount(campaigns, campaignsPerPage);
  console.log("dunks411",campaigns)

  let page = Number(currentPage);

  if (typeof page === 'undefined' || isNaN(page)) {
    page = 1;
  } else if (page > pagesCount) {
    return {
      campaigns: [],
      pagination: {
        currentPage: undefined,
        pagesCount,
      },
    };
  }


}
