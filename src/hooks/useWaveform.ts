// src/hooks/useWaveform.ts
import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

type WSRef = {
  instance: any | null;
};

export default function useWaveform(containerRef: React.RefObject<HTMLElement | null>) {
  const wsRef = useRef<WSRef>({ instance: null });

  useEffect(() => {
    // guard: only run in browser and if container exists
    if (!containerRef?.current) return;
    // if already created, return
    if (wsRef.current.instance) return;

    const ws = WaveSurfer.create({
      container: containerRef.current!,
      waveColor: "#8bd3ff",
      progressColor: "#2b7cff",
      cursorColor: "#ffffff",
      height: 60,
      responsive: true,
      normalize: true,
      interact: true,
      backend: "WebAudio",
    });

    wsRef.current.instance = ws;

    // optional basic event listeners
    ws.on("ready", () => {
      // console.log("Wave ready");
    });
    ws.on("error", (e: any) => {
      console.warn("WaveSurfer error", e);
    });

    return () => {
      try {
        ws.destroy();
      } catch (err) {
        // ignore
      }
      wsRef.current.instance = null;
    };
  }, [containerRef]);

  const load = (blobUrl: string) => {
    try {
      const ws = wsRef.current.instance;
      if (!ws) return;
      ws.load(blobUrl);
    } catch (err) {
      console.warn("wave load failed", err);
    }
  };

  const play = () => wsRef.current.instance?.play();
  const pause = () => wsRef.current.instance?.pause();
  const isPlaying = () => wsRef.current.instance?.isPlaying() || false;

  return { load, play, pause, isPlaying };
}
