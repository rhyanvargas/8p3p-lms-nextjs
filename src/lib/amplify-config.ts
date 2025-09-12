// Amplify configuration loader
// This handles the import of amplify_outputs.json with proper error handling

interface AmplifyConfig {
  aws_project_region: string;
  aws_cognito_region: string;
  [key: string]: unknown;
}

let amplifyConfig: AmplifyConfig;

try {
  // Try to import the real amplify_outputs.json file
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  amplifyConfig = require('../../amplify_outputs.json') as AmplifyConfig;
} catch {
  // Fallback for build environments where file doesn't exist
  amplifyConfig = {
    aws_project_region: 'us-east-1',
    aws_cognito_region: 'us-east-1',
  };
}

export default amplifyConfig;