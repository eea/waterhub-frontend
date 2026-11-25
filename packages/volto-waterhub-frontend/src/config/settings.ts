/* eslint-disable import/no-unresolved -- provided by the registered KitKat bundle */
import loadable from '@loadable/component';
import type { ConfigType } from '@plone/registry';
// @ts-expect-error Provided by the registered KitKat bundle.
import Gallery from '@eeacms/volto-listing-block/blocks/Listing/layout-templates/Gallery';
// @ts-expect-error Provided by the registered KitKat bundle.
import { composeSchema } from '@eeacms/volto-listing-block/schema-utils';
// @ts-expect-error Provided by the registered KitKat bundle.
import UniversalCard from '@eeacms/volto-listing-block/components/UniversalCard/UniversalCard';
// @ts-expect-error Provided by the registered KitKat bundle.
import { withUnknownVariationFallback } from '@eeacms/volto-listing-block/blocks/Listing/variations';

import NewsEventsListingView, { NEWS_EVENTS_VARIATION } from '../components/NewsEventsListing/NewsEventsListingView';
import copernicusEuLogo from '@eeacms/volto-waterhub-frontend/static/logo/copernicus-eu-logo.svg';

const NEWS_EVENTS_VARIATION_TITLE = 'News & Events filter';

const ensureNewsEventsVariationChoice = ({ schema }: { schema: any }) => {
  const choices = schema.properties?.variation?.choices;
  if (choices && !choices.some(([id]: [string]) => id === NEWS_EVENTS_VARIATION)) {
    choices.push([NEWS_EVENTS_VARIATION, NEWS_EVENTS_VARIATION_TITLE]);
  }
  return schema;

type EEASettings = {
  headerOpts?: Record<string, unknown>;
  [key: string]: unknown;
};

export type WaterHubLink = {
  title: string;
  url: string;
};

export type WaterHubSocialLink = {
  name: string;
  /** Remix icon class */
  icon: string;
  url: string;
};

export type WaterHubSettings = {
  headerHashtag: string;
  headerLinks: WaterHubLink[];
  searchPath: string;
  /** Fallback for Plone's portal_actions > footer_actions */
  footerLinks: WaterHubLink[];
  /** Fallback for Plone's portal_actions > social_actions */
  footerSocial: WaterHubSocialLink[];
};

export default function install(config: ConfigType) {
  // volto-subblocks (used by volto-form-block) still expects the react-dnd v5
  // lazy libraries that Volto no longer registers.
  config.settings.loadables = {
    ...(config.settings.loadables as Record<string, unknown>),
    reactDnd: loadable.lib(() => import('react-dnd')),
    reactDndHtml5Backend: loadable.lib(() => import('react-dnd-html5-backend')),
  };

<<<<<<< HEAD
  const listing = config.blocks.blocksConfig.listing;
  if (listing) {
    listing.variations = listing.variations || [];
    if (!listing.variations.some(({ id }) => id === NEWS_EVENTS_VARIATION)) {
      listing.variations.push({
        id: NEWS_EVENTS_VARIATION,
        isDefault: false,
        title: NEWS_EVENTS_VARIATION_TITLE,
        template: Gallery,
        schemaEnhancer: composeSchema(UniversalCard.schemaEnhancer, Gallery.schemaEnhancer),
      } as never);
    }
    listing.schemaEnhancer = composeSchema(listing.schemaEnhancer, ensureNewsEventsVariationChoice);
    listing.view = withUnknownVariationFallback(NewsEventsListingView);
  }
=======
  const eea = (config.settings.eea || {}) as EEASettings;

  config.settings.eea = {
    ...eea,
    headerOpts: {
      ...eea.headerOpts,
      logo: copernicusEuLogo,
      logoWhite: copernicusEuLogo,
      logoWidth: 372,
      logoHeight: 52,
    },
    websiteTitle: 'Copernicus Water Hub',
    organisationName: 'Programme of the European Union - Copernicus',
  };

  const waterhub: WaterHubSettings = {
    headerHashtag: '#EUSpace',
    headerLinks: [
      { title: 'News & Events', url: '/news-events' },
      { title: 'Help & Support', url: '/help-support' },
    ],
    searchPath: '/search',
    footerLinks: [
      { title: 'Disclaimer', url: '/disclaimer' },
      { title: 'Data policy', url: '/data-policy' },
      { title: 'Personal data protection', url: '/personal-data-protection' },
      { title: 'Cookies', url: '/cookies' },
      { title: 'Sitemap', url: '/sitemap' },
    ],
    footerSocial: [
      {
        name: 'LinkedIn',
        icon: 'ri-linkedin-box-fill',
        url: 'https://www.linkedin.com/company/eu-space/',
      },
      {
        name: 'Facebook',
        icon: 'ri-facebook-box-fill',
        url: 'https://www.facebook.com/CopernicusEU',
      },
      {
        name: 'Instagram',
        icon: 'ri-instagram-line',
        url: 'https://www.instagram.com/copernicus_eu/',
      },
    ],
  };
  config.settings.waterhub = waterhub;
>>>>>>> 78caf7491c52b028407b21874da613dfe6d3e7c4

  return config;
}
