import { useGLTF, useAnimations } from '@react-three/drei'
import { useRef, useEffect } from 'react'

export function AvatarViewer({ scale = 0.5, position = [0, -0.5, 0] }) {
  const group = useRef()
  // Load the Untitle2d.glb file
  const { scene, animations } = useGLTF('/Untitle2d.glb')
  const { actions } = useAnimations(animations, group)

  // Debug: log the loaded scene
  console.log('AvatarViewer scene:', scene)

  // Play the first animation on mount (if any)
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = actions[Object.keys(actions)[0]]
      firstAction.reset().fadeIn(0.2).play()
      return () => firstAction.fadeOut(0.2)
    }
  }, [actions])

  // Move the avatar down a bit for better centering
  return <primitive ref={group} object={scene} scale={scale} position={position} />
} 