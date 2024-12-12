import type { TranscriberOptions, TranscriberResponse } from './types';
declare const useTranscriber: (apiKey: string, options: TranscriberOptions) => {
    transcribe: (audioBlob: Blob) => void;
    response: TranscriberResponse;
};
export default useTranscriber;
