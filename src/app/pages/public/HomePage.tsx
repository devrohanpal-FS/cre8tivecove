import { useState, useEffect, useRef } from "react";

import { Link, useNavigate } from "react-router";
import { ArrowRight, ArrowUpRight, Play, Check, Star } from "lucide-react";
import { Reveal } from "../../components/public/Reveal.js";
import { TextReveal } from "../../components/public/TextReveal.js";
import { Magnetic } from "../../components/public/Magnetic.js";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { api } from "../../api/client.js";
import * as Icons from "lucide-react";

// Helper to render lucide icon dynamically from DB string
function DynamicIcon({ name, size, className, style }: { name: string; size?: number; className?: string; style?: any }) {
  const IconComponent = (Icons as any)[name] || Icons.Film;
  return <IconComponent size={size} className={className} style={style} />;
}

// Fallback initial data in case API fails or is not seeded
const FALLBACK_HERO = {
  badge: "Award-Winning Creative Studio",
  headline: "We Create Stories That Move Brands.",
  subheading: "Corporate Films, Commercial Videos, Websites & Creative Experiences — crafted for brands that demand excellence.",
  ctaPrimaryText: "View Our Work",
  ctaPrimaryLink: "/work",
  ctaSecondaryText: "Book a Discovery Call",
  ctaSecondaryLink: "/contact",
  videoUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1100&h=900&fit=crop&auto=format",
  stats: [
    { val: "500+", lbl: "Projects Delivered" },
    { val: "3M+", lbl: "Total Views" },
    { val: "100+", lbl: "Happy Clients" }
  ]
};

const FALLBACK_PROCESS = {
  badge: "How We Work",
  title: "Strategy to screen — every step.",
  steps: [
    { title: "Strategy", desc: "Audience mapping, competitive analysis, and creative brief." },
    { title: "Concept", desc: "Moodboards, storyboards, and creative concept development." },
    { title: "Production", desc: "On-location or studio capture with cinema-grade equipment." },
    { title: "Post Production", desc: "Color grade, sound design, edit, and motion graphics." },
    { title: "Launch", desc: "Delivery across every platform with performance tracking." }
  ],
  image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=600&fit=crop&auto=format",
  imageBadge: "8 Years of Craft"
};

export default function HomePage() {
  const navigate = useNavigate();
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [hoveredWork, setHoveredWork] = useState<number | null>(null);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Parallax states for mouse coordinate drift
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2); // -1 to 1
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2); // -1 to 1
      setParallaxOffset({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMoveGlobal, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMoveGlobal);
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroRef.current.style.setProperty("--mouse-x", `${x}px`);
    heroRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleCtaMouseMove = (e: React.MouseEvent) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctaRef.current.style.setProperty("--mouse-x", `${x}px`);
    ctaRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleCardMouseMove = (e: React.MouseEvent, index: number) => {
    const card = e.currentTarget as HTMLDivElement;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  // Section refs for scroll tracking
  const workSectionRef = useRef<HTMLDivElement>(null);
  const servicesSectionRef = useRef<HTMLDivElement>(null);
  const processSectionRef = useRef<HTMLDivElement>(null);
  const testimonialsSectionRef = useRef<HTMLDivElement>(null);
  const behindSectionRef = useRef<HTMLDivElement>(null);

  // Scroll parallax hooks
  const { scrollY } = useScroll();

  // 1. Hero background and text offsets
  const heroBgY = useTransform(scrollY, [0, 800], [0, 180]);
  const heroTextY = useTransform(scrollY, [0, 800], [0, 90]);

  // 2. Featured Work grid column staggered scroll offsets
  const { scrollYProgress: workScrollProgress } = useScroll({
    target: workSectionRef,
    offset: ["start end", "end start"]
  });
  const workEvenY = useTransform(workScrollProgress, [0, 1], [0, -45]);
  const workOddY = useTransform(workScrollProgress, [0, 1], [0, 45]);

  // 3. Services section background blobs drift & 3-column offsets
  const { scrollYProgress: servicesScrollProgress } = useScroll({
    target: servicesSectionRef,
    offset: ["start end", "start start"]
  });
  const servicesBlob1Y = useTransform(servicesScrollProgress, [0, 1], [-60, 60]);
  const servicesBlob2Y = useTransform(servicesScrollProgress, [0, 1], [60, -60]);
  const servicesCol1Y = useTransform(servicesScrollProgress, [0, 1], [0, -30]);
  const servicesCol2Y = useTransform(servicesScrollProgress, [0, 1], [0, 0]);
  const servicesCol3Y = useTransform(servicesScrollProgress, [0, 1], [0, 30]);

  // 4. Process section split-column scrolling (Left timeline vs Right image/stats)
  const { scrollYProgress: processScrollProgress } = useScroll({
    target: processSectionRef,
    offset: ["start end", "start start"]
  });
  const processLeftY = useTransform(processScrollProgress, [0, 1], [0, -35]);
  const processRightY = useTransform(processScrollProgress, [0, 1], [0, 35]);

  // 5. Testimonials 3-column offsets
  const { scrollYProgress: testimonialsScrollProgress } = useScroll({
    target: testimonialsSectionRef,
    offset: ["start end", "start start"]
  });
  const testimonialCol1Y = useTransform(testimonialsScrollProgress, [0, 1], [0, -25]);
  const testimonialCol2Y = useTransform(testimonialsScrollProgress, [0, 1], [0, 0]);
  const testimonialCol3Y = useTransform(testimonialsScrollProgress, [0, 1], [0, 25]);

  // 6. Behind the lens stagger column offsets
  const { scrollYProgress: behindScrollProgress } = useScroll({
    target: behindSectionRef,
    offset: ["start end", "start start"]
  });
  const behindEvenY = useTransform(behindScrollProgress, [0, 1], [0, -40]);
  const behindOddY = useTransform(behindScrollProgress, [0, 1], [0, 40]);

  // 7. CTA section radial drift
  const { scrollYProgress: ctaScrollProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"]
  });
  const ctaBgY = useTransform(ctaScrollProgress, [0, 1], [-25, 25]);

  // States from API
  const [sections, setSections] = useState<Record<string, any>>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    document.title = "Cre8tiveCove | Where Imagination Sets Sail";
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(s => (s + 1) % 5);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Fetch dynamic content
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Fetch Home Page Configuration
        const pageData = await api.get("/content/pages/home");
        const mapped = pageData.sections.reduce((acc: any, sec: any) => {
          if (sec.isVisible) acc[sec.key] = sec.content;
          return acc;
        }, {});
        setSections(mapped);
      } catch (err) {
        console.warn("Using local fallback for page sections:", err);
      }

      try {
        // 2. Fetch Projects (Limit to featured or first 4)
        const allProjects = await api.get("/projects");
        const featured = allProjects.filter((p: any) => p.isFeatured).slice(0, 4);
        setProjects(featured.length > 0 ? featured : allProjects.slice(0, 4));
      } catch (err) {
        console.error("Failed to load projects:", err);
      }

      try {
        // 3. Fetch Testimonials
        const allTestimonials = await api.get("/testimonials");
        setTestimonials(allTestimonials.slice(0, 3));
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      }

      try {
        // 4. Fetch Services (Limit to first 6)
        const allServices = await api.get("/services");
        setServices(allServices.slice(0, 6));
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    }
    loadData();
  }, []);

  // Resolve section contents with fallback constants
  const hero = sections.hero || FALLBACK_HERO;
  const processSec = sections.process || FALLBACK_PROCESS;
  const ctaSec = sections.cta || { badge: "Let's Begin", title: "Ready to create something remarkable?", ctaText: "Let's Talk", ctaLink: "/contact" };

  const mediaUrl = hero.videoUrl
    ? (hero.videoUrl.startsWith("http") || hero.videoUrl.startsWith("data:") ? hero.videoUrl : `http://localhost:5001${hero.videoUrl}`)
    : "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1100&h=900&fit=crop&auto=format";

  const isVideo = typeof hero.videoUrl === "string" && (
    hero.videoUrl.endsWith(".mp4") ||
    hero.videoUrl.endsWith(".mov") ||
    hero.videoUrl.endsWith(".webm") ||
    hero.videoUrl.includes("/uploads/media/") ||
    hero.videoUrl.includes("video")
  );

  const headlineWords = (hero.headline || "We Create Stories That Move Brands.").split(" ");

  return (
    <div className="relative">
      {/* ── HERO BANNER ── */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="h-screen w-full overflow-hidden relative flex items-center justify-center bg-black group"
      >
        {/* Full-width background video/image */}
        <motion.div
          className="absolute inset-0 z-0 bg-black"
          style={{ y: heroBgY }}
        >
          {isVideo ? (
            <video
              src={mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Cinematic production"
              className="w-full h-full object-cover"
            />
          )}

          {/* Optional dark gradient overlay if text is enabled in CMS */}
          {hero.showText && (
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.75) 100%)"
              }}
            />
          )}
        </motion.div>

        {/* Ambient Cursor Spotlight Glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"
          style={{
            background: "radial-gradient(850px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(200,169,107,0.15), transparent 80%)"
          }}
        />

        {/* CMS Text Overlay (Rendered only if showText is enabled in CMS) */}
        {hero.showText && (
          <div className="relative z-20 w-full max-w-[1440px] mx-auto px-6 lg:px-14 grid grid-cols-1 lg:grid-cols-2 pt-28 pb-16 lg:pt-0 lg:pb-0">
            {/* Left panel */}
            <div
              className="flex flex-col justify-center transition-transform duration-500 ease-out"
              style={{
                transform: `translate(${parallaxOffset.x * 12}px, ${parallaxOffset.y * 12}px)`
              }}
            >
              <motion.div style={{ y: heroTextY }}>
                <div className="flex items-center gap-2.5 mb-10">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#C8A96B" }} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C8A96B]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {hero.badge || "Award-Winning Creative Studio"}
                  </span>
                </div>

                <motion.h1
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(3.2rem, 5.5vw, 5.8rem)",
                    fontWeight: 900,
                    lineHeight: 1.03,
                    color: "#fff",
                    letterSpacing: "-0.025em",
                  }}
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                      }
                    }
                  }}
                  initial="hidden"
                  animate={heroLoaded ? "visible" : "hidden"}
                  className="flex flex-wrap gap-x-[0.25em] gap-y-[0.05em]"
                >
                  {headlineWords.map((word: string, wIdx: number) => {
                    const isStories = word.replace(/[^a-zA-Z]/g, "") === "Stories";
                    return (
                      <span key={wIdx} className="inline-block overflow-hidden py-1">
                        <motion.span
                          className="inline-block origin-bottom"
                          variants={{
                            hidden: { y: "110%", rotateZ: 2, opacity: 0 },
                            visible: {
                              y: 0,
                              rotateZ: 0,
                              opacity: 1,
                              transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
                            }
                          }}
                          style={isStories ? { fontStyle: "italic", color: "#C8A96B" } : {}}
                        >
                          {word}
                        </motion.span>
                      </span>
                    );
                  })}
                </motion.h1>

                <motion.p
                  className="mt-8 text-lg max-w-[420px] leading-[1.75] text-white/80"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={heroLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {hero.subheading}
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-4 mt-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Magnetic>
                    <Link
                      to={hero.ctaPrimaryLink || "/work"}
                      className="group flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[13px] font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#C8A96B", color: "#111" }}
                    >
                      {hero.ctaPrimaryText || "View Our Work"}
                      <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </Magnetic>
                  <Magnetic>
                    <Link
                      to={hero.ctaSecondaryLink || "/contact"}
                      className="group flex items-center gap-2 px-7 py-3.5 rounded-full text-[13px] font-semibold border border-white/20 text-white transition-all duration-300 hover:scale-105 hover:border-[#C8A96B] hover:text-[#C8A96B]"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {hero.ctaSecondaryText || "Book a Discovery Call"}
                    </Link>
                  </Magnetic>
                </motion.div>
              </motion.div>

              {/* Bottom stats strip */}
              <motion.div
                className="flex gap-8 pt-12"
                initial={{ opacity: 0, y: 15 }}
                animate={heroLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {(hero.stats || FALLBACK_HERO.stats).map((item: any) => (
                  <div key={item.lbl}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "1.5rem", color: "#fff" }}>{item.val}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", marginTop: 1 }}>{item.lbl}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right panel */}
            <div
              className="relative min-h-[56vw] lg:min-h-0 flex items-center justify-center transition-transform duration-500 ease-out"
              style={{
                transform: `translate(${parallaxOffset.x * -25}px, ${parallaxOffset.y * -25}px)`
              }}
            >
              <motion.div style={{ y: heroTextY }} className="flex flex-col items-center justify-center">
                <Magnetic range={80} strength={0.4}>
                  <button
                    onClick={() => navigate("/work")}
                    className="group flex flex-col items-center gap-3 cursor-pointer"
                    style={{
                      opacity: heroLoaded ? 1 : 0,
                      transition: "opacity 1s ease 1s",
                    }}
                  >
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center relative"
                      style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(12px)" }}
                    >
                      <motion.div
                        className="absolute -inset-2 rounded-full border border-white/20 pointer-events-none"
                        animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      />
                      <Play size={24} fill="white" className="text-white ml-1 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Watch Showreel
                    </span>
                  </button>
                </Magnetic>
              </motion.div>
            </div>
          </div>
        )}
      </section>



      {/* ── FEATURED WORK ── */}
      {sections.selected_work !== false && (
        <section ref={workSectionRef} className="sticky top-0 z-10 bg-white w-full py-32 px-6 lg:px-14">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-end justify-between mb-16">
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
                  {sections.selected_work?.badge || "Selected Work"}
                </p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 3.75rem)", fontWeight: 900, color: "#111", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
                  {sections.selected_work?.title ? (
                    <TextReveal text={sections.selected_work.title} variant="words" />
                  ) : (
                    <>
                      <TextReveal text="Projects that define" variant="words" />
                      <br />
                      <em style={{ fontStyle: "italic" }}>categories.</em>
                    </>
                  )}
                </h2>
              </Reveal>
              <Reveal from="right">
                <Link
                  to="/work"
                  className="hidden lg:flex items-center gap-2 text-[13px] font-semibold group transition-all duration-200"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}
                >
                  {sections.selected_work?.ctaText || "All Projects"}
                  <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Reveal>
            </div>

            {/* Work grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {projects.map((item, i) => {
                const spans = [7, 5, 5, 7];
                const span = spans[i % 4];
                const tall = i % 4 === 1 || i % 4 === 2;

                const imageUrl = item.thumbnailUrl.startsWith("http")
                  ? item.thumbnailUrl
                  : `https://images.unsplash.com/photo-${item.thumbnailUrl}?w=900&h=700&fit=crop&auto=format`;

                return (
                  <Reveal key={item.id || i} delay={i * 0.1} className="contents">
                    <motion.div
                      className={`relative overflow-hidden rounded-2xl cursor-pointer group`}
                      style={{
                        height: tall ? 520 : 420,
                        background: "#F3F3F3",
                        gridColumn: `span ${span}`,
                        y: i % 2 === 0 ? workEvenY : workOddY
                      }}
                      onClick={() => navigate(`/work/${item.slug}`)}
                      onMouseEnter={() => setHoveredWork(i)}
                      onMouseLeave={() => setHoveredWork(null)}
                      onMouseMove={(e) => handleCardMouseMove(e, i)}
                    >
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
                        style={{ transform: hoveredWork === i ? "scale(1.06)" : "scale(1)" }}
                      />
                      <div
                        className="absolute inset-0 transition-opacity duration-500 z-0"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 55%)", opacity: hoveredWork === i ? 1 : 0.55 }}
                      />

                      {/* Dynamic Spotlight Glow */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
                        style={{
                          background: "radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.12), transparent 85%)"
                        }}
                      />

                      {/* Hover badge */}
                      <div
                        className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-400 z-20"
                        style={{
                          background: "rgba(255,255,255,0.12)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          opacity: hoveredWork === i ? 1 : 0,
                          transform: hoveredWork === i ? "scale(1)" : "scale(0.8)",
                        }}
                      >
                        <ArrowUpRight size={16} className="text-white" />
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-7 z-20">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: "#C8A96B", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {item.category}
                        </span>
                        <h3 className="mt-1.5 text-xl font-bold text-white leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {item.title}
                        </h3>
                        <p
                          className="text-[12px] text-white/50 mt-2 transition-all duration-300"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            opacity: hoveredWork === i ? 1 : 0,
                            transform: hoveredWork === i ? "translateY(0)" : "translateY(6px)",
                          }}
                        >
                          Learn Case Study
                        </p>
                      </div>
                    </motion.div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── SERVICES ── */}
      {sections.services_teaser !== false && (
        <section
          ref={servicesSectionRef}
          style={{ background: "#F7F7F7" }}
          className="sticky lg:top-[-70vh] top-0 z-20 min-h-screen lg:h-screen w-full relative overflow-hidden flex flex-col justify-center py-20 lg:py-0 px-6 lg:px-14"
        >
          {/* Glassmorphic Background Blobs */}
          <motion.div
            className="absolute top-10 left-[-100px] w-96 h-96 rounded-full bg-[#C8A96B]/3 blur-[100px] pointer-events-none"
            style={{ y: servicesBlob1Y }}
          />
          <motion.div
            className="absolute bottom-10 right-[-100px] w-96 h-96 rounded-full bg-[#030213]/3 blur-[100px] pointer-events-none"
            style={{ y: servicesBlob2Y }}
          />

          <div className="max-w-[1440px] mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-20 mb-16">
              <Reveal className="flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
                  {sections.services_teaser?.badge || "What We Do"}
                </p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 3.75rem)", fontWeight: 900, color: "#111", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
                  {sections.services_teaser?.title ? (
                    <TextReveal text={sections.services_teaser.title} variant="words" />
                  ) : (
                    <>
                      <TextReveal text="Full-spectrum" variant="words" />
                      <br />
                      <em style={{ fontStyle: "italic" }}>creative services.</em>
                    </>
                  )}
                </h2>
              </Reveal>
              <Reveal delay={0.1} className="max-w-sm">
                <p className="text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", color: "#888" }}>
                  {sections.services_teaser?.description || "From a single hero film to a complete brand overhaul — every engagement receives the same obsessive level of craft."}
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((s, i) => (
                <Reveal key={s.id || i} delay={i * 0.07}>
                  <motion.div
                    className="group bg-white rounded-2xl p-8 cursor-pointer transition-shadow duration-400 relative overflow-hidden"
                    style={{
                      boxShadow: hoveredService === i ? "0 24px 64px rgba(0,0,0,0.1)" : "0 1px 12px rgba(0,0,0,0.05)",
                      y: i % 3 === 0 ? servicesCol1Y : i % 3 === 1 ? servicesCol2Y : servicesCol3Y
                    }}
                    onClick={() => navigate(`/services/${s.slug}`)}
                    onMouseEnter={() => setHoveredService(i)}
                    onMouseLeave={() => setHoveredService(null)}
                    onMouseMove={(e) => handleCardMouseMove(e, i)}
                  >
                    {/* Dynamic Spotlight overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
                      style={{
                        background: "radial-gradient(220px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(200,169,107,0.06), transparent 80%)"
                      }}
                    />

                    <div className="relative z-10">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center mb-6 transition-all duration-300"
                        style={{ background: hoveredService === i ? "#C8A96B" : "rgba(200,169,107,0.1)" }}
                      >
                        <DynamicIcon name={s.icon} size={18} style={{ color: hoveredService === i ? "#fff" : "#C8A96B" }} />
                      </div>
                      <h3 className="text-base font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>{s.title}</h3>
                      <p className="text-sm whitespace-pre-line" style={{ fontFamily: "'Inter', sans-serif", color: "#888", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: s.shortDescription }} />
                      <div
                        className="flex items-center gap-1.5 mt-6 transition-all duration-200"
                        style={{ color: "#C8A96B" }}
                      >
                        <span className="text-[12px] font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Learn more</span>
                        <ArrowRight size={11} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PROCESS + STATS ── */}
      {sections.process !== false && (
        <section ref={processSectionRef} className="sticky lg:top-[-70vh] top-0 z-30 bg-white min-h-screen lg:h-screen w-full relative overflow-hidden flex flex-col justify-center py-20 lg:py-0 px-6 lg:px-14">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              {/* Process list */}
              <motion.div style={{ y: processLeftY }}>
                <Reveal>
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
                    {processSec.badge || "How We Work"}
                  </p>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 900, color: "#111", lineHeight: 1.1, letterSpacing: "-0.02em" }} className="mb-12">
                    {processSec.title ? (
                      processSec.title.includes("step") ? (
                        <>
                          {processSec.title.split("step")[0]}
                          <em style={{ fontStyle: "italic" }}>every step.</em>
                        </>
                      ) : processSec.title
                    ) : (
                      <>Strategy to screen —<br /><em style={{ fontStyle: "italic" }}>every step.</em></>
                    )}
                  </h2>
                </Reveal>

                <div className="flex flex-col">
                  {(processSec.steps || FALLBACK_PROCESS.steps).map((step: any, i: number) => (
                    <div
                      key={step.title}
                      className="flex gap-5 pb-8 relative cursor-pointer group transition-all duration-300"
                      onClick={() => setActiveStep(i)}
                    >
                      {i < 4 && (
                        <div className="absolute left-5 top-10 bottom-0 w-[2px] bg-[#E8E8E8] overflow-hidden">
                          <motion.div
                            className="w-full bg-[#C8A96B] origin-top"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: activeStep > i ? 1 : activeStep === i ? 0.5 : 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            style={{ height: "100%" }}
                          />
                        </div>
                      )}

                      <div className="relative flex-shrink-0">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center z-10 text-[11px] font-bold transition-all duration-300"
                          style={{
                            background: activeStep === i ? "#C8A96B" : activeStep > i ? "#111" : "#F7F7F7",
                            color: activeStep >= i ? "#fff" : "#aaa",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {activeStep > i ? <Check size={14} /> : String(i + 1).padStart(2, "0")}
                        </div>
                        {activeStep === i && (
                          <motion.div
                            layoutId="activeProcessIndicator"
                            className="absolute -inset-1 rounded-full border border-[#C8A96B]/50 pointer-events-none"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.15, opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          />
                        )}
                      </div>

                      <div className="pt-2 flex-1">
                        <h4
                          className="font-bold text-sm transition-colors duration-200"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: activeStep === i ? "#111" : "#aaa" }}
                        >
                          {step.title}
                        </h4>
                        <AnimatePresence initial={false}>
                          {activeStep === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <p
                                className="text-[13px] mt-1.5 leading-relaxed"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  color: "#888",
                                }}
                              >
                                {step.desc}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Stats & image */}
              <motion.div style={{ y: processRightY }}>
                <Reveal delay={0.2}>
                  <div className="relative rounded-2xl overflow-hidden mb-5" style={{ height: 380, background: "#F7F7F7" }}>
                    <img
                      src={processSec.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=600&fit=crop&auto=format"}
                      alt="Our team at work"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
                    <div className="absolute bottom-6 left-6">
                      <span
                        className="text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                        style={{ background: "#C8A96B", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {processSec.imageBadge || "8 Years of Craft"}
                      </span>
                    </div>
                  </div>
                </Reveal>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { v: "500+", l: "Projects" },
                    { v: "3M+", l: "Views" },
                    { v: "100+", l: "Clients" }
                  ].map((item, i) => (
                    <Reveal key={item.l} delay={0.3 + i * 0.05}>
                      <div className="rounded-2xl p-6 text-center" style={{ background: "#F7F7F7" }}>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", fontWeight: 900, color: "#111" }}>{item.v}</div>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#aaa", marginTop: 3 }}>{item.l}</div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {sections.testimonials !== false && (
        <section ref={testimonialsSectionRef} style={{ background: "#F7F7F7" }} className="sticky lg:top-[-70vh] top-0 z-40 min-h-screen lg:h-screen w-full relative overflow-hidden flex flex-col justify-center py-20 lg:py-0 px-6 lg:px-14">
          <div className="max-w-[1440px] mx-auto">
            <Reveal className="text-center mb-16">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
                {sections.testimonials?.badge || "Client Stories"}
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 3.75rem)", fontWeight: 900, color: "#111", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
                {sections.testimonials?.title || "What our clients say."}
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonials.map((t, i) => {
                const avatarUrl = t.clientPhoto?.startsWith("http")
                  ? t.clientPhoto
                  : `https://images.unsplash.com/photo-${t.clientPhoto || "1507003211169-0a1dd7228f2d"}?w=80&h=80&fit=crop&auto=format`;

                return (
                  <Reveal key={t.id || i} delay={i * 0.12}>
                    <motion.div
                      className="bg-white rounded-2xl p-8 flex flex-col h-full"
                      style={{
                        boxShadow: "0 2px 24px rgba(0,0,0,0.055)",
                        y: i === 0 ? testimonialCol1Y : i === 1 ? testimonialCol2Y : testimonialCol3Y
                      }}
                    >
                      <div className="flex gap-0.5 mb-5">
                        {[...Array(t.rating || 5)].map((_, j) => (
                          <Star key={j} size={12} fill="#C8A96B" style={{ color: "#C8A96B" }} />
                        ))}
                      </div>
                      <blockquote
                        className="text-sm leading-[1.8] flex-1"
                        style={{ fontFamily: "'Inter', sans-serif", color: "#555", fontStyle: "italic" }}
                      >
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>
                      <div className="flex items-center gap-3 mt-7 pt-6 border-t border-gray-100">
                        <img
                          src={avatarUrl}
                          alt={t.clientName}
                          className="w-10 h-10 rounded-full object-cover bg-gray-200 flex-shrink-0"
                        />
                        <div>
                          <p className="text-[13px] font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#111" }}>{t.clientName}</p>
                          <p className="text-[11px] mt-0.5" style={{ fontFamily: "'Inter', sans-serif", color: "#bbb" }}>Client</p>
                        </div>
                      </div>
                    </motion.div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── BEHIND THE SCENES ── */}
      {sections.behind_scenes !== false && (
        <section ref={behindSectionRef} className="sticky lg:top-[-70vh] top-0 z-50 bg-white min-h-screen lg:h-screen w-full relative overflow-hidden flex flex-col justify-center py-20 lg:py-0 px-6 lg:px-14">
          <div className="max-w-[1440px] mx-auto">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
                {sections.behind_scenes?.badge || "Behind the Lens"}
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 4vw, 3.75rem)", fontWeight: 900, color: "#111", lineHeight: 1.08, letterSpacing: "-0.02em" }} className="mb-16">
                {sections.behind_scenes?.title ? (
                  sections.behind_scenes.title.includes("magic") ? (
                    <>
                      {sections.behind_scenes.title.split("magic")[0]}
                      <em style={{ fontStyle: "italic" }}>happens.</em>
                    </>
                  ) : sections.behind_scenes.title
                ) : (
                  <>Where the magic<br /><em style={{ fontStyle: "italic" }}>happens.</em></>
                )}
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-start">
              {(sections.behind_scenes?.items || [
                { img: "1485846234645-a62644f84728", label: "Camera Ops", h: 300, mt: 0 },
                { img: "1508739773434-c26b3d09e071", label: "Drone Shoots", h: 380, mt: 48 },
                { img: "1574717024653-61fd2cf4d44d", label: "Cinematography", h: 380, mt: 0 },
                { img: "1531403236541-e5f16c22a4c3", label: "Editing Suite", h: 300, mt: 48 }
              ]).map((item: any, i: number) => (
                <Reveal key={i} delay={i * 0.1}>
                  <motion.div
                    className="relative overflow-hidden rounded-2xl group cursor-pointer"
                    style={{
                      height: item.h,
                      marginTop: item.mt,
                      background: "#F3F3F3",
                      y: i % 2 === 0 ? behindEvenY : behindOddY
                    }}
                  >
                    <img
                      src={`https://images.unsplash.com/photo-${item.img}?w=500&h=600&fit=crop&auto=format`}
                      alt={item.label}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ background: "rgba(0,0,0,0.38)" }} />
                    <div
                      className="absolute bottom-5 left-5 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      style={{ transform: "translateY(4px)" }}
                    >
                      <span className="text-xs font-semibold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.label}</span>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      {sections.cta !== false && (
        <section className="mx-4 lg:mx-14 mb-24">
          <div
            ref={ctaRef}
            onMouseMove={handleCtaMouseMove}
            className="relative overflow-hidden rounded-3xl px-8 lg:px-20 py-24 text-center group"
            style={{ background: "#111" }}
          >
            {/* Ambient Background Radial Glow */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at 60% 40%, rgba(200,169,107,0.08) 0%, transparent 65%)",
                y: ctaBgY
              }}
            />

            {/* Cursor spotlight */}
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"
              style={{
                background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(200,169,107,0.14), transparent 80%)"
              }}
            />

            <div className="relative z-10">
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C8A96B" }}>
                  {ctaSec.badge || "Let's Begin"}
                </p>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1.07,
                    letterSpacing: "-0.02em",
                  }}
                  className="mb-10"
                >
                  {ctaSec.title ? (
                    ctaSec.title.includes("remarkable") ? (
                      <>
                        {ctaSec.title.split("remarkable")[0]}
                        <em style={{ fontStyle: "italic", color: "#C8A96B" }}>something remarkable?</em>
                      </>
                    ) : ctaSec.title
                  ) : (
                    <>Ready to create<br /><em style={{ fontStyle: "italic", color: "#C8A96B" }}>something remarkable?</em></>
                  )}
                </h2>

                <Magnetic range={70} strength={0.38}>
                  <button
                    onClick={() => navigate(ctaSec.ctaLink || "/contact")}
                    className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-[13px] font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                    style={{ background: "#C8A96B", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {ctaSec.ctaText || "Let's Talk"}
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </Magnetic>
              </Reveal>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
