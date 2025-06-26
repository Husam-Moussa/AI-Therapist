import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TherapistAvatar from './TherapistAvatar'
import GeminiAPI from '../utils/GeminiAPI'

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -30 }
}

const pageTransition = { duration: 0.5, ease: 'easeInOut' }

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
}

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  hover: { scale: 1.04, boxShadow: '0 8px 32px 0 rgba(255,140,0,0.15)' },
  tap: { scale: 0.98 }
}

const TalkingTherapist = () => {
  const [showWelcome, setShowWelcome] = useState(true)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState('neutral')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const geminiAPI = useRef(new GeminiAPI())
  const messagesEndRef = useRef(null)
  const speechRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const speakText = (text) => {
    // Stop any current speech
    if (speechRef.current) {
      speechSynthesis.cancel()
    }

    // Process text for better speech
    const processedText = text
      .replace(/\n/g, ' ') // Remove line breaks
      .replace(/\s+/g, ' ') // Remove extra spaces
      .trim()

    // Wait a moment for speech synthesis to be ready
    setTimeout(() => {
      // Create new speech synthesis
      const utterance = new SpeechSynthesisUtterance(processedText)
      utterance.rate = 1.2 // Faster speech rate
      utterance.pitch = 1.1 // Slightly higher pitch for clarity
      utterance.volume = 0.9 // Higher volume
      
      // Try to use a female voice for the therapist
      const voices = speechSynthesis.getVoices()
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Victoria') ||
        voice.name.includes('Google UK English Female') ||
        voice.name.includes('Microsoft Zira') ||
        voice.name.includes('Google US English Female')
      )
      
      if (femaleVoice) {
        utterance.voice = femaleVoice
      }

      utterance.onstart = () => {
        console.log('Speech started:', processedText)
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        console.log('Speech ended')
        setIsSpeaking(false)
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event)
        setIsSpeaking(false)
      }

      speechRef.current = utterance
      
      // Ensure speech synthesis is ready
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel()
        setTimeout(() => {
          speechSynthesis.speak(utterance)
        }, 100)
      } else {
        speechSynthesis.speak(utterance)
      }
    }, 100)
  }

  const stopSpeaking = () => {
    if (speechRef.current) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    console.log('TalkingTherapist: Sending message:', inputMessage);

    // Stop any current speech
    stopSpeaking()

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      console.log('TalkingTherapist: Calling Gemini API...');
      // Generate response using Gemini API
      const response = await geminiAPI.current.generateResponse(inputMessage, currentEmotion)
      console.log('TalkingTherapist: Received response from Gemini:', response);
      
      // Determine emotion from response (simplified)
      const emotion = determineEmotionFromResponse(response)
      setCurrentEmotion(emotion)

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      
      // Speak the AI response
      setTimeout(() => {
        speakText(response)
      }, 800) // Longer delay to ensure speech synthesis is ready

    } catch (error) {
      console.error('TalkingTherapist: Error generating response:', error)
      
      // Fallback response
      const fallbackMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now, but I'm still here to listen. Can you tell me more about what you're experiencing?",
        sender: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, fallbackMessage])
      
      // Speak the fallback response
      setTimeout(() => {
        speakText(fallbackMessage.text)
      }, 800)
    } finally {
      setIsTyping(false)
    }
  }

  const determineEmotionFromResponse = (response) => {
    const text = response.toLowerCase()
    
    if (text.includes('sad') || text.includes('sorry') || text.includes('difficult')) {
      return 'sad'
    } else if (text.includes('stress') || text.includes('overwhelming') || text.includes('pressure')) {
      return 'concerned'
    } else if (text.includes('anxiety') || text.includes('worry') || text.includes('nervous')) {
      return 'worried'
    } else if (text.includes('angry') || text.includes('frustrated') || text.includes('intensity')) {
      return 'serious'
    } else if (text.includes('hello') || text.includes('welcome') || text.includes('hi')) {
      return 'happy'
    } else {
      return 'neutral'
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearConversation = () => {
    setMessages([])
    setCurrentEmotion('neutral')
    geminiAPI.current.clearHistory()
    stopSpeaking()
  }

  // Welcome screen
  if (showWelcome) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="welcome"
          className="min-h-screen font-sans flex flex-col items-center justify-center bg-black/40 relative overflow-hidden px-4 sm:px-6"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
        >
          <motion.div
            className="text-center max-w-4xl mx-auto px-4 sm:px-6 relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 sm:mb-10 drop-shadow-lg"
              variants={itemVariants}
            >
              Welcome
            </motion.h1>
            {/* Feature Cards Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-16"
              variants={containerVariants}
            >
              {/* Feature Card 1 */}
              <motion.div
                className="group bg-gradient-to-br from-white/15 to-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:border-orange-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl border border-white/10"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-orange-300 transition-colors duration-300 text-center">AI-Powered Conversations</h3>
                <p className="text-xs sm:text-sm text-white/80 text-center">Engage in meaningful conversations powered by advanced AI technology.</p>
              </motion.div>
              {/* Feature Card 2 */}
              <motion.div
                className="group bg-gradient-to-br from-white/15 to-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:border-orange-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl border border-white/10"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-orange-300 transition-colors duration-300 text-center">Voice Responses</h3>
                <p className="text-xs sm:text-sm text-white/80 text-center">Hear the AI therapist's responses spoken aloud for a more immersive experience.</p>
              </motion.div>
              {/* Feature Card 3 */}
              <motion.div
                className="group bg-gradient-to-br from-white/15 to-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:border-orange-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl border border-white/10 sm:col-span-2 lg:col-span-1"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-orange-300 transition-colors duration-300 text-center">Gemini AI</h3>
                <p className="text-xs sm:text-sm text-white/80 text-center">Powered by Google's Gemini AI for intelligent and empathetic responses.</p>
              </motion.div>
            </motion.div>
            {/* CTA Button */}
            <motion.div className="flex justify-center" variants={itemVariants}>
              <motion.div
                onClick={() => setShowWelcome(false)}
                className="group bg-gradient-to-br from-white/15 to-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:border-orange-400/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl border border-white/10 cursor-pointer max-w-sm sm:max-w-md"
                whileHover="hover"
                whileTap="tap"
                variants={cardVariants}
              >
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">Start Conversation</h3>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Show avatar and chat interface
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black/40 px-4 sm:px-6 py-4 sm:py-8">
      {/* Responsive layout: column on small/medium, row on large */}
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8">
        {/* Avatar - positioned above on small/medium screens, left on large screens */}
        <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 flex items-center justify-center order-1 lg:order-1 ml-28 sm:ml-32 lg:ml-0">
          <TherapistAvatar emotion={currentEmotion} isTalking={isTyping} />
        </div>
        
        {/* Chat box - positioned below on small/medium screens, right on large screens */}
        <motion.div
          className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 w-full max-w-2xl order-2 lg:order-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Messages Area */}
          <div className="h-64 sm:h-72 lg:h-80 overflow-y-auto p-3 sm:p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-white/60 text-sm">
                Start a conversation with your virtual therapist...
              </div>
            )}
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`max-w-[80%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Typing Indicator - Below Chat */}
          {isTyping && (
            <div className="px-3 sm:px-4 py-2 border-t border-white/10">
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-white/20 text-white px-3 sm:px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
          
          {/* Input Area */}
          <div className="p-3 sm:p-4 border-t border-white/10">
            <div className="flex space-x-2 sm:space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-sm sm:text-base"
                disabled={isTyping}
              />
              <motion.button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send
              </motion.button>
            </div>
            {/* Clear Conversation Button */}
            {messages.length > 0 && (
              <div className="mt-2 sm:mt-3 flex justify-center">
                <motion.button
                  onClick={clearConversation}
                  className="text-white/60 hover:text-white/80 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Conversation
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TalkingTherapist