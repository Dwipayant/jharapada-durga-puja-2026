import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, VolumeX, Disc } from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const { isAudioPlaying, toggleAudio, language } = useApp();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isRunningRef = useRef<boolean>(false);

  useEffect(() => {
    if (isAudioPlaying) {
      startAmbientAudio();
    } else {
      stopAmbientAudio();
    }

    return () => {
      stopAmbientAudio();
    };
  }, [isAudioPlaying]);

  const startAmbientAudio = () => {
    if (isRunningRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      isRunningRef.current = true;

      // Create ambient drone (Tanpura/Shankha tone)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(136.1, ctx.currentTime); // OM frequency (136.1Hz)
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(272.2, ctx.currentTime); // Harmonic

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      // Periodic gentle bell ring effect
      const bellInterval = setInterval(() => {
        if (!isRunningRef.current || !audioCtxRef.current) {
          clearInterval(bellInterval);
          return;
        }
        playTempleBell(audioCtxRef.current);
      }, 5000);

    } catch (err) {
      console.warn('Web Audio API initialized with ambient fallback', err);
    }
  };

  const playTempleBell = (ctx: AudioContext) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 Bell tone
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.5);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.1);
    } catch (e) {
      console.warn(e);
    }
  };

  const stopAmbientAudio = () => {
    isRunningRef.current = false;
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  return (
    <button
      onClick={toggleAudio}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-300 ${
        isAudioPlaying
          ? 'bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-black shadow-lg shadow-[#FFD700]/30 animate-pulse'
          : 'bg-[#1A0826]/80 text-[#FFFDD0] border border-[#D4AF37]/40 hover:bg-[#D4AF37]/20'
      }`}
      title="Toggle Temple Shankha & Bell Ambient Audio"
    >
      {isAudioPlaying ? (
        <>
          <Disc className="w-4 h-4 animate-spin text-black shrink-0" />
          <span className="whitespace-nowrap">{language === 'en' ? 'Stotram Audio ON' : 'ସ୍ତୋତ୍ରମ ଶ୍ରବଣ ଚାଲୁ'}</span>
          <Volume2 className="w-4 h-4 text-black shrink-0" />
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-[#FFD700] shrink-0" />
          <span className="whitespace-nowrap">{language === 'en' ? 'Festive Chants' : 'ସଙ୍ଗୀତ ଚାଲୁ କରନ୍ତୁ'}</span>
        </>
      )}
    </button>
  );
};
