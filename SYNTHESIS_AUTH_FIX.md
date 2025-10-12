# 🔧 Synthesis Authentication Fix

## Issue
The TTS synthesis endpoint was returning **401 Unauthorized** errors even when the user was logged in.

## Root Cause
The `ttsApi` axios instance in `services/api.ts` did **not** have an authentication interceptor like the main `api` instance. The `synthesizeText` function was manually trying to get the token from the Zustand store, but:

1. The Zustand store might not be hydrated yet on page load
2. The token might be in cookies but not yet loaded into the store
3. Manual token injection was inconsistent

## Error Logs
```
[Error] Failed to load resource: the server responded with a status of 401 () (synthesize, line 0)
[Error] ❌ Synthesis failed:
[Error] Error details: 401
```

## Solution

### Added Request Interceptor to TTS API

Modified `services/api.ts` to add an authentication interceptor to the `ttsApi` instance that:

1. **Checks multiple token sources** (Zustand store → cookies → localStorage)
2. **Automatically adds auth token** to every TTS request
3. **Logs warnings** when no token is found
4. **Handles 401 errors** by logging out and redirecting to login

### Code Changes

#### Before
```typescript
// ❌ Only auth API had interceptor
this.api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ❌ TTS API had NO interceptor
this.ttsApi = axios.create({
  baseURL: TTS_BASE_URL,
  timeout: 30000,
});

// ❌ Manual token injection in synthesizeText
const token = useAuthStore.getState().token;
const headers: any = { 'Content-Type': 'multipart/form-data' };
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}
```

#### After
```typescript
// ✅ Helper function to get token from multiple sources
const getAuthToken = () => {
  // Try Zustand store first
  const storeToken = useAuthStore.getState().token;
  if (storeToken) return storeToken;
  
  // Try cookies (persistent storage)
  const cookieMatch = document.cookie.match(/voxly_at=([^;]+)/);
  if (cookieMatch) return cookieMatch[1];
  
  // Try localStorage as fallback
  return localStorage.getItem('voxly_jwt_token');
};

// ✅ Auth API interceptor
this.api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ TTS API interceptor (NEW)
this.ttsApi.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔑 Adding auth token to TTS request');
  } else {
    console.warn('⚠️ No auth token found for TTS request');
  }
  return config;
});

// ✅ Both APIs have 401 error handlers
this.ttsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ TTS API 401: Token expired or invalid');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ Simplified synthesizeText (no manual token injection needed)
const response = await this.ttsApi.post('/synthesize', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  responseType: 'blob',
});
```

## Benefits

### 1. **Automatic Token Injection**
Every request to the TTS API automatically includes the auth token via the interceptor.

### 2. **Multi-Source Token Retrieval**
The `getAuthToken()` helper checks:
- Zustand store (fastest, in-memory)
- Cookies (persistent, survives page reload)
- localStorage (fallback for compatibility)

### 3. **Consistent Error Handling**
Both Auth and TTS APIs now have consistent 401 error handling:
- Log the user out
- Clear tokens
- Redirect to login page

### 4. **Better Debugging**
Console logs show:
- ✅ When token is successfully added
- ⚠️ When no token is found
- ❌ When 401 errors occur

## Testing

### Manual Test
1. Login to the app
2. Navigate to `/synthesis`
3. Enter text and select a voice
4. Click "Generate Speech"
5. **Expected**: Audio generated successfully
6. Check browser console for: `🔑 Adding auth token to TTS request`

### Console Debug
```javascript
// Check if token is accessible
const token = document.cookie.match(/voxly_at=([^;]+)/);
console.log('Token from cookie:', token ? 'Found' : 'Not found');

// Check Zustand store
console.log('Token from store:', localStorage.getItem('voxly-auth-storage'));
```

## Related Files
- `src/services/api.ts` - Main fix location
- `src/store/useAuthStore.ts` - Token storage
- `src/api.ts` - TokenManager utilities
- `src/pages/SynthesisPage.tsx` - Uses synthesizeText function

## Backend Requirements

The backend TTS service must:
1. Accept `Authorization: Bearer <token>` header
2. Validate JWT tokens
3. Return 401 for invalid/expired tokens
4. Return audio blob for valid requests

Example backend endpoint:
```python
@app.post("/synthesize")
async def synthesize(
    text: str,
    voice_id: str,
    language: str,
    user: User = Depends(get_current_user)  # JWT validation
):
    # Generate audio
    return audio_blob
```

## Verification Checklist

- [x] TTS API has request interceptor
- [x] Token checked from multiple sources
- [x] 401 errors handled with logout
- [x] Console logs added for debugging
- [x] Manual token injection removed from synthesizeText
- [x] Both Auth and TTS APIs have consistent interceptors

## Status

✅ **FIXED** - The TTS synthesis endpoint now properly authenticates all requests.

---

**Last Updated**: 2025-10-12 22:54  
**Issue**: Synthesis 401 Error  
**Solution**: Added request interceptor to TTS API instance
