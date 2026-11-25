import { describe, expect, it } from 'vitest';

import { getNewsEventsQuerystring } from './NewsEventsListingView';

const querystring = {
  b_size: 9,
  query: [
    {
      i: 'path',
      o: 'plone.app.querystring.operation.string.relativePath',
      v: './',
    },
  ],
};

describe('getNewsEventsQuerystring', () => {
  it('keeps the configured query for All', () => {
    expect(getNewsEventsQuerystring(querystring, 'all')).toBe(querystring);
  });

  it('adds the News portal type without changing the saved query', () => {
    const result = getNewsEventsQuerystring(querystring, 'news');

    expect(result.query).toContainEqual({
      i: 'portal_type',
      o: 'plone.app.querystring.operation.selection.any',
      v: ['News Item'],
    });
    expect(querystring.query).toHaveLength(1);
  });

  it('replaces an editor-configured portal type for Events', () => {
    const result = getNewsEventsQuerystring(
      {
        ...querystring,
        query: [
          ...querystring.query,
          {
            i: 'portal_type',
            o: 'plone.app.querystring.operation.selection.any',
            v: ['Document'],
          },
        ],
      },
      'events',
    );

    expect(result.query.filter(({ i }) => i === 'portal_type')).toEqual([
      {
        i: 'portal_type',
        o: 'plone.app.querystring.operation.selection.any',
        v: ['Event'],
      },
    ]);
  });
});
