
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, FileText, Check, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  required: boolean;
  uploaded: boolean;
  file?: File;
  error?: string;
}

const DocumentUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([
    { id: "birth-cert", name: "Birth Certificate", required: true, uploaded: false },
    { id: "immunization", name: "Immunization Records", required: true, uploaded: false },
    { id: "transcript", name: "Previous School Transcript", required: false, uploaded: false },
    { id: "photo", name: "Student Photo", required: true, uploaded: false },
    { id: "proof-residence", name: "Proof of Residence", required: true, uploaded: false },
    { id: "medical", name: "Medical Records", required: false, uploaded: false }
  ]);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }

    if (!allowedTypes.includes(file.type)) {
      return "File type not supported. Please use PDF, JPG, PNG, DOC, or DOCX files";
    }

    return null;
  };

  const handleFileUpload = (docId: string, file: File) => {
    const error = validateFile(file);
    
    if (error) {
      setDocuments(prev => prev.map(doc => 
        doc.id === docId 
          ? { ...doc, uploaded: false, file: undefined, error }
          : doc
      ));
      toast({
        title: "Upload Error",
        description: error,
        variant: "destructive"
      });
      return;
    }

    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, uploaded: true, file, error: undefined }
        : doc
    ));

    toast({
      title: "File Uploaded",
      description: `${file.name} has been uploaded successfully`,
    });
  };

  const handleRemoveFile = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, uploaded: false, file: undefined, error: undefined }
        : doc
    ));

    if (doc?.file) {
      toast({
        title: "File Removed",
        description: `${doc.file.name} has been removed`,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDraggedOver(docId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    setDraggedOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(docId, files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const requiredDocsUploaded = documents.filter(doc => doc.required && doc.uploaded).length;
  const totalRequiredDocs = documents.filter(doc => doc.required).length;
  const canSubmit = requiredDocsUploaded === totalRequiredDocs;

  const handleSubmit = () => {
    if (canSubmit) {
      console.log("Documents submitted:", documents.filter(doc => doc.uploaded));
      toast({
        title: "Application Submitted",
        description: "Your documents have been submitted successfully! Your application is now under review.",
      });
      navigate("/parent-portal");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/parent-portal")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portal
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Upload</h1>
            <p className="text-gray-600">Upload required documents for your child's application</p>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Upload Progress</span>
              <span className="text-sm text-gray-600">
                {requiredDocsUploaded} of {totalRequiredDocs} required documents
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(requiredDocsUploaded / totalRequiredDocs) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Document Upload Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {documents.map((doc) => (
            <Card key={doc.id} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span className="text-base">{doc.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.required && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Required
                      </span>
                    )}
                    {doc.uploaded && (
                      <Check className="h-5 w-5 text-green-600" />
                    )}
                    {doc.error && (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!doc.uploaded ? (
                  <div className="space-y-4">
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        draggedOver === doc.id 
                          ? 'border-primary bg-primary/5' 
                          : doc.error 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 hover:border-primary'
                      }`}
                      onDragOver={(e) => handleDragOver(e, doc.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, doc.id)}
                    >
                      <Upload className={`h-8 w-8 mx-auto mb-2 ${doc.error ? 'text-red-400' : 'text-gray-400'}`} />
                      <p className={`text-sm mb-2 ${doc.error ? 'text-red-600' : 'text-gray-600'}`}>
                        Drop file here or click to browse
                      </p>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(doc.id, file);
                          }
                        }}
                        className="hidden"
                        id={`file-${doc.id}`}
                      />
                      <Label htmlFor={`file-${doc.id}`} className="cursor-pointer">
                        <Button type="button" variant="outline" size="sm">
                          Choose File
                        </Button>
                      </Label>
                    </div>
                    {doc.error && (
                      <div className="flex items-center space-x-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{doc.error}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            {doc.file?.name}
                          </p>
                          <p className="text-xs text-green-600">
                            {doc.file && formatFileSize(doc.file.size)} • Uploaded successfully
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(doc.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Label htmlFor={`replace-${doc.id}`} className="cursor-pointer">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(doc.id, file);
                          }
                        }}
                        className="hidden"
                        id={`replace-${doc.id}`}
                      />
                      <Button type="button" variant="outline" size="sm">
                        Replace File
                      </Button>
                    </Label>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Ready to Submit?</h3>
              <p className="text-gray-600">
                {canSubmit 
                  ? "All required documents have been uploaded. You can now submit your application for review."
                  : `Please upload all required documents before submitting. ${totalRequiredDocs - requiredDocsUploaded} document(s) remaining.`
                }
              </p>
              <Button 
                onClick={handleSubmit}
                disabled={!canSubmit}
                size="lg"
                className="min-w-[200px]"
              >
                <Upload className="h-4 w-4 mr-2" />
                Submit Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentUpload;
