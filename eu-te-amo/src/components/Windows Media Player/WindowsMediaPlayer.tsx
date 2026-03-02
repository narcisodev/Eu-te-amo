import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./styles.module.css";

interface WindowsMediaPlayerProps {
  src: string;
  title: string;
  subtitle?: string;
}

const WindowsMediaPlayer = ({
  src,
  title,
  subtitle,
}: WindowsMediaPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTimeDetailed = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);

    return (
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0") +
      "." +
      milliseconds.toString().padStart(3, "0")
    );
  };

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play().catch(() => setIsPlaying(true));
    }
  }, [src]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video && video.duration) {
      const newTime = (Number(e.target.value) / 100) * video.duration;
      video.currentTime = newTime;
      setProgress(Number(e.target.value));
    }
  };

  return (
    <div className={styles.container} ref={containerRef} tabIndex={0}>
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          className={styles.videoElement}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          autoPlay
          src={src}
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
          {isPlaying ? "| |" : "▶"}
        </button>

        <div className={styles.progressContainer}>
          <input
            type="range"
            className={styles.seekBar}
            value={progress}
            onChange={handleSeek}
            step="0.01"
            min="0"
            max="100"
          />
          <div className={styles.progressBarBg}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className={styles.timeCounter}>
          {formatTimeDetailed(currentTime)} / {formatTimeDetailed(duration)}
        </div>

        <div className={styles.songTitleContainer}>
          <span className={styles.songTitle}>{title}</span>
        </div>
      </div>
    </div>
  );
};

export default WindowsMediaPlayer;
