// Speech Recognition and Text-to-Speech Service for Zambian Admissions System

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

interface VoiceSettings {
  language: string;
  voice?: string;
  rate: number;
  pitch: number;
  volume: number;
}

class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  // Default voice settings for Zambian context
  private defaultSettings: VoiceSettings = {
    language: 'en-US', // English with clear pronunciation
    rate: 0.8, // Slightly slower for clarity
    pitch: 1.0,
    volume: 0.8
  };

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US'; // Primary language
      this.recognition.maxAlternatives = 3;
    }
  }

  // Check if speech recognition is supported
  isSpeechRecognitionSupported(): boolean {
    return this.recognition !== null;
  }

  // Check if text-to-speech is supported
  isTextToSpeechSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  // Start listening for speech input
  startListening(
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        const error = 'Speech recognition not supported';
        onError?.(error);
        reject(new Error(error));
        return;
      }

      if (this.isListening) {
        resolve();
        return;
      }

      this.recognition.onstart = () => {
        this.isListening = true;
        resolve();
      };

      this.recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript.trim();
          
          if (transcript) {
            onResult({
              transcript,
              confidence: result[0].confidence || 0,
              isFinal: result.isFinal
            });
          }
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        const errorMessage = this.getErrorMessage(event.error);
        onError?.(errorMessage);
        reject(new Error(errorMessage));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        const errorMessage = 'Failed to start speech recognition';
        onError?.(errorMessage);
        reject(new Error(errorMessage));
      }
    });
  }

  // Stop listening
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Convert text to speech
  speak(
    text: string, 
    settings?: Partial<VoiceSettings>,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isTextToSpeechSupported()) {
        const error = 'Text-to-speech not supported';
        onError?.(error);
        reject(new Error(error));
        return;
      }

      // Stop any current speech
      this.stopSpeaking();

      const finalSettings = { ...this.defaultSettings, ...settings };
      
      // Clean and prepare text for speech
      const cleanText = this.prepareTextForSpeech(text);
      
      this.currentUtterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance.lang = finalSettings.language;
      this.currentUtterance.rate = finalSettings.rate;
      this.currentUtterance.pitch = finalSettings.pitch;
      this.currentUtterance.volume = finalSettings.volume;

      // Try to use a specific voice if available
      if (finalSettings.voice) {
        const voices = this.synthesis.getVoices();
        const selectedVoice = voices.find(voice => 
          voice.name.includes(finalSettings.voice!) || 
          voice.lang.includes(finalSettings.language)
        );
        if (selectedVoice) {
          this.currentUtterance.voice = selectedVoice;
        }
      }

      this.currentUtterance.onstart = () => {
        onStart?.();
      };

      this.currentUtterance.onend = () => {
        this.currentUtterance = null;
        onEnd?.();
        resolve();
      };

      this.currentUtterance.onerror = (event) => {
        this.currentUtterance = null;
        const errorMessage = `Speech synthesis error: ${event.error}`;
        onError?.(errorMessage);
        reject(new Error(errorMessage));
      };

      this.synthesis.speak(this.currentUtterance);
    });
  }

  // Stop current speech
  stopSpeaking(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  // Check if currently speaking
  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  // Get available voices
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }

  // Get voices suitable for English (Zambian context)
  getEnglishVoices(): SpeechSynthesisVoice[] {
    return this.getAvailableVoices().filter(voice => 
      voice.lang.startsWith('en-') && 
      (voice.name.includes('Female') || voice.name.includes('Male'))
    );
  }

  // Prepare text for better speech synthesis
  private prepareTextForSpeech(text: string): string {
    return text
      // Remove markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      // Replace common abbreviations with full words
      .replace(/\bGrade\s+(\d+)/g, 'Grade $1')
      .replace(/\bID\b/g, 'identification')
      .replace(/\bNRC\b/g, 'National Registration Card')
      .replace(/\bPDF\b/g, 'PDF document')
      .replace(/\bJPG\b/g, 'image file')
      .replace(/\bPNG\b/g, 'image file')
      // Add pauses for better comprehension
      .replace(/\./g, '. ')
      .replace(/\?/g, '? ')
      .replace(/!/g, '! ')
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Get user-friendly error messages
  private getErrorMessage(error: string): string {
    switch (error) {
      case 'no-speech':
        return 'No speech was detected. Please try speaking again.';
      case 'audio-capture':
        return 'Microphone access denied. Please allow microphone access.';
      case 'not-allowed':
        return 'Microphone access not allowed. Please enable microphone permissions.';
      case 'network':
        return 'Network error occurred. Please check your internet connection.';
      case 'service-not-allowed':
        return 'Speech recognition service not available.';
      default:
        return `Speech recognition error: ${error}`;
    }
  }

  // Test speech functionality
  async testSpeech(): Promise<{ recognition: boolean; synthesis: boolean }> {
    const recognition = this.isSpeechRecognitionSupported();
    const synthesis = this.isTextToSpeechSupported();

    if (synthesis) {
      try {
        await this.speak('Speech test successful', { volume: 0.5 });
      } catch (error) {
        console.warn('Speech synthesis test failed:', error);
      }
    }

    return { recognition, synthesis };
  }
}

// Singleton instance
export const speechService = new SpeechService();

// Utility functions for common speech interactions
export const speakWelcomeMessage = async () => {
  await speechService.speak(
    "Welcome to the Zambian School Admissions System. I'm here to help you with your application. You can ask me questions about the admission process, required documents, or any other concerns you may have.",
    { rate: 0.7 }
  );
};

export const speakErrorMessage = async (error: string) => {
  await speechService.speak(
    `I'm sorry, there was an error: ${error}. Please try again or contact support if the problem persists.`,
    { rate: 0.8 }
  );
};

export const speakHelpMessage = async () => {
  await speechService.speak(
    "I can help you with: checking application requirements, explaining document upload process, finding school information, or answering questions about admission deadlines. What would you like to know?",
    { rate: 0.7 }
  );
};

// Type declarations for speech recognition (if not available globally)
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}