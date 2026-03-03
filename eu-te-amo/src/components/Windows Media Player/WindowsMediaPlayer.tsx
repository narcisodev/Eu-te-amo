import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./styles.module.css";

interface WindowsMediaPlayerProps {
  src: string;
  title: string;
  subtitle?: string;
  onPlayingChange?: (playing: boolean) => void;
}

const WindowsMediaPlayer = ({
  src,
  title,
  subtitle,
  onPlayingChange,
}: WindowsMediaPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dragValue, setDragValue] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const lastUpdate = useRef(0);

  const formatTime = useCallback((time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 1000);

    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || isDragging) return;

    const now = performance.now();

    if (now - lastUpdate.current > 50) {
      const current = video.currentTime;
      setDisplayTime(current);
      setProgress((current / video.duration) * 100);
      lastUpdate.current = now;
    }
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const value = Number(e.target.value);
    const newTime = (value / 100) * video.duration;

    setDragValue(value);
    setDisplayTime(newTime);
  };

  const applySeek = () => {
    const video = videoRef.current;
    if (!video || !video.duration || dragValue === null) return;

    const newTime = (dragValue / 100) * video.duration;
    video.currentTime = newTime;

    setProgress(dragValue);
    setDragValue(null);
    setIsDragging(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          className={styles.videoElement}
          src={src}
          autoPlay
          playsInline
          onPlay={() => {
            setIsPlaying(true);
            onPlayingChange?.(true);
          }}
          onPause={() => {
            setIsPlaying(false);
            onPlayingChange?.(false);
          }}
          onEnded={() => {
            setIsPlaying(false);
            onPlayingChange?.(false);
          }}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onTimeUpdate={handleTimeUpdate}
          onClick={togglePlay}
        >
          {subtitle && (
            <track
              src={subtitle}
              kind="subtitles"
              srcLang="pt"
              label="Português"
              default
            />
          )}
        </video>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.playPauseBtn}
          onClick={togglePlay}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>

        <div className={styles.progressContainer}>
          <input
            type="range"
            className={styles.seekBar}
            value={dragValue ?? progress}
            min="0"
            max="100"
            step="0.1"
            onChange={handleSeekChange}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={applySeek}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={applySeek}
          />

          <div className={styles.progressBarBg}>
            <div
              className={styles.progressFill}
              style={{
                width: `${dragValue ?? progress}%`,
              }}
            />
          </div>
        </div>

        <div className={styles.timeCounter}>
          {formatTime(displayTime)} / {formatTime(duration)}
        </div>

        <div className={styles.songTitleContainer}>
          <span className={styles.songTitle}>{title}</span>
        </div>
      </div>
    </div>
  );
};

export default WindowsMediaPlayer;
