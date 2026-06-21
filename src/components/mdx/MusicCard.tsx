import { Loader2, Pause, Play } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

import { cn } from "../../lib/utils";

export interface MDXMusicCardProps {
  id?: string;
  title?: string;
  artist?: string;
  cover?: string;
  audioUrl?: string;
  autoPlay?: boolean;
  className?: string;
}

interface MusicInfo {
  id: number;
  title: string;
  artist: string;
  cover: string;
  album?: string;
  playUrl: string;
}

const DEFAULT_COLOR = "#111111";
const COLOR_QUANTIZATION = 16;
const CANVAS_MAX_SIZE = 200;
const IMAGE_LOAD_TIMEOUT = 5000;

async function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(DEFAULT_COLOR);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    const handleLoad = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(DEFAULT_COLOR);
          return;
        }

        const scale = Math.min(
          CANVAS_MAX_SIZE / img.width,
          CANVAS_MAX_SIZE / img.height,
          1,
        );
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const margin = Math.floor(Math.min(canvas.width, canvas.height) * 0.1);
        const imageData = ctx.getImageData(
          margin,
          margin,
          canvas.width - margin * 2,
          canvas.height - margin * 2,
        );
        const data = imageData.data;

        const colorMap = new Map<string, number>();
        let maxCount = 0;
        let dominantRgb = { r: 17, g: 17, b: 17 };

        for (let i = 0; i < data.length; i += COLOR_QUANTIZATION) {
          const r = Math.floor(data[i] / 16) * 16;
          const g = Math.floor(data[i + 1] / 16) * 16;
          const b = Math.floor(data[i + 2] / 16) * 16;
          const key = `${r},${g},${b}`;

          const count = (colorMap.get(key) || 0) + 1;
          colorMap.set(key, count);

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          const brightness = (r + g + b) / 3;

          if (
            count > maxCount &&
            saturation > 0.2 &&
            brightness > 30 &&
            brightness < 200
          ) {
            maxCount = count;
            dominantRgb = { r, g, b };
          }
        }

        if (maxCount === 0) {
          let r = 0,
            g = 0,
            b = 0,
            count = 0;
          for (let i = 0; i < data.length; i += COLOR_QUANTIZATION) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
          dominantRgb = {
            r: Math.floor(r / count),
            g: Math.floor(g / count),
            b: Math.floor(b / count),
          };
        }

        const toHex = (n: number) => n.toString(16).padStart(2, "0");
        resolve(
          `#${toHex(dominantRgb.r)}${toHex(dominantRgb.g)}${toHex(dominantRgb.b)}`,
        );
      } catch {
        resolve(DEFAULT_COLOR);
      }
    };

    const handleError = () => {
      clearTimeout(timeout);
      resolve(DEFAULT_COLOR);
    };

    const timeout = setTimeout(() => {
      if (!img.complete) {
        resolve(DEFAULT_COLOR);
      }
    }, IMAGE_LOAD_TIMEOUT);

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = imageUrl;
  });
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export default function MusicCard({
  id,
  title: propTitle,
  artist: propArtist,
  cover: propCover,
  audioUrl,
  autoPlay = false,
  className,
}: MDXMusicCardProps) {
  const [musicInfo, setMusicInfo] = useState<MusicInfo | null>(null);
  const [dominantColor, setDominantColor] = useState<string>(DEFAULT_COLOR);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const autoplayAttemptedRef = useRef(false);

  useEffect(() => {
    const fetchMusicInfo = async () => {
      if (!id) {
        if (propTitle && propArtist && propCover) {
          setMusicInfo({
            id: 0,
            title: propTitle,
            artist: propArtist,
            cover: propCover,
            playUrl: audioUrl || "",
          });
          setIsLoading(false);
        } else {
          setError("请提供音乐 ID 或完整的歌曲信息");
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/music/${id}`);

        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(errorData.error || "获取歌曲信息失败");
        }

        const data: MusicInfo = await response.json();
        setMusicInfo(data);
      } catch (err) {
        console.error("Failed to fetch music info:", err);
        setError(err instanceof Error ? err.message : "获取歌曲信息失败");

        if (propTitle && propArtist && propCover) {
          setMusicInfo({
            id: parseInt(id, 10),
            title: propTitle,
            artist: propArtist,
            cover: propCover,
            playUrl:
              audioUrl ||
              `https://music.163.com/song/media/outer/url?id=${id}.mp3`,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusicInfo();
  }, [id, propTitle, propArtist, propCover, audioUrl]);

  useEffect(() => {
    if (musicInfo?.cover) {
      extractDominantColor(musicInfo.cover).then(setDominantColor);
    }
  }, [musicInfo?.cover]);

  const handleAudioLoadedData = useCallback(() => {
    setAudioReady(true);
  }, []);

  const attemptAutoplay = useCallback(() => {
    if (autoplayAttemptedRef.current || autoplayBlocked) return;
    if (!audioRef.current || !autoPlay) return;

    const audio = audioRef.current;

    if (audio.readyState >= 2) {
      autoplayAttemptedRef.current = true;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setAutoplayBlocked(false);
          })
          .catch((error) => {
            console.warn("Autoplay was blocked by browser:", error);
            setAutoplayBlocked(true);
          });
      }
    }
  }, [autoPlay, autoplayBlocked]);

  useEffect(() => {
    if (audioReady && autoPlay && musicInfo?.playUrl && !isLoading) {
      attemptAutoplay();
    }
  }, [audioReady, autoPlay, musicInfo?.playUrl, isLoading, attemptAutoplay]);

  useEffect(() => {
    if (musicInfo?.playUrl) {
      setAudioReady(false);
      setAutoplayBlocked(false);
      autoplayAttemptedRef.current = false;
    }
  }, [musicInfo?.playUrl]);

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || !musicInfo?.playUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, musicInfo?.playUrl]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "my-6 flex items-center justify-center rounded-lg border border-border bg-muted/30 p-6",
          className,
        )}
      >
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-xs text-muted-foreground">
          正在加载音乐...
        </span>
      </div>
    );
  }

  if (error || !musicInfo) {
    return (
      <div
        className={cn(
          "my-6 rounded-lg border border-red-200/50 bg-red-50/10 p-4",
          className,
        )}
      >
        <p className="text-xs text-red-500">{error || "无法加载歌曲信息"}</p>
      </div>
    );
  }

  const rgb = hexToRgb(dominantColor);
  const bgColor = rgb
    ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.04)`
    : "rgba(17, 17, 17, 0.04)";
  const borderColor = rgb
    ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`
    : "rgba(17, 17, 17, 0.12)";

  return (
    <div
      className={cn(
        "relative my-6 overflow-hidden rounded-lg border px-4 transition-all duration-300",
        className,
      )}
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-900 border border-border">
          <img
            src={musicInfo.cover}
            alt={`${musicInfo.title} - ${musicInfo.artist}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="truncate text-base font-medium text-foreground">
            {musicInfo.title}
          </h3>
          <p className="truncate text-xs text-muted-foreground font-light">
            {musicInfo.artist}
          </p>
        </div>

        {musicInfo.playUrl && (
          <button
            onClick={handlePlayPause}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 text-foreground bg-background border border-border shadow-xs cursor-pointer"
            aria-label={isPlaying ? "暂停" : "播放"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 ml-0.5 fill-current" />
            )}
          </button>
        )}
      </div>

      {musicInfo.playUrl && (
        <audio
          ref={audioRef}
          src={musicInfo.playUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onLoadedData={handleAudioLoadedData}
          onCanPlay={() => setAudioReady(true)}
          preload="none"
          className="hidden"
        />
      )}
    </div>
  );
}
