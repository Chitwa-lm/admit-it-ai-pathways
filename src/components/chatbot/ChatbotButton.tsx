import React, { useState } from 'react';
import { MessageCircle, Mic, HelpCircle } from 'lucide-react';
import { VoiceChatbot } from './VoiceChatbot';

interface ChatbotButtonProps {
  context?: 'application' | 'documents' | 'general';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showVoiceIndicator?: boolean;
}

export const ChatbotButton: React.FC<ChatbotButtonProps> = ({
  context = 'general',
  position = 'bottom-right',
  showVoiceIndicator = true
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  const getTooltipPosition = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-full mb-2 left-0';
      case 'top-right':
        return 'top-full mt-2 right-0';
      case 'top-left':
        return 'top-full mt-2 left-0';
      default:
        return 'bottom-full mb-2 right-0';
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className={`fixed ${getPositionClasses()} z-40`}>
        <div className="relative">
          {/* Tooltip */}
          {isHovered && !isChatOpen && (
            <div className={`absolute ${getTooltipPosition()} px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap shadow-lg`}>
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4" />
                <span>Need help? Ask me anything!</span>
                {showVoiceIndicator && (
                  <div className="flex items-center space-x-1 text-xs bg-gray-700 px-2 py-1 rounded">
                    <Mic className="w-3 h-3" />
                    <span>Voice</span>
                  </div>
                )}
              </div>
              {/* Arrow */}
              <div className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
                position.includes('bottom') ? 'top-full -mt-1' : 'bottom-full -mb-1'
              } ${
                position.includes('right') ? 'right-4' : 'left-4'
              }`} />
            </div>
          )}

          {/* Main Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            aria-label="Open chat assistant"
          >
            {/* Pulse Animation */}
            <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20"></div>
            
            {/* Main Icon */}
            <MessageCircle className="w-7 h-7 relative z-10" />
            
            {/* Voice Indicator */}
            {showVoiceIndicator && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                <Mic className="w-3 h-3 text-white" />
              </div>
            )}

            {/* Notification Dot (can be used for unread messages) */}
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              !
            </div>
          </button>

          {/* Context Indicator */}
          {context !== 'general' && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="px-2 py-1 bg-gray-800 text-white text-xs rounded-full">
                {context === 'application' && '📝'}
                {context === 'documents' && '📄'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chatbot Modal */}
      <VoiceChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context={context}
      />
    </>
  );
};

// Hook for managing chatbot state across components
export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<'application' | 'documents' | 'general'>('general');

  const openChatbot = (newContext?: 'application' | 'documents' | 'general') => {
    if (newContext) setContext(newContext);
    setIsOpen(true);
  };

  const closeChatbot = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    context,
    openChatbot,
    closeChatbot,
    setContext
  };
};