"use client";

import React, { useState, useEffect, useRef } from "react";
import InfiniteGallery from "@/components/ui/3d-gallery-photography";
import { 
  Play, 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Search,
  Settings,
  Shield,
  RotateCw,
  Zap,
  ChevronUp
} from "lucide-react";

export default function Home() {
  const [view, setView] = useState<"home" | "gallery">("home");
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  
  // Gear simulator states (kept for possible future use)
  const [gearSpeed] = useState(1.0);
  const [gearDirection] = useState(1);
  const [gearMode] = useState<"torque" | "speed">("torque");
  
  // Spotlight position
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Video Modal state
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  
  // Contact Form state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // Gallery Filters
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHeaderScrolled(true);
      } else {
        setHeaderScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => {
      setFormSubmitted(false);
    }, 6000);
  };

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    setView("home");
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Image assets for 3D gallery
  const galleryImages = [
    { src: "/img/gal_recto.png", alt: "Engranaje Recto", category: "engranajes" },
    { src: "/img/gal_bronze.png", alt: "Corona Helicoidal", category: "engranajes" },
    { src: "/img/gal_interior.png", alt: "Engranajes Interiores", category: "engranajes" },
    { src: "/img/gal_sinfin.png", alt: "Sinfín y Corona", category: "engranajes" },
    { src: "/img/gal_cremallera.png", alt: "Cremalleras", category: "engranajes" },
    { src: "/img/gal_polea.png", alt: "Poleas Sincrónicas", category: "poleas" },
    { src: "/img/gal_estriado.png", alt: "Ejes Estriados", category: "estriados" },
    { src: "/img/gal_cadena.png", alt: "Engranajes de Cadena", category: "engranajes" },
    { src: "/img/gal_repuestos.png", alt: "Repuestos Industriales", category: "repuestos" },
    { src: "/img/gal_caja.png", alt: "Reductores Epicicloidales", category: "repuestos" }
  ];

  // Filtered images for search & tabs
  const filteredImages = galleryImages.filter(img => {
    const matchesCategory = activeFilter === "all" || img.category === activeFilter;
    const matchesSearch = img.alt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate SVG gear speeds based on state
  const baseSpeed = gearSpeed * gearDirection;
  // If mode is speed, conductor rotates at slider speed, Intermediate is faster, driven is super fast
  // If mode is torque, conductor is slower to gain torque, etc.
  const speedMultiplier = gearMode === "speed" ? 1.5 : 0.8;
  const gear1Duration = `${10 / Math.abs(baseSpeed * speedMultiplier || 0.0001)}s`;
  const gear2Duration = `${10 / Math.abs(baseSpeed * speedMultiplier * 1.5 || 0.0001)}s`;
  const gear3Duration = `${10 / Math.abs(baseSpeed * speedMultiplier * 2.25 || 0.0001)}s`;

  return (
    <div className="relative min-h-screen bg-[#060b16] text-slate-100 flex flex-col font-sans select-none">
      
      {/* ==========================================
         HEADER Y NAVEGACIÓN
         ========================================== */}
      <header 
        className={`fixed left-50% -translate-x-[50%] w-[90%] max-w-[1200px] h-[80px] bg-slate-950/85 backdrop-blur-2xl border border-white/5 rounded-full z-[1000] transition-all duration-500 shadow-2xl flex items-center justify-between px-8 ${
          headerScrolled 
            ? "top-[0.8rem] h-[70px] border-sky-500/20 shadow-sky-500/5 bg-[#060b16]/95" 
            : "top-[1.5rem]"
        }`}
      >
        <button 
          onClick={() => { setView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="brand-logo text-lg md:text-xl font-bold tracking-wider font-brand bg-gradient-to-r from-white to-sky-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity cursor-pointer"
        >
          Metalúrgica JOR-CIT
        </button>

        {/* Menú Desktop */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wide text-slate-300">
          <button 
            onClick={() => { setView("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`hover:text-sky-400 transition-colors cursor-pointer ${view === "home" ? "text-sky-400" : ""}`}
          >
            Home
          </button>
          <button 
            onClick={() => setView("gallery")}
            className={`hover:text-sky-400 transition-colors cursor-pointer ${view === "gallery" ? "text-sky-400" : ""}`}
          >
            Galería 3D
          </button>
          <button 
            onClick={() => scrollToSection("videos")}
            className="hover:text-sky-400 transition-colors cursor-pointer"
          >
            Videos
          </button>
          <button 
            onClick={() => scrollToSection("contacto")}
            className="hover:text-sky-400 transition-colors cursor-pointer"
          >
            Contacto
          </button>

          {/* Buscador Integrado */}
          <div className="relative flex items-center">
            {showSearchInput && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar repuestos..."
                className="bg-slate-900/90 border border-white/10 rounded-full px-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 w-44 mr-2 transition-all"
              />
            )}
            <button 
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="p-2 bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-white/10 rounded-full text-slate-400 hover:text-sky-400 transition-all cursor-pointer"
              aria-label="Abrir buscador"
            >
              <Search size={16} strokeWidth={2.5} />
            </button>
          </div>
        </nav>

        {/* Botón Hamburguesa Mobile */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
          aria-label="Menú principal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </header>

      {/* Menú Drawer Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#060b16]/95 backdrop-blur-xl z-[999] md:hidden flex flex-col justify-center items-center gap-8 text-2xl font-brand font-semibold">
          <button 
            onClick={() => { setView("home"); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="text-slate-200 hover:text-sky-400 transition-colors cursor-pointer"
          >
            Home
          </button>
          <button 
            onClick={() => { setView("gallery"); setMobileMenuOpen(false); }}
            className="text-slate-200 hover:text-sky-400 transition-colors cursor-pointer"
          >
            Galería 3D
          </button>
          <button 
            onClick={() => scrollToSection("videos")}
            className="text-slate-200 hover:text-sky-400 transition-colors cursor-pointer"
          >
            Videos
          </button>
          <button 
            onClick={() => scrollToSection("contacto")}
            className="text-slate-200 hover:text-sky-400 transition-colors cursor-pointer"
          >
            Contacto
          </button>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-8 right-8 p-3 rounded-full bg-slate-900 border border-white/5 text-slate-400 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* ==========================================
         VISTA PRINCIPAL (HOME)
         ========================================== */}
      {view === "home" ? (
        <div id="home-view" className="flex-1 flex flex-col">
          
          {/* Hero Banner */}
          <section 
            id="hero" 
            ref={heroRef}
            onMouseMove={handleHeroMouseMove}
            className="relative min-h-screen flex flex-col items-center justify-end pb-0 overflow-hidden"
          >
            {/* Foto de fondo cinematográfica — Ken Burns + barridos de luz */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src="/img/hero_gears.png" 
                alt="Maquinaria Metalúrgica Engranajes" 
                className="w-full h-full object-cover animate-ken-burns"
              />
              {/* Degradado desde abajo */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #060b16 0%, #060b1688 35%, transparent 65%)" }} />
              {/* Degradado desde arriba */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #060b16bb 0%, transparent 20%)" }} />
              {/* Viñeta lateral */}
              <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, #060b16aa 100%)" }} />

              {/* Barrido de luz 1 — rayo diagonal */}
              <div 
                className="absolute inset-y-0 w-[60px] animate-light-sweep pointer-events-none"
                style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.04), rgba(56,189,248,0.06), rgba(255,255,255,0.04), transparent)" }}
              />
              {/* Barrido de luz 2 — más ancho y suave */}
              <div 
                className="absolute inset-y-0 w-[120px] animate-light-sweep-2 pointer-events-none"
                style={{ background: "linear-gradient(to right, transparent, rgba(56,189,248,0.03), rgba(255,255,255,0.05), rgba(56,189,248,0.03), transparent)" }}
              />

              {/* Partículas de polvo industrial flotando */}
              {[
                { left: "12%", bottom: "20%", size: 2, dur: "6s", delay: "0s" },
                { left: "28%", bottom: "35%", size: 1.5, dur: "9s", delay: "2s" },
                { left: "45%", bottom: "15%", size: 2.5, dur: "7s", delay: "1s" },
                { left: "60%", bottom: "28%", size: 1, dur: "11s", delay: "3s" },
                { left: "73%", bottom: "18%", size: 2, dur: "8s", delay: "0.5s" },
                { left: "85%", bottom: "40%", size: 1.5, dur: "10s", delay: "4s" },
                { left: "20%", bottom: "50%", size: 1, dur: "13s", delay: "6s" },
                { left: "55%", bottom: "45%", size: 1.5, dur: "12s", delay: "2.5s" },
              ].map((p, i) => (
                <div
                  key={i}
                  className="absolute rounded-full animate-particle pointer-events-none"
                  style={{
                    left: p.left,
                    bottom: p.bottom,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    background: "rgba(148,163,184,0.6)",
                    animationDuration: p.dur,
                    animationDelay: p.delay,
                    boxShadow: `0 0 ${p.size * 2}px rgba(56,189,248,0.4)`,
                  }}
                />
              ))}

              {/* Líneas de escaneo horizontales sutiles */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.015]"
                style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 4px)" }}
              />
            </div>

            {/* Spotlight cursor */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none hidden md:block"
              style={{
                background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.06), transparent 70%)`
              }}
            />

            {/* Contenido Hero — layout 2 columnas */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-36 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* COLUMNA IZQUIERDA: Texto */}
              <div className="flex flex-col items-start text-left">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-sky-500/25 bg-sky-950/20 backdrop-blur-sm text-sky-300 text-[11px] font-bold tracking-[0.2em] uppercase mb-7">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                  Fabricación de Precisión · Desde 1982
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.9] mb-6">
                  <span className="text-white">METALÚRGICA</span>
                  <br />
                  <span style={{ background: "linear-gradient(95deg, #e2e8f0 0%, #7dd3fc 45%, #38bdf8 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    JOR-CIT
                  </span>
                </h1>

                <p className="text-slate-300 text-base md:text-lg font-light leading-relaxed max-w-xl mb-10 tracking-wide">
                  Engranajes de alta precisión fabricados con maquinaria automática CNC.
                  Tolerancias óptimas para cualquier requerimiento industrial.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <button
                    onClick={() => scrollToSection("contacto")}
                    className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-widest uppercase rounded-lg transition-all duration-300 cursor-pointer shadow-xl shadow-sky-500/30 active:scale-95"
                  >
                    Solicitar Cotización
                  </button>
                  <a
                    href="https://wa.me/5491162493103?text=Hola%20Ing.%20Antezana%2C%20me%20comunico%20desde%20la%20p%C3%A1gina%20web%20de%20Metal%C3%BArgica%20JOR-CIT.%20Quisiera%20consultar%20por%20un%20presupuesto."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#1db954] text-white font-bold text-sm tracking-widest uppercase rounded-lg transition-all duration-300 cursor-pointer shadow-xl shadow-green-500/30 active:scale-95"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp Ing. Antezana
                  </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                  {[
                    { value: "+40", label: "Años" },
                    { value: "±0.01", label: "mm precisión" },
                    { value: "DIN", label: "ISO · ANSI" },
                    { value: "24h", label: "Respuesta" },
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center py-4 px-2 bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-xl hover:border-sky-500/20 transition-colors">
                      <span className="text-xl md:text-2xl font-black text-white leading-none mb-1">{stat.value}</span>
                      <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase text-center">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* COLUMNA DERECHA: HUD de Engranajes — Ingeniería de Precisión */}
              <div className="hidden lg:flex justify-center items-center">
                <div className="w-full max-w-[440px] rounded-xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg, #050b18 0%, #0a1628 50%, #060d1c 100%)", border: "1px solid rgba(56,189,248,0.12)" }}>

                  {/* Header tipo software CAD */}
                  <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid rgba(56,189,248,0.08)", background: "rgba(56,189,248,0.03)" }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: "0 0 6px #34d399" }} />
                      <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Gear Train · CAD/CAM View</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" style={{ animationDelay: "0.3s" }} />
                      <span className="text-[9px] font-bold text-sky-400 tracking-widest uppercase">Live</span>
                    </div>
                  </div>

                  {/* SVG: Engranajes con perfil involuta */}
                  <div className="relative" style={{ background: "radial-gradient(ellipse at 50% 50%, #0d1f3c 0%, #050b18 70%)" }}>

                    {/* Grid de ingeniería de fondo */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 440 240" preserveAspectRatio="none">
                      <defs>
                        <pattern id="eng-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#38bdf8" strokeWidth="0.5"/>
                        </pattern>
                        <pattern id="eng-grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
                          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#38bdf8" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#eng-grid)"/>
                      <rect width="100%" height="100%" fill="url(#eng-grid-major)"/>
                    </svg>

                    {/* Ejes de referencia */}
                    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 440 240">
                      <line x1="220" y1="0" x2="220" y2="240" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="4 4"/>
                      <line x1="0" y1="120" x2="440" y2="120" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="4 4"/>
                    </svg>

                    <svg className="w-full" viewBox="0 0 340 200" style={{ height: "220px" }}>
                      <defs>
                        {/* Filtros y sombras */}
                        <filter id="metal-shadow" x="-30%" y="-30%" width="160%" height="160%">
                          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.8"/>
                          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#38bdf8" floodOpacity="0.08"/>
                        </filter>
                        <filter id="glow-gold">
                          <feGaussianBlur stdDeviation="3" result="blur"/>
                          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>
                        <filter id="glow-contact">
                          <feGaussianBlur stdDeviation="4" result="blur"/>
                          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                        </filter>

                        {/* Gradiente bronce acero cepillado para G1 */}
                        <radialGradient id="g1-grad" cx="38%" cy="32%" r="68%">
                          <stop offset="0%" stopColor="#fef3c7"/>
                          <stop offset="25%" stopColor="#f59e0b"/>
                          <stop offset="55%" stopColor="#b45309"/>
                          <stop offset="80%" stopColor="#78350f"/>
                          <stop offset="100%" stopColor="#2d1500"/>
                        </radialGradient>
                        <linearGradient id="g1-shine" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.25"/>
                          <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.1"/>
                          <stop offset="100%" stopColor="#78350f" stopOpacity="0"/>
                        </linearGradient>

                        {/* Gradiente acero inoxidable para G2 */}
                        <radialGradient id="g2-grad" cx="38%" cy="32%" r="68%">
                          <stop offset="0%" stopColor="#e2e8f0"/>
                          <stop offset="30%" stopColor="#94a3b8"/>
                          <stop offset="60%" stopColor="#475569"/>
                          <stop offset="85%" stopColor="#1e293b"/>
                          <stop offset="100%" stopColor="#0a1221"/>
                        </radialGradient>

                        {/* Gradiente acero oscuro para G3 */}
                        <radialGradient id="g3-grad" cx="38%" cy="32%" r="68%">
                          <stop offset="0%" stopColor="#cbd5e1"/>
                          <stop offset="35%" stopColor="#64748b"/>
                          <stop offset="65%" stopColor="#334155"/>
                          <stop offset="100%" stopColor="#0f172a"/>
                        </radialGradient>

                        {/* Gradiente contacto meshing */}
                        <radialGradient id="contact-glow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9"/>
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
                        </radialGradient>

                        {/* Línea de pitch */}
                        <linearGradient id="pitch-line" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0"/>
                          <stop offset="20%" stopColor="#38bdf8" stopOpacity="0.5"/>
                          <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.5"/>
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
                        </linearGradient>

                        {/* Clippath para G1 */}
                        <clipPath id="g1-clip"><circle cx="80" cy="100" r="50"/></clipPath>
                        <clipPath id="g2-clip"><circle cx="175" cy="100" r="34"/></clipPath>
                        <clipPath id="g3-clip"><circle cx="240" cy="100" r="23"/></clipPath>
                      </defs>

                      {/* ─────────────────────────────────────
                          ENGRANAJE 1: Conductor — Bronce Z=18
                          R_pitch=27, R_add=30, R_ded=23.25
                         ───────────────────────────────────── */}
                      <g style={{ transformOrigin: "80px 100px", animation: "spin-clockwise 8s linear infinite" }}>
                        {/* Cuerpo del engranaje con dientes trapezoidal-involuta */}
                        {Array.from({ length: 18 }, (_, i) => {
                          const angle = (i / 18) * Math.PI * 2;
                          const toothA = (Math.PI * 2) / 18;
                          const hw = toothA * 0.22;
                          const Ra = 30, Rd = 23.25;
                          const cx = 80, cy = 100;
                          const pts = [
                            [cx + Rd * Math.cos(angle - hw * 1.5), cy + Rd * Math.sin(angle - hw * 1.5)],
                            [cx + Ra * Math.cos(angle - hw * 0.55), cy + Ra * Math.sin(angle - hw * 0.55)],
                            [cx + Ra * Math.cos(angle + hw * 0.55), cy + Ra * Math.sin(angle + hw * 0.55)],
                            [cx + Rd * Math.cos(angle + hw * 1.5), cy + Rd * Math.sin(angle + hw * 1.5)],
                          ];
                          return <polygon key={i} points={pts.map(p => p.map(v => v.toFixed(2)).join(",")).join(" ")} fill="url(#g1-grad)" stroke="#92400e" strokeWidth="0.4"/>;
                        })}
                        {/* Círculo de paso */}
                        <circle cx="80" cy="100" r="27" fill="url(#g1-grad)" filter="url(#metal-shadow)"/>
                        {/* Reflejos */}
                        <circle cx="80" cy="100" r="27" fill="url(#g1-shine)"/>
                        {/* Rebaje central */}
                        <circle cx="80" cy="100" r="18" fill="#0a1221" stroke="#b45309" strokeWidth="1"/>
                        {/* Nervios del disco */}
                        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                          const rad = deg * Math.PI / 180;
                          return <line key={i} x1={80 + 8 * Math.cos(rad)} y1={100 + 8 * Math.sin(rad)} x2={80 + 16 * Math.cos(rad)} y2={100 + 16 * Math.sin(rad)} stroke="#d97706" strokeWidth="3" strokeLinecap="round"/>;
                        })}
                        {/* Buje central */}
                        <circle cx="80" cy="100" r="7" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5"/>
                        <circle cx="80" cy="100" r="3" fill="#f59e0b"/>
                      </g>

                      {/* ─────────────────────────────────────
                          ENGRANAJE 2: Acero Z=12
                          R_pitch=18, R_add=21, R_ded=15.5
                         ───────────────────────────────────── */}
                      <g style={{ transformOrigin: "175px 100px", animation: "spin-counterclockwise 5.33s linear infinite" }}>
                        {Array.from({ length: 12 }, (_, i) => {
                          const angle = (i / 12) * Math.PI * 2;
                          const toothA = (Math.PI * 2) / 12;
                          const hw = toothA * 0.22;
                          const Ra = 21, Rd = 15.5;
                          const cx = 175, cy = 100;
                          const pts = [
                            [cx + Rd * Math.cos(angle - hw * 1.5), cy + Rd * Math.sin(angle - hw * 1.5)],
                            [cx + Ra * Math.cos(angle - hw * 0.55), cy + Ra * Math.sin(angle - hw * 0.55)],
                            [cx + Ra * Math.cos(angle + hw * 0.55), cy + Ra * Math.sin(angle + hw * 0.55)],
                            [cx + Rd * Math.cos(angle + hw * 1.5), cy + Rd * Math.sin(angle + hw * 1.5)],
                          ];
                          return <polygon key={i} points={pts.map(p => p.map(v => v.toFixed(2)).join(",")).join(" ")} fill="url(#g2-grad)" stroke="#334155" strokeWidth="0.4"/>;
                        })}
                        <circle cx="175" cy="100" r="18" fill="url(#g2-grad)" filter="url(#metal-shadow)"/>
                        <circle cx="175" cy="100" r="11" fill="#0a1221" stroke="#475569" strokeWidth="1"/>
                        {[0, 90, 180, 270].map((deg, i) => {
                          const rad = deg * Math.PI / 180;
                          return <line key={i} x1={175 + 4 * Math.cos(rad)} y1={100 + 4 * Math.sin(rad)} x2={175 + 9 * Math.cos(rad)} y2={100 + 9 * Math.sin(rad)} stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"/>;
                        })}
                        <circle cx="175" cy="100" r="4.5" fill="#1e293b" stroke="#94a3b8" strokeWidth="1"/>
                        <circle cx="175" cy="100" r="2" fill="#94a3b8"/>
                      </g>

                      {/* ─────────────────────────────────────
                          ENGRANAJE 3: Conducido — Acero oscuro Z=8
                          R_pitch=12, R_add=15, R_ded=9.5
                         ───────────────────────────────────── */}
                      <g style={{ transformOrigin: "240px 100px", animation: "spin-clockwise 3.2s linear infinite" }}>
                        {Array.from({ length: 8 }, (_, i) => {
                          const angle = (i / 8) * Math.PI * 2;
                          const toothA = (Math.PI * 2) / 8;
                          const hw = toothA * 0.22;
                          const Ra = 15, Rd = 9.5;
                          const cx = 240, cy = 100;
                          const pts = [
                            [cx + Rd * Math.cos(angle - hw * 1.5), cy + Rd * Math.sin(angle - hw * 1.5)],
                            [cx + Ra * Math.cos(angle - hw * 0.55), cy + Ra * Math.sin(angle - hw * 0.55)],
                            [cx + Ra * Math.cos(angle + hw * 0.55), cy + Ra * Math.sin(angle + hw * 0.55)],
                            [cx + Rd * Math.cos(angle + hw * 1.5), cy + Rd * Math.sin(angle + hw * 1.5)],
                          ];
                          return <polygon key={i} points={pts.map(p => p.map(v => v.toFixed(2)).join(",")).join(" ")} fill="url(#g3-grad)" stroke="#1e293b" strokeWidth="0.4"/>;
                        })}
                        <circle cx="240" cy="100" r="12" fill="url(#g3-grad)" filter="url(#metal-shadow)"/>
                        <circle cx="240" cy="100" r="7" fill="#0a1221" stroke="#334155" strokeWidth="0.75"/>
                        <circle cx="240" cy="100" r="3.5" fill="#1e293b" stroke="#64748b" strokeWidth="0.75"/>
                        <circle cx="240" cy="100" r="1.5" fill="#64748b"/>
                      </g>

                      {/* ─── Puntos de contacto meshing con glow ─── */}
                      <circle cx="107" cy="100" r="3" fill="url(#contact-glow)" filter="url(#glow-contact)" opacity="0.85">
                        <animate attributeName="opacity" values="0.85;0.4;0.85" dur="1.2s" repeatCount="indefinite"/>
                        <animate attributeName="r" values="3;4.5;3" dur="1.2s" repeatCount="indefinite"/>
                      </circle>
                      <circle cx="193" cy="100" r="2.5" fill="url(#contact-glow)" filter="url(#glow-contact)" opacity="0.75">
                        <animate attributeName="opacity" values="0.75;0.35;0.75" dur="1s" repeatCount="indefinite"/>
                        <animate attributeName="r" values="2.5;4;2.5" dur="1s" repeatCount="indefinite"/>
                      </circle>

                      {/* ─── Línea de paso horizontal ─── */}
                      <line x1="30" y1="100" x2="270" y2="100" stroke="url(#pitch-line)" strokeWidth="0.6" strokeDasharray="5 4"/>

                      {/* ─── Anotaciones técnicas estilo CAD ─── */}
                      {/* G1 label */}
                      <line x1="80" y1="65" x2="80" y2="30" stroke="#d97706" strokeWidth="0.6" opacity="0.6"/>
                      <line x1="80" y1="30" x2="115" y2="30" stroke="#d97706" strokeWidth="0.6" opacity="0.6"/>
                      <rect x="116" y="21" width="72" height="17" rx="2" fill="#0a1221" stroke="#d97706" strokeWidth="0.6" opacity="0.9"/>
                      <text x="152" y="32" fill="#f59e0b" fontSize="7" fontWeight="700" textAnchor="middle" letterSpacing="0.4" fontFamily="monospace">Z₁=18 · m=3</text>

                      {/* G2 label */}
                      <line x1="175" y1="134" x2="175" y2="170" stroke="#64748b" strokeWidth="0.6" opacity="0.6"/>
                      <line x1="175" y1="170" x2="210" y2="170" stroke="#64748b" strokeWidth="0.6" opacity="0.6"/>
                      <rect x="211" y="162" width="72" height="16" rx="2" fill="#0a1221" stroke="#64748b" strokeWidth="0.6" opacity="0.9"/>
                      <text x="247" y="173" fill="#94a3b8" fontSize="7" fontWeight="700" textAnchor="middle" letterSpacing="0.4" fontFamily="monospace">Z₂=12 · m=3</text>

                      {/* G3 label */}
                      <line x1="240" y1="65" x2="240" y2="30" stroke="#475569" strokeWidth="0.6" opacity="0.6"/>
                      <line x1="240" y1="30" x2="275" y2="30" stroke="#475569" strokeWidth="0.6" opacity="0.6"/>
                      <rect x="276" y="22" width="58" height="16" rx="2" fill="#0a1221" stroke="#475569" strokeWidth="0.6" opacity="0.9"/>
                      <text x="305" y="33" fill="#64748b" fontSize="7" fontWeight="700" textAnchor="middle" letterSpacing="0.4" fontFamily="monospace">Z₃=8</text>

                      {/* Flechas de dirección de giro */}
                      <path d="M 52 75 A 27 27 0 0 1 75 73" stroke="#f59e0b" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6"/>
                      <polygon points="75,70 72,75 78,75" fill="#f59e0b" opacity="0.6"/>

                      <path d="M 175 78 A 18 18 0 0 0 161 88" stroke="#94a3b8" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>
                      <polygon points="161,88 157,84 163,82" fill="#94a3b8" opacity="0.5"/>

                      {/* Círculos de paso punteados */}
                      <circle cx="80" cy="100" r="27" fill="none" stroke="#d97706" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.25"/>
                      <circle cx="175" cy="100" r="18" fill="none" stroke="#64748b" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.25"/>
                      <circle cx="240" cy="100" r="12" fill="none" stroke="#475569" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.25"/>

                      {/* Cotas de distancia entre centros */}
                      <line x1="80" y1="155" x2="175" y2="155" stroke="#38bdf8" strokeWidth="0.6" opacity="0.4"/>
                      <line x1="80" y1="151" x2="80" y2="159" stroke="#38bdf8" strokeWidth="0.6" opacity="0.4"/>
                      <line x1="175" y1="151" x2="175" y2="159" stroke="#38bdf8" strokeWidth="0.6" opacity="0.4"/>
                      <text x="127" y="150" fill="#38bdf8" fontSize="6" textAnchor="middle" fontFamily="monospace" opacity="0.6">a₁₂ = 45mm</text>

                      <line x1="175" y1="145" x2="240" y2="145" stroke="#38bdf8" strokeWidth="0.6" opacity="0.3"/>
                      <line x1="175" y1="141" x2="175" y2="149" stroke="#38bdf8" strokeWidth="0.6" opacity="0.3"/>
                      <line x1="240" y1="141" x2="240" y2="149" stroke="#38bdf8" strokeWidth="0.6" opacity="0.3"/>
                      <text x="207" y="140" fill="#38bdf8" fontSize="6" textAnchor="middle" fontFamily="monospace" opacity="0.5">a₂₃ = 30mm</text>
                    </svg>
                  </div>

                  {/* Footer: datos técnicos tipo panel de control */}
                  <div style={{ borderTop: "1px solid rgba(56,189,248,0.08)", background: "rgba(10,18,33,0.8)" }}>
                    <div className="grid grid-cols-4 divide-x" style={{ borderColor: "rgba(56,189,248,0.06)" }}>
                      {[
                        { val: "i = 2.25", sub: "Relación total", col: "#38bdf8" },
                        { val: "m = 3", sub: "Módulo DIN", col: "#f59e0b" },
                        { val: "α = 20°", sub: "Pres. angle", col: "#94a3b8" },
                        { val: "DIN 867", sub: "Norma ISO", col: "#34d399" },
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center py-3 px-2 gap-0.5" style={{ borderRight: i < 3 ? "1px solid rgba(56,189,248,0.07)" : "none" }}>
                          <span className="text-[11px] font-black tracking-tight" style={{ color: item.col, fontFamily: "monospace" }}>{item.val}</span>
                          <span className="text-[8px] font-semibold tracking-widest uppercase text-center" style={{ color: "#4a5568" }}>{item.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Capacidades Grid */}
          <section id="capacidades" className="py-24 bg-[#0c1527]/30 border-y border-white/5 relative z-10">
            <div className="container mx-auto px-6 max-w-5xl">
              <h2 className="text-center text-xl md:text-2xl font-extrabold font-brand tracking-wider text-slate-300 max-w-2xl mx-auto mb-16 uppercase leading-snug">
                Fabricamos piezas unitarias, o bien series de:
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex gap-5 p-6 rounded-xl bg-slate-950/40 border border-white/5 hover:border-sky-500/10 hover:bg-slate-950/60 transition-all duration-500">
                  <div className="p-3 bg-sky-950/30 border border-sky-500/15 rounded-lg text-sky-400 self-start">
                    <Settings size={20} className="animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-300 font-brand mb-2 uppercase tracking-wide">Engranajes Completos</h3>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-normal">
                      Engranajes rectos, helicoidales, interiores, sinfines y coronas, cremalleras, tanto en módulo como en sistema diametral pitch (DP).
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 p-6 rounded-xl bg-slate-950/40 border border-white/5 hover:border-sky-500/10 hover:bg-slate-950/60 transition-all duration-500">
                  <div className="p-3 bg-sky-950/30 border border-sky-500/15 rounded-lg text-sky-400 self-start">
                    <Settings size={20} className="animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-300 font-brand mb-2 uppercase tracking-wide">Transmisión Sincrónica</h3>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-normal">
                      Poleas dentadas sincrónicas para correas de goma o poliuretano, trapezoideales y redondas de tipo HTD de alta resistencia.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 p-6 rounded-xl bg-slate-950/40 border border-white/5 hover:border-sky-500/10 hover:bg-slate-950/60 transition-all duration-500">
                  <div className="p-3 bg-sky-950/30 border border-sky-500/15 rounded-lg text-sky-400 self-start">
                    <Settings size={20} className="animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-300 font-brand mb-2 uppercase tracking-wide">Estriados Normados</h3>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-normal">
                      Estriados interiores y exteriores normados de gran tolerancia según normas internacionales: DIN 5480, DIN 5482, UNI 221 y ANSI B92.1-1970.
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 p-6 rounded-xl bg-slate-950/40 border border-white/5 hover:border-sky-500/10 hover:bg-slate-950/60 transition-all duration-500">
                  <div className="p-3 bg-sky-950/30 border border-sky-500/15 rounded-lg text-sky-400 self-start">
                    <Settings size={20} className="animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-300 font-brand mb-2 uppercase tracking-wide">Sistemas de Cadena</h3>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-normal">
                      Engranajes y piñones de cadena para arrastres mecánicos según estándares de fabricación ASA y British Standard (B.S.).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Catálogo de Productos Destacados */}
          <section id="productos" className="py-24 relative z-10 bg-[#060b16]">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="flex flex-col items-center text-center mb-16">
                <h2 className="text-3xl font-extrabold font-brand tracking-wider text-slate-100 uppercase">PRODUCTOS</h2>
                <div className="w-16 h-1 bg-sky-500 mt-4 rounded-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Producto 1 */}
                <div className="group bg-slate-950/50 border border-white/5 hover:border-sky-500/20 rounded-xl overflow-hidden transition-all duration-500 shadow-xl">
                  <div className="p-5 border-b border-white/5 bg-slate-950/30">
                    <h3 className="text-sm font-bold font-brand tracking-wide text-slate-300 uppercase">Coronas Helicoidales</h3>
                  </div>
                  <div className="aspect-square w-full overflow-hidden bg-slate-900/60">
                    <img 
                      src="/img/prod_corona.png" 
                      alt="Coronas Helicoidales" 
                      className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                    />
                  </div>
                </div>

                {/* Producto 2 */}
                <div className="group bg-slate-950/50 border border-white/5 hover:border-sky-500/20 rounded-xl overflow-hidden transition-all duration-500 shadow-xl">
                  <div className="p-5 border-b border-white/5 bg-slate-950/30">
                    <h3 className="text-sm font-bold font-brand tracking-wide text-slate-300 uppercase">Sector Dentado</h3>
                  </div>
                  <div className="aspect-square w-full overflow-hidden bg-slate-900/60">
                    <img 
                      src="/img/prod_sector.png" 
                      alt="Sector Dentado" 
                      className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                    />
                  </div>
                </div>

                {/* Producto 3 */}
                <div className="group bg-slate-950/50 border border-white/5 hover:border-sky-500/20 rounded-xl overflow-hidden transition-all duration-500 shadow-xl">
                  <div className="p-5 border-b border-white/5 bg-slate-950/30">
                    <h3 className="text-sm font-bold font-brand tracking-wide text-slate-300 uppercase">Repuestos Agrícolas</h3>
                  </div>
                  <div className="aspect-square w-full overflow-hidden bg-slate-900/60">
                    <img 
                      src="/img/prod_repuestos.png" 
                      alt="Repuestos Agrícolas" 
                      className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                    />
                  </div>
                </div>

                {/* Producto 4 */}
                <div className="group bg-slate-950/50 border border-white/5 hover:border-sky-500/20 rounded-xl overflow-hidden transition-all duration-500 shadow-xl">
                  <div className="p-5 border-b border-white/5 bg-slate-950/30">
                    <h3 className="text-sm font-bold font-brand tracking-wide text-slate-300 uppercase">Reductores Especiales</h3>
                  </div>
                  <div className="aspect-square w-full overflow-hidden bg-slate-900/60">
                    <img 
                      src="/img/prod_reductor.png" 
                      alt="Reductor Epicicloidal" 
                      className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                    />
                  </div>
                </div>
              </div>

              {/* Botón Ver Galería interactiva 3D */}
              <div className="flex justify-center mt-16">
                <button 
                  onClick={() => setView("gallery")}
                  className="px-8 py-3.5 bg-sky-950/30 hover:bg-sky-950/60 border border-sky-500/20 hover:border-sky-500/40 text-sky-400 font-bold rounded-lg transition-all duration-300 cursor-pointer inline-flex items-center gap-2 active:scale-95"
                >
                  <Settings size={18} className="animate-spin-slow" />
                  VER GALERÍA 3D
                </button>
              </div>
            </div>
          </section>

          {/* Videos de Maquinaria */}
          <section id="videos" className="py-24 bg-[#0c1527]/30 border-y border-white/5 relative z-10">
            <div className="container mx-auto px-6 max-w-5xl">
              <div className="flex flex-col items-center text-center mb-16">
                <h2 className="text-3xl font-extrabold font-brand tracking-wider text-slate-100 uppercase">DEMOSTRACIONES EN VIDEO</h2>
                <div className="w-16 h-1 bg-sky-500 mt-4 rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Video 1 */}
                <div 
                  onClick={() => setActiveVideoUrl("https://www.youtube.com/embed/8_F8EszG184")}
                  className="group bg-slate-950/40 border border-white/5 hover:border-sky-500/10 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 shadow-xl"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src="/img/video_cover1.png" 
                      alt="Talladora de Engranajes" 
                      className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover:bg-slate-950/20 transition-all">
                      <div className="w-12 h-12 bg-sky-500/90 text-slate-950 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-400 transition-all duration-300 shadow-lg">
                        <Play size={20} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-bold font-brand text-slate-300 leading-snug">Tallado de Engranajes Rectos en Creadora</h3>
                    <span className="text-[10px] text-sky-400 mt-2 block font-semibold uppercase">Reproducir Video</span>
                  </div>
                </div>

                {/* Video 2 */}
                <div 
                  onClick={() => setActiveVideoUrl("https://www.youtube.com/embed/c-Z788H83w4")}
                  className="group bg-slate-950/40 border border-white/5 hover:border-sky-500/10 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 shadow-xl"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src="/img/video_cover2.png" 
                      alt="Fresado de Coronas" 
                      className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover:bg-slate-950/20 transition-all">
                      <div className="w-12 h-12 bg-sky-500/90 text-slate-950 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-400 transition-all duration-300 shadow-lg">
                        <Play size={20} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-bold font-brand text-slate-300 leading-snug">Fresado de Corona Helicoidal de Gran Diámetro</h3>
                    <span className="text-[10px] text-sky-400 mt-2 block font-semibold uppercase">Reproducir Video</span>
                  </div>
                </div>

                {/* Video 3 */}
                <div 
                  onClick={() => setActiveVideoUrl("https://www.youtube.com/embed/mK9k2tF0UeY")}
                  className="group bg-slate-950/40 border border-white/5 hover:border-sky-500/10 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 shadow-xl"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src="/img/video_cover3.png" 
                      alt="Control de Calidad" 
                      className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover:bg-slate-950/20 transition-all">
                      <div className="w-12 h-12 bg-sky-500/90 text-slate-950 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-400 transition-all duration-300 shadow-lg">
                        <Play size={20} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm font-bold font-brand text-slate-300 leading-snug">Control de Calidad y Verificación Dimensional</h3>
                    <span className="text-[10px] text-sky-400 mt-2 block font-semibold uppercase">Reproducir Video</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Información y Formulario de Contacto */}
          <section id="contacto" className="py-24 relative z-10 bg-[#060b16]">
            <div className="container mx-auto px-6 max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-12">
                
                {/* Info Card */}
                <div className="bg-slate-950/50 border border-white/5 p-8 rounded-2xl shadow-xl self-start">
                  <h3 className="text-xl font-bold font-brand text-slate-200 tracking-wider mb-8 uppercase">METALÚRGICA JOR-CIT</h3>
                  
                  <ul className="flex flex-col gap-6 text-xs md:text-sm">
                    <li className="flex gap-4">
                      <div className="p-2.5 bg-sky-950/40 border border-sky-500/10 rounded-lg text-sky-400 self-start">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-300 mb-1 uppercase text-xs">Dirección</h4>
                        <p className="text-slate-400 leading-relaxed">Zona Industrial Metalúrgica, Buenos Aires, Argentina</p>
                      </div>
                    </li>

                    <li className="flex gap-4">
                      <div className="p-2.5 bg-sky-950/40 border border-sky-500/10 rounded-lg text-sky-400 self-start">
                        <Phone size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-300 mb-1 uppercase text-xs">Teléfonos</h4>
                        <p className="text-slate-400 leading-relaxed">+54 11 4455-8899 / +54 9 11 5566-7788</p>
                      </div>
                    </li>

                    <li className="flex gap-4">
                      <div className="p-2.5 bg-sky-950/40 border border-sky-500/10 rounded-lg text-sky-400 self-start">
                        <Mail size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-300 mb-1 uppercase text-xs">Correo Electrónico</h4>
                        <p className="text-slate-400 leading-relaxed">contacto@metalurgicajorcit.com.ar</p>
                      </div>
                    </li>

                    <li className="flex gap-4">
                      <div className="p-2.5 bg-sky-950/40 border border-sky-500/10 rounded-lg text-sky-400 self-start">
                        <Clock size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-300 mb-1 uppercase text-xs">Horario de Atención</h4>
                        <p className="text-slate-400 leading-relaxed">Lunes a Viernes: 8:00 hs a 17:00 hs</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Form Card */}
                <div className="bg-slate-950/50 border border-white/5 p-8 rounded-2xl shadow-xl relative overflow-hidden">
                  {formSubmitted ? (
                    <div className="flex flex-col items-center justify-center text-center h-full py-12">
                      <div className="w-16 h-16 bg-emerald-950/50 border border-emerald-500/25 rounded-full flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        <Send size={24} />
                      </div>
                      <h3 className="text-xl font-bold font-brand text-slate-200 uppercase mb-3">¡Mensaje Enviado!</h3>
                      <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                        Su consulta ha sido procesada con éxito. Un asesor técnico de Metalúrgica JOR-CIT se pondrá en contacto a la brevedad.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 text-xs font-semibold">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-slate-400 uppercase tracking-wide">Nombre Completo</label>
                        <input 
                          type="text" 
                          id="name" 
                          required
                          value={formData.name}
                          onChange={handleFormChange}
                          placeholder="Ej: Juan Pérez"
                          className="bg-slate-900 border border-white/5 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-slate-400 uppercase tracking-wide">Correo Electrónico</label>
                        <input 
                          type="email" 
                          id="email" 
                          required
                          value={formData.email}
                          onChange={handleFormChange}
                          placeholder="Ej: juan@empresa.com"
                          className="bg-slate-900 border border-white/5 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="subject" className="text-slate-400 uppercase tracking-wide">Asunto</label>
                        <input 
                          type="text" 
                          id="subject" 
                          required
                          value={formData.subject}
                          onChange={handleFormChange}
                          placeholder="Ej: Cotización de Engranajes Rectos"
                          className="bg-slate-900 border border-white/5 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="message" className="text-slate-400 uppercase tracking-wide">Mensaje</label>
                        <textarea 
                          id="message" 
                          required
                          value={formData.message}
                          onChange={handleFormChange}
                          placeholder="Detalle las medidas, módulo o DP de las piezas a fabricar..."
                          rows={4}
                          className="bg-slate-900 border border-white/5 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none"
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="py-3.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 font-bold rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 active:scale-95 mt-2"
                      >
                        <span>ENVIAR MENSAJE</span>
                        <Send size={14} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>

        </div>
      ) : (
        /* ==========================================
           VISTA DE GALERÍA (INTRINSIC 3D WEBGL ENGINE)
           ========================================== */
        <div id="gallery-view" className="flex-1 flex flex-col pt-24 min-h-screen bg-[#060b16]">
          <div className="container mx-auto px-6 max-w-6xl flex-1 flex flex-col">
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8 mb-8">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-extrabold font-brand tracking-wider text-slate-100 uppercase">TRABAJOS Y ENGRANAJES</h2>
                <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">
                  Use la rueda del ratón, flechas del teclado o arrastre táctil para navegar el catálogo 3D interactivo
                </p>
              </div>

              {/* Filtros de la Galería */}
              <div className="flex flex-wrap gap-2 justify-center font-semibold text-xs tracking-wider">
                {[
                  { id: "all", label: "TODOS" },
                  { id: "engranajes", label: "ENGRANAJES" },
                  { id: "poleas", label: "POLEAS" },
                  { id: "estriados", label: "ESTRIADOS" },
                  { id: "repuestos", label: "REPUESTOS" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-4 py-2 border rounded-full transition-all cursor-pointer ${
                      activeFilter === tab.id
                        ? "bg-sky-400 text-slate-950 border-sky-400"
                        : "bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Infinite WebGL Gallery Canvas */}
            <div className="flex-1 min-h-[460px] md:min-h-[580px] bg-slate-950/20 border border-white/5 hover:border-sky-500/10 rounded-2xl overflow-hidden relative flex flex-col justify-center items-center shadow-2xl p-4 transition-all duration-500">
              {filteredImages.length > 0 ? (
                <InfiniteGallery 
                  images={filteredImages} 
                  speed={1.5}
                  visibleCount={Math.min(12, filteredImages.length * 2)}
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <div className="text-center p-8 max-w-sm">
                  <Settings size={36} className="text-slate-600 animate-spin-slow mx-auto mb-4" />
                  <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">No se encontraron piezas</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    Pruebe a cambiar el término de búsqueda o seleccione otra categoría en los filtros superiores.
                  </p>
                </div>
              )}

              {/* HUD / Overlay indicator for expensive $10K look */}
              {filteredImages.length > 0 && (
                <div className="absolute bottom-6 left-6 right-6 pointer-events-none flex justify-between items-end font-mono text-[10px] text-sky-400/80 tracking-widest uppercase">
                  <div className="flex flex-col gap-1">
                    <span>SECCIÓN: CATÁLOGO ACTIVO</span>
                    <span>PIEZAS CARGADAS: {filteredImages.length}</span>
                  </div>
                  <div className="text-right flex flex-col gap-1 hidden md:block">
                    <span>Navegación: Rueda de ratón / Pantalla táctil</span>
                    <span>WebGL Engine Active | 60 FPS</span>
                  </div>
                </div>
              )}
            </div>

            {/* Botón Volver a la vista principal */}
            <div className="flex justify-center py-8">
              <button 
                onClick={() => setView("home")}
                className="px-8 py-3 bg-slate-900 border border-white/10 hover:border-white/20 text-slate-300 font-bold rounded-lg transition-all cursor-pointer active:scale-95"
              >
                Volver al Home
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==========================================
         FOOTER
         ========================================== */}
      <footer className="bg-slate-950 border-t border-white/5 relative z-20 mt-auto">
        <div className="border-b border-white/5 py-8 bg-[#0c1527]/50">
          <div className="container mx-auto px-6 max-w-5xl flex justify-between items-center">
            <h2 className="text-lg font-bold font-brand tracking-wider text-slate-300 uppercase">CONTÁCTENOS</h2>
            
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-10 h-10 bg-slate-900 border border-white/10 hover:border-white/20 hover:text-sky-400 rounded-full flex items-center justify-center transition-all cursor-pointer"
              aria-label="Volver arriba"
            >
              <ChevronUp size={20} />
            </button>
          </div>
        </div>

        <div className="py-6 text-center text-[10px] font-mono uppercase text-slate-500 tracking-wider">
          <p>&copy; {new Date().getFullYear()} Metalúrgica JOR-CIT. Fabricación de Engranajes de Precisión. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* ==========================================
         VIDEO LIGHTBOX MODAL
         ========================================== */}
      {activeVideoUrl && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[2000] flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <iframe 
              src={`${activeVideoUrl}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
            <button 
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 border border-white/10 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Cerrar video"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
         BOTÓN WHATSAPP FLOTANTE
         ========================================== */}
      <a
        href="https://wa.me/5491162493103?text=Hola%20Ing.%20Antezana%2C%20me%20comunico%20desde%20la%20p%C3%A1gina%20web%20de%20Metal%C3%BArgica%20JOR-CIT.%20Quisiera%20consultar%20por%20un%20presupuesto."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[1100] flex items-center gap-3 pl-4 pr-5 py-4 bg-[#25D366] hover:bg-[#1db954] text-white font-bold rounded-full shadow-2xl shadow-green-600/40 hover:shadow-green-500/60 transition-all duration-300 hover:scale-105 active:scale-95 group"
        aria-label="Contactar por WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 flex-shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-black tracking-wide">Ing. Antezana</span>
          <span className="text-[11px] font-semibold opacity-90">+54 9 11 6249-3103</span>
        </div>
      </a>

    </div>
  );
}
