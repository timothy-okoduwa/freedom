'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { globalAudioStore } from '../lib/audioStore';
import { useResizeKey } from '../hooks/useResizeKey';

interface DraggableStickerProps {
  src: string;
  alt: string;
  soundSrc?: string;
  className?: string;
  imageClassName?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  badgeText?: string;
  rotate?: number;
  hoverScale?: number;
}

function parseRotateFromClass(className: string): number {
  const bracketMatch = className.match(/rotate-\[(-?\d+)deg\]/);
  if (bracketMatch) {
    return parseInt(bracketMatch[1], 10);
  }
  const stdMatch = className.match(/(-?rotate-\d+)/);
  if (stdMatch) {
    const raw = stdMatch[1];
    if (raw.startsWith('-rotate-')) {
      return -parseInt(raw.replace('-rotate-', ''), 10);
    }
    if (raw.startsWith('rotate-')) {
      return parseInt(raw.replace('rotate-', ''), 10);
    }
  }
  return 0;
}

function cleanRotateClass(className: string): string {
  return className
    .replace(/rotate-\[(-?\d+)deg\]/g, '')
    .replace(/-?rotate-\d+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const DraggableSticker: React.FC<DraggableStickerProps> = ({
  src,
  alt,
  soundSrc,
  className = '',
  imageClassName = 'w-14 h-14 object-contain drop-shadow-xl',
  containerRef,
  badgeText,
  rotate,
  hoverScale = 1.2,
}) => {
  const resetKey = useResizeKey();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);

  const initialRotate = rotate !== undefined ? rotate : parseRotateFromClass(className);
  const cleanClass = cleanRotateClass(className);

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
      key={resetKey}
      drag
      dragConstraints={containerRef}
      dragElastic={0}
      dragMomentum={false}
      initial={{ rotate: initialRotate }}
      animate={{ rotate: initialRotate }}
      whileHover={{ scale: hoverScale, rotate: 0, zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
      onPointerDown={startSound}
      onPointerUp={stopSound}
      onPointerCancel={stopSound}
      onDragStart={startSound}
      onDragEnd={stopSound}
      style={{ touchAction: 'none' }}
      className={`cursor-grab active:cursor-grabbing z-20 ${cleanClass}`}
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
