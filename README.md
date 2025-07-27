# LambdaCRM

A lightweight serverless CRM built on AWS Lambda, API Gateway, and DynamoDB. This project consists of a TypeScript backend with an AWS Lambda function, a React frontend with modern UI components, and AWS CDK for infrastructure as code.

*This project is still under development so this document may not be updated to reflect the most recent changes.*

## 🏗️ Architecture

- **Backend**: TypeScript Lambda function with API Gateway
- **Frontend**: React with Vite, TailwindCSS, and ShadeCN UI components
- **Database**: DynamoDB with single-table design
- **Authentication**: AWS Cognito
- **Infrastructure**: AWS CDK
- **Local Development**: docker compose with LocalStack

## 📁 Project Structure

```
lambdacrm/
├── backend/           # Lambda function and API logic (Internally routes within a single Lambda)
│   ├── src/
│   │   ├── controllers/   # Internal route handlers
│   │   ├── lib/           # Core lib
│   │   ├── models/        # Entities
│   │   ├── repositories/  # Data access layer
│   │   ├── schemas/       # Zod validation schemas
│   │   └── services/      # Business logic
│   │   └── types/         # Typescript types
│   └── package.json
├── frontend/          # React frontend application
│   ├── src/           # React components and pages
│   └── package.json
├── cdk/              # AWS CDK infrastructure code
│   ├── lib/          # CDK stack definitions
│   └── package.json
└── docker-compose.local.yml # Local development services
```

## 🚀 Deployment

### AWS Deployment

1. **Configure AWS credentials**
   ```bash
   aws configure
   ```

2. **Bootstrap CDK (first time only)**
   ```bash
   cd cdk
   cdk bootstrap
   ```

3. **Build and deploy**
   ```bash
   # Build backend
   cd backend
   npm run build

   # Deploy infrastructure
   cd ../cdk
   cdk deploy
   ```

4. **Build and deploy frontend**
   ```bash
   cd frontend
   npm run build
   # Upload build/ directory to S3 or your hosting service
   ```

## 🧪 Testing

Tests will be added soon.

```bash
# Backend tests
cd backend
npm test

# Frontend tests (if configured)
cd frontend
npm test

# CDK tests
cd cdk
npm test
```

## 📝 Environment Variables

Look at the sample `.env.sample` files in each major directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
