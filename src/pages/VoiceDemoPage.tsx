import React from 'react';
import { VoiceEnabledApplicationForm } from '../components/application/VoiceEnabledApplicationForm';
import { ChatbotButton } from '../components/chatbot/ChatbotButton';
import { Mic, Volume2, MessageCircle, HelpCircle } from 'lucide-react';

const VoiceDemoPage: React.FC = () => {
  const handleFormSubmit = (formData: any) => {
    console.log('Form submitted:', formData);
    alert('Form submitted successfully! Check the console for data.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Voice Mode Demo</h1>
          <p className="text-gray-600 mt-1">
            Test the voice-enabled features of the admissions system
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2" />
            How to Turn On Voice Mode
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-blue-800">🎤 Voice Input in Forms:</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start space-x-2">
                  <span className="font-medium">1.</span>
                  <span>Click the <Mic className="w-4 h-4 inline mx-1" /> microphone button next to any form field</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium">2.</span>
                  <span>Speak clearly when you see "Listening..." (red pulsing button)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium">3.</span>
                  <span>Stop speaking and the text will appear automatically</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium">4.</span>
                  <span>Edit the text if needed, then move to the next field</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-blue-800">💬 Voice Chat Assistant:</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start space-x-2">
                  <span className="font-medium">1.</span>
                  <span>Click the floating <MessageCircle className="w-4 h-4 inline mx-1" /> chat button (bottom-right)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium">2.</span>
                  <span>Click the <Mic className="w-4 h-4 inline mx-1" /> button in the chat input</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium">3.</span>
                  <span>Ask questions like "What documents do I need?"</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium">4.</span>
                  <span>The bot will respond with voice if <Volume2 className="w-4 h-4 inline mx-1" /> is enabled</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">🎯 Try These Voice Commands:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-blue-800">In Chat:</p>
                <ul className="text-blue-700 space-y-1 mt-1">
                  <li>• "What documents do I need for Grade 8?"</li>
                  <li>• "How do I check my application status?"</li>
                  <li>• "What are the admission deadlines?"</li>
                  <li>• "Help me upload documents"</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-blue-800">In Forms:</p>
                <ul className="text-blue-700 space-y-1 mt-1">
                  <li>• "John Mwanza" (for name fields)</li>
                  <li>• "john at gmail dot com" (for email)</li>
                  <li>• "zero nine seven one two three four five six seven" (for phone)</li>
                  <li>• "Lusaka Primary School" (for school names)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Browser Support Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <h3 className="font-medium text-yellow-900 mb-2">🌐 Browser Support:</h3>
          <div className="text-sm text-yellow-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">✅ Voice Recognition Works:</p>
              <ul className="mt-1 space-y-1">
                <li>• Chrome (recommended)</li>
                <li>• Microsoft Edge</li>
                <li>• Safari (iOS 14.5+)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">✅ Text-to-Speech Works:</p>
              <ul className="mt-1 space-y-1">
                <li>• All modern browsers</li>
                <li>• Automatic fallback to text-only</li>
                <li>• Mobile devices supported</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo Form */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              🎤 Try the Voice-Enabled Application Form
            </h2>
            <p className="text-gray-600 mt-1">
              Click the microphone buttons next to form fields to use voice input
            </p>
          </div>
          
          <div className="p-6">
            <VoiceEnabledApplicationForm 
              onSubmit={handleFormSubmit}
              initialData={{
                gradeApplying: 'grade_8'
              }}
            />
          </div>
        </div>
      </div>

      {/* Voice-Enabled Chatbot */}
      <ChatbotButton 
        context="application" 
        position="bottom-right"
        showVoiceIndicator={true}
      />
    </div>
  );
};

export default VoiceDemoPage;