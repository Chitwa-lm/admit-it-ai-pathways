
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, HelpCircle, FileText, Search, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const ParentChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hi! I'm here to help you with your child's enrollment application. What can I assist you with today?",
      sender: 'bot' as const,
      timestamp: new Date()
    }
  ]);

  const quickHelp = [
    { icon: FileText, text: "How to start an application", action: "start-app" },
    { icon: Upload, text: "Document upload help", action: "upload-docs" },
    { icon: Search, text: "Find available school places", action: "find-schools" },
    { icon: HelpCircle, text: "Application status", action: "check-status" }
  ];

  const handleQuickHelp = (action: string) => {
    let botResponse = '';
    
    switch (action) {
      case 'start-app':
        botResponse = "To start an application, click on 'Start Application' from your dashboard. The application will automatically be sent to all applicable schools based on your preferences and location.";
        break;
      case 'upload-docs':
        botResponse = "You can upload required documents by clicking 'Upload Documents' from your dashboard. Accepted formats include PDF, JPG, and PNG. Make sure documents are clear and readable.";
        break;
      case 'find-schools':
        botResponse = "Use the 'Available Places' tab to search for schools with open enrollment. You can filter by grade level, district, and school type to find the best fit for your child.";
        break;
      case 'check-status':
        botResponse = "Your application status is displayed on your dashboard. You'll see updates for each step: Application Form, Documents, and Review status.";
        break;
      default:
        botResponse = "I'm here to help! Please let me know what specific question you have about the enrollment process.";
    }

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: botResponse,
      sender: 'bot' as const,
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Simple bot response (in a real app, this would connect to an AI service)
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your question! For detailed assistance, please contact our support team at support@admitai.pro or call (555) 123-4567. We're here to help make your enrollment process smooth and easy!",
        sender: 'bot' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "rounded-full w-14 h-14 shadow-xl hover:shadow-2xl transition-all duration-300",
            "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
            isOpen && "bg-gray-500 hover:bg-gray-600"
          )}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </Button>
        
        {!isOpen && (
          <div className="absolute -top-12 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap animate-fade-in">
            Need help?
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900"></div>
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 animate-fade-in">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <MessageCircle className="h-5 w-5" />
                <span>AdmitAI Assistant</span>
              </CardTitle>
              <p className="text-blue-100 text-sm">We're here to help with your enrollment questions!</p>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] p-3 rounded-lg text-sm",
                        msg.sender === 'user'
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Help Options */}
              <div className="px-4 py-3 border-t bg-gray-50">
                <p className="text-xs text-gray-600 mb-2 font-medium">Quick Help:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickHelp.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-auto p-2 text-xs justify-start"
                      onClick={() => handleQuickHelp(item.action)}
                    >
                      <item.icon className="h-3 w-3 mr-1" />
                      {item.text}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your question..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ParentChatbot;
