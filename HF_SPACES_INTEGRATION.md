# 🚀 Hugging Face Spaces TTS API Integration Guide

This guide shows how to integrate your Final-Voxly frontend with the deployed Hugging Face Spaces TTS API.

## 🔗 API Endpoints

Your deployed TTS service is available at:
- **Base URL**: `https://huggingface.co/spaces/Yaya5777/voxly-tts`
- **API Predict**: `https://huggingface.co/spaces/Yaya5777/voxly-tts/api/predict`
- **Direct FastAPI**: `https://huggingface.co/spaces/Yaya5777/voxly-tts/synthesize`

## 🛠️ Frontend Integration Examples

### 1. Using the Updated TTS Service

```typescript
import { ttsService } from '../services/api';

// Method 1: Use the standard synthesize endpoint
const generateSpeech = async () => {
  try {
    const audioBlob = await ttsService.synthesize({
      text: "Hello from Voxly TTS!",
      voice_id: "sarah_excited_female",
      format: "wav"
    });
    
    // Play the audio
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error('TTS Error:', error);
  }
};

// Method 2: Use the HF Spaces predict API
const generateSpeechHF = async () => {
  try {
    const audioBlob = await ttsService.predict({
      text: "Hello from Hugging Face Spaces!",
      voice_id: "sarah_excited_female",
      format: "wav"
    });
    
    // Play the audio
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error('HF Spaces TTS Error:', error);
  }
};
```

### 2. Direct Fetch Integration

```typescript
// Direct integration with HF Spaces API
const synthesizeWithFetch = async (text: string, voiceId: string) => {
  try {
    const response = await fetch('https://huggingface.co/spaces/Yaya5777/voxly-tts/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [text, voiceId, 'wav']
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Handle the response based on HF Spaces format
    if (result.data && result.data[0]) {
      // If it returns a file path or base64, handle accordingly
      return result.data[0];
    }
    
    return result;
  } catch (error) {
    console.error('Direct fetch error:', error);
    throw error;
  }
};
```

### 3. React Component Example

```tsx
import React, { useState } from 'react';
import { ttsService } from '../services/api';

const TTSDemo: React.FC = () => {
  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState('sarah_excited_female');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleSynthesize = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      // Use the updated TTS service
      const audioBlob = await ttsService.synthesize({
        text,
        voice_id: voiceId,
        format: 'wav'
      });
      
      // Create audio URL
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      // Auto-play the audio
      const audio = new Audio(url);
      audio.play();
      
    } catch (error) {
      console.error('TTS synthesis failed:', error);
      alert('Failed to generate speech. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tts-demo">
      <h2>🎤 TTS Demo - Hugging Face Spaces</h2>
      
      <div className="form-group">
        <label>Text to Synthesize:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech..."
          rows={4}
        />
      </div>
      
      <div className="form-group">
        <label>Voice:</label>
        <select value={voiceId} onChange={(e) => setVoiceId(e.target.value)}>
          <option value="sarah_excited_female">Sarah (Excited)</option>
          <option value="david_professional_male">David (Professional)</option>
          <option value="elena_spanish_female">Elena (Spanish)</option>
          <option value="marie_french_female">Marie (French)</option>
          <option value="hans_german_male">Hans (German)</option>
        </select>
      </div>
      
      <button 
        onClick={handleSynthesize} 
        disabled={loading || !text.trim()}
        className="synthesize-btn"
      >
        {loading ? '🔄 Generating...' : '🎤 Generate Speech'}
      </button>
      
      {audioUrl && (
        <div className="audio-player">
          <h3>Generated Audio:</h3>
          <audio controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default TTSDemo;
```

## 🔧 Environment Configuration

### 1. Update `.env.local`

```bash
# Production - Use your HF Spaces URL
NEXT_PUBLIC_TTS_URL=https://huggingface.co/spaces/Yaya5777/voxly-tts

# Development - Use localhost
# NEXT_PUBLIC_TTS_URL=http://localhost:8000

NEXT_PUBLIC_AUTH_URL=http://localhost:8001
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Verify Configuration

```typescript
// Check your environment configuration
import { TTS_URL } from '../config/env';

console.log('TTS API URL:', TTS_URL);
// Should output: https://huggingface.co/spaces/Yaya5777/voxly-tts
```

## 🎯 Available Voices

Your TTS service includes 56 premium voices:

### Professional Voices
- `david_professional_male` - Corporate American male
- `rachel_business_female` - Business British female
- `michael_executive_deep` - Executive deep voice
- `jennifer_corporate_female` - Professional American female

### International Accents
- `elena_spanish_female` - Spanish accent speaking English
- `marie_french_female` - French accent speaking English
- `hans_german_male` - German accent speaking English
- `sofia_italian_female` - Italian accent speaking English
- `kenji_japanese_gentle` - Japanese accent speaking English
- `dmitri_russian_deep` - Russian accent speaking English
- `fatima_arabic_female` - Arabic accent speaking English
- `omar_arabic_male` - Arabic accent speaking English

### Conversational Voices
- `sarah_excited_female` - Energetic American female
- `emma_happy_british` - Happy British female
- `lucas_calm_male` - Calm American male
- `sophie_friendly_canadian` - Friendly Canadian female

## 🚨 Error Handling

```typescript
const handleTTSError = (error: any) => {
  console.error('TTS Error:', error);
  
  if (error.response?.status === 429) {
    alert('Rate limit exceeded. Please wait a moment and try again.');
  } else if (error.response?.status === 500) {
    alert('TTS service temporarily unavailable. Please try again later.');
  } else if (error.message?.includes('Network Error')) {
    alert('Network error. Please check your internet connection.');
  } else {
    alert('Failed to generate speech. Please try again.');
  }
};

// Use in your TTS calls
try {
  const audioBlob = await ttsService.synthesize({...});
} catch (error) {
  handleTTSError(error);
}
```

## 🔄 Testing the Integration

### 1. Test Voice List
```typescript
const testVoices = async () => {
  try {
    const voices = await ttsService.getVoices();
    console.log('Available voices:', voices);
  } catch (error) {
    console.error('Failed to fetch voices:', error);
  }
};
```

### 2. Test Synthesis
```typescript
const testSynthesis = async () => {
  try {
    const audioBlob = await ttsService.synthesize({
      text: "Testing Hugging Face Spaces integration!",
      voice_id: "sarah_excited_female"
    });
    
    console.log('Audio blob generated:', audioBlob);
    
    // Play the audio
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error('Synthesis test failed:', error);
  }
};
```

### 3. Test Health Check
```typescript
const testHealth = async () => {
  try {
    const health = await ttsService.healthCheck();
    console.log('TTS service health:', health);
  } catch (error) {
    console.error('Health check failed:', error);
  }
};
```

## 📱 Mobile Considerations

```typescript
// Handle mobile audio playback
const playAudioMobile = (audioBlob: Blob) => {
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  
  // Mobile Safari requires user interaction
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log('Audio playback started');
      })
      .catch(error => {
        console.log('Audio playback failed:', error);
        // Fallback: provide download link
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = 'speech.wav';
        link.textContent = 'Download Audio';
        document.body.appendChild(link);
      });
  }
};
```

## 🎉 Success!

Your frontend is now configured to work with your deployed Hugging Face Spaces TTS API! The integration supports:

- ✅ 56 premium AI voices with natural accents
- ✅ Real-time speech synthesis
- ✅ Error handling and fallbacks
- ✅ Mobile compatibility
- ✅ Production-ready deployment

Test the integration and enjoy your powerful TTS service! 🚀
