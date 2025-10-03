import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { useVoiceForm } from '../../hooks/useVoiceAssistant';
import { ChatbotButton } from '../chatbot/ChatbotButton';

interface FormData {
  studentName: string;
  dateOfBirth: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  previousSchool: string;
  gradeApplying: string;
}

interface VoiceEnabledApplicationFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

export const VoiceEnabledApplicationForm: React.FC<VoiceEnabledApplicationFormProps> = ({
  onSubmit,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    dateOfBirth: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    address: '',
    previousSchool: '',
    gradeApplying: 'grade_8',
    ...initialData
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [voiceInputField, setVoiceInputField] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const voice = useVoiceForm({
    autoSpeak: voiceEnabled,
    rate: 0.8,
    volume: 0.7
  });

  // Welcome message when component mounts
  useEffect(() => {
    if (voiceEnabled && voice.isSupported) {
      voice.speak("Welcome to the school application form. You can use voice input for any field by clicking the microphone button, or ask for help using the chat assistant.");
    }
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFieldFocus = async (fieldName: string, instructions?: string) => {
    if (!voiceEnabled) return;
    
    const currentValue = formData[fieldName as keyof FormData];
    await voice.announceField(
      fieldName.replace(/([A-Z])/g, ' $1').toLowerCase(),
      instructions,
      currentValue
    );
  };

  const startVoiceInput = async (fieldName: keyof FormData, fieldType: 'text' | 'email' | 'phone' | 'date' = 'text') => {
    setVoiceInputField(fieldName);
    
    await voice.startVoiceInput(
      (value) => {
        handleInputChange(fieldName, value);
        setVoiceInputField(null);
      },
      fieldType
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.parentName.trim()) {
      newErrors.parentName = 'Parent/Guardian name is required';
    }

    if (!formData.parentEmail.trim()) {
      newErrors.parentEmail = 'Parent email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.parentEmail)) {
      newErrors.parentEmail = 'Please enter a valid email address';
    }

    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = 'Parent phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);

    // Speak validation errors
    if (Object.keys(newErrors).length > 0 && voiceEnabled) {
      const firstError = Object.entries(newErrors)[0];
      voice.speakValidationError(
        firstError[0].replace(/([A-Z])/g, ' $1').toLowerCase(),
        firstError[1] || ''
      );
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (voiceEnabled) {
        await voice.speakSuccess('Form submitted successfully! Your application has been received.');
      }
      onSubmit(formData);
    }
  };

  const FormField: React.FC<{
    label: string;
    name: keyof FormData;
    type?: string;
    placeholder?: string;
    instructions?: string;
    voiceType?: 'text' | 'email' | 'phone' | 'date';
    required?: boolean;
  }> = ({ label, name, type = 'text', placeholder, instructions, voiceType = 'text', required = false }) => {
    const hasError = !!errors[name];
    const isVoiceActive = voiceInputField === name;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {instructions && (
            <button
              type="button"
              onClick={() => voice.speak(instructions)}
              className="ml-2 text-blue-600 hover:text-blue-800"
              title="Listen to instructions"
            >
              <HelpCircle className="w-4 h-4 inline" />
            </button>
          )}
        </label>
        
        <div className="relative">
          <input
            type={type}
            value={formData[name]}
            onChange={(e) => handleInputChange(name, e.target.value)}
            onFocus={() => handleFieldFocus(label, instructions)}
            placeholder={placeholder}
            className={`w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 ${
              hasError 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-blue-500'
            } ${isVoiceActive ? 'bg-blue-50 border-blue-400' : ''}`}
          />
          
          {/* Voice Input Button */}
          {voice.isSupported && (
            <button
              type="button"
              onClick={() => startVoiceInput(name, voiceType)}
              disabled={voice.isListening && voiceInputField !== name}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                isVoiceActive
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isVoiceActive ? 'Listening...' : 'Use voice input'}
            >
              {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
        </div>
        
        {/* Interim transcript display */}
        {isVoiceActive && voice.interimTranscript && (
          <div className="text-sm text-blue-600 italic bg-blue-50 p-2 rounded">
            Listening: "{voice.interimTranscript}"
          </div>
        )}
        
        {/* Error message */}
        {hasError && (
          <p className="text-sm text-red-600 flex items-center space-x-1">
            <span>{errors[name]}</span>
            {voiceEnabled && (
              <button
                type="button"
                onClick={() => voice.speakValidationError(label, errors[name] || '')}
                className="text-red-500 hover:text-red-700"
                title="Listen to error"
              >
                <Volume2 className="w-3 h-3" />
              </button>
            )}
          </p>
        )}
        
        {/* Instructions */}
        {instructions && (
          <p className="text-xs text-gray-500">{instructions}</p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header with Voice Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">School Application Form</h2>
          <p className="text-gray-600">Fill out all required fields to submit your application</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Voice Toggle */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-lg ${
              voiceEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}
            title={voiceEnabled ? 'Disable voice assistance' : 'Enable voice assistance'}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          {/* Speech Support Indicator */}
          {voice.isSupported && (
            <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              <Mic className="w-3 h-3" />
              <span>Voice Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {voice.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{voice.error}</p>
          <button
            onClick={voice.clearError}
            className="text-red-600 hover:text-red-800 text-xs underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Student Information
          </h3>
          
          <FormField
            label="Student Full Name"
            name="studentName"
            placeholder="Enter student's full name"
            instructions="Please provide the student's complete legal name as it appears on official documents"
            required
          />
          
          <FormField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            instructions="Select the student's date of birth from the calendar"
            voiceType="date"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade Applying For <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gradeApplying}
              onChange={(e) => handleInputChange('gradeApplying', e.target.value)}
              onFocus={() => handleFieldFocus('Grade Level', 'Select the grade level you are applying for')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="grade_8">Grade 8</option>
              <option value="grade_10">Grade 10</option>
              <option value="grade_12">Grade 12</option>
            </select>
          </div>
          
          <FormField
            label="Previous School"
            name="previousSchool"
            placeholder="Name of previous school attended"
            instructions="Enter the name of the school the student previously attended"
          />
        </div>

        {/* Parent/Guardian Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Parent/Guardian Information
          </h3>
          
          <FormField
            label="Parent/Guardian Name"
            name="parentName"
            placeholder="Enter parent or guardian's full name"
            instructions="Provide the full name of the parent or legal guardian"
            required
          />
          
          <FormField
            label="Email Address"
            name="parentEmail"
            type="email"
            placeholder="parent@example.com"
            instructions="Enter a valid email address for application updates and communication"
            voiceType="email"
            required
          />
          
          <FormField
            label="Phone Number"
            name="parentPhone"
            type="tel"
            placeholder="+260 XXX XXX XXX"
            instructions="Enter your phone number including country code for Zambia"
            voiceType="phone"
            required
          />
          
          <FormField
            label="Home Address"
            name="address"
            placeholder="Enter complete home address"
            instructions="Provide your complete residential address including district and province"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={voice.isListening || voice.isSpeaking}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {voice.isListening ? 'Listening...' : voice.isSpeaking ? 'Speaking...' : 'Submit Application'}
          </button>
        </div>
      </form>

      {/* Floating Chatbot Button */}
      <ChatbotButton 
        context="application" 
        showVoiceIndicator={voice.isSupported}
      />
    </div>
  );
};