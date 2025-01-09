# StocksAPI - Exchange Simulator

## Description

This project is a simulator for an exchange built with TypeScript and Serverless architecture. It utilizes AWS services and serverless functions to simulate stock orders, account management, and order matching. The system is designed for scalability and efficiency.

## Modules

- **Account Management**: Manage user accounts.
- **Order Management**: Handle stock orders.
- **Order Matching Engine**: The matching engine of the system.

## Installation

1. Clone the repository.
2. Run `npm install` to install the dependencies.

## Scripts

- `deploy:all`: Deploys all services using Serverless.
- `deploy:account-management`: Deploys the account management service.
- `deploy:order-management`: Deploys the order management service.
- `local:order-management`: Runs the order management service locally.
- `local:account-management`: Runs the account management service locally.
- `local:order-matching-engine`: Runs the order matching engine locally using TypeScript.
- `test`: Run unit tests with Vitest.
- `coverage`: Run tests with coverage tracking using Vitest.

## Requirements

- Node.js >= 20.11.0
- AWS credentials configured (for deployment)
- Serverless Framework installed

## Deployment

The project is built using the Serverless Framework, which can be used to deploy the application to AWS Lambda. The following deployment steps are available:

- `sls deploy`: Deploys the entire project.
- `sls account-management:deploy`: Deploys the account management component.
- `sls order-management:deploy`: Deploys the order management component.

## Local Development

To run services locally for development and testing, use the following commands:

- `sls order-management:offline`: Runs the order management service locally.
- `sls account-management:offline`: Runs the account management service locally.
- `ts-node ./src/modules/order-matching-engine/index.ts`: Runs the order matching engine locally.

## License

This project is licensed under the MIT License.
