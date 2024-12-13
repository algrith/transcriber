import RecordPlugin from 'wavesurfer.js/dist/plugins/record.js';
import { useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const WaveSurferErrors = {
  NoRecorderInstance: (action) => {
    return `No recorder instance found. You can only ${action} an existing instance of recorder.`;
  },
  NoPlayerInstance: (action) => {
    return `No player instance found. You can only ${action} with a player instance.`;
  }
};

const RecorderStates = {
  recording: 'recording',
  stopped: 'stopped',
  paused: 'paused'
};

const PlayBackStates = {
  stopped: 'stopped',
  playing: 'playing',
  paused: 'paused'
};

const useWaveSurfer = ({ waveformRef }) => {
  const [loadedAudioFileDuration, setLoadedAudioFileDuration] = useState(0);
  const [isWaveformVisible, setWaveformVisibility] = useState(false);
  const [recordedFileExtension, setFileExtension] = useState('');
  const [recorderState, setRecorderState] = useState('stopped');
  const [playbackState, setPlaybackState] = useState('stopped');
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState('');
  const [canPlayAudio, setCanPlayAudio] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const [recorder, setRecorder] = useState(null);
  
  const createWavesurfer = (props) => {
    const { progressColor, waveColor, autoplay = false, url = '' } = props;
    if (wavesurfer) wavesurfer.destroy();
    
    const newWavesurfer = WaveSurfer.create({
      progressColor: progressColor || '#a2435f',
      waveColor: waveColor || '#ddd',
      container: waveformRef.current,
      backend: 'MediaElement',
      barHeight: 24,
      barRadius: 20,
      barWidth: 2,
      height: 24,
      barGap: 6,
      autoplay,
      url
    });

    return newWavesurfer;
  };
  
  const loadAudioFile = (props) => setWavesurfer(createWavesurfer(props));

  const updateBlobData = (blob, eventType) => {
    const fileExtension = `${blob.type.split(';')[0].split('/')[1]}` || 'webm';
    setRecordedBlobUrl(URL.createObjectURL(blob));
    setFileExtension(fileExtension);
    setRecorderState(eventType);
    setCanPlayAudio(true);
    setRecordedBlob(blob);
  };

  const createRecorder = () => {
    if (recorder) recorder.destroy();

    const recorderOptions = {
      renderRecordedAudio: true,
      scrollingWaveform: true
    };

    if (MediaRecorder.isTypeSupported('audio/webm')) {
      recorderOptions.mimeType = 'audio/webm';
    }

    const wavesurfer = createWavesurfer({});
    setWavesurfer(wavesurfer);

    const newRecorder = wavesurfer.registerPlugin(
      RecordPlugin.create(recorderOptions)
    );
    
    return newRecorder;
  };

  const getRecorder = () => {
    if (recorder) return recorder;

    const newRecorder = createRecorder();
    setRecorder(newRecorder);
    return newRecorder;
  };

  const updatePlaybackData = () => {
    // Handles first mount where there is no existing instance of wavesurfer.
    if (!wavesurfer) return;

    const audioElement = wavesurfer.getWrapper();
		if (audioElement && !isWaveformVisible) {
			const options = { threshold: 0, root: waveformRef.current };
			const observer = new IntersectionObserver(function(entries) {
				if (entries[0].isIntersecting) setWaveformVisibility(true);
			}, options);
			observer.observe(audioElement);
		}

    wavesurfer.on('ready', () => setLoadedAudioFileDuration(wavesurfer.getDuration() * 1000));
    wavesurfer.on('timeupdate', (duration) => setPlaybackDuration(duration * 1000));
    wavesurfer.on('finish', () => setPlaybackState('stopped'));
    wavesurfer.on('play', () => setPlaybackState('playing'));
    wavesurfer.on('pause', () => setPlaybackState('paused'));
  };
  
  const updateRecorderData = () => {
    // Handles first mount where there is no existing instance of recorder.
    if (!recorder) return;
    recorder.on('record-progress', (duration) => setRecordingDuration(duration));
    recorder.on('record-pause', (blob) => updateBlobData(blob, 'paused'));
    recorder.on('record-end', (blob) => updateBlobData(blob, 'stopped'));
    recorder.on('record-resume', () => {
      setRecorderState('recording');
      setCanPlayAudio(false);
    });
  };

  const resumeRecording = () => {
    // Can only resume an existing instance of recorder
    if (!recorder) throw new Error(WaveSurferErrors.NoRecorderInstance('resume'));
    wavesurfer?.stop();
    recorder.resumeRecording();
  };

  const resetRecordStates = () => {
    setRecorderState('stopped');
    setPlaybackState('stopped');
    setRecordingDuration(0);
    setPlaybackDuration(0);
    setRecordedBlobUrl('');
    setCanPlayAudio(false);
    setRecordedBlob(null);
    setFileExtension('');
  };

  const startRecording = () => {
    // Can either start an existing instance of recorder or create a new instance
    const newRecorder = recorder ?? getRecorder();
    resetRecordStates();
    wavesurfer?.stop();

    newRecorder.startRecording()
    .then(() => setRecorderState('recording'));
  };

  const pauseRecording = () => {
    // Can only pause an existing instance of recorder
    if (!recorder) throw new Error(WaveSurferErrors.NoRecorderInstance('pause'));
    recorder.pauseRecording();
  };

  const stopRecording = () => {
    // Can only stop an existing instance of recorder
    if (!recorder) throw new Error(WaveSurferErrors.NoRecorderInstance('stop'));
    recorder.stopRecording();
  };

  const playLoadedAudio = () => {
    // Can only play/pause an existing instance of wavesurfer
    if (!wavesurfer) throw new Error(WaveSurferErrors.NoPlayerInstance('play'));
    wavesurfer.playPause();
  };

  const playRecording = () => {
    // Can only stop an existing instance of recorder
    if (!wavesurfer) throw new Error(WaveSurferErrors.NoPlayerInstance('play'));
    wavesurfer.playPause();
  };
  
  const handleRecording = () => {
    // Can either use an existing instance of recorder or create a new instance
    if (!recorder) return startRecording();
    if (recorder.isRecording()) return pauseRecording();
    if (recorder.isPaused()) return resumeRecording();
    startRecording();
  };
  
  useEffect(() => {
    updatePlaybackData();
  }, [wavesurfer]);

  useEffect(() => {
    updateRecorderData();
  }, [recorder]);

  return {
    loadedAudioFileDuration,
    recordedFileExtension,
    isWaveformVisible,
    recordingDuration,
    resetRecordStates,
    playbackDuration,
    recordedBlobUrl,
    playLoadedAudio,
    resumeRecording,
    handleRecording,
    pauseRecording,
    startRecording,
    playRecording,
    loadAudioFile,
    playbackState,
    recorderState,
    stopRecording,
    recordedBlob,
    canPlayAudio,
    getRecorder,
    wavesurfer
  };
};

export default useWaveSurfer;



// const useWaveSurfer = ({ waveformRef }) => {
//   const [recordingState, setRecordingState] = useState('stopped');
//   const [recordFileExtension, setFileExtension] = useState();
//   const [recordTime, setRecordTime] = useState(0);
//   const [recordBlob, setRecordBlob] = useState();
//   const [recordUrl, setRecordUrl] = useState();
//   const recorderRef = useRef();
    
//   const getRecorder = () => {
//     if (!recorderRef.current) {
//       const wavesurfer = WaveSurfer.create({
//         progressColor: 'rgb(100, 0, 100)',
//         container: waveformRef?.current,
//         waveColor: 'rgb(200, 0, 200)',
//         renderFunction: (channels, ctx) => {
//           const { width, height } = ctx.canvas;
//           const scale = channels[0].length / width;
//           const step = 10;

//           ctx.translate(0, height / 2);
//           ctx.strokeStyle = ctx.fillStyle;
//           ctx.beginPath();

//           for (let i = 0; i < width; i += step * 2) {
//             const index = Math.floor(i * scale);
//             const value = Math.abs(channels[0][index]);
//             let x = i;
//             let y = value * height;

//             ctx.moveTo(x, 0);
//             ctx.lineTo(x, y);
//             ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, true);
//             ctx.lineTo(x + step, 0);

//             x = x + step;
//             y = -y;
//             ctx.moveTo(x, 0);
//             ctx.lineTo(x, y);
//             ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, false);
//             ctx.lineTo(x + step, 0);
//           }

//           ctx.stroke();
//           ctx.closePath();
//         }
//       });
      
//       recorderRef.current = wavesurfer.registerPlugin(
//         RecordPlugin.create({
//           renderRecordedAudio: false,
//           scrollingWaveform: false
//         })
//       );
      
//       return recorderRef.current;
//     }

//     return recorderRef.current;
//   };

//   useEffect(() => {
//     const recorder = getRecorder();

//     recorder.on('record-progress', (time) => setRecordTime(time));

//     recorder.on('record-end', (blob) => {
//       const fileExtension = `${blob.type.split(';')[0].split('/')[1]}` || 'webm';
//       setRecordUrl(URL.createObjectURL(blob));
//       setFileExtension(fileExtension);
//       setRecordBlob(blob);
//     });
//   }, [recorderRef.current]);
  
//   useEffect(() => {
//     if (recordingState === 'stopped') setRecordTime(0);
//   }, [recordingState]);

//   const handleRecording = () => {
//     const recorder = getRecorder();

//     if (recorder.isRecording()) {
//       recorder.pauseRecording();
//       return setRecordingState('paused');
//     }

//     if (recorder.isPaused()) {
//       recorder.resumeRecording();
//       return setRecordingState('recording');
//     }

//     recorder.startRecording().then(() => {
//       setRecordingState('recording');
//     });
//   };

//   const stopRecording = () => {
//     const recorder = getRecorder();

//     if (recorder.isRecording() || recorder.isPaused()) {
//       recorder.stopRecording();
//       setRecordingState('stopped');
//     }
//   };

//   return {
//     recordFileExtension,
//     handleRecording,
//     recordingState,
//     stopRecording,
//     getRecorder,
//     recordTime,
//     recordBlob,
//     recordUrl,
//   };
// };

// export default useWaveSurfer;

// TS
// 'use client';

// import RecordPlugin from 'wavesurfer.js/dist/plugins/record.js';
// import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js';
// import { RefObject, useEffect, useState } from 'react';
// import colors from '@/lib/colors';

// const WaveSurferErrors = {
//   NoRecorderInstance: (action: string) => {
//     return `No recorder instance found. You can only ${action} an existing instance of recorder.`;
//   },
//   NoPlayerInstance: (action: string) => {
//     return `No player instance found. You can only ${action} with a player instance.`;
//   }
// };

// export type RecorderStates = 'recording' | 'stopped' | 'paused';
// export type PlayBackStates = 'stopped' | 'playing' | 'paused';
// export type WaveSurferProps = Partial<WaveSurferOptions>;

// const useWaveSurfer = ({ waveformRef }: { waveformRef: RefObject<HTMLElement> }) => {
//   const [recorderState, setRecorderState] = useState<RecorderStates>('stopped');
//   const [playbackState, setPlaybackState] = useState<PlayBackStates>('stopped');
//   const [isWaveformVisible, setWaveformVisibility] = useState<boolean>(false);
//   const [loadedAudioFileDuration, setLoadedAudioFileDuration] = useState(0);
//   const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
//   const [recorder, setRecorder] = useState<RecordPlugin | null>(null);
//   const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
//   const [recordedFileExtension, setFileExtension] = useState('');
//   const [recordingDuration, setRecordingDuration] = useState(0);
//   const [playbackDuration, setPlaybackDuration] = useState(0);
//   const [recordedBlobUrl, setRecordedBlobUrl] = useState('');
//   const [canPlayAudio, setCanPlayAudio] = useState(false);
  
//   const createWavesurfer = (props: WaveSurferProps): WaveSurfer => {
//     const { progressColor, waveColor, autoplay = false, url = '' } = props;
//     if (wavesurfer) wavesurfer.destroy();
    
//     const newWavesurfer = WaveSurfer.create({
//       progressColor: progressColor || colors.theme.primary,
//       waveColor: waveColor || colors.theme.text,
//       container: waveformRef.current!,
//       backend: 'MediaElement',
//       barHeight: 24,
//       barRadius: 20,
//       barWidth: 2,
//       height: 24,
//       barGap: 6,
//       autoplay,
//       url
//     });

//     return newWavesurfer;
//   };
  
//   const loadAudioFile = (props: WaveSurferProps) => setWavesurfer(createWavesurfer(props));

//   const updateBlobData = (blob: Blob, eventType: RecorderStates) => {
//     const fileExtension = `${blob.type.split(';')[0].split('/')[1]}` || 'webm';
//     setRecordedBlobUrl(URL.createObjectURL(blob));
//     setFileExtension(fileExtension);
//     setRecorderState(eventType);
//     setCanPlayAudio(true);
//     setRecordedBlob(blob);
//   };

//   const createRecorder = (): RecordPlugin => {
//     if (recorder) recorder.destroy();

//     const recorderOptions: RecordPlugin['options'] = {
//       renderRecordedAudio: true,
//       scrollingWaveform: true
//     };

//     if (MediaRecorder.isTypeSupported('audio/webm')) {
//       recorderOptions.mimeType = 'audio/webm';
//     }

//     const wavesurfer = createWavesurfer({});
//     setWavesurfer(wavesurfer);

//     const newRecorder = wavesurfer.registerPlugin(
//       RecordPlugin.create(recorderOptions)
//     );
    
//     return newRecorder;
//   };

//   const getRecorder = () => {
//     if (recorder) return recorder;

//     const newRecorder = createRecorder();
//     setRecorder(newRecorder);
//     return newRecorder;
//   };

//   const updatePlaybackData = () => {
//     // Handles first mount where there is no existing instance of wavesurfer.
//     if (!wavesurfer) return;

//     const audioElement = wavesurfer.getWrapper();
// 		if (audioElement && !isWaveformVisible) {
// 			const options = { threshold: 0, root: waveformRef.current };
// 			const observer = new IntersectionObserver(function(entries) {
// 				if (entries[0].isIntersecting) setWaveformVisibility(true);
// 			}, options);
// 			observer.observe(audioElement);
// 		}

//     wavesurfer.on('ready', () => setLoadedAudioFileDuration(wavesurfer.getDuration() * 1000));
//     wavesurfer.on('timeupdate', (duration: number) => setPlaybackDuration(duration * 1000));
//     wavesurfer.on('finish', () => setPlaybackState('stopped'));
//     wavesurfer.on('play', () => setPlaybackState('playing'));
//     wavesurfer.on('pause', () => setPlaybackState('paused'));
//   };
  
//   const updateRecorderData = () => {
//     // Handles first mount where there is no existing instance of recorder.
//     if (!recorder) return;
//     recorder.on('record-progress', (duration: number) => setRecordingDuration(duration));
//     recorder.on('record-pause', (blob: Blob) => updateBlobData(blob, 'paused'));
//     recorder.on('record-end', (blob: Blob) => updateBlobData(blob, 'stopped'));
//     recorder.on('record-resume', () => {
//       setRecorderState('recording');
//       setCanPlayAudio(false);
//     });
//   };

//   const resumeRecording = () => {
//     // Can only resume an existing instance of recorder
//     if (!recorder) throw new Error(WaveSurferErrors.NoRecorderInstance('resume'));
//     wavesurfer?.stop();
//     recorder.resumeRecording();
//   };

//   const resetRecordStates = () => {
//     setRecorderState('stopped');
//     setPlaybackState('stopped');
//     setRecordingDuration(0);
//     setPlaybackDuration(0);
//     setRecordedBlobUrl('');
//     setCanPlayAudio(false);
//     setRecordedBlob(null);
//     setFileExtension('');
//   };

//   const startRecording = () => {
//     // Can either start an existing instance of recorder or create a new instance
//     const newRecorder = recorder ?? getRecorder();
//     resetRecordStates();
//     wavesurfer?.stop();

//     newRecorder.startRecording()
//     .then(() => setRecorderState('recording'));
//   };

//   const pauseRecording = () => {
//     // Can only pause an existing instance of recorder
//     if (!recorder) throw new Error(WaveSurferErrors.NoRecorderInstance('pause'));
//     recorder.pauseRecording();
//   };

//   const stopRecording = () => {
//     // Can only stop an existing instance of recorder
//     if (!recorder) throw new Error(WaveSurferErrors.NoRecorderInstance('stop'));
//     recorder.stopRecording();
//   };

//   const playLoadedAudio = () => {
//     // Can only play/pause an existing instance of wavesurfer
//     if (!wavesurfer) throw new Error(WaveSurferErrors.NoPlayerInstance('play'));
//     wavesurfer.playPause();
//   };

//   const playRecording = () => {
//     // Can only stop an existing instance of recorder
//     if (!wavesurfer) throw new Error(WaveSurferErrors.NoPlayerInstance('play'));
//     wavesurfer.playPause();
//   };
  
//   const handleRecording = () => {
//     // Can either use an existing instance of recorder or create a new instance
//     if (!recorder) return startRecording();
//     if (recorder.isRecording()) return pauseRecording();
//     if (recorder.isPaused()) return resumeRecording();
//     startRecording();
//   };
  
//   useEffect(() => {
//     updatePlaybackData();
//   }, [wavesurfer]);

//   useEffect(() => {
//     updateRecorderData();
//   }, [recorder]);

//   return {
//     loadedAudioFileDuration,
//     recordedFileExtension,
//     isWaveformVisible,
//     recordingDuration,
//     resetRecordStates,
//     playbackDuration,
//     recordedBlobUrl,
//     playLoadedAudio,
//     resumeRecording,
//     handleRecording,
//     pauseRecording,
//     startRecording,
//     playRecording,
//     loadAudioFile,
//     playbackState,
//     recorderState,
//     stopRecording,
//     recordedBlob,
//     canPlayAudio,
//     getRecorder,
//     wavesurfer
//   };
// };

// export default useWaveSurfer;