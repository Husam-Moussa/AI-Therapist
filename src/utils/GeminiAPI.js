const GEMINI_API_KEY = 'AIzaSyDJieg7Lc1GS_-L3fqsfxdj6pJ8Sy_bZDk';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

class GeminiAPI {
  constructor() {
    this.apiKey = GEMINI_API_KEY;
    this.conversationHistory = [];
  }

  async generateResponse(userMessage, emotion = 'neutral') {
    try {
      console.log('Gemini API: Generating response for:', userMessage);
      
      // Build conversation context
      const systemPrompt = `You are a compassionate AI therapist. Respond with empathy, understanding, and therapeutic guidance. Keep responses conversational and supportive. Current emotion context: ${emotion}.`;

      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      // Prepare the request payload
      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemPrompt}\n\nUser: ${userMessage}\n\nPlease respond as a supportive AI therapist. Keep your response concise and conversational (2-3 sentences maximum):`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 150,
        }
      };

      console.log('Gemini API: Sending request to:', GEMINI_API_URL);
      
      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Gemini API: Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API: Error response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini API: Response data:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        console.log('Gemini API: Generated response:', aiResponse);
        
        // Add AI response to history
        this.conversationHistory.push({
          role: 'model',
          parts: [{ text: aiResponse }]
        });

        return aiResponse;
      } else {
        console.error('Gemini API: Invalid response format:', data);
        throw new Error('Invalid response format from Gemini API');
      }

    } catch (error) {
      console.error('Gemini API Error:', error);
      console.log('Gemini API: Falling back to local response');
      // Fallback to local response if API fails
      return this.getFallbackResponse(userMessage, emotion);
    }
  }

  getFallbackResponse(userMessage, emotion) {
    console.log('Gemini API: Using fallback response for:', userMessage);
    
    const responses = {
      greeting: [
        "Hello! I'm here to listen and support you. How are you feeling today?",
        "Welcome! I'm ready to have a meaningful conversation with you. What's on your mind?",
        "Hi there! I'm here to help you work through whatever you're experiencing. How can I assist you today?"
      ],
      stress: [
        "I can sense you're feeling stressed. Let's take a moment to breathe together. What's causing you the most concern right now?",
        "Stress can be overwhelming. Remember, it's okay to feel this way. Can you tell me more about what's troubling you?",
        "I hear that you're under a lot of pressure. Let's explore what's happening and find some ways to help you cope."
      ],
      sadness: [
        "I'm sorry you're feeling sad. Your feelings are valid, and I'm here to listen. Would you like to talk about what's bringing you down?",
        "It sounds like you're going through a difficult time. Remember that it's okay to not be okay. What would be most helpful for you right now?",
        "I can hear the sadness in your words. Let's work through this together. What's been the hardest part for you?"
      ],
      anxiety: [
        "Anxiety can feel very overwhelming. Let's take this one step at a time. What specific worries are you carrying right now?",
        "I understand anxiety can be really challenging. Remember to breathe. Can you tell me what's making you feel most anxious?",
        "Anxiety often makes everything feel bigger than it is. Let's break this down together. What's the main source of your worry?"
      ],
      anger: [
        "I can feel the intensity of your emotions. It's okay to be angry. Can you help me understand what's behind these feelings?",
        "Anger is a natural emotion, and it sounds like you have good reasons to feel this way. What happened that led to these feelings?",
        "I hear your frustration. Let's explore what's causing this anger and find healthy ways to process these emotions."
      ],
      default: [
        "I'm here to listen and support you. Can you tell me more about what you're experiencing?",
        "Thank you for sharing that with me. How are you feeling about this situation?",
        "I appreciate you opening up to me. What would be most helpful for you right now?"
      ]
    };

    // Simple keyword matching for emotion detection
    const message = userMessage.toLowerCase();
    let emotionType = 'default';

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      emotionType = 'greeting';
    } else if (message.includes('stress') || message.includes('overwhelmed') || message.includes('pressure')) {
      emotionType = 'stress';
    } else if (message.includes('sad') || message.includes('depressed') || message.includes('down')) {
      emotionType = 'sadness';
    } else if (message.includes('anxious') || message.includes('worry') || message.includes('nervous')) {
      emotionType = 'anxiety';
    } else if (message.includes('angry') || message.includes('mad') || message.includes('frustrated')) {
      emotionType = 'anger';
    }

    const responseArray = responses[emotionType];
    const fallbackResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
    console.log('Gemini API: Fallback response:', fallbackResponse);
    return fallbackResponse;
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

export default GeminiAPI; 