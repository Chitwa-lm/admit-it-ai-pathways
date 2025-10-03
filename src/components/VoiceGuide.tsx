import React, { useState } from 'react';
import { Mic, Volume2, MessageCircle, X, Play, Pause } from 'lucide-react';
import { speechService } from '../services/speechService';

export const VoiceGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakInstructions = async () => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    try {
      await speechService.speak(
        "Welcome to voice mode! Here's how to use it: First, click the microphone button next to any form field to use voice input. Second, click the floating chat button to ask questions with your voice. Third, toggle the volume button to enable or disable voice responses. Voice mode works best in Chrome, Edge, and Safari browsers.",
        { rate: 0.7 },
        undefined,
        () => setIsSpeaking(false)
      );
    } catch (error) {
      setIsSpeaking(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 flex items-center space-x-2 z-50"
      >
        <Mic className="w-4 h-4" />
        <span>Voice Guide</span>
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-xl border p-6 max-w-sm z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">🎤 Voice Mode Guide</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
          <Mic className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Form Voice Input</p>
            <p className="text-blue-700 mt-1">
              Click the <Mic className="w-3 h-3 inline" /> button next to any form field, then speak your answer clearly.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
          <MessageCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-green-900">Voice Chat</p>
            <p className="text-green-700 mt-1">
              Click the floating chat button, then use the <Mic className="w-3 h-3 inline" /> in the chat to ask questions.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
          <Volume2 className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <p className="font-medium text-purple-900">Voice Responses</p>
            <p className="text-purple-700 mt-1">
              Toggle the <Volume2 className="w-3 h-3 inline" /> button to enable/disable voice responses.
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={speakInstructions}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isSpeaking 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isSpeaking ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Stop Instructions</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Listen to Instructions</span>
              </>
            )}
          </button>
        </div>

        <div className="text-xs text-gray-500 border-t pt-3">
          <p><strong>Best browsers:</strong> Chrome, Edge, Safari</p>
          <p><strong>Try saying:</strong> "What documents do I need?" or "Help me with my application"</p>
        </div>
      </div>
    </div>
  );
};