import React from 'react';
import cx from 'classnames';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { isInternalURL } from '@plone/volto/helpers/Url/Url';

// These imports are provided by the registered KitKat bundle.
// eslint-disable-next-line import/no-unresolved
import PreviewImage from '@eeacms/volto-listing-block/PreviewImage';
// eslint-disable-next-line import/no-unresolved
import { CardActionLink, isCardActionLinkable, useCardAction } from '@eeacms/volto-listing-block/components/UniversalCard/fragments/CardAction';

import './news-events-card.less';

const messages = defineMessages({
  cardType: {
    id: 'News & Events card',
    defaultMessage: 'News & Events card',
  },
});
export const cardTypeMessage = messages.cardType;

const dateOptions = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' };

function parseCalendarDate(value) {
  const day = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.exec(value)?.[0];
  if (!day) return null;
  const date = new Date(day);
  return Number.isNaN(date.getTime()) ? null : date;
}

const NewsEventsCard = ({ item, preview_image, preview_image_url, preview_image_fallbacks, className }) => {
  const intl = useIntl();
  const action = useCardAction();
  const isEvent = item['@type'] === 'Event';
  const isNews = item['@type'] === 'News Item';
  const start = isEvent ? parseCalendarDate(item.start) : parseCalendarDate(item.effective) ?? parseCalendarDate(item.EffectiveDate);
  const end = isEvent && !item.open_end ? parseCalendarDate(item.end) : null;
  const date = start && (end > start ? new Intl.DateTimeFormat(intl.locale, dateOptions).formatRange(start, end) : intl.formatDate(start, dateOptions));
  const location = isEvent && item.location;
  const service = item.service?.title || (typeof item.service === 'string' && item.service) || item.head_title;
  const title = item.title || item.Title;
  const description = item.description || item.Description;
  const external = isCardActionLinkable(action) && !isInternalURL(action.url);

  return (
    <article className={cx('ui card news-events-card', className)}>
      <div className="news-events-card-image">
        <PreviewImage item={item} preview_image={preview_image} preview_image_url={preview_image_url} fallbacks={preview_image_fallbacks} alt="" />
        {service && <span className="news-events-card-service">{service}</span>}
      </div>
      {(isEvent || isNews || date || location) && (
        <div className="news-events-card-meta">
          {isEvent && (
            <span className="news-events-card-type">
              <FormattedMessage id="Event" defaultMessage="Event" />
            </span>
          )}
          {isNews && (
            <span className="news-events-card-type">
              <FormattedMessage id="News" defaultMessage="News" />
            </span>
          )}
          {date && <span>{date}</span>}
          {location && <span>{location}</span>}
        </div>
      )}
      <h3 className="news-events-card-title">
        <CardActionLink>
          <span>{title}</span>
          {external && <i className="ri-external-link-line" aria-hidden="true" />}
        </CardActionLink>
      </h3>
      {description && <p className="news-events-card-description">{description}</p>}
    </article>
  );
};

export default NewsEventsCard;
