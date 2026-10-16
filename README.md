# Copernicus Thematic Water Hub Frontend

Copernicus Thematic Water Hub Volto frontend

## Development

```bash
# Fetch Volto core + addons (via mrs.developer.json) and install dependencies
make develop

# Start the frontend (requires a Plone backend running on port 8080)
make start
```

The frontend will be available at http://localhost:3000.

## Build

```bash
make build
```

## Testing

```bash
# Run Cypress acceptance tests
make cypress

# Open Cypress interactive runner
make cypress-open
```

## Docker

```bash
# Build the Docker image
docker build -t eeacms/waterhub-frontend .
```

## Project structure

This project uses the Volto 19 add-on driven development pattern with pnpm workspaces:

- `packages/volto-waterhub-frontend/` — Project-specific add-on (routes, config, components)
- `packages/` — Fetched add-on sources (via `mrs.developer.json`)
- `core/` — Volto core source (fetched by `mrs.developer.json`)
- `volto.config.js` — Add-on registration
- `pnpm-workspace.yaml` — Workspace definition

## CI

The Jenkinsfile defines the CI pipeline:
- Bundlewatch (bundle size monitoring)
- Gitflow release automation
- Docker image build & push
- Rancher catalog update & demo upgrade
- SonarQube tag updates

Generated using [Cookieplone (2.0.0b3)](https://github.com/plone/cookieplone) and [cookieplone-templates (ace731b)](https://github.com/plone/cookieplone-templates/commit/ace731bcd9946a6de46550d64d49f079ac0ce915) on 2026-10-16 12:26:50.234506
