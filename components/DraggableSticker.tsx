'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { globalAudioStore } from '../lib/audioStore';

interface DraggableStickerProps {
  src: string;
  alt: string;
  soundSrc?: string;
  className?: string;
  imageClassName?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  badgeText?: string;
}

export const DraggableSticker: React.FC<DraggableStickerProps> = ({
  src,
  alt,
  soundSrc,
  className = '',
  imageClassName = 'w-14 h-14 object-contain drop-shadow-xl',
  containerRef,
  badgeText,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);

  const startSound = () => {
    if (!soundSrc) return;
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;

    if (!audioRef.current) {
      audioRef.current = new Audio(soundSrc);
      audioRef.current.loop = true;
    }
    audioRef.current.currentTime = 0;
    globalAudioStore.duckVolume();
    audioRef.current.play().catch(() => {});
  };

  const stopSound = () => {
    if (!soundSrc || !isPlayingRef.current) return;
    isPlayingRef.current = false;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    globalAudioStore.restoreVolume();
  };

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragElastic={0}
      whileHover={{ scale: 1.2, zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
      onPointerDown={startSound}
      onPointerUp={stopSound}
      onPointerCancel={stopSound}
      onDragStart={startSound}
      onDragEnd={stopSound}
      className={`cursor-grab active:cursor-grabbing z-20 ${className}`}
    >
      <div className="relative group">
        <img src={src} alt={alt} className={imageClassName} />
        {badgeText && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/80 text-white text-[9px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {badgeText}
          </div>
        )}
      </div>
    </motion.div>
  );
};
