import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import TalkingTherapist from './components/TalkingTherapist'

const App = () => {
  const [videoStatus, setVideoStatus] = useState('loading')
  const videoRef = useRef(null)

  useEffect(() => {
    console.log('App component mounted, video ref:', videoRef.current)
    
    // Try to load video after component mounts
    setTimeout(() => {
      if (videoRef.current) {
        console.log('Attempting to load video...')
        videoRef.current.load()
      }
    }, 100)
  }, [])

  const handleVideoLoad = () => {
    console.log('Video loaded successfully')
    setVideoStatus('loaded')
  }

  const handleVideoError = (error) => {
    console.error('Video error:', error)
    setVideoStatus('error')
  }

  const handleVideoCanPlay = () => {
    console.log('Video can play')
    setVideoStatus('can-play')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          onCanPlay={handleVideoCanPlay}
          style={{ 
            display: videoStatus === 'loaded' || videoStatus === 'can-play' ? 'block' : 'none',
            opacity: videoStatus === 'loaded' || videoStatus === 'can-play' ? 1 : 0
          }}
        >
          <source src="/156473-812592018_small.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Fallback background */}
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        <TalkingTherapist />
      </div>
    </div>
  )
}

export default App
