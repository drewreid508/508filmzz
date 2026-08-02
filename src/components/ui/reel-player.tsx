"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { getMedia, atLeast } from "@/lib/media";
import { cn } from "@/lib/utils";

function timecode(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Inline vertical reel player — plays in place so visitors never leave the page.
 *
 * The video element carries no `controls`; a custom overlay keeps the chrome on
 * brand. Nothing is fetched until the player scrolls into view.
 */
export function ReelPlayer({
  src,
  poster,
  title,
  className,
}: {
  src: string;
  poster: string;
  title: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  const posterAsset = getMedia(poster);

  // Only load the file once it's near the viewport.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pause when scrolled away — audio following you down the page is hostile.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) videoRef.current?.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  const scrub = (event: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const next = (Number(event.target.value) / 100) * duration;
    video.currentTime = next;
    setProgress(Number(event.target.value));
  };

  return (
    <div
      ref={wrapRef}
      className={cn("relative mx-auto w-full max-w-[380px]", className)}
    >
      <div
        className="group relative overflow-hidden bg-ink-2"
        style={{ aspectRatio: 9 / 16 }}
      >
        <video
          ref={videoRef}
          src={armed ? src : undefined}
          // The player is max-380px wide; 720 covers it at 2x DPR. The 900px
          // rendition was eagerly fetched below the fold and competed with LCP.
          poster={atLeast(posterAsset, 720).webp}
          muted={muted}
          playsInline
          preload="none"
          aria-label={title}
          className="h-full w-full object-cover"
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            setCurrent(v.currentTime);
            if (v.duration) setProgress((v.currentTime / v.duration) * 100);
          }}
          onEnded={() => {
            setPlaying(false);
            setProgress(0);
          }}
        />

        {/* Centre play affordance — only while paused */}
        {!playing && (
          <button
            type="button"
            onClick={toggle}
            aria-label={`Play ${title}`}
            className="absolute inset-0 flex items-center justify-center bg-ink/25 transition-colors duration-500 hover:bg-ink/10"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-bone/70 bg-ink/35 backdrop-blur-sm transition-all duration-500 group-hover:border-accent group-hover:text-accent">
              <Play size={22} className="ml-1 fill-current" strokeWidth={0} aria-hidden="true" />
            </span>
          </button>
        )}

        {/* Controls */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-ink/90 to-transparent px-4 pt-10 pb-4 transition-opacity duration-500",
            playing ? "opacity-0 group-hover:opacity-100 focus-within:opacity-100" : "opacity-100"
          )}
        >
          <label className="sr-only" htmlFor={`scrub-${poster}`}>
            Seek through {title}
          </label>
          <input
            id={`scrub-${poster}`}
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={scrub}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/25 accent-accent"
            style={{
              background: `linear-gradient(to right, #1e90ff ${progress}%, rgba(255,255,255,0.22) ${progress}%)`,
            }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? "Pause" : "Play"}
                className="text-bone transition-colors duration-400 hover:text-accent"
              >
                {playing ? (
                  <Pause size={16} className="fill-current" strokeWidth={0} aria-hidden="true" />
                ) : (
                  <Play size={16} className="fill-current" strokeWidth={0} aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Unmute" : "Mute"}
                className="text-bone transition-colors duration-400 hover:text-accent"
              >
                {muted ? (
                  <VolumeX size={16} strokeWidth={1.6} aria-hidden="true" />
                ) : (
                  <Volume2 size={16} strokeWidth={1.6} aria-hidden="true" />
                )}
              </button>
              <span className="font-mono text-[0.66rem] tracking-wide text-bone/75 tabular-nums">
                {timecode(current)} / {timecode(duration)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => videoRef.current?.requestFullscreen?.()}
              aria-label="Full screen"
              className="text-bone transition-colors duration-400 hover:text-accent"
            >
              <Maximize2 size={15} strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Viewfinder brackets */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 -left-4 h-10 w-10 border-t border-l border-accent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -bottom-4 h-10 w-10 border-r border-b border-accent"
      />
    </div>
  );
}
