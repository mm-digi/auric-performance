export default function HeroSlideshow() {
  return (
    <div className="hero-media">
      <video
        className="is-active"
        src="/videos/marine.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    </div>
  );
}
