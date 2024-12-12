export type SpeechToTextEnginesURLs = Record<SpeechToTextEngines, string>;
export type TranscriberResponse = {
    error: string | null;
    transcript: string;
    loading: boolean;
};
export type TranscriberOptions = {
    engine: SpeechToTextEngines;
};
export declare enum SpeechToTextEngines {
    GOOGLE = "google"
}
