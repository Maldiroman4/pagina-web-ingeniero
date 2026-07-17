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
  Zap
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
            {/* Foto de fondo cinematográfica */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/img/hero_gears.png" 
                alt="Maquinaria Metalúrgica Engranajes" 
                className="w-full h-full object-cover scale-105"
                style={{ filter: "brightness(0.45) saturate(0.7)" }}
              />
              {/* Degradado desde abajo */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #060b16 0%, #060b1690 40%, transparent 70%)" }} />
              {/* Degradado desde arriba para header */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #060b16aa 0%, transparent 25%)" }} />
            </div>

            {/* Spotlight cursor */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none hidden md:block"
              style={{
                background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.06), transparent 70%)`
              }}
            />

            {/* Contenido Hero — centrado verticalmente */}
            <div className="relative z-20 flex flex-col items-center text-center px-6 pb-32 pt-44 w-full max-w-5xl mx-auto">
              
              {/* Badge superior */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-sky-500/25 bg-sky-950/20 backdrop-blur-sm text-sky-300 text-[11px] font-bold tracking-[0.2em] uppercase mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                Fabricación de Precisión Industrial · Desde 1982
              </div>

              {/* Headline principal */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.92] mb-6">
                <span className="text-white drop-shadow-2xl">METALÚRGICA</span>
                <br />
                <span
                  style={{
                    background: "linear-gradient(95deg, #e2e8f0 0%, #7dd3fc 45%, #38bdf8 80%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  JOR-CIT
                </span>
              </h1>

              {/* Subtítulo */}
              <p className="text-slate-300 text-base md:text-xl font-light leading-relaxed max-w-2xl mb-10 tracking-wide">
                Engranajes de alta precisión fabricados con maquinaria automática CNC.<br className="hidden md:block" />
                Tolerancias óptimas para cualquier requerimiento industrial.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <button 
                  onClick={() => scrollToSection("contacto")}
                  className="px-10 py-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-widest uppercase rounded-lg transition-all duration-300 cursor-pointer shadow-xl shadow-sky-500/30 active:scale-95 hover:shadow-sky-400/40"
                >
                  Solicitar Cotización
                </button>
                <button 
                  onClick={() => setView("gallery")}
                  className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-slate-200 font-semibold text-sm tracking-widest uppercase rounded-lg transition-all duration-300 cursor-pointer active:scale-95 backdrop-blur-sm"
                >
                  Ver Catálogo
                </button>
              </div>

              {/* Strip de estadísticas */}
              <div className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                {[
                  { value: "+40", label: "Años de Experiencia", unit: "" },
                  { value: "±0.01", label: "Tolerancia (mm)", unit: "" },
                  { value: "DIN", label: "ISO · ANSI · B92.1", unit: "" },
                  { value: "24h", label: "Respuesta Técnica", unit: "" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center justify-center py-6 px-4 bg-slate-900/60 backdrop-blur-md hover:bg-slate-900/80 transition-colors duration-300">
                    <span className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none mb-1">{stat.value}</span>
                    <span className="text-[10px] md:text-xs text-slate-400 font-semibold tracking-wider uppercase text-center leading-tight">{stat.label}</span>
                  </div>
                ))}
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

    </div>
  );
}
