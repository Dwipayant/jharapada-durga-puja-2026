import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, Maximize2, Compass, Play, Pause, ZoomIn, ZoomOut, RotateCcw, Info } from 'lucide-react';

interface PanoramaViewerProps {
  imageUrl: string;
  title: string;
}

export const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ imageUrl, title }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [yaw, setYaw] = useState<number>(0); // 0 to 360 degrees
  const [pitch, setPitch] = useState<number>(0); // -30 to 30 degrees
  const [fov, setFov] = useState<number>(75); // Field of view in degrees (zoom: 45 to 90)
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; startYaw: number; startPitch: number }>({ x: 0, y: 0, startYaw: 0, startPitch: 0 });
  
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const [activeHotspotInfo, setActiveHotspotInfo] = useState<string | null>('sanctum');

  // Hotspots positioned around 360 degrees
  const hotspots = [
    {
      id: 'gate',
      targetYaw: 0, // 0 deg (North / Front)
      targetPitch: 5,
      title: '🏰 Bauda Garh 120ft Gate',
      desc: '120ft historic fort gate structure rendered with 3D projection laser lights.',
      icon: Maximize2,
      color: 'bg-[#B8001F] text-[#FFD700]'
    },
    {
      id: 'sanctum',
      targetYaw: 90, // 90 deg (East / Right)
      targetPitch: -2,
      title: '🛕 Goddess Durga Sanctum & Gold Medha',
      desc: '2.5kg Pure Gold Crown & 300kg Silver Tableaux lit with 108 ghee diyas.',
      icon: Sparkles,
      color: 'bg-[#FFD700] text-amber-950'
    },
    {
      id: 'bazaar',
      targetYaw: 220, // 220 deg (West / Left)
      targetPitch: 0,
      title: '🎡 Meena Bazaar & Carnival Lights',
      desc: '60ft Giant Ferris Wheel and 200+ street food and handicraft stalls.',
      icon: Compass,
      color: 'bg-blue-600 text-white'
    }
  ];

  // Load image when imageUrl changes
  useEffect(() => {
    setImageError(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      setLoadedImage(img);
    };
    img.onerror = () => {
      console.warn('Panorama image failed to load, switching to synthetic 360 fallback:', imageUrl);
      setImageError(true);
      setLoadedImage(null);
    };
  }, [imageUrl]);

  // Render 360 Canvas loop
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (loadedImage && !imageError) {
      // Equirectangular 360 Wrapping Projection
      const normYaw = ((yaw % 360) + 360) % 360;
      const srcX = (normYaw / 360) * loadedImage.naturalWidth;
      const viewWidthSrc = (fov / 360) * loadedImage.naturalWidth;
      const viewHeightSrc = loadedImage.naturalHeight;

      // Draw horizontal slice 1
      const part1WidthSrc = Math.min(viewWidthSrc, loadedImage.naturalWidth - srcX);
      const part1WidthDest = (part1WidthSrc / viewWidthSrc) * width;

      // Pitch offset in pixels
      const pitchOffset = (pitch / 90) * (height / 3);

      ctx.drawImage(
        loadedImage,
        srcX, 0, part1WidthSrc, viewHeightSrc,
        0, pitchOffset, part1WidthDest, height
      );

      // Draw horizontal slice 2 (if wrapped around the 360 seam)
      if (part1WidthSrc < viewWidthSrc) {
        const part2WidthSrc = viewWidthSrc - part1WidthSrc;
        const part2WidthDest = width - part1WidthDest;
        ctx.drawImage(
          loadedImage,
          0, 0, part2WidthSrc, viewHeightSrc,
          part1WidthDest, pitchOffset, part2WidthDest, height
        );
      }
    } else {
      // Synthetic 360 Night Pandal Canvas Background
      const normYaw = ((yaw % 360) + 360) % 360;
      
      // Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#0B0518');
      skyGrad.addColorStop(0.6, '#1C0D2B');
      skyGrad.addColorStop(1, '#3A0B1A');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw 360 stars & fireworks in background
      for (let i = 0; i < 80; i++) {
        const starYaw = (i * 37) % 360;
        let diff = (starYaw - normYaw + 540) % 360 - 180;
        if (Math.abs(diff) < fov / 2) {
          const sx = ((diff + fov / 2) / fov) * width;
          const sy = ((i * 19) % (height * 0.6)) + (pitch * 2);
          ctx.fillStyle = i % 3 === 0 ? '#FFD700' : '#FFFFFF';
          ctx.beginPath();
          ctx.arc(sx, sy, (i % 3) + 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Bauda Garh Fort Silhouette & Diyas at 0 deg
      const drawFortAt = (targetDeg: number, label: string) => {
        let diff = (targetDeg - normYaw + 540) % 360 - 180;
        if (Math.abs(diff) < fov / 2) {
          const fx = ((diff + fov / 2) / fov) * width;
          const fy = height * 0.45 + (pitch * 2);

          // Fort Pillars
          ctx.fillStyle = '#7D0000';
          ctx.fillRect(fx - 90, fy, 180, height - fy);

          // Gold Gate Arch
          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(fx, fy + 20, 70, Math.PI, 0);
          ctx.stroke();

          // Dome
          ctx.fillStyle = '#B8001F';
          ctx.beginPath();
          ctx.arc(fx, fy - 20, 40, Math.PI, 0);
          ctx.fill();

          ctx.fillStyle = '#FFD700';
          ctx.font = 'bold 14px serif';
          ctx.textAlign = 'center';
          ctx.fillText(label, fx, fy + 50);
        }
      };

      drawFortAt(0, '🏰 Bauda Garh Fort Gate (0°)');
      drawFortAt(90, '🛕 Goddess Durga Gold Sanctum (90°)');
      drawFortAt(220, '🎡 Meena Bazaar Carnival (220°)');
    }
  }, [yaw, pitch, fov, loadedImage, imageError]);

  // Resize canvas to container
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
        renderCanvas();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvas]);

  // Auto-rotate animation frame
  useEffect(() => {
    let animId: number;
    if (isAutoRotating && !isDragging) {
      const animate = () => {
        setYaw(prev => (prev + 0.12) % 360);
        animId = requestAnimationFrame(animate);
      };
      animId = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animId);
  }, [isAutoRotating, isDragging]);

  // Re-render when states change
  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Mouse & Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      startYaw: yaw,
      startPitch: pitch
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Convert drag pixel displacement to yaw & pitch angle degrees
    const sensitivity = fov / 600;
    const newYaw = (dragStart.startYaw - deltaX * sensitivity + 360) % 360;
    const newPitch = Math.max(-30, Math.min(30, dragStart.startPitch + deltaY * sensitivity));
    
    setYaw(newYaw);
    setPitch(newPitch);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        startYaw: yaw,
        startPitch: pitch
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;
    
    const sensitivity = fov / 500;
    const newYaw = (dragStart.startYaw - deltaX * sensitivity + 360) % 360;
    const newPitch = Math.max(-30, Math.min(30, dragStart.startPitch + deltaY * sensitivity));
    
    setYaw(newYaw);
    setPitch(newPitch);
  };

  // Helper: calculate screen position for hotspots
  const getHotspotScreenPos = (targetYaw: number) => {
    const normYaw = ((yaw % 360) + 360) % 360;
    let diff = (targetYaw - normYaw + 540) % 360 - 180; // normalize to [-180, 180]
    const halfFov = fov / 2;
    if (diff >= -halfFov && diff <= halfFov) {
      const xPercent = ((diff + halfFov) / fov) * 100;
      return { visible: true, xPercent };
    }
    return { visible: false, xPercent: 0 };
  };

  const currentDirectionLabel = () => {
    const normYaw = Math.round(((yaw % 360) + 360) % 360);
    if (normYaw >= 337.5 || normYaw < 22.5) return `${normYaw}° (North / Main Gate)`;
    if (normYaw >= 22.5 && normYaw < 67.5) return `${normYaw}° (North-East)`;
    if (normYaw >= 67.5 && normYaw < 112.5) return `${normYaw}° (East / Gold Sanctum)`;
    if (normYaw >= 112.5 && normYaw < 157.5) return `${normYaw}° (South-East)`;
    if (normYaw >= 157.5 && normYaw < 202.5) return `${normYaw}° (South / Food Court)`;
    if (normYaw >= 202.5 && normYaw < 247.5) return `${normYaw}° (West / Meena Bazaar)`;
    return `${normYaw}° (North-West)`;
  };

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-2xl border-2 border-[#D4AF37] bg-black shadow-2xl"
    >
      {/* 360 Canvas Renderer */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Dynamic Hotspots overlay */}
      {hotspots.map((hs) => {
        const { visible, xPercent } = getHotspotScreenPos(hs.targetYaw);
        if (!visible) return null;

        const Icon = hs.icon;
        return (
          <button
            key={hs.id}
            onClick={(e) => {
              e.stopPropagation();
              setActiveHotspotInfo(hs.id);
            }}
            style={{ left: `${xPercent}%`, top: `${50 - pitch}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 p-3 rounded-full ${hs.color} shadow-2xl border-2 border-white animate-bounce hover:scale-125 transition-transform z-20`}
            title={hs.title}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}

      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10">
        
        {/* Live Title & Compass direction */}
        <div className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D4AF37] text-white text-xs font-bold flex items-center gap-2 pointer-events-auto shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{title}</span>
          <span className="text-[#FFD700] border-l border-amber-500/50 pl-2 font-mono text-[11px]">
            🧭 {currentDirectionLabel()}
          </span>
        </div>

        {/* Orbit & Zoom Toolbar */}
        <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-full border border-amber-400/60 pointer-events-auto shadow-md">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2 rounded-full text-xs font-bold transition-all ${
              isAutoRotating ? 'bg-[#B8001F] text-white' : 'bg-white/20 text-white hover:bg-white/40'
            }`}
            title={isAutoRotating ? 'Pause 360° Auto Orbit' : 'Play 360° Auto Orbit'}
          >
            {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setFov(prev => Math.max(45, prev - 10))}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setFov(prev => Math.min(95, prev + 10))}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={() => { setYaw(0); setPitch(0); setFov(75); }}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40"
            title="Reset Camera Center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Drag Instruction Banner at top center */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-[#FFD700] pointer-events-none shadow-sm flex items-center gap-1.5 border border-[#FFD700]/30">
        <span>👈 Drag left / right to rotate 360° camera 👉</span>
      </div>

      {/* Bottom Hotspot Details Drawer */}
      {activeHotspotInfo && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border-2 border-[#D4AF37] text-xs shadow-2xl pointer-events-auto animate-fadeIn flex items-center justify-between gap-4 z-30">
          <div>
            {hotspots.find(h => h.id === activeHotspotInfo) ? (
              <>
                <h4 className="font-extrabold text-[#7D0000] text-sm flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#B8001F]" />
                  <span>{hotspots.find(h => h.id === activeHotspotInfo)?.title}</span>
                </h4>
                <p className="text-amber-950 font-medium mt-0.5">
                  {hotspots.find(h => h.id === activeHotspotInfo)?.desc}
                </p>
              </>
            ) : (
              <div>
                <h4 className="font-extrabold text-[#7D0000] text-sm">360° Pandal Walkthrough Active</h4>
                <p className="text-amber-950 font-medium">Click any glowing hotspot pin to inspect pandal features.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveHotspotInfo(null)}
            className="p-1.5 rounded-lg bg-amber-100 text-amber-950 hover:bg-amber-200"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
