# External Services

Third-party services integrated into the Muggle AI platform.

## Auth0

- **Purpose**: User authentication (JWT)
- **Usage in MCP**: Device code flow for CLI login
- **Config**: Domain + Client ID required in both frontend and backend

## Stripe

- **Purpose**: Subscription billing
- **Dev setup**: Stripe CLI auto-configures webhook secrets
- **Config**: API keys and webhook secret in backend `.env`

## Firebase / Firestore

- **Purpose**: Primary database
- **Config**: Firebase credentials in backend `.env`

## Azure

- **App Service**: Production hosting for backend services
- **Service Bus**: Async messaging between services
- **Config**: Azure connection strings in backend `.env`

## Application Insights

- **Purpose**: Production monitoring and telemetry

## MongoDB

- **Purpose**: Secondary database (Mongoose schemas in prompt-service)
- **Config**: Connection string in backend `.env`

## Redis

- **Purpose**: Task queuing for async workflow execution
- **Config**: Connection string in backend `.env`
