
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, CheckCircle, AlertCircle, Sparkles, BookCheck } from 'lucide-react';
import { nlpService, type ApplicationSuggestion, type PredictiveText } from '@/services/nlpService';
import { cn } from '@/lib/utils';

interface SmartInputProps {
  value: string;
  onChange: (value: string) => void;
  field: string;
  placeholder?: string;
  type?: 'input' | 'textarea';
  className?: string;
  label?: string;
}

const SmartInput: React.FC<SmartInputProps> = ({
  value,
  onChange,
  field,
  placeholder,
  type = 'input',
  className,
  label
}) => {
  const [suggestions, setSuggestions] = useState<ApplicationSuggestion[]>([]);
  const [predictiveText, setPredictiveText] = useState<PredictiveText | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.trim().length > 0) {
      timeoutRef.current = setTimeout(async () => {
        setIsAnalyzing(true);
        try {
          const [analysisResult, predictiveResult] = await Promise.all([
            nlpService.analyzeApplicationText(value, field),
            nlpService.getPredictiveText(value, field)
          ]);
          setSuggestions(analysisResult);
          setPredictiveText(predictiveResult);
        } catch (error) {
          console.error('NLP analysis error:', error);
        } finally {
          setIsAnalyzing(false);
        }
      }, 500);
    } else {
      setSuggestions([]);
      setPredictiveText(null);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, field]);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (predictiveText && predictiveText.suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const getIconForSuggestionType = (type?: string) => {
    switch (type) {
      case 'spelling':
        return BookCheck;
      case 'validation':
        return AlertCircle;
      case 'enhancement':
        return Sparkles;
      default:
        return CheckCircle;
    }
  };

  const getStyleForSuggestionType = (type?: string, confidence: number = 0) => {
    switch (type) {
      case 'spelling':
        return "bg-yellow-50 text-yellow-800 border border-yellow-200";
      case 'validation':
        return confidence > 0.8 
          ? "bg-red-50 text-red-800 border border-red-200" 
          : "bg-orange-50 text-orange-800 border border-orange-200";
      case 'enhancement':
        return "bg-blue-50 text-blue-800 border border-blue-200";
      default:
        return "bg-green-50 text-green-800 border border-green-200";
    }
  };

  const InputComponent = type === 'textarea' ? Textarea : Input;

  return (
    <div className="relative space-y-3">
      <div className="relative">
        <InputComponent
          ref={inputRef as any}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            className,
            "transition-all duration-200",
            isAnalyzing && "border-blue-300 shadow-md",
            suggestions.some(s => s.type === 'spelling') && "border-yellow-300 shadow-md",
            suggestions.some(s => s.type === 'validation' && s.confidence > 0.8) && "border-red-300 shadow-md"
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        {isAnalyzing && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Brain className="h-5 w-5 text-blue-500 animate-pulse" />
          </div>
        )}
      </div>

      {/* Predictive Text Suggestions */}
      {showSuggestions && predictiveText && predictiveText.suggestions.length > 0 && (
        <Card className="absolute z-10 w-full max-h-48 overflow-y-auto border shadow-xl bg-white/95 backdrop-blur-sm">
          <div className="p-3">
            <div className="text-xs text-gray-500 mb-3 flex items-center font-medium">
              <Brain className="h-3 w-3 mr-2" />
              AI Smart Suggestions
            </div>
            {predictiveText.suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left h-auto p-3 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="text-sm font-medium">{suggestion}</span>
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Enhanced Validation Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => {
            const IconComponent = getIconForSuggestionType(suggestion.type);
            return (
              <div
                key={index}
                className={cn(
                  "flex items-start space-x-3 p-3 rounded-lg text-sm transition-all duration-200 hover:shadow-md",
                  getStyleForSuggestionType(suggestion.type, suggestion.confidence)
                )}
              >
                <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-medium">{suggestion.suggestion}</span>
                  {suggestion.type === 'spelling' && (
                    <div className="text-xs opacity-75 mt-1">
                      Spell check powered by AI
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SmartInput;
