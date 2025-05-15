import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Seat } from '../../contexts/BookingContext';

interface SeatModelProps {
  seat: Seat;
  isSelected: boolean;
  onClick: () => void;
}

const SeatModel: React.FC<SeatModelProps> = ({ seat, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  // Define color based on seat status
  let color;
  if (!seat.isAvailable) {
    color = 'red';
  } else if (isSelected) {
    color = 'blue';
  } else if (seat.isLadiesOnly) {
    color = 'purple';
  } else {
    color = 'green';
  }
  
  // Determine seat dimensions based on type
  let width = 1;
  let height = 0.2;
  let depth = 2;
  
  if (seat.type === 'side-lower' || seat.type === 'side-upper') {
    width = 0.8;
    depth = 1.5;
  }
  
  // Hover animation
  useFrame(() => {
    if (meshRef.current) {
      if (hovered && seat.isAvailable) {
        meshRef.current.position.y = seat.position.y + Math.sin(Date.now() * 0.005) * 0.05;
      } else {
        meshRef.current.position.y = seat.position.y;
      }
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={[seat.position.x, seat.position.y, seat.position.z]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (seat.isAvailable) onClick();
      }}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial 
        color={hovered && seat.isAvailable ? '#ffffff' : color} 
        metalness={0.1}
        roughness={0.5}
      />
      <Html position={[0, 0.2, 0]} center>
        <div 
          className="bg-white bg-opacity-80 px-2 py-1 rounded text-xs pointer-events-none"
          style={{ 
            color: '#000', 
            fontWeight: 'bold', 
            whiteSpace: 'nowrap',
            textShadow: '0 0 2px white'
          }}
        >
          {seat.number}
        </div>
      </Html>
    </mesh>
  );
};

// Custom HTML component for Three.js
const Html: React.FC<{ 
  position: [number, number, number];
  center?: boolean;
  children: React.ReactNode;
}> = ({ position, center = true, children }) => {
  const ref = useRef<THREE.Group>(null!);
  
  useFrame(({ camera }) => {
    if (ref.current) {
      ref.current.quaternion.copy(camera.quaternion);
    }
  });
  
  return (
    <group ref={ref} position={position}>
      <Html2D center={center}>{children}</Html2D>
    </group>
  );
};

// Basic HTML implementation for Three.js
const Html2D: React.FC<{ 
  center?: boolean;
  children: React.ReactNode;
}> = ({ center = true, children }) => {
  return (
    <div
      className="html-annotation"
      style={{
        position: 'absolute',
        transform: center ? 'translate(-50%, -50%)' : 'none',
        pointerEvents: 'none'
      }}
    >
      {children}
    </div>
  );
};

export default SeatModel;