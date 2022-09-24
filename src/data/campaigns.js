import { gql } from '@apollo/client';

export const CAMPAIGN_FIELDS =gql`
fragment CampaignFields on AmpliFiCampaign {
  id
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






