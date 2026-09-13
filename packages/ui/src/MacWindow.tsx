import React from 'react';
import { cn } from './utils';

export interface MacWindowProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  caption?: string;
  tintHeader?: string; // e.g. "rgba(52, 199, 89, 0.2)"
  isTransparent?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onZoom?: () => void;
  children: React.ReactNode;
}

export const MacWindow: React.FC<MacWindowProps> = ({
  title,
  caption,
  tintHeader,
  isTransparent = false,
  className,
  children,
  onClose,
  onMinimize,
  onZoom,
  ...props
}) => {
  return (
    <div className={cn('flex flex-col select-none group', className)} {...props}>
      <div
        className={cn(
          'rounded-[14px] overflow-hidden border border-black/10 bg-white shadow-retro-window transition-all duration-300 hover:shadow-retro-window-hover',
          isTransparent && 'bg-white/80 backdrop-blur-md'
        )}
      >
        {/* Title bar */}
        <div
          className="h-9 px-3 flex items-center justify-between border-b border-black/[0.08] relative"
          style={
            tintHeader
              ? {
                  backgroundImage: `linear-gradient(90deg, ${tintHeader}, ${tintHeader}), linear-gradient(90deg, #d6d5d7 0%, #f0f0f0 50%, #d6d5d7 100%)`,
                }
              : {
                  background: 'linear-gradient(180deg, #FAFAFA 0%, #EBEBEB 100%)',
                }
          }
        >
          {/* Traffic light dots */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition-opacity flex items-center justify-center cursor-pointer shadow-sm"
              aria-label="Close"
            />
            <button
              type="button"
              onClick={onMinimize}
              className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:opacity-80 transition-opacity flex items-center justify-center cursor-pointer shadow-sm"
              aria-label="Minimize"
            />
            <button
              type="button"
              onClick={onZoom}
              className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:opacity-80 transition-opacity flex items-center justify-center cursor-pointer shadow-sm"
              aria-label="Zoom"
            />
          </div>

          {/* Centered title if present */}
          {title && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-medium text-[#4B4B4B] tracking-tight">
              {title}
            </div>
          )}

          {/* Right spacer or icon */}
          <div className="w-10 flex justify-end items-center opacity-30 hover:opacity-70 transition-opacity">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M9 1L1 9" stroke="#333" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Content canvas */}
        <div className="relative overflow-hidden">{children}</div>
      </div>

      {/* Optional window caption tag beneath (HeyClicky signature style e.g. "heyclicky-draw.mov") */}
      {caption && (
        <div className="mt-1.5 text-center text-[11px] font-mono tracking-tight text-[#7A7A7A] opacity-90">
          {caption}
        </div>
      )}
    </div>
  );
};
