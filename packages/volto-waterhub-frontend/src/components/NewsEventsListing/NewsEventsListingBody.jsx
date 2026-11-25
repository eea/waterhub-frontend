import React, { createRef, useMemo } from 'react';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import { Dimmer, Loader } from 'semantic-ui-react';
import Slugger from 'github-slugger';

import SlotRenderer from '@plone/volto/components/theme/SlotRenderer/SlotRenderer';
import withQuerystringResults from '@plone/volto/components/manage/Blocks/Listing/withQuerystringResults';
import { normalizeString } from '@plone/volto/helpers/Utils/Utils';
import { renderLinkElement } from '@plone/volto-slate/editor/render';
import config from '@plone/volto/registry';

import NewsEventsPagination from './NewsEventsPagination';

const countMessages = defineMessages({
  all: {
    id: '{count} news and events',
    defaultMessage: '{count} news and events',
  },
  news: {
    id: '{count, plural, one {# news item} other {# news items}}',
    defaultMessage: '{count, plural, one {# news item} other {# news items}}',
  },
  events: {
    id: '{count, plural, one {# event} other {# events}}',
    defaultMessage: '{count, plural, one {# event} other {# events}}',
  },
});

const paginationLabels = defineMessages({
  top: {
    id: 'Listing pagination above results',
    defaultMessage: 'Listing pagination above results',
  },
  bottom: {
    id: 'Listing pagination below results',
    defaultMessage: 'Listing pagination below results',
  },
});

const Headline = ({ headlineTag, id, data = {}, listingItems, isEditMode }) => {
  const slug = Slugger.slug(normalizeString(data.headline));
  const LinkedHeadline = useMemo(() => renderLinkElement(headlineTag), [headlineTag]);

  return <LinkedHeadline mode={!isEditMode && 'view'} children={data.headline} attributes={{ id: slug || id }} className={cx('headline', { emptyListing: !listingItems?.length > 0 })} />;
};

const NewsEventsListingBody = withQuerystringResults((props) => {
  const { activeFilter = 'all', content, currentPage, data = {}, filter, hasLoaded, id, intl, isEditMode, isFolderContentsListing, listingItems, onPaginationChange, total, totalPages, variation } = props;
  const variations = config.blocks?.blocksConfig.listing?.variations || [];
  const defaultVariation = variations.find(({ isDefault }) => isDefault);
  const legacyVariation = data.template ? variations.find(({ id }) => id === data.template) : null;
  const ListingBodyTemplate = (!data.variation && legacyVariation?.template) || variation?.template || defaultVariation?.template;
  const NoResults = variation?.noResultsComponent || config.blocks?.blocksConfig.listing.noResultsComponent;
  const listingRef = createRef();
  const HeadlineTag = data.headlineTag || 'h2';

  const showPagination = totalPages > 1 && listingItems?.length > 0;

  const changePage = (event, activePage) => {
    if (!isEditMode) {
      listingRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    onPaginationChange(event, { activePage });
  };

  return (
    <>
      {data.headline && <Headline headlineTag={HeadlineTag} id={id} listingItems={listingItems} data={data} isEditMode={isEditMode} />}
      <SlotRenderer name="aboveListingItems" content={content} data={data} />
      <div className="news-events-listing-toolbar" ref={listingRef}>
        {filter}
        {showPagination && <NewsEventsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} label={intl.formatMessage(paginationLabels.top)} />}
      </div>
      {listingItems?.length > 0 ? (
        <>
          <ListingBodyTemplate items={listingItems} isEditMode={isEditMode} {...data} {...variation} />
          <div className="news-events-listing-footer">
            <div className="news-events-listing-total" aria-live="polite">
              <FormattedMessage {...countMessages[activeFilter]} values={{ count: total ?? listingItems.length }} />
            </div>
            {showPagination && <NewsEventsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} label={intl.formatMessage(paginationLabels.bottom)} />}
          </div>
        </>
      ) : isEditMode ? (
        <div className="listing message">
          {isFolderContentsListing && <FormattedMessage id="No items found in this container." defaultMessage="No items found in this container." />}
          {hasLoaded && NoResults && <NoResults isEditMode {...data} />}
          <Dimmer active={!hasLoaded} inverted>
            <Loader indeterminate size="small">
              <FormattedMessage id="loading" defaultMessage="Loading" />
            </Loader>
          </Dimmer>
        </div>
      ) : (
        <div className="emptyListing">
          {hasLoaded && NoResults && <NoResults {...data} />}
          <Dimmer active={!hasLoaded} inverted>
            <Loader indeterminate size="small">
              <FormattedMessage id="loading" defaultMessage="Loading" />
            </Loader>
          </Dimmer>
        </div>
      )}
    </>
  );
});

export default injectIntl(NewsEventsListingBody);
