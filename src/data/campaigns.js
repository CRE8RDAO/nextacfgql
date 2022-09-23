import { gql } from '@apollo/client';

export const CAMPAIGN_FIELDS =gql`
fragment CampaignFields on AmpliFiCampaign {
  title
  content
  featuredImage {
    node {
      id
    }
  }
  id
  slug
  uri
  
}

query AllCampaignsIndex {
 ampliFiCampaigns(first: 10000, where: {hasPassword: false}) {
    edges {
      node {
        ...CampaignFields
      }
    }
  }
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






