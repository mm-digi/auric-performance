type LoopVideoProps = {
  src: string;
  className?: string;
};

export default function LoopVideo({ src, className }: LoopVideoProps) {
  return (
    <video
      className={className}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}
