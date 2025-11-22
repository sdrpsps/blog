"use client";

import Image from "next/image";
import { Loader2, Pause, Play } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

import { cn } from "@/lib/utils";

export interface MDXMusicCardProps {
  /** 音乐 ID（网易云音乐），如果提供则会自动获取歌曲信息 */
  id?: string;
  /** 歌名（如果提供了 id，则此参数可选） */
  title?: string;
  /** 歌手（如果提供了 id，则此参数可选） */
  artist?: string;
  /** 专辑封面图片 URL（如果提供了 id，则此参数可选） */
  cover?: string;
  /** 音乐播放链接（可选，如果不提供则使用网易云音乐 ID） */
  audioUrl?: string;
  /** 是否自动播放 */
  autoPlay?: boolean;
  /** 自定义类名 */
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

const DEFAULT_COLOR = "#6366f1";
const COLOR_QUANTIZATION = 16;
const CANVAS_MAX_SIZE = 200;
const IMAGE_LOAD_TIMEOUT = 5000;

/**
 * 从图片 URL 提取主色调
 * 使用更智能的算法：采样多个区域并选择最饱和的颜色
 */
async function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
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

        // 限制 canvas 大小以提高性能
        const scale = Math.min(
          CANVAS_MAX_SIZE / img.width,
          CANVAS_MAX_SIZE / img.height,
          1
        );
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 采样整个图片，但跳过边缘区域
        const margin = Math.floor(Math.min(canvas.width, canvas.height) * 0.1);
        const imageData = ctx.getImageData(
          margin,
          margin,
          canvas.width - margin * 2,
          canvas.height - margin * 2
        );
        const data = imageData.data;

        // 使用颜色直方图方法，选择最饱和且亮度适中的颜色
        const colorMap = new Map<string, number>();
        let maxCount = 0;
        let dominantRgb = { r: 99, g: 102, b: 241 }; // 默认颜色

        // 将颜色量化以减少计算量
        for (let i = 0; i < data.length; i += COLOR_QUANTIZATION) {
          const r = Math.floor(data[i] / 16) * 16;
          const g = Math.floor(data[i + 1] / 16) * 16;
          const b = Math.floor(data[i + 2] / 16) * 16;
          const key = `${r},${g},${b}`;

          const count = (colorMap.get(key) || 0) + 1;
          colorMap.set(key, count);

          // 计算饱和度
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          const brightness = (r + g + b) / 3;

          // 选择饱和度较高且亮度适中的颜色
          if (
            count > maxCount &&
            saturation > 0.2 &&
            brightness > 30 &&
            brightness < 220
          ) {
            maxCount = count;
            dominantRgb = { r, g, b };
          }
        }

        // 如果没找到合适的颜色，使用平均值
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

        // 转换为十六进制
        const toHex = (n: number) => n.toString(16).padStart(2, "0");
        const hex = `#${toHex(dominantRgb.r)}${toHex(dominantRgb.g)}${toHex(dominantRgb.b)}`;

        resolve(hex);
      } catch {
        resolve(DEFAULT_COLOR);
      }
    };

    const handleError = () => {
      clearTimeout(timeout);
      resolve(DEFAULT_COLOR);
    };

    // 设置超时，避免长时间等待
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

/**
 * 将十六进制颜色转换为 RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null;
}

export function MDXMusicCard({
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

  // 根据 ID 获取歌曲信息
  useEffect(() => {
    const fetchMusicInfo = async () => {
      if (!id) {
        // 如果没有 ID，使用传入的 props
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
          setError("请提供音乐 ID 或完整的歌曲信息（标题、歌手、封面）");
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
        
        // 如果获取失败，尝试使用传入的 props 作为后备
        if (propTitle && propArtist && propCover) {
          setMusicInfo({
            id: Number.parseInt(id, 10),
            title: propTitle,
            artist: propArtist,
            cover: propCover,
            playUrl: audioUrl || `https://music.163.com/song/media/outer/url?id=${id}.mp3`,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusicInfo();
  }, [id, propTitle, propArtist, propCover, audioUrl]);

  // 提取主色调
  useEffect(() => {
    if (musicInfo?.cover) {
      extractDominantColor(musicInfo.cover).then(setDominantColor);
    }
  }, [musicInfo?.cover]);

  // 处理音频加载完成
  const handleAudioLoadedData = useCallback(() => {
    setAudioReady(true);
  }, []);

  // 尝试自动播放
  const attemptAutoplay = useCallback(() => {
    // 如果已经尝试过或已经被阻止，不再尝试
    if (autoplayAttemptedRef.current || autoplayBlocked) return;
    if (!audioRef.current || !autoPlay) return;

    const audio = audioRef.current;
    
    // 如果音频已经准备好，直接播放
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
            // 浏览器阻止了自动播放（这是正常行为）
            console.warn("Autoplay was blocked by browser:", error);
            setAutoplayBlocked(true);
          });
      }
    }
  }, [autoPlay, autoplayBlocked]);

  // 当音频准备好时尝试自动播放
  useEffect(() => {
    if (audioReady && autoPlay && musicInfo?.playUrl && !isLoading) {
      attemptAutoplay();
    }
  }, [audioReady, autoPlay, musicInfo?.playUrl, isLoading, attemptAutoplay]);

  // 当 playUrl 变化时，重置 audioReady 状态
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

  // 如果没有音乐信息，显示加载或错误状态
  if (isLoading) {
    return (
      <div
        className={cn(
          "my-8 flex items-center justify-center rounded-xl border-2 border-border/50 bg-muted/30 p-8",
          className
        )}
      >
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-3 text-sm text-muted-foreground">加载中...</span>
      </div>
    );
  }

  if (error || !musicInfo) {
    return (
      <div
        className={cn(
          "my-8 rounded-xl border-2 border-destructive/50 bg-destructive/10 p-6",
          className
        )}
      >
        <p className="text-sm text-destructive">
          {error || "无法加载歌曲信息"}
        </p>
      </div>
    );
  }

  const rgb = hexToRgb(dominantColor);
  const bgColor = rgb
    ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`
    : "rgba(99, 102, 241, 0.15)";
  const borderColor = rgb
    ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`
    : "rgba(99, 102, 241, 0.3)";

  return (
    <div
      className={cn(
        "group relative my-8 overflow-hidden rounded-xl border-2 p-6 transition-all duration-300",
        "hover:shadow-lg",
        className
      )}
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      <div className="flex items-center gap-4">
        {/* 专辑封面 */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg shadow-md">
          <Image
            src={musicInfo.cover}
            alt={`${musicInfo.title} - ${musicInfo.artist}`}
            width={80}
            height={80}
            className="h-full w-full object-cover"
            unoptimized
          />
        </div>

        {/* 音乐信息 */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3
            className={cn(
              "truncate text-lg font-semibold text-foreground",
              "group-hover:opacity-90 transition-opacity"
            )}
          >
            {musicInfo.title}
          </h3>
          <p
            className={cn(
              "truncate text-sm text-muted-foreground",
              "opacity-80 group-hover:opacity-100 transition-opacity"
            )}
          >
            {musicInfo.artist}
          </p>
        </div>

        {/* 播放按钮 */}
        {musicInfo.playUrl && (
          <button
            onClick={handlePlayPause}
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all duration-200",
              "hover:scale-110 active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "text-foreground bg-background/50 hover:bg-background/70 backdrop-blur-sm"
            )}
            aria-label={isPlaying ? "暂停" : "播放"}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </button>
        )}
      </div>

      {/* 音频元素 */}
      {musicInfo.playUrl && (
        <audio
          ref={audioRef}
          src={musicInfo.playUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onLoadedData={handleAudioLoadedData}
          onCanPlay={() => setAudioReady(true)}
          preload="auto"
          className="hidden"
        />
      )}

      {/* 自动播放被阻止的提示 */}
      {autoplayBlocked && autoPlay && (
        <div className="mt-2 text-xs text-center text-muted-foreground opacity-70">
          自动播放被浏览器阻止，请点击播放按钮
        </div>
      )}

      {/* 渐变背景装饰 */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-20 blur-3xl"
        style={{
          backgroundColor: dominantColor,
        }}
      />
    </div>
  );
}

