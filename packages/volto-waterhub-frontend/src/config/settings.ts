import loadable from '@loadable/component';
import type { ConfigType } from '@plone/registry';
import copernicusEuLogo from '@eeacms/volto-waterhub-frontend/static/logo/copernicus-eu-logo.svg';

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

  return config;
}
