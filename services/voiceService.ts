
import { DetectionRequest, DetectionResponse } from "../types";
import { MOCK_API_KEY, API_ENDPOINT } from "../constants";

export class VoiceDetectionService {
  // Client-side will call a server endpoint that holds the real API key.
  // This keeps secrets out of the browser and avoids runtime auth errors in production.
  static async detect(request: DetectionRequest, apiKey: string): Promise<DetectionResponse> {
    if (apiKey !== MOCK_API_KEY) {
      return {
        status: 'error',
        message: 'Access Denied: Please verify your security key.'
      };
    }

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request, apiKey })
      });

      if (!res.ok) {
        const text = await res.text();
        return { status: 'error', message: text || 'Server error' };
      }

      const data = await res.json();
      return data as DetectionResponse;
    } catch (err) {
      console.error('Client fetch error:', err);
      return {
        status: 'error',
        message: 'We encountered a hiccup while analyzing the audio. Please try again.'
      };
    }
  }
}
