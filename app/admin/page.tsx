'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [type, setType] = useState<'text' | 'image' | 'video'>('text');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // JSON'a ekle (şimdilik console'da göster)
    const newMeme = {
      id: Date.now(),
      type,
      content,
      url: url || undefined,
      rating: Math.floor(Math.random() * 10) + 1
    };
    
    console.log('New meme to add:', newMeme);
    alert('Meme eklendi! (Console\'u kontrol et - gerçek implementasyonda JSON\'a yazılacak)');
    
    // Form temizle
    setContent('');
    setUrl('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-red-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-gray-800 rounded-full"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
          </Link>
          <h1 className="text-4xl font-black">Admin Panel</h1>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Meme Type</label>
              <div className="flex gap-4">
                {(['text', 'image', 'video'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                      type === t
                        ? 'bg-purple-600 scale-105'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {type === 'text' ? 'Joke Text' : 'Description'}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={type === 'text' ? 6 : 3}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none resize-none"
                placeholder={
                  type === 'text'
                    ? 'Enter your dark joke here...'
                    : 'Enter description...'
                }
              />
            </div>

            {/* URL (for image/video) */}
            {type !== 'text' && (
              <div>
                <label className="block text-sm font-medium mb-2">URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:border-purple-500 focus:outline-none"
                  placeholder={
                    type === 'image'
                      ? 'https://imgur.com/...'
                      : 'https://youtube.com/embed/...'
                  }
                />
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Meme
            </motion.button>
          </form>
        </motion.div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <h3 className="font-bold mb-2 text-yellow-400">📝 Not:</h3>
          <p className="text-sm text-gray-400">
            Şu anda yeni meme'ler console'a yazdırılıyor. Gerçek implementasyonda bu
            data/memes.json dosyasına yazılacak. Bunun için bir backend API endpoint'i
            veya file system erişimi gerekiyor.
          </p>
        </div>
      </div>
    </div>
  );
}

