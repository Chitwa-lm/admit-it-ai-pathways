import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageCircle, 
  X, 
  Send,
  HelpCircle,
  Settings,
  Loader
} from 'lucide-react';
import { speechService, speakWelcomeMessage, speakErrorMessage } from '../../services/speechService';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface VoiceChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  context?: 'application' | 'documents' | 'general';
}

export const VoiceChatbot: React.FC<VoiceChatbotProps> = ({
  isOpen,
  onClose,
  context = 'general'
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechSupport, setSpeechSupport] = useState({ recognition: false, synthesis: false });
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize speech support check
  useEffect(() => {
    const checkSpeechSupport = async () => {
      const support = await speechService.testSpeech();
      setSpeechSupport(support);
    };
    
    if (isOpen) {
      checkSpeechSupport();
      // Add welcome message
      addBotMessage("Hello! I'm here to help you with your school admission application. You can speak to me or type your questions.");
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = useCallback((content: string, shouldSpeak = true) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type: 'bot',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    
    if (shouldSpeak && voiceEnabled && speechSupport.synthesis) {
      setIsSpeaking(true);
      speechService.speak(
        content,
        { rate: 0.8 },
        undefined,
        () => setIsSpeaking(false),
        (error) => {
          console.error('Speech error:', error);
          setIsSpeaking(false);
        }
      );
    }
  }, [voiceEnabled, speechSupport.synthesis]);

  const addUserMessage = useCallback((content: string, isVoice = false) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      isVoice
    };
    
    setMessages(prev => [...prev, message]);
  }, []);

  const processUserInput = useCallback(async (input: string, isVoice = false) => {
    if (!input.trim()) return;

    addUserMessage(input, isVoice);
    setIsProcessing(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await generateBotResponse(input, context);
      addBotMessage(response);
    } catch (error) {
      console.error('Error processing input:', error);
      addBotMessage("I'm sorry, I couldn't process your request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [context, addUserMessage, addBotMessage]);

  const startListening = useCallback(async () => {
    if (!speechSupport.recognition) {
      addBotMessage("Sorry, speech recognition is not supported on your device. Please type your message instead.");
      return;
    }

    try {
      setIsListening(true);
      setInterimTranscript('');
      
      await speechService.startListening(
        (result) => {
          if (result.isFinal) {
            setInterimTranscript('');
            if (result.transcript.trim()) {
              processUserInput(result.transcript, true);
            }
            setIsListening(false);
          } else {
            setInterimTranscript(result.transcript);
          }
        },
        (error) => {
          console.error('Speech recognition error:', error);
          setIsListening(false);
          setInterimTranscript('');
          addBotMessage(`Speech recognition error: ${error}. Please try typing your message instead.`);
        }
      );
    } catch (error) {
      setIsListening(false);
      setInterimTranscript('');
      console.error('Failed to start listening:', error);
    }
  }, [speechSupport.recognition, processUserInput, addBotMessage]);

  const stopListening = useCallback(() => {
    speechService.stopListening();
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const toggleSpeaking = useCallback(() => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  const handleTextSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      processUserInput(textInput);
      setTextInput('');
    }
  }, [textInput, processUserInput]);

  const handleQuickAction = useCallback((action: string) => {
    processUserInput(action);
  }, [processUserInput]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6" />
            <div>
              <h3 className="text-lg font-semibold">Admissions Assistant</h3>
              <p className="text-sm text-blue-100">
                {speechSupport.recognition ? 'Voice & Text Support' : 'Text Support Only'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Voice Toggle */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-lg ${voiceEnabled ? 'bg-blue-500' : 'bg-gray-500'}`}
              title={voiceEnabled ? 'Disable voice responses' : 'Enable voice responses'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-500 rounded-lg"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 shadow-sm border'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                  <span>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  {message.isVoice && (
                    <Mic className="w-3 h-3 ml-2" />
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Interim Transcript */}
          {interimTranscript && (
            <div className="flex justify-end">
              <div className="bg-blue-100 p-3 rounded-lg border-2 border-blue-300 border-dashed">
                <p className="text-sm text-blue-800 italic">{interimTranscript}</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="p-3 border-t bg-gray-50">
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => handleQuickAction("What documents do I need for Grade 8 admission?")}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
            >
              Required Documents
            </button>
            <button
              onClick={() => handleQuickAction("How do I check my application status?")}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200"
            >
              Application Status
            </button>
            <button
              onClick={() => handleQuickAction("What are the admission deadlines?")}
              className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200"
            >
              Deadlines
            </button>
            <button
              onClick={() => handleQuickAction("How do I upload documents?")}
              className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
            >
              Upload Help
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white rounded-b-lg">
          <form onSubmit={handleTextSubmit} className="flex items-center space-x-2">
            {/* Voice Input Button */}
            {speechSupport.recognition && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-3 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
            
            {/* Text Input */}
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Type your message or use voice..."}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isListening}
            />
            
            {/* Send Button */}
            <button
              type="submit"
              disabled={!textInput.trim() || isListening}
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
            
            {/* Stop Speaking Button */}
            {isSpeaking && (
              <button
                type="button"
                onClick={toggleSpeaking}
                className="p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                title="Stop speaking"
              >
                <VolumeX className="w-5 h-5" />
              </button>
            )}
          </form>
          
          {/* Status Indicators */}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              {speechSupport.recognition && (
                <span className="flex items-center space-x-1">
                  <Mic className="w-3 h-3" />
                  <span>Voice input available</span>
                </span>
              )}
              {speechSupport.synthesis && voiceEnabled && (
                <span className="flex items-center space-x-1">
                  <Volume2 className="w-3 h-3" />
                  <span>Voice responses enabled</span>
                </span>
              )}
            </div>
            
            {isListening && (
              <span className="text-red-500 animate-pulse">
                🔴 Listening...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Bot response generation (simplified - in real app, this would connect to an AI service)
async function generateBotResponse(input: string, context: string): Promise<string> {
  const inputLower = input.toLowerCase();
  
  // Document-related queries
  if (inputLower.includes('document') || inputLower.includes('upload') || inputLower.includes('file')) {
    if (inputLower.includes('grade 8') || inputLower.includes('grade eight')) {
      return "For Grade 8 admission, you need: Birth Certificate, Grade 7 Certificate, Medical Report, Passport Photo, Parent/Guardian ID, and Proof of Residence. All documents should be clear photos or PDF files under 5MB each.";
    }
    if (inputLower.includes('grade 10') || inputLower.includes('grade ten')) {
      return "For Grade 10 admission, you need: Birth Certificate, Grade 9 Certificate, Medical Report, Passport Photo, Parent/Guardian ID, and Proof of Residence. Make sure all documents are recent and clearly readable.";
    }
    if (inputLower.includes('grade 12') || inputLower.includes('grade twelve')) {
      return "For Grade 12 admission, you need: Birth Certificate, Grade 12 Certificate, and Passport Photo. Medical Report and Parent ID are optional but recommended.";
    }
    return "You can upload documents by clicking the upload area or dragging files directly. Our system will automatically verify each document. Supported formats are JPG, PNG, and PDF files up to 5MB each.";
  }
  
  // Status-related queries
  if (inputLower.includes('status') || inputLower.includes('application') || inputLower.includes('progress')) {
    return "You can check your application status in the Parent Portal. Look for the 'My Applications' section where you'll see real-time updates on your application progress, from submission to final decision.";
  }
  
  // Deadline queries
  if (inputLower.includes('deadline') || inputLower.includes('when') || inputLower.includes('date')) {
    return "Application deadlines vary by school and grade level. Generally, applications open in January and close in March for the following academic year. Check with your specific school for exact dates.";
  }
  
  // Help queries
  if (inputLower.includes('help') || inputLower.includes('how') || inputLower.includes('what')) {
    return "I can help you with: checking document requirements, explaining the upload process, tracking application status, understanding deadlines, and answering questions about the admission process. What specific area would you like help with?";
  }
  
  // School information
  if (inputLower.includes('school') || inputLower.includes('find') || inputLower.includes('search')) {
    return "You can search for schools by province, district, or school type in the School Search section. Each school profile shows available places, admission requirements, and contact information.";
  }
  
  // Error or problem queries
  if (inputLower.includes('error') || inputLower.includes('problem') || inputLower.includes('issue')) {
    return "If you're experiencing technical issues, try refreshing the page or clearing your browser cache. For document upload problems, ensure your files are under 5MB and in JPG, PNG, or PDF format. Contact support if issues persist.";
  }
  
  // Default response
  return "I understand you're asking about the admission process. I can help with document requirements, application status, school information, and technical support. Could you please be more specific about what you need help with?";
}