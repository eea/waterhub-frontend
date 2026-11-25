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

const NEWS_EVENTS_VARIATION_TITLE = 'News & Events filter';

const ensureNewsEventsVariationChoice = ({ schema }: { schema: any }) => {
  const choices = schema.properties?.variation?.choices;
  if (choices && !choices.some(([id]: [string]) => id === NEWS_EVENTS_VARIATION)) {
    choices.push([NEWS_EVENTS_VARIATION, NEWS_EVENTS_VARIATION_TITLE]);
  }
  return schema;
};

export default function install(config: ConfigType) {
  // volto-subblocks (used by volto-form-block) still expects the react-dnd v5
  // lazy libraries that Volto no longer registers.
  config.settings.loadables = {
    ...(config.settings.loadables as Record<string, unknown>),
    reactDnd: loadable.lib(() => import('react-dnd')),
    reactDndHtml5Backend: loadable.lib(() => import('react-dnd-html5-backend')),
  };

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

  return config;
}
