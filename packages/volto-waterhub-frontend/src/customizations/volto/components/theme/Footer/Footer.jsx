/**
 * WaterHub footer (replaces the EEA website theme footer).
 * @module components/theme/Footer/Footer
 */

import { defineMessages, useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import { Container, Image } from 'semantic-ui-react';

import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import config from '@plone/volto/registry';

import copernicusEuLogo from '@eeacms/volto-waterhub-frontend/static/footer/copernicus-eu-white.svg';
import eeaLogo from '@eeacms/volto-waterhub-frontend/static/footer/eea-white.svg';
import atmosphereIcon from '@eeacms/volto-waterhub-frontend/static/footer/services/atmosphere.svg';
import marineIcon from '@eeacms/volto-waterhub-frontend/static/footer/services/marine.svg';
import landIcon from '@eeacms/volto-waterhub-frontend/static/footer/services/land.svg';
import securityIcon from '@eeacms/volto-waterhub-frontend/static/footer/services/security.svg';
import climateIcon from '@eeacms/volto-waterhub-frontend/static/footer/services/climate.svg';
import emergencyIcon from '@eeacms/volto-waterhub-frontend/static/footer/services/emergency.svg';

const messages = defineMessages({
  footer: {
    id: 'Footer',
    defaultMessage: 'Footer',
  },
  implementedBy: {
    id: 'Implemented by',
    defaultMessage: 'Implemented by',
  },
  copernicusProgramme: {
    id: 'Programme of the European Union - Copernicus',
    defaultMessage: 'Programme of the European Union - Copernicus',
  },
  eea: {
    id: 'European Environment Agency',
    defaultMessage: 'European Environment Agency',
  },
  copernicusServices: {
    id: 'Copernicus Services',
    defaultMessage: 'Copernicus Services',
  },
  atmosphere: {
    id: 'Atmosphere',
    defaultMessage: 'Atmosphere',
  },
  marine: {
    id: 'Marine',
    defaultMessage: 'Marine',
  },
  land: {
    id: 'Land',
    defaultMessage: 'Land',
  },
  security: {
    id: 'Security',
    defaultMessage: 'Security',
  },
  climateChange: {
    id: 'Climate Change',
    defaultMessage: 'Climate Change',
  },
  emergency: {
    id: 'Emergency',
    defaultMessage: 'Emergency',
  },
  followUs: {
    id: 'Follow us',
    defaultMessage: 'Follow us',
  },
  copernicus: {
    id: 'Copernicus',
    defaultMessage: 'Copernicus',
  },
  copernicusDescription: {
    id: 'footerCopernicusDescription',
    defaultMessage: "Copernicus is the Earth observation component of the European Union's Space programme, looking at our planet and its environment for the benefit of Europe's citizens.",
  },
  waterHub: {
    id: 'Copernicus Water Hub',
    defaultMessage: 'Copernicus Water Hub',
  },
  waterHubDescription: {
    id: 'footerWaterHubDescription',
    defaultMessage: 'One access point to Copernicus water information from all services, implemented by the European Environment Agency.',
  },
  legal: {
    id: 'Legal information',
    defaultMessage: 'Legal information',
  },
});

const services = [
  { id: 'atmosphere', url: 'https://atmosphere.copernicus.eu/', icon: atmosphereIcon },
  { id: 'marine', url: 'https://marine.copernicus.eu/', icon: marineIcon },
  { id: 'land', url: 'https://land.copernicus.eu/', icon: landIcon },
  {
    id: 'security',
    url: 'https://www.copernicus.eu/en/services/security',
    icon: securityIcon,
  },
  { id: 'climateChange', url: 'https://climate.copernicus.eu/', icon: climateIcon },
  { id: 'emergency', url: 'https://emergency.copernicus.eu/', icon: emergencyIcon },
];

const ExternalLink = ({ href, children, ...rest }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
    {children}
  </a>
);

const FooterColumn = ({ title, children }) => (
  <div className="waterhub-footer-column">
    <h2 className="waterhub-footer-title">{title}</h2>
    {children}
  </div>
);

const Footer = () => {
  const intl = useIntl();
  const { footerLinks = [], footerSocial = [] } = config.settings.waterhub || {};

  // As in the EEA website theme: Plone's portal_actions first (editable by site
  // managers), config.settings.waterhub when the category doesn't exist.
  const { footerActions, socialActions } = useSelector(
    (state) => ({
      footerActions: state.actions?.actions?.footer_actions,
      socialActions: state.actions?.actions?.social_actions,
    }),
    shallowEqual,
  );

  // ZMI > portal_actions > footer_actions
  const actions = Array.isArray(footerActions)
    ? footerActions.map((action) => ({
        title: action.title,
        url: flattenToAppURL(action.url),
      }))
    : footerLinks;

  // ZMI > portal_actions > social_actions (icon: a Remix icon class)
  const social = Array.isArray(socialActions)
    ? socialActions.map((action) => ({
        name: action.title || action.id,
        icon: action.icon,
        url: action.url,
      }))
    : footerSocial;

  return (
    <footer id="footer" className="waterhub-footer" aria-label={intl.formatMessage(messages.footer)}>
      <div className="waterhub-footer-accent">
        <Container>
          <svg className="waterhub-footer-stripes" aria-hidden="true" focusable="false" viewBox="0 0 80 100" width="96" height="120">
            <line className="stripe-mint" x1="4" y1="20" x2="47" y2="100" />
            <line className="stripe-violet" x1="10" y1="4" x2="62" y2="100" />
            <line className="stripe-yellow" x1="63" y1="70" x2="75" y2="92" />
          </svg>
        </Container>
      </div>
      <div className="waterhub-footer-main">
        <Container>
          <div className="waterhub-footer-logos">
            <ExternalLink href="https://www.copernicus.eu/en" className="waterhub-footer-copernicus">
              <Image src={copernicusEuLogo} alt={intl.formatMessage(messages.copernicusProgramme)} width={238} height={56} loading="lazy" />
            </ExternalLink>
            <span className="waterhub-footer-implemented">{intl.formatMessage(messages.implementedBy)}</span>
            <ExternalLink href="https://www.eea.europa.eu/en" className="waterhub-footer-eea">
              <Image src={eeaLogo} alt={intl.formatMessage(messages.eea)} width={52} height={60} loading="lazy" />
            </ExternalLink>
          </div>

          <div className="waterhub-footer-columns">
            <FooterColumn title={intl.formatMessage(messages.copernicusServices)}>
              <ul className="waterhub-footer-services">
                {services.map((service) => (
                  <li key={service.id}>
                    <ExternalLink href={service.url}>
                      <Image src={service.icon} alt="" width={52} height={52} loading="lazy" />
                      <span>{intl.formatMessage(messages[service.id])}</span>
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn title={intl.formatMessage(messages.followUs)}>
              <ul className="waterhub-footer-social">
                {social.map((item) => (
                  <li key={item.url}>
                    <ExternalLink href={item.url} aria-label={item.name} title={item.name}>
                      <i className={item.icon} aria-hidden="true" />
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <div className="waterhub-footer-column">
              <h2 className="waterhub-footer-title">{intl.formatMessage(messages.copernicus)}</h2>
              <p>{intl.formatMessage(messages.copernicusDescription)}</p>
              <h2 className="waterhub-footer-title">{intl.formatMessage(messages.waterHub)}</h2>
              <p>{intl.formatMessage(messages.waterHubDescription)}</p>
            </div>
          </div>
        </Container>
      </div>

      {actions.length > 0 && (
        <nav className="waterhub-footer-bottom" aria-label={intl.formatMessage(messages.legal)}>
          <Container>
            <ul>
              {actions.map((action) => (
                <li key={action.url}>
                  <UniversalLink href={action.url}>{action.title}</UniversalLink>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}
    </footer>
  );
};

export default Footer;
