const fs = require("fs");
const { execSync } = require("child_process");

const BACKEND_STACK_NAME = "LambdaCrmBackendStack";
const FRONTEND_STACK_NAME = "LambdaCrmFrontendStack";
const ENV_FILE_PATH = "./frontend/.env.prod";

function getStackOutput(outputKey) {
  try {
    const result = execSync(
      `aws cloudformation describe-stacks --stack-name ${BACKEND_STACK_NAME} --query "Stacks[0].Outputs[?OutputKey=='${outputKey}'].OutputValue" --output text`,
      { encoding: "utf-8" }
    );
    return result.trim();
  } catch (err) {
    console.error(`Error fetching stack output for ${outputKey}:`, err.message);
    process.exit(1);
  }
}
execSync("cd ./backend && npm run deployment-build");
execSync(`cd ./cdk && cdk deploy ${BACKEND_STACK_NAME} --require-approval never`);

const appClientId = getStackOutput("clientId");
const apiUrl = getStackOutput("apiUrl");

// Create the environment file using the generated client id & api gateway url
fs.writeFileSync(ENV_FILE_PATH,
`VITE_AWS_COGNITO_APP_CLIENT_ID=${appClientId}
VITE_BACKEND_API_BASE_URL=${apiUrl}`);

execSync(`cd ./cdk && cdk deploy ${FRONTEND_STACK_NAME} --require-approval never`);
execSync("cd ./frontend && npm run build");
execSync("aws s3 sync ./frontend/dist s3://lambda-crm-frontend-bucket --delete")
