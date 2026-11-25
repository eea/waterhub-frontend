import React, { useMemo, useState } from 'react';
import cx from 'classnames';
import { defineMessages, useIntl } from 'react-intl';

import ListingBody from '@plone/volto/components/manage/Blocks/Listing/ListingBody';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import { usePagination } from '@plone/volto/helpers/Utils/usePagination';

import NewsEventsListingBody from './NewsEventsListingBody';
import './news-events-listing.less';

export const NEWS_EVENTS_VARIATION = 'newsEventsGallery';

const messages = defineMessages({
  all: {
    id: 'All',
    defaultMessage: 'All',
  },
  news: {
    id: 'News',
    defaultMessage: 'News',
  },
  events: {
    id: 'Events',
    defaultMessage: 'Events',
  },
  filterLabel: {
    id: 'News and events filters',
    defaultMessage: 'News and events filters',
  },
});

const FILTERS = [
  { id: 'all', message: messages.all, portalType: null },
  { id: 'news', message: messages.news, portalType: 'News Item' },
  { id: 'events', message: messages.events, portalType: 'Event' },
];

const PORTAL_TYPE_OPERATION = 'plone.app.querystring.operation.selection.any';

export function getNewsEventsQuerystring(querystring = {}, filterId = 'all') {
  const filter = FILTERS.find(({ id }) => id === filterId) || FILTERS[0];

  if (!filter.portalType) return querystring;

  return {
    ...querystring,
    query: [
      ...(querystring.query || []).filter(({ i }) => i !== 'portal_type'),
      {
        i: 'portal_type',
        o: PORTAL_TYPE_OPERATION,
        v: [filter.portalType],
      },
    ],
  };
}

const getFilteredListingId = (id, filter) => `${id}-${filter}`;

const FilterButton = ({ listingId, active, label, onChange }) => {
  const { currentPage, setCurrentPage } = usePagination(listingId, 1);

  return (
    <button
      className={cx('news-events-listing-filter-item', { active })}
      type="button"
      aria-pressed={active}
      onClick={() => {
        if (active) return;
        if (currentPage !== 1) setCurrentPage(1);
        onChange();
      }}
    >
      {label}
    </button>
  );
};

const Filter = ({ listingId, activeFilter, onChange }) => {
  const intl = useIntl();

  return (
    <div className="news-events-listing-filter" role="group" aria-label={intl.formatMessage(messages.filterLabel)}>
      {FILTERS.map(({ id, message }) => (
        <FilterButton key={id} listingId={getFilteredListingId(listingId, id)} active={activeFilter === id} label={intl.formatMessage(message)} onChange={() => onChange(id)} />
      ))}
    </div>
  );
};

const NewsEventsListingView = (props) => {
  const { block, className, data = {}, id = block, path, pathname, style, variation } = props;
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredData = useMemo(
    () => ({
      ...data,
      querystring: getNewsEventsQuerystring(data.querystring, activeFilter),
    }),
    [activeFilter, data],
  );

  const isNewsEventsListing = data.variation === NEWS_EVENTS_VARIATION;
  const listingId = isNewsEventsListing ? getFilteredListingId(id, activeFilter) : id;
  const Body = isNewsEventsListing ? NewsEventsListingBody : ListingBody;

  return (
    <div className={cx('block listing', data.variation || 'default', className)} style={style}>
      <Body
        key={listingId}
        {...props}
        data={isNewsEventsListing ? filteredData : data}
        id={listingId}
        path={path ?? pathname}
        variation={variation}
        {...(isNewsEventsListing && {
          activeFilter,
          filter: <Filter listingId={id} activeFilter={activeFilter} onChange={setActiveFilter} />,
        })}
      />
    </div>
  );
};

export default withBlockExtensions(NewsEventsListingView);
