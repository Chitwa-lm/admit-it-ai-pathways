import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Send, Brain } from "lucide-react";
import SmartInput from "@/components/SmartInput";
import ApplicationProgress from "@/components/ApplicationProgress";
import { nlpService } from "@/services/nlpService";
import { useToast } from "@/hooks/use-toast";
import PendingApplicationsProvider from "@/components/PendingApplicationsProvider";
import PageHeader from "@/components/ui/PageHeader";
import ParentNavigation from "@/components/parent/ParentNavigation";
import { supabase } from "@/lib/supabase";
import { ChatbotButton } from "../components/chatbot/ChatbotButton";

const ApplicationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const continueApplicationId = searchParams.get('continue');
  
  const [formData, setFormData] = useState({
  // Add missing state and stub functions
  const [progress, setProgress] = useState<{ completionPercentage: number }>({ completionPercentage: 0 });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasDraft, setHasDraft] = useState<boolean>(false);

  // Stub: update form data and recalculate progress
  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Example: recalculate completion percentage (customize as needed)
      const requiredFields = [
        'studentName', 'dateOfBirth', 'grade', 'gender', 'parentName', 'parentPhone', 'parentEmail', 'address', 'emergencyContact', 'emergencyPhone'
      ];
      const filled = requiredFields.filter((f) => updated[f as keyof typeof updated]);
      setProgress({ completionPercentage: Math.round((filled.length / requiredFields.length) * 100) });
      return updated;
    });
  };

  // Stub: save draft
  const saveNow = (): void => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasDraft(true);
      toast({ title: 'Draft Saved', description: 'Your draft has been saved.' });
    }, 1000);
  };

  // Stub: delete draft
  const deleteDraft = (): void => {
    setHasDraft(false);
    toast({ title: 'Draft Deleted', description: 'Your draft has been deleted.' });
  };
    studentName: "",
    dateOfBirth: "",
    grade: "",
    gender: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    address: "",
    previousSchool: "",
    specialNeeds: "",
    hasAllergies: false,
    allergyDetails: "",
    emergencyContact: "",
    emergencyPhone: "",
    additionalInfo: ""
  });
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Added missing state and stub functions
  const [progress, setProgress] = useState<{ completionPercentage: number }>({ completionPercentage: 0 });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasDraft, setHasDraft] = useState<boolean>(false);

  // Stub: update form data and recalculate progress
  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Example: recalculate completion percentage (customize as needed)
      const requiredFields = [
        'studentName', 'dateOfBirth', 'grade', 'gender', 'parentName', 'parentPhone', 'parentEmail', 'address', 'emergencyContact', 'emergencyPhone'
      ];
      const filled = requiredFields.filter((f) => updated[f as keyof typeof updated]);
      setProgress({ completionPercentage: Math.round((filled.length / requiredFields.length) * 100) });
      return updated;
    });
  };

  // Stub: save draft
  const saveNow = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasDraft(true);
      toast({ title: 'Draft Saved', description: 'Your draft has been saved.' });
    }, 1000);
  };

  // Stub: delete draft
  const deleteDraft = () => {
    setHasDraft(false);
    toast({ title: 'Draft Deleted', description: 'Your draft has been deleted.' });
  };

  // Load existing application data if continuing
  useEffect(() => {
    const loadExistingApplication = async () => {
      if (continueApplicationId) {
        setIsLoading(true);
        try {
          const { data: application, error } = await supabase
            .from('applications')
            .select('*')
            .eq('id', continueApplicationId)
            .single();

          if (error) throw error;

          if (application && application.application_data) {
            const appData = application.application_data;
            
            // Map the database structure to form structure
            setFormData({
              studentName: appData.personal_info?.first_name + ' ' + appData.personal_info?.last_name || '',
              dateOfBirth: appData.personal_info?.date_of_birth || '',
              grade: application.grade_level || '',
              gender: appData.personal_info?.gender || '',
              parentName: appData.personal_info?.parent_guardian_info?.father_name || appData.personal_info?.parent_guardian_info?.mother_name || '',
              parentPhone: appData.personal_info?.parent_guardian_info?.father_phone || appData.personal_info?.parent_guardian_info?.mother_phone || '',
              parentEmail: appData.personal_info?.parent_guardian_info?.father_email || appData.personal_info?.parent_guardian_info?.mother_email || '',
              address: appData.personal_info?.address || '',
              previousSchool: appData.academic_history?.[0]?.institution || '',
              specialNeeds: '',
              hasAllergies: appData.medical_info?.allergies?.length > 0 || false,
              allergyDetails: appData.medical_info?.allergies?.join(', ') || '',
              emergencyContact: appData.emergency_contact?.name || '',
              emergencyPhone: appData.emergency_contact?.phone || '',
              additionalInfo: ''
            });

            setCurrentApplicationId(continueApplicationId);
            
            toast({
              title: "Application Loaded",
              description: "Your previous application data has been loaded. You can continue where you left off.",
            });
          }
        } catch (error) {
          console.error('Error loading application:', error);
          toast({
            title: "Error",
            description: "Failed to load your previous application. Starting with a blank form.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadExistingApplication();
  }, [continueApplicationId, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (progress.completionPercentage < 100) {
      toast({
        title: "Application Incomplete",
        description: "Please complete all required sections before submitting.",
        variant: "destructive"
      });
      return;
    }

    console.log("Application submitted:", formData);
    toast({
      title: "Application Submitted",
      description: "Your application has been submitted successfully. You'll be redirected to upload documents.",
    });
    
    // Delete draft after successful submission
    deleteDraft();
    navigate("/documents");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    updateFormData(field, value);
  };

  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const summary = await nlpService.generateApplicationSummary(formData);
      toast({
        title: "Application Summary Generated",
        description: summary,
        duration: 10000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate application summary",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your application...</p>
        </div>
      </div>
    );
  }

  return (
    <PendingApplicationsProvider checkOnMount={!continueApplicationId}>
      <div className="min-h-screen bg-gray-50">
        <ParentNavigation />
        <div className="p-6">
        <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <PageHeader
            title="Smart Application Form"
            description="AI-powered form with smart suggestions and validation"
            backTo="/parent-portal"
            backLabel="Back to Portal"
            actions={
              <Button
                onClick={generateSummary}
                disabled={isGeneratingSummary}
                variant="outline"
                size="sm"
              >
                <Brain className="h-4 w-4 mr-2" />
                {isGeneratingSummary ? "Generating..." : "AI Summary"}
              </Button>
            }
          />
        </div>

        <ApplicationProgress progress={progress} isSaving={isSaving} />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Full Name *</Label>
                  <SmartInput
                    field="studentName"
                    value={formData.studentName}
                    onChange={(value) => handleInputChange("studentName", value)}
                    placeholder="Enter student's full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <SmartInput
                    field="dateOfBirth"
                    type="input"
                    value={formData.dateOfBirth}
                    onChange={(value) => handleInputChange("dateOfBirth", value)}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grade Level *</Label>
                  <Select value={formData.grade} onValueChange={(value) => handleInputChange("grade", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kindergarten">Kindergarten</SelectItem>
                      <SelectItem value="grade-1">Grade 1</SelectItem>
                      <SelectItem value="grade-2">Grade 2</SelectItem>
                      <SelectItem value="grade-3">Grade 3</SelectItem>
                      <SelectItem value="grade-4">Grade 4</SelectItem>
                      <SelectItem value="grade-5">Grade 5</SelectItem>
                      <SelectItem value="grade-6">Grade 6</SelectItem>
                      <SelectItem value="grade-7">Grade 7</SelectItem>
                      <SelectItem value="grade-8">Grade 8</SelectItem>
                      <SelectItem value="grade-9">Grade 9</SelectItem>
                      <SelectItem value="grade-10">Grade 10</SelectItem>
                      <SelectItem value="grade-11">Grade 11</SelectItem>
                      <SelectItem value="grade-12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup 
                    value={formData.gender} 
                    onValueChange={(value) => handleInputChange("gender", value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parent Information */}
          <Card>
            <CardHeader>
              <CardTitle>Parent/Guardian Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                  <SmartInput
                    field="parentName"
                    value={formData.parentName}
                    onChange={(value) => handleInputChange("parentName", value)}
                    placeholder="Enter parent/guardian name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Phone Number *</Label>
                  <SmartInput
                    field="parentPhone"
                    value={formData.parentPhone}
                    onChange={(value) => handleInputChange("parentPhone", value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentEmail">Email Address *</Label>
                <SmartInput
                  field="parentEmail"
                  value={formData.parentEmail}
                  onChange={(value) => handleInputChange("parentEmail", value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Home Address *</Label>
                <SmartInput
                  field="address"
                  type="textarea"
                  value={formData.address}
                  onChange={(value) => handleInputChange("address", value)}
                  placeholder="Enter complete home address"
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="previousSchool">Previous School (if applicable)</Label>
                <SmartInput
                  field="previousSchool"
                  value={formData.previousSchool}
                  onChange={(value) => handleInputChange("previousSchool", value)}
                  placeholder="Enter previous school name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialNeeds">Special Educational Needs</Label>
                <SmartInput
                  field="specialNeeds"
                  type="textarea"
                  value={formData.specialNeeds}
                  onChange={(value) => handleInputChange("specialNeeds", value)}
                  placeholder="Please describe any special needs or accommodations required"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allergies"
                  checked={formData.hasAllergies}
                  onCheckedChange={(checked) => handleInputChange("hasAllergies", checked as boolean)}
                />
                <Label htmlFor="allergies">Student has allergies or medical conditions</Label>
              </div>

              {formData.hasAllergies && (
                <div className="space-y-2">
                  <Label htmlFor="allergyDetails">Allergy/Medical Details *</Label>
                  <SmartInput
                    field="allergyDetails"
                    type="textarea"
                    value={formData.allergyDetails}
                    onChange={(value) => handleInputChange("allergyDetails", value)}
                    placeholder="Please provide details about allergies or medical conditions"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                  <SmartInput
                    field="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(value) => handleInputChange("emergencyContact", value)}
                    placeholder="Enter emergency contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                  <SmartInput
                    field="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(value) => handleInputChange("emergencyPhone", value)}
                    placeholder="Enter emergency contact phone"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <SmartInput
                  field="additionalInfo"
                  type="textarea"
                  value={formData.additionalInfo}
                  onChange={(value) => handleInputChange("additionalInfo", value)}
                  placeholder="Any additional information you'd like to share"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={saveNow}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={progress.completionPercentage < 100}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Application
            </Button>
          </div>
          
          {hasDraft && progress.completionPercentage < 100 && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Complete all required sections to submit your application
              </p>
            </div>
          )}
        </form>
        </div>
        </div>
      </div>
      
      {/* Voice-Enabled Chatbot for Application Help */}
      <ChatbotButton 
        context="application" 
        position="bottom-right"
        showVoiceIndicator={true}
      />
    </PendingApplicationsProvider>
  );
};

export default ApplicationForm;