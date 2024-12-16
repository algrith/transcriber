import useTranscriber from '@algrith/transcriber';
import { useEffect, useRef } from 'react';

import useWaveSurfer from '../hooks/wavesurfer';
import { TranscriberWrapper } from './styled';
import { Timer } from '../utils/timer';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const options = {
  engine: 'google'
};

const Transcriber = () => {
  const { transcribe, response } = useTranscriber(apiKey, options);
  const { transcript, loading, error } = response;
  const waveformRef = useRef();
  const {
    recordedFileExtension,
    recordingDuration,
    recordedBlobUrl,
    handleRecording,
    recorderState,
    stopRecording,
    recordedBlob
  } = useWaveSurfer({
    waveformRef
  });
  
  const disabledStopButton = !['recording', 'paused'].includes(recorderState);
  const timer = new Timer(recordingDuration).formatted();
  
  useEffect(() => {
    if (recordedBlob) transcribe(recordedBlob);
  }, [recordedBlob]);

	return (
    <TranscriberWrapper>
      <div className='recorder'>
        <button onClick={handleRecording} type='button' className={`record ${recorderState}`}>
          {recorderState === 'recording' && 'Pause'}
          {recorderState === 'paused' && 'Resume'}
          {recorderState === 'stopped' && 'Start'}
        </button>

        <button
          disabled={disabledStopButton}
          onClick={stopRecording}
          className='stop'
          type='button'
        >
          Stop
        </button>

        <div className='indicator' />

        <div className='timer'>{timer}</div>
      </div>

      <div ref={waveformRef} />

      {recordedBlobUrl && (
        <>
          <audio controls src={recordedBlobUrl}></audio>

          <a href={recordedBlobUrl} download={`recording.${recordedFileExtension}`}>
            Download
          </a>
        </>
      )}

      {loading ? (
        <div>Transcribing...Please wait!</div>
      ) : (
        <>
          {error && (
            <div>
              Oops! Your audio input could not be transcribed!
              Try again with a clearer/audible recording.
            </div>
          )}

          {transcript && (
            <div>
              <h1>Transcript</h1>
              {transcript}
            </div>
          )}
        </>
      )}
    </TranscriberWrapper>
  );
};

export default Transcriber;