import { useState, useEffect, useCallback, useRef } from 'react';
import { speechService } from '../services/speechService';

interface VoiceAssistantOptions {
  autoSpeak?: boolean;
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

interface VoiceAssistantState {
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  lastTranscript: string;
  error: string | null;
}

export const useVoiceAssistant = (options: VoiceAssistantOptions = {}) => {
  const [state, setState] = useState<VoiceAssistantState>({
    isListening: false,
    isSpeaking: false,
    isSupported: false,
    lastTranscript: '',
    error: null
  });

  const [interimTranscript, setInterimTranscript] = useState('');
  const onTranscriptRef = useRef<((transcript: string) => void) | null>(null);
  const onErrorRef = useRef<((error: string) => void) | null>(null);

  // Check speech support on mount
  useEffect(() => {
    const checkSupport = async () => {
      try {
        const support = await speechService.testSpeech();
        setState(prev => ({
          ...prev,
          isSupported: support.recognition && support.synthesis
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isSupported: false,
          error: 'Speech services not available'
        }));
      }
    };

    checkSupport();
  }, []);

  // Start listening for speech input
  const startListening = useCallback(async (
    onTranscript?: (transcript: string) => void,
    onError?: (error: string) => void
  ) => {
    if (!state.isSupported) {
      const error = 'Speech recognition not supported';
      onError?.(error);
      setState(prev => ({ ...prev, error }));
      return;
    }

    onTranscriptRef.current = onTranscript || null;
    onErrorRef.current = onError || null;

    try {
      setState(prev => ({ ...prev, isListening: true, error: null }));
      setInterimTranscript('');

      await speechService.startListening(
        (result) => {
          if (result.isFinal) {
            setInterimTranscript('');
            setState(prev => ({ 
              ...prev, 
              lastTranscript: result.transcript,
              isListening: false 
            }));
            onTranscriptRef.current?.(result.transcript);
          } else {
            setInterimTranscript(result.transcript);
          }
        },
        (error) => {
          setState(prev => ({ 
            ...prev, 
            isListening: false, 
            error 
          }));
          setInterimTranscript('');
          onErrorRef.current?.(error);
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start listening';
      setState(prev => ({ 
        ...prev, 
        isListening: false, 
        error: errorMessage 
      }));
      onError?.(errorMessage);
    }
  }, [state.isSupported]);

  // Stop listening
  const stopListening = useCallback(() => {
    speechService.stopListening();
    setState(prev => ({ ...prev, isListening: false }));
    setInterimTranscript('');
  }, []);

  // Speak text
  const speak = useCallback(async (
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ) => {
    if (!state.isSupported) {
      const error = 'Text-to-speech not supported';
      onError?.(error);
      return;
    }

    try {
      setState(prev => ({ ...prev, isSpeaking: true, error: null }));
      
      await speechService.speak(
        text,
        {
          language: options.language || 'en-US',
          rate: options.rate || 0.8,
          pitch: options.pitch || 1.0,
          volume: options.volume || 0.8
        },
        () => {
          onStart?.();
        },
        () => {
          setState(prev => ({ ...prev, isSpeaking: false }));
          onEnd?.();
        },
        (error) => {
          setState(prev => ({ ...prev, isSpeaking: false, error }));
          onError?.(error);
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to speak';
      setState(prev => ({ ...prev, isSpeaking: false, error: errorMessage }));
      onError?.(errorMessage);
    }
  }, [state.isSupported, options]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    speechService.stopSpeaking();
    setState(prev => ({ ...prev, isSpeaking: false }));
  }, []);

  // Toggle listening
  const toggleListening = useCallback(async (
    onTranscript?: (transcript: string) => void,
    onError?: (error: string) => void
  ) => {
    if (state.isListening) {
      stopListening();
    } else {
      await startListening(onTranscript, onError);
    }
  }, [state.isListening, startListening, stopListening]);

  // Speak form field labels and instructions (accessibility helper)
  const speakFieldInstructions = useCallback(async (fieldName: string, instructions?: string) => {
    if (!options.autoSpeak) return;
    
    const message = instructions 
      ? `${fieldName}. ${instructions}`
      : `Please fill in the ${fieldName} field`;
    
    await speak(message);
  }, [speak, options.autoSpeak]);

  // Speak validation errors
  const speakValidationError = useCallback(async (fieldName: string, error: string) => {
    if (!options.autoSpeak) return;
    
    const message = `Error in ${fieldName}: ${error}`;
    await speak(message);
  }, [speak, options.autoSpeak]);

  // Speak success messages
  const speakSuccess = useCallback(async (message: string) => {
    if (!options.autoSpeak) return;
    
    await speak(`Success: ${message}`);
  }, [speak, options.autoSpeak]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    ...state,
    interimTranscript,
    
    // Actions
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
    clearError,
    
    // Accessibility helpers
    speakFieldInstructions,
    speakValidationError,
    speakSuccess
  };
};

// Hook for voice-enabled form interactions
export const useVoiceForm = (options: VoiceAssistantOptions = {}) => {
  const voice = useVoiceAssistant({ ...options, autoSpeak: true });
  const [currentField, setCurrentField] = useState<string | null>(null);

  // Announce field focus
  const announceField = useCallback(async (
    fieldName: string, 
    instructions?: string,
    value?: string
  ) => {
    setCurrentField(fieldName);
    
    let message = `${fieldName} field`;
    if (value) {
      message += `. Current value: ${value}`;
    }
    if (instructions) {
      message += `. ${instructions}`;
    }
    
    await voice.speak(message);
  }, [voice]);

  // Voice input for current field
  const startVoiceInput = useCallback(async (
    onInput: (value: string) => void,
    fieldType: 'text' | 'email' | 'phone' | 'date' = 'text'
  ) => {
    if (!currentField) return;

    const instructions = getFieldInstructions(fieldType);
    await voice.speak(`Please speak your ${currentField}. ${instructions}`);

    await voice.startListening(
      (transcript) => {
        const processedValue = processVoiceInput(transcript, fieldType);
        onInput(processedValue);
        voice.speak(`You said: ${processedValue}. Is this correct?`);
      },
      (error) => {
        voice.speak(`Sorry, I couldn't understand. Please try again or type your ${currentField}.`);
      }
    );
  }, [currentField, voice]);

  return {
    ...voice,
    currentField,
    announceField,
    startVoiceInput
  };
};

// Helper function to get field-specific instructions
function getFieldInstructions(fieldType: string): string {
  switch (fieldType) {
    case 'email':
      return 'Speak your email address clearly, including the at symbol and domain.';
    case 'phone':
      return 'Speak your phone number digit by digit.';
    case 'date':
      return 'Speak the date in day, month, year format.';
    default:
      return 'Speak clearly and pause when finished.';
  }
}

// Helper function to process voice input based on field type
function processVoiceInput(transcript: string, fieldType: string): string {
  const cleaned = transcript.trim().toLowerCase();
  
  switch (fieldType) {
    case 'email':
      return cleaned
        .replace(/\s+at\s+/g, '@')
        .replace(/\s+dot\s+/g, '.')
        .replace(/\s+/g, '');
    
    case 'phone':
      return cleaned
        .replace(/\D/g, '') // Remove non-digits
        .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); // Format as XXX-XXX-XXXX
    
    case 'date':
      // Simple date processing - in real app, use a proper date parser
      return cleaned
        .replace(/(\d+)(st|nd|rd|th)/, '$1')
        .replace(/\s+/g, ' ');
    
    default:
      return transcript.trim();
  }
}