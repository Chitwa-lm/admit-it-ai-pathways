import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Brain,
  Upload,
  Loader2
} from "lucide-react";
import { nlpService, type DocumentVerification } from "@/services/nlpService";
import { useToast } from "@/hooks/use-toast";

interface DocumentValidatorProps {
  onValidationComplete?: (result: DocumentVerification) => void;
  file?: File | null;
}

const DocumentValidator: React.FC<DocumentValidatorProps> = ({ onValidationComplete, file: propFile }) => {
  const [file, setFile] = useState<File | null>(propFile || null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<DocumentVerification | null>(null);
  const { toast } = useToast();

  // Update internal file state when prop changes
  React.useEffect(() => {
    if (propFile && propFile !== file) {
      setFile(propFile);
      setValidationResult(null);
    }
  }, [propFile, file]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setValidationResult(null);
    }
  };

  const handleValidate = async () => {
    if (!file) return;

    setIsValidating(true);
    try {
      const result = await nlpService.verifyDocument(file);
      setValidationResult(result);
      onValidationComplete?.(result);
      
      toast({
        title: "Document Validated",
        description: `Validation completed with ${result.overallScore}% score`,
        variant: result.isValid ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Failed to validate document. Please try again.",
        variant: "destructive"
      });
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <span>Smart Document Validator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload or Validation */}
        {!propFile ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
                >
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Upload className="h-4 w-4" />
                    <span>{file ? file.name : 'Select document to validate'}</span>
                  </div>
                </label>
              </div>
              {file && (
                <Button 
                  onClick={handleValidate} 
                  disabled={isValidating}
                  className="min-w-[120px]"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Validating
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Validate
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    {file?.name}
                  </p>
                  <p className="text-xs text-blue-600">
                    Ready for validation
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleValidate} 
                disabled={isValidating}
                size="sm"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Validate
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Validation Results */}
        {validationResult && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center space-y-2">
              <div className={`text-3xl font-bold ${getScoreColor(validationResult.overallScore)}`}>
                {validationResult.overallScore}%
              </div>
              <p className="text-sm text-gray-600">Overall Document Score</p>
              <Progress value={validationResult.overallScore} className="w-full" />
              <div className="flex items-center justify-center space-x-2">
                {validationResult.isValid ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">Valid Document</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-red-600 font-medium">Issues Found</span>
                  </>
                )}
              </div>
            </div>

            {/* Document Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Document Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Type: <span className="font-medium">{validationResult.documentType}</span></div>
                <div>Confidence: <span className="font-medium">{Math.round(validationResult.confidence * 100)}%</span></div>
              </div>
            </div>

            {/* Grammar Errors */}
            {validationResult.grammarErrors && validationResult.grammarErrors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span>Grammar & Spelling Issues</span>
                </h4>
                <div className="space-y-2">
                  {validationResult.grammarErrors.map((error, index) => (
                    <Alert key={index} className="text-sm">
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="line-through text-red-600">"{error.text}"</span>
                            <span className="mx-2">→</span>
                            <span className="text-green-600">"{error.suggestion}"</span>
                          </div>
                          <Badge variant={getSeverityColor(error.severity)}>
                            {error.severity}
                          </Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Fields */}
            {validationResult.missingFields && validationResult.missingFields.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span>Missing Information</span>
                </h4>
                <div className="space-y-2">
                  {validationResult.missingFields.map((field, index) => (
                    <Alert key={index} variant={field.required ? "destructive" : "default"}>
                      <AlertDescription className="flex items-center justify-between">
                        <span>{field.description}</span>
                        <Badge variant={field.required ? "destructive" : "secondary"}>
                          {field.required ? "Required" : "Optional"}
                        </Badge>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Data */}
            {validationResult.extractedData && Object.keys(validationResult.extractedData).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Extracted Information</span>
                </h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {Object.entries(validationResult.extractedData).map(([key, value]) => 
                      value && (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span>{String(value)}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* General Issues */}
            {validationResult.issues && validationResult.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Additional Issues</h4>
                <div className="space-y-1">
                  {validationResult.issues.map((issue, index) => (
                    <Alert key={index} variant="default">
                      <AlertDescription className="text-sm">{issue}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentValidator;