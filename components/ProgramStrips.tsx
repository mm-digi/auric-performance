"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const programmes = [
  { href: "/programmes#outrun", title: "OUTRUN", copy: "Improve running performance while maintaining strength, muscle and athleticism.", video: "/videos/run.mp4" },
  { href: "/programmes#outlift", title: "OUTLIFT", copy: "Build strength without losing your engine, fitness or athleticism.", video: "/videos/alex-bar.mp4" },
  { href: "/programmes#outperform", title: "OUTPERFORM", copy: "Build strength and maximise running performance.", video: "/videos/box.mp4" },
  { href: "/programmes#complete-package", title: "THE COMPLETE PACKAGE", copy: "Access OUTRUN, OUTLIFT and OUTPERFORM with unlimited programme changes.", video: "/videos/coaches.mp4" },
  { href: "/programmes#auric-sub60", title: "AURIC SUB60", copy: "Stronger, faster and more capable in 60 minutes or less.", video: "/videos/alex-row.mp4" },
];

export default function ProgramStrips() {
  const storyRef = useRef<HTMLElement>(null); const videoRefs = useRef<Array<HTMLVideoElement | null>>([]); const [index, setIndex] = useState(0);
  useEffect(() => { const story = storyRef.current; if (!story) return; const updateStory = () => { const rect = story.getBoundingClientRect(); const available = story.offsetHeight - window.innerHeight; const progress = Math.max(0, Math.min(0.999, -rect.top / available)); setIndex(Math.min(programmes.length - 1, Math.floor(progress * programmes.length))); }; window.addEventListener("scroll", updateStory, { passive: true }); updateStory(); return () => window.removeEventListener("scroll", updateStory); }, []);
  useEffect(() => { videoRefs.current.forEach((video, i) => { if (!video) return; if (i === index) video.play().catch(() => {}); else video.pause(); }); }, [index]);
  const current = programmes[index]; const step = String(index + 1).padStart(2, "0");
  return <><div className="wrap program-strips-intro"><div className="kicker">Programmes</div><h2 className="display">OUTRUN:OUTLIFT:OUTPERFORM</h2><p>Choose the programme that matches your goal, then get on with the&nbsp;work.</p></div><section className="program-story" ref={storyRef}><div className="program-story-sticky"><div className="program-story-bg">{programmes.map((programme, i) => <video key={programme.video} ref={(node) => { videoRefs.current[i] = node; }} className={i === index ? "is-active" : ""} src={programme.video} muted loop playsInline preload="metadata" />)}</div><div className="wrap program-story-inner"><div className="kicker">Programmes {step} / 05</div><div className="program-story-text">{programmes.map((programme, i) => <h2 key={programme.title} className={i === index ? "is-active" : ""}>{programme.title}</h2>)}<div className="program-story-number" aria-hidden="true">{step}</div>{programmes.map((programme, i) => <p key={programme.copy} className={i === index ? "is-active" : ""}>{programme.copy}</p>)}</div><Link href={current.href} className="program-strip-link">Explore {current.title} →</Link></div></div></section></>;
}
