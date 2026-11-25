import React, { createRef, useMemo } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';
import { Dimmer, Loader, Pagination } from 'semantic-ui-react';
import Slugger from 'github-slugger';

import Icon from '@plone/volto/components/theme/Icon/Icon';
import SlotRenderer from '@plone/volto/components/theme/SlotRenderer/SlotRenderer';
import withQuerystringResults from '@plone/volto/components/manage/Blocks/Listing/withQuerystringResults';
import { normalizeString } from '@plone/volto/helpers/Utils/Utils';
import { renderLinkElement } from '@plone/volto-slate/editor/render';
import config from '@plone/volto/registry';

import paginationLeftSVG from '@plone/volto/icons/left-key.svg';
import paginationRightSVG from '@plone/volto/icons/right-key.svg';

const Headline = ({ headlineTag, id, data = {}, listingItems, isEditMode }) => {
  const slug = Slugger.slug(normalizeString(data.headline));
  const LinkedHeadline = useMemo(() => renderLinkElement(headlineTag), [headlineTag]);

  return <LinkedHeadline mode={!isEditMode && 'view'} children={data.headline} attributes={{ id: slug || id }} className={cx('headline', { emptyListing: !listingItems?.length > 0 })} />;
};

const NewsEventsListingBody = withQuerystringResults((props) => {
  const { content, currentPage, data = {}, hasLoaded, id, isEditMode, isFolderContentsListing, listingItems, nextBatch, onPaginationChange, prevBatch, total, totalPages, variation } = props;
  const variations = config.blocks?.blocksConfig.listing?.variations || [];
  const defaultVariation = variations.find(({ isDefault }) => isDefault);
  const legacyVariation = data.template ? variations.find(({ id }) => id === data.template) : null;
  const ListingBodyTemplate = (!data.variation && legacyVariation?.template) || variation?.template || defaultVariation?.template;
  const NoResults = variation?.noResultsComponent || config.blocks?.blocksConfig.listing.noResultsComponent;
  const listingRef = createRef();
  const HeadlineTag = data.headlineTag || 'h2';

  return (
    <>
      {data.headline && <Headline headlineTag={HeadlineTag} id={id} listingItems={listingItems} data={data} isEditMode={isEditMode} />}
      <SlotRenderer name="aboveListingItems" content={content} data={data} />
      {listingItems?.length > 0 ? (
        <div ref={listingRef}>
          <ListingBodyTemplate items={listingItems} isEditMode={isEditMode} {...data} {...variation} />
          <div className="news-events-listing-footer">
            <div className="news-events-listing-total" aria-live="polite">
              <FormattedMessage id="Found {count} results" defaultMessage="Found {count} results" values={{ count: total ?? listingItems.length }} />
            </div>
            {totalPages > 1 && (
              <div className="pagination-wrapper">
                <Pagination
                  activePage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(event, { activePage }) => {
                    if (!isEditMode) {
                      listingRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                    onPaginationChange(event, { activePage });
                  }}
                  firstItem={null}
                  lastItem={null}
                  prevItem={{
                    content: <Icon name={paginationLeftSVG} size="18px" />,
                    icon: true,
                    'aria-disabled': !prevBatch,
                    className: !prevBatch ? 'disabled' : null,
                  }}
                  nextItem={{
                    content: <Icon name={paginationRightSVG} size="18px" />,
                    icon: true,
                    'aria-disabled': !nextBatch,
                    className: !nextBatch ? 'disabled' : null,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ) : isEditMode ? (
        <div className="listing message" ref={listingRef}>
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
