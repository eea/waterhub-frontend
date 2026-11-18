import loadable from '@loadable/component';
import type { ConfigType } from '@plone/registry';

export default function install(config: ConfigType) {
  // volto-subblocks (used by volto-form-block) still expects the react-dnd v5
  // lazy libraries that Volto no longer registers.
  config.settings.loadables = {
    ...(config.settings.loadables as Record<string, unknown>),
    reactDnd: loadable.lib(() => import('react-dnd')),
    reactDndHtml5Backend: loadable.lib(() => import('react-dnd-html5-backend')),
  };

  return config;
}
