
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Send } from "lucide-react";

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Application submitted:", formData);
    // In real app, this would submit to backend
    navigate("/documents");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/parent-portal")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portal
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Application</h1>
            <p className="text-gray-600">Complete your child's enrollment application</p>
          </div>
        </div>

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
                  <Input
                    id="studentName"
                    value={formData.studentName}
                    onChange={(e) => handleInputChange("studentName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grade Level *</Label>
                  <Select onValueChange={(value) => handleInputChange("grade", value)}>
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
                  <Input
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) => handleInputChange("parentName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Phone Number *</Label>
                  <Input
                    id="parentPhone"
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(e) => handleInputChange("parentPhone", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentEmail">Email Address *</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => handleInputChange("parentEmail", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Home Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
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
                <Input
                  id="previousSchool"
                  value={formData.previousSchool}
                  onChange={(e) => handleInputChange("previousSchool", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialNeeds">Special Educational Needs</Label>
                <Textarea
                  id="specialNeeds"
                  placeholder="Please describe any special needs or accommodations required"
                  value={formData.specialNeeds}
                  onChange={(e) => handleInputChange("specialNeeds", e.target.value)}
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
                  <Textarea
                    id="allergyDetails"
                    placeholder="Please provide details about allergies or medical conditions"
                    value={formData.allergyDetails}
                    onChange={(e) => handleInputChange("allergyDetails", e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any additional information you'd like to share"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button type="button" variant="outline" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button type="submit" className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
