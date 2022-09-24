import Link from 'next/link';

import { campaignPathBySlug, sanitizeExcerpt } from 'lib/campaigns';

import Metadata from 'components/Metadata';


import styles from './CampaignCard.module.scss';

const CampaignCard = ({ campaign, options = {} }) => {
  const { title, excerpt, slug, date, author, categories } = campaign;
  const { excludeMetadata = [] } = options;

  const metadata = {};

  if (!excludeMetadata.includes('author')) {
    metadata.author = author;
  }

  if (!excludeMetadata.includes('date')) {
    metadata.date = date;
  }

  if (!excludeMetadata.includes('categories')) {
    metadata.categories = categories;
  }

  let campaignCardStyle = styles.campaignCard;



  return (
    <div className={campaignCardStyle}>
      
      <Link href={campaignPathBySlug(slug)}>
        <a>
          <h3
            className={styles.campaignCardTitle}
            dangerouslySetInnerHTML={{
              __html: title,
            }}
          />
        </a>
      </Link>
      <Metadata className={styles.campaignCardMetadata} {...metadata} />
      {excerpt && (
        <div
          className={styles.campaignCardContent}
          dangerouslySetInnerHTML={{
            __html: sanitizeExcerpt(excerpt),
          }}
        />
      )}
    </div>
  );
};

export default CampaignCard;
