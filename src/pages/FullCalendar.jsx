import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { FlipCalendar } from '../components/FlipCalendar';

const pageLabels = [
  'Bìa', 'Tháng 1', 'Tháng 2', 'Tháng 3',
  'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7',
  'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

function FullCalendar() {
  const [currentPage, setCurrentPage] = useState(0);

  const goNext = () => setCurrentPage(prev => Math.min(prev + 1, 13));
  const goPrev = () => setCurrentPage(prev => Math.max(prev - 1, 0));

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="w-full h-screen bg-[#e0e0e0] flex flex-col items-center justify-center relative">
      {/* Top bar */}
      <div className="absolute top-0 right-0 p-4 z-20 text-right">
        <h1 className="text-xl font-bold text-slate-700">Lịch bàn lật</h1>
        <p className="text-slate-500 text-sm">Click trang để lật • Kéo để xoay • Phím ← →</p>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 2, 10], fov: 45 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            shadow-mapSize={2048}
            castShadow
          />

          <FlipCalendar currentPage={currentPage} onNext={goNext} onPrev={goPrev} />

          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={12}
            blur={2.5}
            far={4.5}
          />

          <OrbitControls
            enablePan={false}
            zoomToCursor
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.5}
            minDistance={4}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>

      {/* Bottom navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        <button
          onClick={goPrev}
          disabled={currentPage === 0}
          className="bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg text-slate-700 font-medium hover:bg-white hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          ← Trước
        </button>

        <div className="bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg text-slate-700 font-bold min-w-[120px] text-center select-none">
          {currentPage < 13 ? pageLabels[currentPage] : 'Hết'}
        </div>

        <button
          onClick={goNext}
          disabled={currentPage === 13}
          className="bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-lg text-slate-700 font-medium hover:bg-white hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Sau →
        </button>
      </div>

      {/* Page dots indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {Array.from({ length: 13 }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === currentPage
                ? 'bg-slate-700 scale-125'
                : i < currentPage
                  ? 'bg-slate-400'
                  : 'bg-slate-300'
            } hover:bg-slate-500`}
          />
        ))}
      </div>
    </div>
  );
}

export default FullCalendar;
