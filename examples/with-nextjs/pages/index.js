'use client';

import Head from 'next/head';

import Transcriber from '../components/transcriber';

const Index = () => {
	return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, minimum-scale=1, initial-scale=1'
        />
        <title> Home | Algrith Speech Transcriber</title>
      </Head>

      <main>
        <Transcriber />
      </main>
    </>
  );
};

export default Index;