
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, CheckCircle, AlertCircle } from 'lucide-react';
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

  const InputComponent = type === 'textarea' ? Textarea : Input;

  return (
    <div className="relative space-y-2">
      <div className="relative">
        <InputComponent
          ref={inputRef as any}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            className,
            isAnalyzing && "border-blue-300",
            suggestions.length > 0 && suggestions.some(s => s.confidence > 0.8) && "border-orange-300"
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        {isAnalyzing && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Brain className="h-4 w-4 text-blue-500 animate-pulse" />
          </div>
        )}
      </div>

      {/* Predictive Text Suggestions */}
      {showSuggestions && predictiveText && predictiveText.suggestions.length > 0 && (
        <Card className="absolute z-10 w-full max-h-40 overflow-y-auto border shadow-lg bg-white">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2 flex items-center">
              <Brain className="h-3 w-3 mr-1" />
              Smart Suggestions
            </div>
            {predictiveText.suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-left h-auto p-2 hover:bg-gray-50"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="text-sm">{suggestion}</span>
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Validation Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-1">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start space-x-2 p-2 rounded text-xs",
                suggestion.confidence > 0.8 
                  ? "bg-orange-50 text-orange-800 border border-orange-200" 
                  : "bg-blue-50 text-blue-800 border border-blue-200"
              )}
            >
              {suggestion.confidence > 0.8 ? (
                <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
              ) : (
                <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
              )}
              <span>{suggestion.suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartInput;
