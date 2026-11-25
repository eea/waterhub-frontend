/**
 * WaterHub header (replaces the EEA website theme header).
 * @module components/theme/Header/Header
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { defineMessages, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import cx from 'classnames';
import { Image } from 'semantic-ui-react';

import { getNavigation } from '@plone/volto/actions/navigation/navigation';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { getBaseUrl } from '@plone/volto/helpers/Url/Url';
import { hasApiExpander } from '@plone/volto/helpers/Utils/Utils';
import config from '@plone/volto/registry';

import searchIcon from '@eeacms/volto-eea-design-system/../theme/themes/eea/assets/images/Header/search-line.svg';
import Header from '@eeacms/volto-eea-design-system/ui/Header/Header';
import EEALogo from '@eeacms/volto-eea-website-theme/components/theme/Logo';

const messages = defineMessages({
  secondaryNavigation: {
    id: 'Secondary navigation',
    defaultMessage: 'Secondary navigation',
  },
  searchPlaceholder: {
    id: 'Search the Water hub',
    defaultMessage: 'Search the Water hub',
  },
  search: {
    id: 'Search',
    defaultMessage: 'Search',
  },
  register: {
    id: 'Register',
    defaultMessage: 'Register',
  },
  login: {
    id: 'Login',
    defaultMessage: 'Login',
  },
  logout: {
    id: 'Log out',
    defaultMessage: 'Log out',
  },
  waterHub: {
    id: 'Water Hub',
    defaultMessage: 'Water Hub',
  },
});

const removeTrailingSlash = (path) => path.replace(/\/+$/, '');

/**
 * Prepares Plone's navigation for EEA's Header.Main:
 * - drops Home, which Figma's menu leaves out (the logo and hub pill link home);
 * - sets `@id` to the site-relative `url`. Header.Main picks the current section
 *   by `url` but marks it active by comparing `@id` (an absolute URL), so no item
 *   was ever active (Figma: Nav link Active).
 */
const toMenuItems = (items = []) => items.filter((item) => item.url && item.url !== '/').map((item) => ({ ...item, '@id': item.url }));

const TopSearch = () => {
  const intl = useIntl();
  const history = useHistory();
  const [text, setText] = useState('');
  const { searchPath = '/search' } = config.settings.waterhub || {};

  const onSubmit = (event) => {
    event.preventDefault();
    const query = text.trim();
    history.push(query ? `${searchPath}?SearchableText=${encodeURIComponent(query)}` : searchPath);
  };

  return (
    <form role="search" className="waterhub-top-search" onSubmit={onSubmit}>
      <input type="search" name="SearchableText" value={text} onChange={(event) => setText(event.target.value)} placeholder={intl.formatMessage(messages.searchPlaceholder)} aria-label={intl.formatMessage(messages.searchPlaceholder)} />
      <button type="submit" aria-label={intl.formatMessage(messages.search)}>
        <Image src={searchIcon} alt="" width={16} height={16} />
      </button>
    </form>
  );
};

/* Figma Icon/user and Icon/chev-down (16px); the paths are Remix's user-line and arrow-down-s-line, the set EEA uses */
const UserIcon = () => (
  <svg className="waterhub-account-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="waterhub-account-chevron" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
  </svg>
);

/** The user's name from the session token, where Plone puts it (`fullname`, else the user id). */
const tokenUserName = (token) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(payload), (char) => char.charCodeAt(0));
    const claims = JSON.parse(new TextDecoder().decode(bytes));
    return claims.fullname || claims.sub || '';
  } catch (error) {
    return '';
  }
};

/** Figma (Header, Desktop, Logged in): icon, name and chevron; the menu itself isn't designed. */
const AccountMenu = ({ name }) => {
  const intl = useIntl();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const menuId = 'waterhub-account-menu';

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        ref.current?.querySelector('button')?.focus();
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div
      className="waterhub-account-menu"
      ref={ref}
      onBlur={(event) => {
        if (!ref.current?.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button type="button" className="waterhub-account-toggle" aria-expanded={open} aria-controls={open ? menuId : undefined} onClick={() => setOpen(!open)}>
        <UserIcon />
        <span className="waterhub-account-name">{name}</span>
        <ChevronDownIcon />
      </button>
      {open && (
        <ul id={menuId} className="waterhub-account-dropdown">
          <li>
            <UniversalLink href="/logout">{intl.formatMessage(messages.logout)}</UniversalLink>
          </li>
        </ul>
      )}
    </div>
  );
};

const AccountLinks = ({ className, dropdown = false }) => {
  const intl = useIntl();
  const token = useSelector((state) => state.userSession?.token);
  const name = useMemo(() => (token ? tokenUserName(token) : ''), [token]);

  return (
    <div className={className}>
      {token && dropdown && <AccountMenu name={name} />}
      {token && !dropdown && (
        <>
          <span className="waterhub-account-user">
            <UserIcon />
            {name}
          </span>
          <span aria-hidden="true"> / </span>
          <UniversalLink href="/logout">{intl.formatMessage(messages.logout)}</UniversalLink>
        </>
      )}
      {!token && (
        <>
          <UniversalLink href="/register">{intl.formatMessage(messages.register)}</UniversalLink>
          <span aria-hidden="true"> / </span>
          <UniversalLink href="/login">{intl.formatMessage(messages.login)}</UniversalLink>
        </>
      )}
    </div>
  );
};

/**
 * The top bar is hidden on mobile, so the account links move into the burger
 * menu. EEA's HeaderMenuPopUp has no slot for them (and is imported relatively,
 * so it can't be shadowed), so this returns a node appended to its container
 * once it mounts, for a portal.
 */
const useMobileMenuSlot = () => {
  const [slot, setSlot] = useState(null);

  useEffect(() => {
    const bar = document.querySelector('.eea.header .main.bar');
    if (!bar) return undefined;

    const sync = () => {
      const container = bar.querySelector('#mega-menu > .ui.container');
      if (!container) {
        setSlot(null);
        return;
      }
      let node = container.querySelector(':scope > .waterhub-menu-account');
      if (!node) {
        node = document.createElement('div');
        node.className = 'waterhub-menu-account';
        container.appendChild(node);
      }
      setSlot(node);
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(bar, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return slot;
};

const WaterHubHeader = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const token = useSelector((state) => state.userSession?.token);
  const navigationItems = useSelector((state) => state.navigation?.items);
  const items = useMemo(() => toMenuItems(navigationItems), [navigationItems]);
  const routerPathname = removeTrailingSlash(pathname) || '';
  const mobileMenuSlot = useMobileMenuSlot();

  const { eea = {}, waterhub = {}, menuItemsLayouts = {} } = config.settings;
  const headerOpts = eea.headerOpts || {};
  const { headerHashtag, headerLinks = [] } = waterhub;

  useEffect(() => {
    const baseUrl = getBaseUrl(pathname);
    if (!hasApiExpander('navigation', baseUrl)) {
      dispatch(getNavigation(baseUrl, config.settings.navDepth));
    }
  }, [dispatch, pathname, token]);

  return (
    <Header menuItems={items}>
      <Header.TopHeader>
        <Header.TopItem className="waterhub-hashtag">{headerHashtag}</Header.TopItem>
        <Header.TopItem className="waterhub-top-actions">
          {headerLinks.length > 0 && (
            <nav className="waterhub-top-links" aria-label={intl.formatMessage(messages.secondaryNavigation)}>
              <ul>
                {headerLinks.map((link) => (
                  <li key={link.url}>
                    <UniversalLink href={link.url}>{link.title}</UniversalLink>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <TopSearch />
          <AccountLinks className="waterhub-account" dropdown />
        </Header.TopItem>
      </Header.TopHeader>
      <Header.Main
        pathname={pathname}
        headerSearchBox={eea.headerSearchBox || []}
        logo={
          <div className="waterhub-brand">
            <EEALogo src={headerOpts.logo} title={eea.websiteTitle} alt={eea.organisationName} width={headerOpts.logoWidth} height={headerOpts.logoHeight} />
            <UniversalLink href="/" className="waterhub-badge" aria-hidden="true" tabIndex={-1}>
              {intl.formatMessage(messages.waterHub)}
            </UniversalLink>
          </div>
        }
        menuItems={items}
        menuItemsLayouts={menuItemsLayouts}
        renderGlobalMenuItem={(item, { onClick }) => (
          <a
            href={item.url || '/'}
            title={item.title}
            onClick={(event) => {
              event.preventDefault();
              onClick(event, item);
            }}
          >
            {item.title}
          </a>
        )}
        renderMenuItem={(item, options, props) => (
          <UniversalLink
            href={item.url || '/'}
            title={item.nav_title || item.title}
            {...(options || {})}
            className={cx(options?.className, {
              active: item.url === routerPathname,
            })}
          >
            {props?.iconPosition !== 'right' && props?.children}
            <span>{item.nav_title || item.title}</span>
            {props?.iconPosition === 'right' && props?.children}
          </UniversalLink>
        )}
      />
      {mobileMenuSlot && createPortal(<AccountLinks className="waterhub-account" />, mobileMenuSlot)}
      <div id="eea-side-menu-host" className="eea-side-menu-host" />
    </Header>
  );
};

export default WaterHubHeader;
