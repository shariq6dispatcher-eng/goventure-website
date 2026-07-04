"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

/**
 * Full-width autoplaying video section, shown right after the Hero —
 * mirrors the video block on upsunday.co.
 *
 * Drop your video file at: public/videos/showreel.mp4
 * (and optionally a poster image at public/images/hero/hero-1.png,
 * already used below as a placeholder poster).
 */
export default function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <section className="relative bg-black py-6 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#D4AF37]/20 shadow-[0_0_60px_rgba(212,175,55,0.12)] aspect-[3/4] sm:aspect-video group"
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src="/videos/showreel.mp4"
            poster="/images/hero/hero-1.png"
            autoPlay
            loop
            muted
            playsInline
          />

          {/* Gradient overlay for control legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Controls */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between">
            <button
              onClick={togglePlay}
              aria-label={playing ? "Pause video" : "Play video"}
              className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 text-white hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
            >
              {playing ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute video" : "Mute video"}
              className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 text-white hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
            >
              {muted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
