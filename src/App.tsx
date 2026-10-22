import { useState, useRef, useEffect, useCallback } from "react";
import { planets, PlanetData } from "./planetData";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const anglesRef = useRef<number[]>(planets.map(() => Math.random() * Math.PI * 2));
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 });
  const [showLabels, setShowLabels] = useState(true);
  const lastTimeRef = useRef<number>(0);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const size = Math.min(container.clientWidth, container.clientHeight, 800);
        setCanvasSize({ width: size, height: size });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Draw the solar system
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const scale = Math.min(width, height) / 800;

      // Clear canvas
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, width, height);

      // Draw stars background
      drawStars(ctx, width, height);

      // Draw orbit paths
      planets.forEach((planet) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, planet.orbitRadius * scale, 0, Math.PI * 2);
        ctx.strokeStyle =
          selectedPlanet?.name === planet.name
            ? "rgba(255, 255, 255, 0.4)"
            : "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = selectedPlanet?.name === planet.name ? 2 : 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw Sun
      const sunGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        30 * scale
      );
      sunGradient.addColorStop(0, "#fff7e0");
      sunGradient.addColorStop(0.3, "#ffcc00");
      sunGradient.addColorStop(0.7, "#ff8800");
      sunGradient.addColorStop(1, "#ff440040");
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30 * scale, 0, Math.PI * 2);
      ctx.fillStyle = sunGradient;
      ctx.fill();

      // Sun glow
      const glowGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        20 * scale,
        centerX,
        centerY,
        50 * scale
      );
      glowGradient.addColorStop(0, "rgba(255, 200, 0, 0.3)");
      glowGradient.addColorStop(1, "rgba(255, 200, 0, 0)");
      ctx.beginPath();
      ctx.arc(centerX, centerY, 50 * scale, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Draw planets
      planets.forEach((planet, index) => {
        const angle = anglesRef.current[index];
        const x = centerX + Math.cos(angle) * planet.orbitRadius * scale;
        const y = centerY + Math.sin(angle) * planet.orbitRadius * scale;
        const r = planet.radius * scale;

        // Planet glow
        const planetGlow = ctx.createRadialGradient(x, y, 0, x, y, r * 2);
        planetGlow.addColorStop(0, planet.color + "60");
        planetGlow.addColorStop(1, planet.color + "00");
        ctx.beginPath();
        ctx.arc(x, y, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = planetGlow;
        ctx.fill();

        // Planet body
        const planetGradient = ctx.createRadialGradient(
          x - r * 0.3,
          y - r * 0.3,
          0,
          x,
          y,
          r
        );
        planetGradient.addColorStop(0, lightenColor(planet.color, 40));
        planetGradient.addColorStop(1, planet.color);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = planetGradient;
        ctx.fill();

        // Saturn rings
        if (planet.name === "Saturn") {
          ctx.beginPath();
          ctx.ellipse(x, y, r * 2, r * 0.5, 0.3, 0, Math.PI * 2);
          ctx.strokeStyle = "#f0d89080";
          ctx.lineWidth = 2 * scale;
          ctx.stroke();
        }

        // Selection highlight
        if (selectedPlanet?.name === planet.name) {
          ctx.beginPath();
          ctx.arc(x, y, r + 4 * scale, 0, Math.PI * 2);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Hover highlight
        if (hoveredPlanet === planet.name) {
          ctx.beginPath();
          ctx.arc(x, y, r + 3 * scale, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Planet labels
        if (showLabels) {
          ctx.font = `${11 * scale}px sans-serif`;
          ctx.fillStyle =
            selectedPlanet?.name === planet.name
              ? "#ffffff"
              : "rgba(255, 255, 255, 0.7)";
          ctx.textAlign = "center";
          ctx.fillText(planet.name, x, y - r - 6 * scale);
        }
      });
    },
    [selectedPlanet, hoveredPlanet, showLabels]
  );

  // Stars cache
  const starsRef = useRef<{ x: number; y: number; size: number; brightness: number }[]>([]);

  function drawStars(ctx: CanvasRenderingContext2D, width: number, height: number) {
    if (starsRef.current.length === 0) {
      for (let i = 0; i < 200; i++) {
        starsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.5,
          brightness: Math.random() * 0.5 + 0.3,
        });
      }
    }
    starsRef.current.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      ctx.fill();
    });
  }

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (isPlaying) {
        planets.forEach((planet, index) => {
          anglesRef.current[index] += planet.orbitalSpeed * speed * delta * 0.5;
        });
      }

      draw(ctx, canvasSize.width, canvasSize.height);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, speed, draw, canvasSize]);

  // Handle click on planet
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    const scale = Math.min(canvasSize.width, canvasSize.height) / 800;

    let clicked: PlanetData | null = null;
    planets.forEach((planet, index) => {
      const angle = anglesRef.current[index];
      const px = centerX + Math.cos(angle) * planet.orbitRadius * scale;
      const py = centerY + Math.sin(angle) * planet.orbitRadius * scale;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist < planet.radius * scale + 10) {
        clicked = planet;
      }
    });

    setSelectedPlanet(clicked);
  };

  // Handle mouse move for hover
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    const scale = Math.min(canvasSize.width, canvasSize.height) / 800;

    let hovered: string | null = null;
    planets.forEach((planet, index) => {
      const angle = anglesRef.current[index];
      const px = centerX + Math.cos(angle) * planet.orbitRadius * scale;
      const py = centerY + Math.sin(angle) * planet.orbitRadius * scale;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist < planet.radius * scale + 10) {
        hovered = planet.name;
      }
    });

    setHoveredPlanet(hovered);
    canvas.style.cursor = hovered ? "pointer" : "default";
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex flex-col items-center overflow-hidden">
      {/* Header */}
      <header className="w-full text-center py-4 px-4">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
          🌌 Solar System Explorer
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Click on any planet to learn more about it
        </p>
      </header>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 w-full max-w-7xl px-4 flex-1">
        {/* Canvas */}
        <div className="relative flex items-center justify-center w-full max-w-[700px] aspect-square">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="rounded-2xl border border-white/10 shadow-2xl shadow-blue-900/20"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={() => setHoveredPlanet(null)}
          />
        </div>

        {/* Side panel */}
        <div className="w-full lg:w-80 flex flex-col gap-4 pb-4">
          {/* Planet Info */}
          <div
            className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 transition-all duration-300 ${
              selectedPlanet ? "opacity-100 translate-y-0" : "opacity-60"
            }`}
          >
            {selectedPlanet ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-full shadow-lg"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${lightenColor(
                        selectedPlanet.color,
                        40
                      )}, ${selectedPlanet.color})`,
                    }}
                  />
                  <div>
                    <h2 className="text-xl font-bold">{selectedPlanet.name}</h2>
                    <span className="text-gray-400 text-sm">{selectedPlanet.emoji}</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {selectedPlanet.description}
                </p>
                <div className="space-y-3">
                  <InfoRow
                    label="Diameter"
                    value={`${selectedPlanet.diameter.toLocaleString()} km`}
                  />
                  <InfoRow
                    label="Distance from Sun"
                    value={`${selectedPlanet.distanceFromSun} million km`}
                  />
                  <InfoRow
                    label="Orbital Period"
                    value={formatOrbitalPeriod(selectedPlanet.orbitalPeriod)}
                  />
                  <InfoRow
                    label="Relative Speed"
                    value={`${selectedPlanet.orbitalSpeed}x Earth`}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-4xl mb-2">🪐</p>
                <p className="text-gray-400 text-sm">
                  Click on a planet to see its details
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
              Controls
            </h3>

            {/* Play/Pause */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all ${
                  isPlaying
                    ? "bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30"
                    : "bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30"
                }`}
              >
                {isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all ${
                  showLabels
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30"
                    : "bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30"
                }`}
              >
                {showLabels ? "🏷 Labels On" : "🏷 Labels Off"}
              </button>
            </div>

            {/* Speed Control */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">Speed</span>
                <span className="text-xs font-mono text-yellow-300">{speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gray-700 accent-yellow-400"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-500">0.1x</span>
                <span className="text-[10px] text-gray-500">5.0x</span>
              </div>
            </div>

            {/* Speed presets */}
            <div className="flex gap-1.5 mt-3">
              {[0.5, 1, 2, 3, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    Math.abs(speed - s) < 0.05
                      ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/40"
                      : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Planet list */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
              Planets
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {planets.map((planet) => (
                <button
                  key={planet.name}
                  onClick={() => setSelectedPlanet(planet)}
                  className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs transition-all ${
                    selectedPlanet?.name === planet.name
                      ? "bg-white/15 border border-white/20"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: planet.color }}
                  />
                  <span className="truncate">{planet.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
      <span className="text-gray-400 text-xs">{label}</span>
      <span className="text-white text-xs font-medium">{value}</span>
    </div>
  );
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + percent);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + percent);
  const b = Math.min(255, (num & 0x0000ff) + percent);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function formatOrbitalPeriod(days: number): string {
  if (days < 365) return `${days} days`;
  const years = (days / 365.25).toFixed(1);
  return `${years} years`;
}

export default App;
