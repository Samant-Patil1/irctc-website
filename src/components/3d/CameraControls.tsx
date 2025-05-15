import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const CameraControls = () => {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 5;
    controls.maxDistance = 20;
    
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);
  
  return null;
};

export default CameraControls;