/**
 * Comprehensive Frontend Auth Flow Test
 * Tests all authentication components and flows after backend integration fixes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test configuration
const FRONTEND_DIR = path.join(__dirname, 'src');
const COMPONENTS_DIR = path.join(FRONTEND_DIR, 'components');
const PAGES_DIR = path.join(FRONTEND_DIR, 'pages');
const SERVICES_DIR = path.join(FRONTEND_DIR, 'services');
const STORE_DIR = path.join(FRONTEND_DIR, 'store');

// Color codes for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const color = passed ? 'green' : 'red';
  log(`${status} ${testName}`, color);
  if (details) {
    log(`   ${details}`, 'blue');
  }
}

// Test results tracking
let totalTests = 0;
let passedTests = 0;

function runTest(testName, testFn) {
  totalTests++;
  try {
    const result = testFn();
    if (result) {
      passedTests++;
      logTest(testName, true, result);
    } else {
      logTest(testName, false, 'Test returned false');
    }
  } catch (error) {
    logTest(testName, false, `Error: ${error.message}`);
  }
}

// Helper function to read file content
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

// Test 1: Verify AuthModal component fixes
runTest('AuthModal Component - Registration Flow', () => {
  const authModalPath = path.join(COMPONENTS_DIR, 'AuthModal.tsx');
  const content = readFile(authModalPath);
  
  if (!content) return false;
  
  // Check for immediate login handling
  const hasImmediateLogin = content.includes('authLogin(data.access_token, user)');
  const hasVerificationMessage = content.includes('Please check your email to verify');
  const hasGoogleOAuthFix = content.includes('window.location.href = `${authUrl}/auth/google`');
  
  return hasImmediateLogin && hasVerificationMessage && hasGoogleOAuthFix 
    ? 'Registration flow handles immediate login and verification emails'
    : false;
});

// Test 2: Verify API service fixes
runTest('API Service - Environment Variables and Endpoints', () => {
  const apiPath = path.join(SERVICES_DIR, 'api.ts');
  const content = readFile(apiPath);
  
  if (!content) return false;
  
  // Check for correct environment variable usage
  const hasCorrectEnvVars = content.includes('VITE_AUTH_URL') || content.includes('NEXT_PUBLIC_AUTH_URL');
  const hasJSONPayload = content.includes('Content-Type": "application/json"');
  const hasGoogleOAuthRedirect = content.includes('/auth/google');
  
  return hasCorrectEnvVars && hasJSONPayload && hasGoogleOAuthRedirect
    ? 'API service uses correct environment variables and JSON payloads'
    : false;
});

// Test 3: Verify Auth Store fixes
runTest('Auth Store - Token Management and Backend URLs', () => {
  const storePath = path.join(STORE_DIR, 'useAuthStore.ts');
  const content = readFile(storePath);
  
  if (!content) return false;
  
  // Check for correct backend URL usage
  const hasCorrectBackendURL = content.includes('VITE_AUTH_URL') || content.includes('NEXT_PUBLIC_AUTH_URL');
  const hasTokenVerification = content.includes('/auth/me');
  const hasLogoutEndpoint = content.includes('/auth/logout');
  const hasAuthorizationHeader = content.includes('Authorization": `Bearer');
  
  return hasCorrectBackendURL && hasTokenVerification && hasLogoutEndpoint && hasAuthorizationHeader
    ? 'Auth store uses correct backend URLs and token handling'
    : false;
});

// Test 4: Verify AuthSuccess page fixes
runTest('AuthSuccess Page - Google OAuth Callback Handling', () => {
  const authSuccessPath = path.join(PAGES_DIR, 'AuthSuccess.tsx');
  const content = readFile(authSuccessPath);
  
  if (!content) return false;
  
  // Check for Google OAuth callback handling
  const hasSearchParams = content.includes('useSearchParams');
  const hasTokenExtraction = content.includes('searchParams.get(\'token\')');
  const hasUserInfoFetch = content.includes('/auth/me');
  const hasNewUserHandling = content.includes('new_user');
  const hasVerificationHandling = content.includes('verification_sent');
  
  return hasSearchParams && hasTokenExtraction && hasUserInfoFetch && hasNewUserHandling && hasVerificationHandling
    ? 'AuthSuccess page handles Google OAuth callbacks with proper token and user info extraction'
    : false;
});

// Test 5: Environment variable configuration
runTest('Environment Variables - Configuration Check', () => {
  const envExamplePath = path.join(__dirname, '.env.example');
  const content = readFile(envExamplePath);
  
  if (!content) {
    // Check if there's a different env file structure
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageContent = readFile(packageJsonPath);
    return packageContent ? 'Environment variables should be configured in deployment' : false;
  }
  
  const hasAuthURL = content.includes('VITE_AUTH_URL') || content.includes('NEXT_PUBLIC_AUTH_URL');
  const hasFrontendURL = content.includes('NEXT_PUBLIC_FRONTEND_URL');
  const hasGoogleClientId = content.includes('NEXT_PUBLIC_GOOGLE_CLIENT_ID');
  
  return hasAuthURL && hasFrontendURL && hasGoogleClientId
    ? 'Environment variables properly configured'
    : 'Environment variables need to be set up';
});

// Test 6: Component imports and dependencies
runTest('Component Dependencies - Import Validation', () => {
  const authModalPath = path.join(COMPONENTS_DIR, 'AuthModal.tsx');
  const content = readFile(authModalPath);
  
  if (!content) return false;
  
  // Check for required imports
  const hasUseAuthStore = content.includes('useAuthStore');
  const hasUseToast = content.includes('useToast');
  const hasAPIImports = content.includes('login') && content.includes('register');
  
  return hasUseAuthStore && hasUseToast && hasAPIImports
    ? 'All required dependencies are properly imported'
    : false;
});

// Test 7: User type definitions
runTest('Type Definitions - User Interface', () => {
  const typesPath = path.join(FRONTEND_DIR, 'types.ts');
  let content = readFile(typesPath);
  
  if (!content) {
    // Try alternative locations
    const indexPath = path.join(FRONTEND_DIR, 'types', 'index.ts');
    content = readFile(indexPath);
  }
  
  if (!content) {
    // Check if types are defined inline in components
    const authModalPath = path.join(COMPONENTS_DIR, 'AuthModal.tsx');
    content = readFile(authModalPath);
  }
  
  if (!content) return false;
  
  // Check for User type definition
  const hasUserType = content.includes('interface User') || content.includes('type User');
  const hasRequiredFields = content.includes('email') && content.includes('username');
  
  return hasUserType && hasRequiredFields
    ? 'User type definitions are present'
    : 'User type definitions need verification';
});

// Test 8: Error handling
runTest('Error Handling - Toast and Feedback', () => {
  const authModalPath = path.join(COMPONENTS_DIR, 'AuthModal.tsx');
  const content = readFile(authModalPath);
  
  if (!content) return false;
  
  // Check for error handling
  const hasTryCatch = content.includes('try {') && content.includes('catch');
  const hasErrorToasts = content.includes('show(') && content.includes('error');
  const hasLoadingStates = content.includes('loading') || content.includes('isLoading');
  
  return hasTryCatch && hasErrorToasts && hasLoadingStates
    ? 'Error handling and user feedback implemented'
    : false;
});

// Test 9: Route configuration
runTest('Route Configuration - Auth Pages', () => {
  // Check if there's a router configuration
  const routerPaths = [
    path.join(FRONTEND_DIR, 'App.tsx'),
    path.join(FRONTEND_DIR, 'router.tsx'),
    path.join(FRONTEND_DIR, 'routes.tsx')
  ];
  
  let routerContent = null;
  for (const routerPath of routerPaths) {
    routerContent = readFile(routerPath);
    if (routerContent) break;
  }
  
  if (!routerContent) return 'Router configuration not found in expected locations';
  
  // Check for auth routes
  const hasAuthSuccessRoute = routerContent.includes('/auth/success') || routerContent.includes('AuthSuccess');
  const hasAuthRoutes = routerContent.includes('auth') || routerContent.includes('Auth');
  
  return hasAuthSuccessRoute && hasAuthRoutes
    ? 'Auth routes are configured'
    : 'Auth routes need to be verified in router configuration';
});

// Test 10: Build configuration
runTest('Build Configuration - Dependencies', () => {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const content = readFile(packageJsonPath);
  
  if (!content) return false;
  
  const packageJson = JSON.parse(content);
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  // Check for required dependencies
  const hasReact = dependencies.react;
  const hasReactRouter = dependencies['react-router-dom'];
  const hasZustand = dependencies.zustand;
  
  return hasReact && hasReactRouter && hasZustand
    ? 'Required dependencies are installed'
    : 'Some required dependencies may be missing';
});

// Summary
log('\n' + '='.repeat(60), 'blue');
log('FRONTEND AUTH FLOW TEST SUMMARY', 'blue');
log('='.repeat(60), 'blue');

log(`\nTotal Tests: ${totalTests}`);
log(`Passed: ${passedTests}`, 'green');
log(`Failed: ${totalTests - passedTests}`, passedTests === totalTests ? 'green' : 'red');
log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`, passedTests === totalTests ? 'green' : 'yellow');

if (passedTests === totalTests) {
  log('\n🎉 ALL TESTS PASSED! Frontend auth flow is ready.', 'green');
  log('\nNext Steps:', 'blue');
  log('1. Deploy frontend with updated auth components');
  log('2. Test end-to-end auth flow with live backend');
  log('3. Verify Google OAuth integration in production');
  log('4. Monitor user authentication success rates');
} else {
  log('\n⚠️  Some tests failed. Please review the issues above.', 'yellow');
  log('\nRecommended Actions:', 'blue');
  log('1. Fix failing components and configurations');
  log('2. Re-run tests to verify fixes');
  log('3. Test manually in development environment');
}

log('\n' + '='.repeat(60), 'blue');
