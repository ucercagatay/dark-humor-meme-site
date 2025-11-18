'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Heart, Share2, AlertTriangle } from 'lucide-react';
import memesData from '@/data/memes.json';

type Meme = {
  id: number;
  type: 'text' | 'image' | 'video';
  content: string;
  url?: string;
  rating: number;
};

export default function Home() {
  const [currentMeme, setCurrentMeme] = useState<Meme | null>(null);
  const [liked, setLiked] = useState(false);
  const [cringeLevel, setCringeLevel] = useState(0);
  const [remainingIndices, setRemainingIndices] = useState<number[]>([]);

  const getRandomMeme = () => {
    const memes = memesData.memes as Meme[];
    
    // Eğer kalan index yoksa, tüm indexleri yeniden doldur
    let indices = remainingIndices;
    if (indices.length === 0) {
      indices = Array.from({ length: memes.length }, (_, i) => i);
    }
    
    // Random bir index seç
    const randomIndexPosition = Math.floor(Math.random() * indices.length);
    const selectedIndex = indices[randomIndexPosition];
    
    // Seçilen index'i listeden çıkar
    const newIndices = indices.filter((_, i) => i !== randomIndexPosition);
    setRemainingIndices(newIndices);
    
    // Meme'i göster
    setCurrentMeme(memes[selectedIndex]);
    setLiked(false);
    setCringeLevel(Math.floor(Math.random() * 10) + 1);
  };

  useEffect(() => {
    getRandomMeme();
  }, []);

  useEffect(() => {
    // TikTok embed script'ini yükle
    if (currentMeme?.type === 'video' && currentMeme?.url?.includes('tiktok')) {
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [currentMeme]);

  const handleShare = () => {
    if (navigator.share && currentMeme) {
      navigator.share({
        title: 'Dark Humor',
        text: currentMeme.type === 'text' ? currentMeme.content : 'Check out this dark meme!',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-red-900 text-white">
      {/* Header */}
      <header className="p-6 text-center">
        <motion.h1 
          className="text-6xl font-black mb-2 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          💀 DARK HUMOR 💀
        </motion.h1>
        <motion.p 
          className="text-gray-400 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Laugh at your own risk
        </motion.p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <AnimatePresence mode="wait">
          {currentMeme && (
            <motion.div
              key={currentMeme.id}
              initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Cringe Meter */}
              <div className="absolute -top-12 right-0 flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-bold">Cringe Level: {cringeLevel}/10</span>
              </div>

              {/* Meme Card */}
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 shadow-2xl border-2 border-purple-500/30 min-h-[400px] flex items-center justify-center">
                {currentMeme.type === 'text' && (
                  <p className="text-3xl font-bold text-center leading-relaxed">
                    {currentMeme.content}
                  </p>
                )}
                
                {currentMeme.type === 'image' && currentMeme.url && (
                  <img 
                    src={currentMeme.url} 
                    alt="Dark meme" 
                    className="max-w-full rounded-xl"
                  />
                )}
                
                {currentMeme.type === 'video' && currentMeme.url && (
                  <div className="w-full flex justify-center">
                    {currentMeme.url.includes('tiktok') ? (
                      <blockquote 
                        className="tiktok-embed" 
                        cite={currentMeme.url}
                        data-video-id={currentMeme.url.split('/video/')[1]?.split('?')[0]}
                        style={{ maxWidth: '605px', minWidth: '325px' }}
                      >
                        <section>
                          <a 
                            href={currentMeme.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 text-lg"
                          >
                            TikTok'ta İzle
                          </a>
                        </section>
                      </blockquote>
                    ) : currentMeme.url.includes('youtube.com/shorts') ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${currentMeme.url.split('/shorts/')[1]?.split('?')[0]}`}
                        className="w-full rounded-xl"
                        style={{ aspectRatio: '9/16', maxHeight: '600px' }}
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    ) : (
                      <iframe
                        src={currentMeme.url}
                        className="w-full aspect-video rounded-xl max-w-2xl"
                        allowFullScreen
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setLiked(!liked)}
                  className={`p-6 rounded-full ${
                    liked ? 'bg-red-500' : 'bg-gray-800'
                  } transition-colors`}
                >
                  <Heart className={`w-8 h-8 ${liked ? 'fill-white' : ''}`} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={getRandomMeme}
                  className="p-6 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  <RefreshCw className="w-8 h-8" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-6 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <Share2 className="w-8 h-8" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-500">
            You've seen <span className="text-purple-400 font-bold">∞</span> cursed memes today
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-4 right-4">
        <a 
          href="/admin" 
          className="px-4 py-2 bg-black/50 hover:bg-black/70 rounded-full text-sm backdrop-blur-sm transition-colors"
        >
          + Add Meme
        </a>
      </footer>
    </div>
  );
}
