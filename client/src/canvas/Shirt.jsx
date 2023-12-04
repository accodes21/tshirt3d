import React, {useState, useEffect} from 'react'
import {easing} from 'maath'
import {useSnapshot} from 'valtio'
import { useFrame } from '@react-three/fiber'
import { Decal, useGLTF, useTexture } from '@react-three/drei'
import state from '../store'

const Shirt = () => {

  const snap = useSnapshot(state)  
  const {nodes, materials} = useGLTF('/shirt_baked.glb')
  const logoTexture = useTexture(snap.logoDecal)
  const fullTexture = useTexture(snap.fullDecal)

  useFrame((state, delta) => easing.dampC(materials.lambert1.color, snap.color, 0.25, delta))
  
  const stateString = JSON.stringify(snap)

  const meshRef = React.useRef();

  // State to store the initial mouse position
  const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 });

  // State to store the model's position
  const [modelPosition, setModelPosition] = useState({ x: 0, y: 0, z: 0 });

  // State to store the rotation of the model
  const [modelRotation, setModelRotation] = useState({ x: 0, y: 0, z: 0 });

  // Event handler for mouse movement
  const handleMouseMove = (event) => {
    if (event.buttons === 1) {
      // Calculate the change in mouse position
      const deltaX = event.clientX - initialMousePosition.x;
      const deltaY = event.clientY - initialMousePosition.y;

      // Update the model's position based on mouse movement
      setModelPosition((prevPosition) => ({
        x: prevPosition.x + deltaX * 0.01,
        y: prevPosition.y - deltaY * 0.01, // Invert deltaY for natural movement
        z: prevPosition.z,
      }));

      // Update the initial mouse position for the next frame
      setInitialMousePosition({ x: event.clientX, y: event.clientY });
    }
  };

  // Animation loop
  useFrame(() => {
    // Rotate the model 360 degrees around the y-axis
    setModelRotation((prevRotation) => ({
      x: prevRotation.x,
      y: (prevRotation.y + 0.003) % (2 * Math.PI), // 0.005 is the rotation speed
      z: prevRotation.z,
    }));

    // Apply the rotation and position to the mesh
    meshRef.current.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
    meshRef.current.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
  });

  return (
    <group
      key={stateString}
    >
      <mesh
        ref={meshRef}
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {snap.isFullTexture && (
          <Decal 
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}

        {snap.isLogoTexture && (
          <Decal 
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={0.15}
            map={logoTexture}
            map-anisotropy={16}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  )
}

export default Shirt