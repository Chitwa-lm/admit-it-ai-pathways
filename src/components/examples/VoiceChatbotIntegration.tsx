import React from 'react';
import { ChatbotButton } from '../chatbot/ChatbotButton';
import { VoiceEnabledApplicationForm } from '../application/VoiceEnabledApplicationForm';

// Example 1: Adding chatbot to any existing page
export const PageWithChatbot: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your existing page content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          School Admissions Portal
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Apply Now</h3>
            <p className="text-gray-600 mb-4">Start your school application process</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Begin Application
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Check Status</h3>
            <p className="text-gray-600 mb-4">Track your application progress</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              View Status
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
            <p className="text-gray-600 mb-4">Submit required documents</p>
            <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Upload Files
            </button>
          </div>
        </div>
      </div>
      
      {/* Add the floating chatbot button */}
      <ChatbotButton 
        context="general" 
        position="bottom-right"
        showVoiceIndicator={true}
      />
    </div>
  );
};

// Example 2: Document upload page with context-specific chatbot
export const DocumentUploadPageWithChatbot: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Upload Required Documents
        </h1>
        
        {/* Your document upload components would go here */}
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600 mb-4">
            Upload your required documents for the admission process.
            If you need help, click the chat button for assistance.
          </p>
          
          {/* Document upload interface */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-500">Drag and drop files here or click to browse</p>
          </div>
        </div>
      </div>
      
      {/* Context-specific chatbot for document help */}
      <ChatbotButton 
        context="documents" 
        position="bottom-right"
        showVoiceIndicator={true}
      />
    </div>
  );
};

// Example 3: Application form page with voice assistance
export const ApplicationPageWithVoice: React.FC = () => {
  const handleFormSubmit = (formData: any) => {
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <VoiceEnabledApplicationForm 
          onSubmit={handleFormSubmit}
          initialData={{
            gradeApplying: 'grade_8'
          }}
        />
      </div>
    </div>
  );
};

// Example 4: Custom integration with existing components
export const CustomChatbotIntegration: React.FC = () => {
  const [showChat, setShowChat] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your existing header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">School Portal</h1>
          
          {/* Custom chat trigger in header */}
          <button
            onClick={() => setShowChat(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <span>Need Help?</span>
            <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">Voice</span>
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Welcome to the Admissions Portal</h2>
          <p className="text-gray-600">
            Get help with your application process using our voice-enabled assistant.
            You can speak your questions or type them - we're here to help!
          </p>
        </div>
      </main>
      
      {/* Always show floating button */}
      <ChatbotButton 
        context="general" 
        position="bottom-right"
        showVoiceIndicator={true}
      />
    </div>
  );
};

// Usage instructions component
export const VoiceChatbotUsageGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Voice Chatbot Integration Guide
      </h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            1. Basic Integration
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700">
{`import { ChatbotButton } from './components/chatbot/ChatbotButton';

// Add to any page
<ChatbotButton 
  context="general" 
  position="bottom-right"
  showVoiceIndicator={true}
/>`}
            </pre>
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            2. Context-Specific Help
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700">
{`// For application pages
<ChatbotButton context="application" />

// For document upload pages  
<ChatbotButton context="documents" />

// For general help
<ChatbotButton context="general" />`}
            </pre>
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            3. Voice-Enabled Forms
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700">
{`import { VoiceEnabledApplicationForm } from './components/application/VoiceEnabledApplicationForm';

<VoiceEnabledApplicationForm 
  onSubmit={handleSubmit}
  initialData={existingData}
/>`}
            </pre>
          </div>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            4. Features
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>🎤 Voice input for all form fields</li>
            <li>🔊 Text-to-speech responses</li>
            <li>🤖 Context-aware chatbot assistance</li>
            <li>♿ Accessibility support</li>
            <li>🌍 Zambian education system knowledge</li>
            <li>📱 Mobile-responsive design</li>
            <li>🔄 Real-time speech recognition</li>
            <li>🎯 Smart field validation</li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            5. Browser Support
          </h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Voice Recognition:</strong> Chrome, Edge, Safari (iOS 14.5+)<br/>
              <strong>Text-to-Speech:</strong> All modern browsers<br/>
              <strong>Fallback:</strong> Text-only mode for unsupported browsers
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};