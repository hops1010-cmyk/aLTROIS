import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Cache of generated songs
const songCache = new Map<string, { audioBase64?: string; mimeType?: string; lyrics?: string }>();

// 1. Lyria Music Generation Route
app.post('/api/lyria/generate', async (req, res) => {
  try {
    const { prompt, songId, imageBase64, imageMimeType, model = 'lyria-3-clip-preview' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
    }

    console.log(`[Lyria API] Generating song with model: ${model}, prompt: "${prompt.slice(0, 60)}..."`);

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';
    let isSyntheticFallback = false;
    let fallbackReason = '';

    try {
      let contents: any = prompt;
      if (imageBase64) {
        contents = {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: imageBase64.replace(/^data:[^;]+;base64,/, ''),
                mimeType: imageMimeType || 'image/jpeg'
              }
            }
          ]
        };
      }

      // Call Lyria model
      const responseStream = await ai.models.generateContentStream({
        model: model,
        contents: contents,
        config: {
          responseModalities: ['AUDIO']
        } as any
      });

      for await (const chunk of responseStream) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;

        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
          if (part.text && !lyrics) {
            lyrics = part.text;
          }
        }
      }
    } catch (err: any) {
      console.warn('[Lyria API] Lyria streaming warning / quota restriction:', err.message || err);
      isSyntheticFallback = true;
      fallbackReason = err.message?.includes('429') || err.message?.includes('Quota')
        ? 'Lyria requires a billed/paid project key. Fallback synthesis activated.'
        : `Lyria generation issue: ${err.message || 'Generation error'}`;

      // Generate lyrics & song metadata using gemini-3.8-flash
      try {
        const textGen = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are the lead vocalist and audio director for a legendary Bronx heavy hardcore / beatdown metal band named aLTROIS.
Generate aggressive, raw, authentic song lyrics with verses, chorus, and a crushing half-time breakdown for this prompt:
"${prompt}"
Output only the raw lyrics with structure markers like [VERSE], [CHORUS], [BREAKDOWN - HALF TIME DROP-F].`
        });
        lyrics = textGen.text || '';
      } catch (e) {
        console.error('Text gen fallback error:', e);
      }
    }

    if (songId && audioBase64) {
      songCache.set(songId, { audioBase64, mimeType, lyrics });
    }

    return res.json({
      success: true,
      audioBase64: audioBase64 || null,
      mimeType: mimeType,
      lyrics: lyrics,
      modelUsed: isSyntheticFallback ? 'synthesizer-augmented' : model,
      isSyntheticFallback,
      fallbackReason
    });
  } catch (error: any) {
    console.error('Server error in /api/lyria/generate:', error);
    return res.status(500).json({ error: error.message || 'Music generation failed' });
  }
});

// 2. Custom AI Music & Soundtrack Generator (Text or Image)
app.post('/api/music/generate-custom', async (req, res) => {
  try {
    const { prompt, type = 'soundtrack', mood, genre, imageBase64, imageMimeType } = req.body;
    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: 'Prompt or image is required' });
    }

    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const enhancedPrompt = `Create a ${type} with mood "${mood || 'intense, energetic'}" in genre "${genre || 'hardcore metal'}". Prompt: ${prompt || 'Based on provided image'}`;

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';
    let isSyntheticFallback = false;

    try {
      let contents: any = enhancedPrompt;
      if (imageBase64) {
        contents = {
          parts: [
            { text: enhancedPrompt },
            {
              inlineData: {
                data: imageBase64.replace(/^data:[^;]+;base64,/, ''),
                mimeType: imageMimeType || 'image/jpeg'
              }
            }
          ]
        };
      }

      const responseStream = await ai.models.generateContentStream({
        model: 'lyria-3-clip-preview',
        contents,
        config: {
          responseModalities: ['AUDIO']
        } as any
      });

      for await (const chunk of responseStream) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            audioBase64 += part.inlineData.data;
            if (part.inlineData.mimeType) mimeType = part.inlineData.mimeType;
          }
          if (part.text && !lyrics) lyrics = part.text;
        }
      }
    } catch (err: any) {
      console.warn('Custom Lyria generation fallback:', err.message);
      isSyntheticFallback = true;
      const lyricsGen = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Generate musical composition directives, tempo, instrumentation, and lyrics/speech for: ${enhancedPrompt}`
      });
      lyrics = lyricsGen.text || '';
    }

    return res.json({
      success: true,
      audioBase64: audioBase64 || null,
      mimeType,
      lyrics,
      prompt: enhancedPrompt,
      isSyntheticFallback,
      type
    });
  } catch (error: any) {
    console.error('Error generating custom music:', error);
    return res.status(500).json({ error: error.message || 'Custom music generation failed' });
  }
});

// 3. Google Maps Venue, Route & Directions Agent (with Grounding)
app.post('/api/maps/agent', async (req, res) => {
  try {
    const { query, venueName, userLocation } = req.body;
    if (!query && !venueName) {
      return res.status(400).json({ error: 'Query or venueName is required' });
    }

    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const searchQuery = query || `Give detailed venue information, address, transit directions, and surrounding punk/hardcore landmarks for ${venueName} in real-time.`;

    // Call Gemini with Google Maps tool
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: searchQuery,
      config: {
        tools: [{ googleMaps: {} } as any],
        systemInstruction: `You are the aLTROIS Tour Operations Pit Navigator. You have access to real-time Google Maps data. 
Provide accurate, tactical routing, venue details, nearest transit lines, parking coordinates, and local warnings for touring fans and mosh crews. Keep it punchy, practical, and in character with Bronx Hardcore tour operations.`
      }
    });

    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;

    return res.json({
      success: true,
      text: response.text || '',
      groundingMetadata: groundingMetadata || null,
      venueName: venueName || 'Custom Route'
    });
  } catch (error: any) {
    console.error('Error in Google Maps agent:', error);
    return res.status(500).json({ error: error.message || 'Google Maps agent failed' });
  }
});

// 4. Live Audio Transcription Route (Gemini 3.5 Transcribe / Interactions API)
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm', language = 'en' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    console.log(`[Transcribe API] Processing audio transcription (${mimeType})...`);

    const cleanBase64 = audioBase64.replace(/^data:[^;]+;base64,/, '');

    // Transcribe with gemini-3.5-transcribe or gemini-3.8-flash
    let transcriptText = '';
    try {
      const interaction = await ai.interactions.create({
        model: 'gemini-3.5-transcribe',
        input: [
          {
            type: 'audio',
            data: cleanBase64,
            mime_type: mimeType
          },
          {
            type: 'text',
            text: 'Transcribe this live audio feed word-for-word. If there are heavy vocals, screams, blast beats, crowd shouts, or mosh pit callouts, annotate them in brackets like [CROWD SHOUT] or [GUTTURAL ROAR].'
          }
        ]
      });

      transcriptText = interaction.output_text || '';
      if (!transcriptText) {
        for (const step of interaction.steps || []) {
          if (step.type === 'model_output') {
            const t = (step.content as any[])?.find((c: any) => c.type === 'text');
            if (t?.text) transcriptText += t.text;
          }
        }
      }
    } catch (transcribeErr: any) {
      console.warn('Interactions transcribe fallback to multimodal generateContent:', transcribeErr.message);
      const flashResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType
            }
          },
          {
            text: 'Transcribe this audio recording accurately. Identify words spoken or screamed, musical genre, and crowd reactions.'
          }
        ]
      });
      transcriptText = flashResponse.text || '';
    }

    return res.json({
      success: true,
      transcript: transcriptText.trim() || '[No discernible speech detected in this audio segment]',
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Error in transcription endpoint:', error);
    return res.status(500).json({ error: error.message || 'Transcription failed' });
  }
});

// Setup Vite middlewares for development or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`[aLTROIS Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
