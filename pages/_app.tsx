import Head from "next/head";
import type { AppProps } from "next/app";
import "../src/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Voxly - AI Voice Synthesis</title>
        <meta name="description" content="Advanced AI-powered text-to-speech synthesis with 3D audio visualization" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
