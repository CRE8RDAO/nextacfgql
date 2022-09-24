import { gql } from '@apollo/client';

export const CAMPAIGN_FIELDS =gql`
fragment CampaignFields on AmpliFiCampaign {
  id
  excerpt
   categories{
    edges{
      node{
        databaseId
        id
        name
        slug
        
      }
    }
  }
  databaseId
  date
  slug
  title
  
}


`;

export const QUERY_ALL_CAMPAIGNS_INDEX = gql`
  ${CAMPAIGN_FIELDS}
  query AllCampaignsIndex {
    ampliFiCampaigns(first: 10000, where: { hasPassword: false }) {
      edges {
        node {
          ...CampaignFields
        }
      }
    }
  }
`;



export const QUERY_ALL_CAMPAIGNS = gql`
  ${CAMPAIGN_FIELDS}
  query AllCampaigns {
    ampliFiCampaigns(first: 10000) {
      edges {
        node {
          ...CampaignFields
          author {
            node {
              avatar {
                height
                url
                width
              }
              id
              name
              slug
            }
          }
          content
          excerpt
          featuredImage {
            node {
              altText
              caption
              sourceUrl
              srcSet
              sizes
              id
            }
          }
          modified
        }
      }
    }
  }
`;


export const QUERY_ALL_CAMPAIGNS_ARCHIVE = gql`
  ${CAMPAIGN_FIELDS}
  query AllCampaignsArchive {
   ampliFiCampaigns(first: 10000, where: { hasPassword: false }) {
      edges {
        node {
          ...CampaignFields
          author {
            node {
              avatar {
                height
                url
                width
              }
              id
              name
              slug
            }
          }
          excerpt
        }
      }
    }
  }
`;

export const QUERY_CAMPAIGN_BY_SLUG = gql`
  query CampaignBySlug($slug: ID!) {
  ampliFiCampaign(id: $slug, idType: SLUG) {
    excerpt
    author {
      node {
        avatar {
          height
          url
          width
        }
        id
        name
        slug
      }
    }
    id
    categories {
      edges {
        node {
          databaseId
          id
          name
          slug
        }
      }
    }
    content
    date
    featuredImage {
      node {
        altText
        caption
        sourceUrl
        srcSet
        sizes
        id
      }
    }
    modified
    databaseId
    title
    slug
  }
}
`;







export const QUERY_CAMPAIGNS_BY_CATEGORY_ID_INDEX = gql`
  ${CAMPAIGN_FIELDS}
  query CampaignsByCategoryId($categoryId: Int!) {
    ampliFiCampaigns(where: { categoryId: $categoryId, hasPassword: false }) {
      edges {
        node {
          ...CampaignFields
        }
      }
    }
  }
`;

export const QUERY_CAMPAIGNS_BY_CATEGORY_ID_ARCHIVE = gql`
  ${CAMPAIGN_FIELDS}
  query CampaignsByCategoryId($categoryId: Int!) {
    ampliFiCampaigns(where: { categoryId: $categoryId, hasPassword: false }) {
      edges {
        node {
          ...CampaignFields
          author {
            node {
              avatar {
                height
                url
                width
              }
              id
              name
              slug
            }
          }
          excerpt
        }
      }
    }
  }
`;

export const QUERY_CAMPAIGNS_BY_CATEGORY_ID = gql`
  ${CAMPAIGN_FIELDS}
  query CampaignsByCategoryId($categoryId: Int!) {
    ampliFiCampaigns(where: { categoryId: $categoryId, hasPassword: false }) {
      edges {
        node {
          ...CampaignFields
          author {
            node {
              avatar {
                height
                url
                width
              }
              id
              name
              slug
            }
          }
          content
          excerpt
          featuredImage {
            node {
              altText
              caption
              id
              sizes
              sourceUrl
              srcSet
            }
          }
          modified
        }
      }
    }
  }
`;

export const QUERY_CAMPAIGNS_BY_AUTHOR_SLUG_INDEX = gql`
  ${CAMPAIGN_FIELDS}
  query CampaignByAuthorSlugIndex($slug: String!) {
    ampliFiCampaigns(where: { authorName: $slug, hasPassword: false }) {
      edges {
        node {
          ...CampaignFields
        }
      }
    }
  }
`;

export const QUERY_CAMPAIGNS_BY_AUTHOR_SLUG_ARCHIVE = gql`
  ${CAMPAIGN_FIELDS}
  query CampaignByAuthorSlugArchive($slug: String!) {
    ampliFiCampaigns(where: { authorName: $slug, hasPassword: false }) {
      edges {
        node {
          ...CampaignFields
          excerpt
        }
      }
    }
  }
`;

export const QUERY_CAMPAIGNS_BY_AUTHOR_SLUG = gql`
  ${CAMPAIGN_FIELDS}
  query CampaignByAuthorSlug($slug: String!) {
    ampliFiCampaigns(where: { authorName: $slug, hasPassword: false }) {
      edges {
        node {
          ...CampaignFields
          excerpt
          featuredImage {
            node {
              altText
              caption
              id
              sizes
              sourceUrl
              srcSet
            }
          }
          modified
        }
      }
    }
  }
`;

export const QUERY_CAMPAIGN_SEO_BY_SLUG = gql`
  query CampaignSEOBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      seo {
        canonical
        metaDesc
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphAuthor
        opengraphDescription
        opengraphModifiedTime
        opengraphPublishedTime
        opengraphPublisher
        opengraphTitle
        opengraphType
        readingTime
        title
        twitterDescription
        twitterTitle
        twitterImage {
          altText
          sourceUrl
          mediaDetails {
            width
            height
          }
        }
        opengraphImage {
          altText
          sourceUrl
          mediaDetails {
            height
            width
          }
        }
      }
    }
  }
`;

export const QUERY_CAMPAIGN_PER_PAGE = gql`
  query CampaignPerPage {
    allSettings {
      readingSettingsCampaignsPerPage
    }
  }
`;







