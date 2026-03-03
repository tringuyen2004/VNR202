import React, { useMemo, useLayoutEffect, useRef } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { getCalendarData } from '../utils/calendarData';

export function Calendar({ id, ...props }) {
  const { front, back } = useMemo(() => getCalendarData(id), [id]);

  // Load textures
  const [frontTexture, backTexture] = useTexture([front, back]);

  useLayoutEffect(() => {
    frontTexture.anisotropy = 16;
    backTexture.anisotropy = 16;
    frontTexture.needsUpdate = true;
    backTexture.needsUpdate = true;
  }, [frontTexture, backTexture]);

  // Desk calendar dimensions
  const width = 3.5;
  const height = 2.8;
  const tiltAngle = 0.3; // ~17 degrees - each panel tilts from vertical

  // Create page shape (rounded rectangle, no hole)
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

  // Extrude settings for page thickness
  const extrudeSettings = useMemo(() => ({
    depth: 0.01,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 3
  }), []);

  const frontTexRef = useRef();
  const backTexRef = useRef();

  // Fix UVs to map texture across the entire shape
  useLayoutEffect(() => {
    [frontTexRef.current, backTexRef.current].forEach(mesh => {
      if (mesh && mesh.geometry) {
        const geo = mesh.geometry;
        geo.computeBoundingBox();
        const bbox = geo.boundingBox;
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const uvAttribute = geo.attributes.uv;

        for (let i = 0; i < uvAttribute.count; i++) {
          const u = (geo.attributes.position.getX(i) - bbox.min.x) / size.x;
          const v = (geo.attributes.position.getY(i) - bbox.min.y) / size.y;
          uvAttribute.setXY(i, u, v);
        }
        uvAttribute.needsUpdate = true;
      }
    });
  }, [pageShape]);

  // Height of the ridge (top hinge) from the base
  const ridgeY = height * Math.cos(tiltAngle);

  return (
    <group {...props}>
      {/* Center the calendar vertically */}
      <group position={[0, -ridgeY / 2, 0]}>
        {/* Ridge / hinge point at the top */}
        <group position={[0, ridgeY, 0]}>

          {/* Front panel - tilted so bottom comes toward viewer */}
          <group rotation={[-tiltAngle, 0, 0]}>
            <group position={[0, -height / 2, 0]}>
              <mesh castShadow receiveShadow>
                <extrudeGeometry args={[pageShape, extrudeSettings]} />
                <meshStandardMaterial
                  color="#f5f5f0"
                  roughness={0.45}
                  metalness={0.05}
                  side={THREE.DoubleSide}
                />
              </mesh>
              <mesh ref={frontTexRef} position={[0, 0, 0.027]} receiveShadow>
                <shapeGeometry args={[pageShape]} />
                <meshBasicMaterial
                  map={frontTexture}
                  transparent
                  toneMapped={false}
                />
              </mesh>
            </group>
          </group>

          {/* Back panel - tilted so bottom goes away from viewer */}
          <group rotation={[tiltAngle, 0, 0]}>
            <group position={[0, -height / 2, 0]}>
              <mesh castShadow receiveShadow>
                <extrudeGeometry args={[pageShape, extrudeSettings]} />
                <meshStandardMaterial
                  color="#f5f5f0"
                  roughness={0.45}
                  metalness={0.05}
                  side={THREE.DoubleSide}
                />
              </mesh>
              <mesh ref={backTexRef} position={[0, 0, -0.009]} rotation={[0, Math.PI, 0]} receiveShadow>
                <shapeGeometry args={[pageShape]} />
                <meshBasicMaterial
                  map={backTexture}
                  transparent
                  toneMapped={false}
                />
              </mesh>
            </group>
          </group>

          {/* Spiral binding rings along the ridge */}
          {Array.from({ length: 9 }, (_, i) => {
            const xPos = -width / 2 + 0.35 + i * ((width - 0.7) / 8);
            return (
              <mesh key={i} position={[xPos, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[0.09, 0.013, 8, 20]} />
                <meshStandardMaterial color="#b0b0b0" metalness={0.85} roughness={0.15} />
              </mesh>
            );
          })}

        </group>
      </group>
    </group>
  );
}
