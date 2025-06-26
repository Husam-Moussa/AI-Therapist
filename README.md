# AI Therapist - Emotional AI Companion

An interactive AI therapist application with emotional intelligence and iconic visual design. The therapist can analyze user emotions, respond empathetically, and display emotional expressions through a dynamic avatar.

## 🌟 Features

### Emotional Intelligence
- **Real-time Emotion Analysis**: Analyzes user messages to detect emotional states (sad, anxious, angry, happy, neutral)
- **Context-Aware Responses**: Provides therapeutic responses based on detected emotions
- **Intensity Detection**: Recognizes emotional intensity modifiers (very, extremely, etc.)

### Iconic Therapist Avatar
- **Dynamic Facial Expressions**: Eyes, eyebrows, and mouth change based on emotional context
- **Professional Appearance**: Glasses, styled hair, and professional attire
- **Emotional Color Auras**: Background glow changes color based on detected emotions
- **Natural Animations**: Blinking, subtle movements, and typing indicators
- **Responsive Design**: Adapts to different screen sizes

### Interactive Chat Interface
- **Real-time Messaging**: Smooth conversation flow with typing indicators
- **Message History**: Scrollable chat history with timestamps
- **Professional UI**: Clean, therapeutic design with calming colors
- **Accessibility**: Focus states and keyboard navigation

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd therapist
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Use

1. **Start a Session**: The therapist (Dr. Sarah Chen) will greet you with a welcoming message
2. **Share Your Thoughts**: Type your feelings, concerns, or experiences in the chat input
3. **Watch the Response**: The therapist will analyze your message and respond with appropriate emotional support
4. **Observe Emotions**: Notice how the therapist's facial expressions and background colors change based on your emotional state

### Example Conversations

**Sad/Depressed:**
- "I've been feeling really down lately"
- "I miss my friend who moved away"
- "Nothing seems to make me happy anymore"

**Anxious/Worried:**
- "I'm worried about my upcoming presentation"
- "What if I fail my exam?"
- "I can't stop thinking about what might go wrong"

**Angry/Frustrated:**
- "I'm so mad at my boss"
- "My relationship is falling apart"
- "I feel betrayed by someone I trusted"

**Happy/Positive:**
- "I got the job I wanted!"
- "I'm feeling really good about myself today"
- "I accomplished something I'm proud of"

## 🧠 How It Works

### Emotion Engine
The `EmotionEngine` class analyzes text using:
- **Keyword Matching**: Extensive vocabulary for each emotional state
- **Intensity Modifiers**: Recognizes words like "very", "extremely", "slightly"
- **Context Analysis**: Understands phrases and patterns that indicate emotions
- **Negation Handling**: Accounts for negative statements

### Response Generation
Therapist responses are generated based on:
- **Detected Emotion**: Different response strategies for each emotional state
- **Therapeutic Techniques**: Empathetic listening, validation, and gentle guidance
- **Professional Tone**: Maintains appropriate therapeutic boundaries

### Visual Feedback
The avatar responds through:
- **Facial Expressions**: Eyes, eyebrows, mouth, and cheeks change
- **Color Psychology**: Background colors reflect emotional states
- **Animations**: Smooth transitions and natural movements
- **Typing Indicators**: Shows when the therapist is "thinking"

## 🎨 Design Philosophy

### Therapeutic Approach
- **Non-judgmental**: Creates a safe space for emotional expression
- **Empathetic**: Validates feelings and experiences
- **Professional**: Maintains appropriate therapeutic boundaries
- **Supportive**: Offers gentle guidance and encouragement

### Visual Design
- **Calming Colors**: Soft gradients and muted tones
- **Professional Appearance**: Clean, trustworthy aesthetic
- **Accessibility**: High contrast and readable typography
- **Responsive**: Works on all device sizes

## 🔧 Technical Details

### Built With
- **React 19**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Fast build tool and development server
- **JavaScript ES6+**: Modern JavaScript features

### Project Structure
```
src/
├── components/
│   ├── TherapistAvatar.jsx    # Emotional avatar component
│   └── ChatInterface.jsx      # Chat interface component
├── utils/
│   └── EmotionEngine.js       # Emotion analysis engine
├── App.jsx                    # Main application component
├── App.css                    # Custom styles and animations
└── main.jsx                   # Application entry point
```

### Key Components

#### TherapistAvatar
- Renders the iconic therapist with dynamic expressions
- Handles emotion-based visual changes
- Manages animations and transitions

#### ChatInterface
- Manages message display and input
- Handles user interactions
- Provides typing indicators and timestamps

#### EmotionEngine
- Analyzes text for emotional content
- Provides emotion classification
- Handles intensity and context analysis

## 🚀 Future Enhancements

- **Voice Integration**: Speech-to-text and text-to-speech capabilities
- **Advanced AI**: Integration with more sophisticated language models
- **Session History**: Save and review past conversations
- **Mood Tracking**: Visual charts of emotional patterns over time
- **Multiple Therapists**: Different personality types and specialties
- **Group Sessions**: Support for multiple users
- **Crisis Detection**: Automatic detection of crisis situations
- **Professional Integration**: Connect with human therapists

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Important Notice

This AI therapist is designed for entertainment and educational purposes. It is not a substitute for professional mental health care. If you are experiencing mental health concerns, please seek help from a qualified mental health professional.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need support, please open an issue in the repository.
