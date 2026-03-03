import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';
import { Calendar } from '../components/Calendar';
import { useParams, Link } from 'react-router-dom';

function Detail() {
  const { id } = useParams();

  return (
    <div className="w-full h-screen bg-[#e0e0e0] flex flex-col items-center justify-center relative">
      <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-start pointer-events-none">
        <Link to="/" className="pointer-events-auto bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-sm md:text-base text-slate-700 font-medium hover:bg-white transition-colors whitespace-nowrap">
          ← Trở lại
        </Link>
        <div className="text-right">
             <h1 className="text-xl font-bold text-slate-700">Lịch bàn #{id}</h1>
             <p className="text-slate-500 text-sm">Kéo để xoay • Cuộn để phóng to</p>
        </div>
      </div>

      <Canvas
        shadows
        camera={{ position: [0, 0, 12], fov: 45 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <Environment preset="studio" />
          
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />

          <Float
            speed={2} // Animation speed
            rotationIntensity={0.5} // XYZ rotation intensity
            floatIntensity={0.5} // Up/down float intensity
          >
            <Calendar id={id} />
          </Float>

          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.4}
            scale={12}
            blur={2.5}
            far={4.5}
          />
          
          <OrbitControls 
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            minDistance={4}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Detail;
