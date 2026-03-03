import { useRef, useMemo, useLayoutEffect } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/4.png';
import img5 from '../assets/5.png';
import img6 from '../assets/6.png';
import img7 from '../assets/7.png';
import img8 from '../assets/8.png';
import img9 from '../assets/9.png';
import img10 from '../assets/10.png';
import img11 from '../assets/11.png';
import img12 from '../assets/12.png';
import img13 from '../assets/13.png';
// img2-img13 = tháng 1-12 (mặt trước)
const monthImages = [img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13];
// Mặt sau: tất cả dùng img1
const backImages = [img1, img1, img1, img1, img1, img1, img1, img1, img1, img1, img1, img1];

const FLIP_SPEED = 5;

function CalendarPage({ frontTex, backTex, pageShape, extrudeSettings, targetRotation, stackOffset, height, isClickable, onClick }) {
  const groupRef = useRef();
  const frontTexRef = useRef();
  const backTexRef = useRef();
  const initialized = useRef(false);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (!initialized.current) {
      groupRef.current.rotation.x = targetRotation;
      initialized.current = true;
      return;
    }

    const current = groupRef.current.rotation.x;
    const diff = targetRotation - current;
    if (Math.abs(diff) > 0.001) {
      groupRef.current.rotation.x += diff * Math.min(delta * FLIP_SPEED, 1);
    } else {
      groupRef.current.rotation.x = targetRotation;
    }
  });

  // Fix UVs for front and back texture meshes
  useLayoutEffect(() => {
    const fixUVs = (mesh, mirrorU, mirrorV) => {
      if (!mesh?.geometry) return;
      const geo = mesh.geometry;
      geo.computeBoundingBox();
      const bbox = geo.boundingBox;
      const size = new THREE.Vector3();
      bbox.getSize(size);
      const uvAttr = geo.attributes.uv;
      for (let i = 0; i < uvAttr.count; i++) {
        let u = (geo.attributes.position.getX(i) - bbox.min.x) / size.x;
        let v = (geo.attributes.position.getY(i) - bbox.min.y) / size.y;
        if (mirrorU) u = 1 - u;
        if (mirrorV) v = 1 - v;
        uvAttr.setXY(i, u, v);
      }
      uvAttr.needsUpdate = true;
    };
    fixUVs(frontTexRef.current, false, false);
    fixUVs(backTexRef.current, true, true);
  }, [pageShape]);

  const handlePointerOver = isClickable ? (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  } : undefined;

  const handlePointerOut = isClickable ? () => {
    document.body.style.cursor = 'auto';
  } : undefined;

  const handleClick = isClickable ? (e) => {
    e.stopPropagation();
    onClick?.();
  } : undefined;

  return (
    <group ref={groupRef}>
      <group position={[0, -height / 2, stackOffset]}>
        {/* Page body */}
        <mesh
          castShadow
          receiveShadow
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <extrudeGeometry args={[pageShape, extrudeSettings]} />
          <meshStandardMaterial
            color="#f5f5f0"
            roughness={0.45}
            metalness={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Front face texture */}
        <mesh ref={frontTexRef} position={[0, 0, 0.016]} receiveShadow>
          <shapeGeometry args={[pageShape]} />
          <meshBasicMaterial map={frontTex} transparent toneMapped={false} />
        </mesh>

        {/* Back face texture */}
        <mesh ref={backTexRef} position={[0, 0, -0.006]} rotation={[0, Math.PI, 0]} receiveShadow>
          <shapeGeometry args={[pageShape]} />
          <meshBasicMaterial map={backTex} transparent toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

export function FlipCalendar({ currentPage = 0, onNext, onPrev, ...props }) {
  const monthTextures = useTexture(monthImages);
  const backTextures = useTexture(backImages);
  const backPanelTexRef = useRef();

  useLayoutEffect(() => {
    [...monthTextures, ...backTextures].forEach(t => {
      t.anisotropy = 16;
      t.needsUpdate = true;
    });
  }, [monthTextures, backTextures]);

  // Fix UVs for back panel texture
  useLayoutEffect(() => {
    const mesh = backPanelTexRef.current;
    if (!mesh?.geometry) return;
    const geo = mesh.geometry;
    geo.computeBoundingBox();
    const bbox = geo.boundingBox;
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const uvAttr = geo.attributes.uv;
    for (let i = 0; i < uvAttr.count; i++) {
      const u = (geo.attributes.position.getX(i) - bbox.min.x) / size.x;
      const v = (geo.attributes.position.getY(i) - bbox.min.y) / size.y;
      uvAttr.setXY(i, u, v);
    }
    uvAttr.needsUpdate = true;
  }, []);

  const width = 3.5;
  const height = 2.8;
  const tiltAngle = 0.3;

  const pageShape = useMemo(() => {
    const shape = new THREE.Shape();
    const radius = 0.06;
    const x = -width / 2;
    const y = -height / 2;

    shape.moveTo(x, y + radius);
    shape.lineTo(x, y + height - radius);
    shape.quadraticCurveTo(x, y + height, x + radius, y + height);
    shape.lineTo(x + width - radius, y + height);
    shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    shape.lineTo(x + width, y + radius);
    shape.quadraticCurveTo(x + width, y, x + width - radius, y);
    shape.lineTo(x + radius, y);
    shape.quadraticCurveTo(x, y, x, y + radius);

    return shape;
  }, []);

  const pageExtrudeSettings = useMemo(() => ({
    depth: 0.005,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.003,
    bevelSegments: 2
  }), []);

  const backExtrudeSettings = useMemo(() => ({
    depth: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 3
  }), []);

  const ridgeY = height * Math.cos(tiltAngle);
  const frontZ = height * Math.sin(tiltAngle);

  // Stand side triangle shape
  const standSideShape = useMemo(() => {
    const shape = new THREE.Shape();
    const pad = 0.1;
    const r = 0.05;

    // Shape XY: after rotation [0, π/2, 0] → X maps to -worldZ, Y maps to worldY
    // Top vertex (ridge area)
    shape.moveTo(0, 0.06);
    // Back-bottom edge
    shape.lineTo(frontZ + pad, -ridgeY + r);
    shape.quadraticCurveTo(frontZ + pad, -ridgeY, frontZ + pad - r, -ridgeY);
    // Front-bottom edge
    shape.lineTo(-(frontZ + pad) + r, -ridgeY);
    shape.quadraticCurveTo(-(frontZ + pad), -ridgeY, -(frontZ + pad), -ridgeY + r);
    shape.closePath();

    return shape;
  }, [frontZ, ridgeY]);

  const standExtrudeSettings = useMemo(() => ({
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.005,
    bevelSize: 0.005,
    bevelSegments: 2,
  }), []);

  return (
    <group {...props}>
      <group position={[0, -ridgeY / 2, 0]}>
        <group position={[0, ridgeY, 0]}>

          {/* Back support panel */}
          <group rotation={[tiltAngle, 0, 0]}>
            <group position={[0, -height / 2, 0]}>
              <mesh castShadow receiveShadow>
                <extrudeGeometry args={[pageShape, backExtrudeSettings]} />
                <meshStandardMaterial
                  color="#d4cfc5"
                  roughness={0.6}
                  metalness={0.05}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Back panel front texture */}
              <mesh ref={backPanelTexRef} position={[0, 0, 0.03]} receiveShadow>
                <shapeGeometry args={[pageShape]} />
                <meshBasicMaterial map={backTextures[0]} transparent toneMapped={false} />
              </mesh>
            </group>
          </group>

          {/* 12 flippable calendar pages */}
          {monthTextures.map((texture, index) => {
            const isFlipped = index < currentPage;
            const targetRotation = isFlipped
              ? (tiltAngle - Math.PI)
              : (-tiltAngle);

            const stackOffset = isFlipped
              ? (currentPage - 1 - index) * 0.003
              : (index - currentPage) * -0.003;

            // Current front page → click to go next
            // Most recently flipped page → click to go back
            const isCurrentPage = index === currentPage;
            const isTopFlipped = index === currentPage - 1;
            const isClickable = isCurrentPage || isTopFlipped;
            const clickHandler = isCurrentPage ? onNext : isTopFlipped ? onPrev : undefined;

            return (
              <CalendarPage
                key={index}
                frontTex={texture}
                backTex={backTextures[index]}
                pageShape={pageShape}
                extrudeSettings={pageExtrudeSettings}
                targetRotation={targetRotation}
                stackOffset={stackOffset}
                height={height}
                isClickable={isClickable}
                onClick={clickHandler}
              />
            );
          })}

          {/* Spiral binding rings */}
          {Array.from({ length: 9 }, (_, i) => {
            const xPos = -width / 2 + 0.35 + i * ((width - 0.7) / 8);
            return (
              <mesh key={i} position={[xPos, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[0.09, 0.013, 8, 20]} />
                <meshStandardMaterial color="#b0b0b0" metalness={0.85} roughness={0.15} />
              </mesh>
            );
          })}

          {/* ===== Calendar Stand (Giá đỡ lịch) ===== */}

          {/* Left side support */}
          <mesh
            position={[-width / 2 - 0.08, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            castShadow
            receiveShadow
          >
            <extrudeGeometry args={[standSideShape, standExtrudeSettings]} />
            <meshStandardMaterial color="#5C3317" roughness={0.7} metalness={0.05} side={THREE.DoubleSide} />
          </mesh>

          {/* Right side support */}
          <mesh
            position={[width / 2, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            castShadow
            receiveShadow
          >
            <extrudeGeometry args={[standSideShape, standExtrudeSettings]} />
            <meshStandardMaterial color="#5C3317" roughness={0.7} metalness={0.05} side={THREE.DoubleSide} />
          </mesh>

          {/* Base plate */}
          <mesh position={[0, -ridgeY - 0.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[width + 0.3, 0.1, frontZ * 2 + 0.3]} />
            <meshStandardMaterial color="#5C3317" roughness={0.7} metalness={0.05} />
          </mesh>

          {/* Front rail (thanh chắn trước) */}
          <mesh position={[0, -ridgeY + 0.05, frontZ + 0.15]} castShadow receiveShadow>
            <boxGeometry args={[width + 0.2, 0.13, 0.05]} />
            <meshStandardMaterial color="#5C3317" roughness={0.7} metalness={0.05} />
          </mesh>

        </group>
      </group>
    </group>
  );
}
