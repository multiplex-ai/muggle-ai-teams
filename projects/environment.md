# Environment Configuration

Each service requires its own `.env` file. Refer to each service's README or `.env.example` for the complete list.

## muggle-ai-ui

| Variable | Purpose |
|----------|---------|
| `REACT_APP_API_URL` | Backend API base URL |
| `REACT_APP_AUTH0_DOMAIN` | Auth0 tenant domain |
| `REACT_APP_AUTH0_CLIENT_ID` | Auth0 application client ID |

## muggle-ai-prompt-service

| Category | Variables |
|----------|-----------|
| Firebase | Firebase credentials (project ID, private key, client email) |
| Auth0 | Domain, client ID, audience |
| Stripe | API key, webhook secret |
| Azure | App Service config, Service Bus connection string |
| MongoDB | Connection string |
| Redis | Connection string |

## muggle-ai-mcp

| Category | Variables |
|----------|-----------|
| API | Endpoint URLs for mcp-gateway and local Electron app |
| Auth0 | Domain, client ID (for device code flow) |

## Notes

- Never commit `.env` files to version control
- Each service has a `.env.example` or README documenting required variables
- In development, Stripe CLI auto-configures webhook secrets
