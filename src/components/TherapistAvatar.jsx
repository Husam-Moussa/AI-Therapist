import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { AvatarViewer } from './AvatarViewer'

const TherapistAvatar = ({ emotion = 'neutral', isTalking = false }) => {
  return (
    <div className="w-full h-full relative">
      <Canvas 
        camera={{ position: [0, 1, 3], fov: 50 }}
        style={{ background:'Transparent' }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 5, 2]} intensity={0.8} />
        <pointLight position={[-2, 2, 2]} intensity={0.5} />
        
        <AvatarViewer scale={0.7} position={[0, -1.5, 0]} />
        
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}

export default TherapistAvatar 