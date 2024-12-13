import type { SpeechToTextEnginesURLs, TranscriberOptions, TranscriberResponse } from './types';
import { useState } from 'react';

const speechToTextEngineUrls: SpeechToTextEnginesURLs = {
  google: `https://speech.googleapis.com/v1/speech:recognize`
};

const useTranscriber = (apiKey: string, options: TranscriberOptions) => {
  const engineUrl = `${speechToTextEngineUrls[options.engine]}?key=${apiKey}`;
  const [response, setResponse] = useState<TranscriberResponse>({
    loading: false,
    transcript: '',
    error: null
  });

  const transcribe = (audioBlob: Blob) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (!reader.result || typeof reader.result !== 'string') return;
      setResponse((prev) => ({ ...prev, loading: true }));
      const base64Data = reader.result.split(',')[1];
      
      fetch(engineUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            sampleRateHertz: 48000,
            encoding: 'WEBM_OPUS',
            languageCode: 'en-US'
          },
          audio: {
            content: base64Data,
          },
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const transcript = data.results.map((result: Record<string, any>) => (
          result.alternatives[0].transcript
        )).join('\n');

        setResponse((prev) => ({
          ...prev,
          loading: false,
          error: null,
          transcript
        }));
      })
      .catch((error) => {
        console.error('An error occurred during transcription:', error);
        setResponse((prev) => ({
          ...prev,
          loading: false,
          transcript: '',
          error
        }));
      });
    };

    reader.readAsDataURL(audioBlob);
  };

  return {
    transcribe,
    response
  };
};

export default useTranscriber;