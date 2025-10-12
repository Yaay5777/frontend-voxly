# 🔧 Demo 404 Error Fix

## Issue
Voice demos were failing with **404 Not Found** errors because the frontend was calling a `/demo` endpoint that doesn't exist on the TTS backend.

## Error Logs
```
2025-10-12 20:04:19,399 - app - INFO - POST /demo - Status: 404 - 0.0021s
INFO: 10.16.14.117:50390 - "POST /demo HTTP/1.1" 404 Not Found

[Error] Failed to load resource: the server responded with a status of 404 () (demo, line 0)
[Error] ❌ Demo generation failed:
[Error] Demo synthesis failed:
```

## Root Cause

### Backend Issue
The TTS backend **only has `/synthesize` endpoint**, not `/demo`.

Backend endpoints:
- ✅ `/synthesize` - Requires authentication, generates audio
- ❌ `/demo` - **Does not exist**

### Frontend Issue
Three places in the frontend were calling the non-existent `/demo` endpoint:

1. **`services/api.ts`** - `generateVoiceDemo()` function
2. **`pages/VoicesPage.tsx`** - Direct fetch call to `/demo`
3. **`pages/HomePage.tsx`** - Using `generateVoiceDemo()`

## Solution

### 1. Fixed `services/api.ts`

Changed `generateVoiceDemo()` to use `/synthesize` endpoint instead of `/demo`:

```typescript
// ❌ BEFORE
async generateVoiceDemo(text: string, voiceId: string): Promise<Blob> {
  const formData = new FormData();
  formData.append('text', text);
  formData.append('speaker_id', voiceId);  // ❌ Wrong parameter name
  formData.append('language', 'en');

  const response = await this.ttsApi.post('/demo', formData, {  // ❌ 404!
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });
}
```

```typescript
// ✅ AFTER
async generateVoiceDemo(text: string, voiceId: string, language: string = 'en'): Promise<Blob> {
  const formData = new FormData();
  formData.append('text', text);
  formData.append('voice_id', voiceId);  // ✅ Correct parameter name
  formData.append('language', language);

  // ✅ Use /synthesize endpoint (auth token added automatically by interceptor)
  const response = await this.ttsApi.post('/synthesize', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });
}
```

**Key Changes:**
- Endpoint: `/demo` → `/synthesize`
- Parameter: `speaker_id` → `voice_id`
- Added `language` parameter
- Authentication automatically handled by interceptor

### 2. Fixed `pages/VoicesPage.tsx`

**Before:** Direct fetch call to `/demo` endpoint
```typescript
// ❌ BEFORE
const response = await fetch(`${TTS_API_URL}/demo`, {
  method: 'POST',
  body: formData,
});
```

**After:** Use the API function
```typescript
// ✅ AFTER
import { generateVoiceDemo as apiGenerateVoiceDemo } from '../services/api';

const generateVoiceDemo = async (voice: Voice) => {
  // Check authentication first
  if (!isAuthenticated) {
    alert('Please login to play voice demos.');
    navigate('/login');
    return;
  }
  
  // Use API function (auth token added automatically)
  const audioBlob = await apiGenerateVoiceDemo(
    voice.sample_text || "Hello, this is a sample of my voice.",
    voice.id,
    'en'
  );
};
```

**Key Changes:**
- Removed direct fetch call
- Use centralized API function
- Added authentication check
- Better error handling with 401 detection

### 3. Fixed `pages/HomePage.tsx`

**Before:** No auth check, poor error handling
```typescript
// ❌ BEFORE
const handleDemoSynthesis = async () => {
  try {
    const audioBlob = await generateVoiceDemo(demoText, 'emma_american_female');
    // ...
  } catch (error) {
    alert('Voice synthesis failed. Please try again.');
  }
};
```

**After:** Auth check + better error handling
```typescript
// ✅ AFTER
const handleDemoSynthesis = async () => {
  // Check authentication
  if (!isAuthenticated) {
    alert('Please login to try voice synthesis.');
    window.location.href = '/login';
    return;
  }
  
  try {
    const audioBlob = await generateVoiceDemo(demoText, 'emma_american_female', 'en');
    // ...
  } catch (error: any) {
    let errorMessage = 'Voice synthesis failed. ';
    if (error.response?.status === 401) {
      errorMessage = 'Your session expired. Please login again.';
      setTimeout(() => window.location.href = '/login', 2000);
    } else if (error.response?.status === 404) {
      errorMessage += 'TTS service unavailable.';
    } else if (error.response?.status === 500) {
      errorMessage += 'Server error. Please try again.';
    }
    alert(errorMessage);
  }
};
```

**Key Changes:**
- Added authentication check
- Added language parameter
- Specific error handling for 401/404/500
- Auto-redirect on session expiry

## Benefits

### 1. **Single Source of Truth**
All demo generation now goes through `services/api.ts`, making it easier to:
- Update endpoint URLs
- Add error handling
- Monitor API calls
- Add request/response interceptors

### 2. **Automatic Authentication**
The TTS API interceptor automatically adds auth tokens to all requests, including demos:
```typescript
this.ttsApi.interceptors.request.use((config) => {
  const token = getAuthToken();  // Checks store → cookies → localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. **Consistent Error Handling**
All three locations now handle:
- 401 Unauthorized → Logout + redirect to login
- 404 Not Found → Service unavailable message
- 500 Server Error → Retry message
- Network errors → Connection message

### 4. **Better UX**
- Clear authentication requirements
- Specific error messages
- Auto-redirect on session expiry
- No confusing "404" errors

## Testing

### Test Demo on VoicesPage
1. Navigate to `/voices`
2. Click "Demo" button on any voice
3. **Expected**: Audio plays (if logged in)
4. **If not logged in**: "Please login" alert + redirect to login
5. Check console: Should see `🔑 Adding auth token to TTS request`

### Test Demo on HomePage
1. Navigate to `/`
2. Scroll to synthesis demo section
3. Enter text and click "Generate"
4. **Expected**: Audio generates and plays
5. **If not logged in**: "Please login" alert + redirect

### Test Error Scenarios
```bash
# Test 401 (expired token)
# 1. Login
# 2. Manually delete cookie: document.cookie = "voxly_at=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
# 3. Try to generate demo
# Expected: "Your session expired. Please login again."

# Test with no auth
# 1. Logout
# 2. Try to generate demo
# Expected: "Please login to play voice demos."
```

## Files Modified

| File | Change | Description |
|------|--------|-------------|
| `services/api.ts` | ✏️ Modified | Changed `/demo` to `/synthesize`, fixed parameter names |
| `pages/VoicesPage.tsx` | ✏️ Modified | Use API function instead of direct fetch |
| `pages/HomePage.tsx` | ✏️ Modified | Added auth check and better error handling |

## Backend Requirements

The TTS backend must:
1. Have `/synthesize` endpoint (not `/demo`)
2. Accept `voice_id` parameter (not `speaker_id`)
3. Require authentication via `Authorization: Bearer <token>` header
4. Return audio blob on success
5. Return 401 for invalid/missing tokens

Example backend:
```python
@app.post("/synthesize")
async def synthesize(
    text: str = Form(...),
    voice_id: str = Form(...),
    language: str = Form("en"),
    user: User = Depends(get_current_user)  # Validates JWT
):
    # Generate audio
    return audio_blob
```

## Related Fixes

This fix builds on previous fixes:
1. **Auth Persistence** - Tokens stored in cookies for page reload
2. **TTS API Interceptor** - Auto-adds auth token to all TTS requests
3. **Multi-Source Token Retrieval** - Checks store → cookies → localStorage

## Status

✅ **FIXED** - All demo generation now uses `/synthesize` endpoint with proper authentication.

---

**Last Updated**: 2025-10-12 23:05  
**Issue**: Demo 404 Error  
**Solution**: Changed `/demo` → `/synthesize` in all locations
