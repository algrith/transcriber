<!-- <a href="https://react-speech-transcriber.com" target="_blank" rel="noopener">
  <picture>
    <source media="(prefers-color-scheme: dark)" alt="React Speech Transcriber" srcset="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/github/excalidraw_github_cover_2_dark.png" />
    <img alt="Excalidraw" src="https://excalidraw.nyc3.cdn.digitaloceanspaces.com/github/excalidraw_github_cover_2.png" />
  </picture>
</a> -->

<h4 align="center">
  <a href="#">Algrith Transcriber</a>
</h4>

<div align="center">
  <h2>
    A lightweight npm utility built on the Google speech-to-text API for converting pre-recorded speech to text, ideal for processing audio files, creating captions, and enhancing accessibility.
  </h2>
</div>

<br />
<p align="center">
  <a href="https://github.com/algrith/transcriber/main/LICENSE">
    <img alt="Algrith Transcriber is released under the MIT license." src="https://img.shields.io/badge/license-MIT-blue.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@algrith/transcriber">
    <img alt="npm downloads/month" src="https://img.shields.io/npm/dm/@algrith/transcriber" />
  </a>
</p>

## Features

The Algrith Transcriber (npm package) supports:

- 🎵&nbsp;Wide range of audio files - mp3, wav, aac, etc.
- 🎙️&nbsp;Speech-to-text(STT) transcription.
- 🤖&nbsp;Supports Google STT engine.

## Quick start

```
npm install @algrith/transcriber
```

or via yarn

```
yarn add @algrith/transcriber
```

##  Usage & Examples

Currently, there is an implemented usage for [NextJs (Using page router) example](https://github.com/algrith/transcriber/tree/main/examples/with-nextjs).

**Note:** Currently, we only support Google STT engine.

```
import useTranscriber from '@algrith/transcriber';

const apiKey = // Your Google API key;
const options = {
  engine: 'google'  //  Currently only Google engine is supported.
}

const { transcribe, response } = useTranscriber(apiKey, options);

export default Transcriber;
```

##  TypeScript Support

Types can be found at https://github.com/algrith/transcriber/tree/main/src/types.

## Contributing

- Missing something or found a bug? [Report here](https://github.com/algrith/transcriber/issues).