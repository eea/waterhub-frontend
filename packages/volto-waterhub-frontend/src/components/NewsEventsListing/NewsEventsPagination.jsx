import React from 'react';
import { FormattedMessage } from 'react-intl';

import Icon from '@plone/volto/components/theme/Icon/Icon';
import leftSVG from '@plone/volto/icons/left-key.svg';
import rightSVG from '@plone/volto/icons/right-key.svg';

const NewsEventsPagination = ({ currentPage, totalPages, onPageChange, label }) => {
  const page = Number(currentPage);
  const pages = [...new Set([1, page - 1, page, page + 1, totalPages])].filter((number) => number >= 1 && number <= totalPages).sort((first, second) => first - second);

  return (
    <nav className="news-events-pagination" aria-label={label}>
      {page > 1 && (
        <button type="button" onClick={(event) => onPageChange(event, page - 1)}>
          <Icon name={leftSVG} size="12px" aria-hidden="true" />
          <FormattedMessage id="Previous" defaultMessage="Previous" />
        </button>
      )}
      {pages.map((number, index) => (
        <React.Fragment key={number}>
          {index > 0 && number - pages[index - 1] > 1 && <span aria-hidden="true">…</span>}
          <button
            type="button"
            aria-current={number === page ? 'page' : undefined}
            onClick={(event) => {
              if (number !== page) onPageChange(event, number);
            }}
          >
            {number}
          </button>
        </React.Fragment>
      ))}
      {page < totalPages && (
        <button type="button" onClick={(event) => onPageChange(event, page + 1)}>
          <FormattedMessage id="Next" defaultMessage="Next" />
          <Icon name={rightSVG} size="12px" aria-hidden="true" />
        </button>
      )}
    </nav>
  );
};

export default NewsEventsPagination;
