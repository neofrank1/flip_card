'use client'
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  CardFlip,
  CardFlipFront,
  CardFlipBack,
  CardFlipContent,
  useCardFlip
} from "@/components/ui/card-flip";
import { ComicText } from '@/components/ui/comic-text';

function ComicTextBubble() {
  return (
    <motion.div
      className="absolute -top-40 left-1/2 transform -translate-x-1/2 z-50 whitespace-nowrap"
      initial={{ opacity: 0, x: -200 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        y: [0, -10, 0]
      }}
      transition={{
        opacity: { duration: 0.6 },
        x: { duration: 0.8, ease: "easeOut" },
        y: {
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }}
    >
      <ComicText fontSize={4}>putang ina mo!</ComicText>
    </motion.div>
  );
}

function VideoEmbed({ onShowComic, onHideComic }: { onShowComic: () => void; onHideComic: () => void }) {
  const { isFlipped } = useCardFlip();
  const [iframeKey, setIframeKey] = useState(0);
  const baseUrl = "https://www.youtube.com/embed/X5cOk0U_f1g";

  useEffect(() => {
    if (isFlipped) {
      // Force fresh iframe load when flipped to back
      // This ensures clean state and stops previous playback
      setIframeKey(Date.now());
      
      // Show comic text when card flips
      // Add a small delay to let the flip animation complete
      const timer = setTimeout(() => {
        onShowComic();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // Hide comic text when flipped back to front
      onHideComic();
    }
  }, [isFlipped, onShowComic, onHideComic]);

  // Only render iframe when flipped - unmounting stops playback
  if (!isFlipped) {
    return null;
  }

  // Load iframe with autoplay when flipped to back
  // autoplay=1 and mute=1 are required for autoplay to work in most browsers
  const iframeSrc = `${baseUrl}?si=6DuondIInGOjWVel&controls=0&start=44&autoplay=1&mute=0`;

  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe 
          key={`youtube-${iframeKey}`}
          data-testid="embed-iframe" 
          className="absolute top-0 left-0 w-full h-full rounded-xl"
          src={iframeSrc}
          title="YouTube video player"
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [showComicText, setShowComicText] = useState(false);

  const handleShowComic = useCallback(() => {
    setShowComicText(true);
  }, []);

  const handleHideComic = useCallback(() => {
    setShowComicText(false);
  }, []);


  return (
    <div className="flex justify-center items-center min-h-[70vh] w-full p-4">
      <div className="relative w-full max-w-md">
        {showComicText && <ComicTextBubble />}
        <CardFlip className="w-full mx-auto">
          <CardFlipFront>
            <CardFlipContent>
              <p className="text-center text-2xl font-bold">Click the card to flip</p>
            </CardFlipContent>
          </CardFlipFront>
        
          <CardFlipBack>
            <CardFlipContent>
              <VideoEmbed 
                onShowComic={handleShowComic} 
                onHideComic={handleHideComic}
              />
            </CardFlipContent>
          </CardFlipBack>
        </CardFlip>
      </div>
    </div>
  );
}
