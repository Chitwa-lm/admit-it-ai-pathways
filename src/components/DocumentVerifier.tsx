
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, FileText, Brain, Loader2 } from 'lucide-react';
import { nlpService, type DocumentVerification } from '@/services/nlpService';

interface DocumentVerifierProps {
  file: File;
  onVerificationComplete: (result: DocumentVerification) => void;
}

const DocumentVerifier: React.FC<DocumentVerifierProps> = ({
  file,
  onVerificationComplete
}) => {
  const [verification, setVerification] = useState<DocumentVerification | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerification = async () => {
    setIsVerifying(true);
    try {
      const result = await nlpService.verifyDocument(file);
      setVerification(result);
      onVerificationComplete(result);
    } catch (error) {
      console.error('Document verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-50 border-green-200';
    if (confidence >= 0.6) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-base">
          <Brain className="h-4 w-4" />
          <span>Document Verification</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">{file.name}</span>
          </div>
          <Button
            onClick={handleVerification}
            disabled={isVerifying}
            size="sm"
            variant="outline"
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Brain className="h-3 w-3 mr-1" />
                Verify Document
              </>
            )}
          </Button>
        </div>

        {isVerifying && (
          <div className="space-y-2">
            <div className="text-xs text-gray-600">Analyzing document with AI...</div>
            <Progress value={75} className="h-2" />
          </div>
        )}

        {verification && (
          <div className="space-y-4">
            <div className={`p-3 rounded-lg border ${getConfidenceBg(verification.confidence)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {verification.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">
                    {verification.isValid ? 'Document Verified' : 'Verification Failed'}
                  </span>
                </div>
                <Badge variant={verification.confidence >= 0.8 ? 'default' : 'secondary'}>
                  {Math.round(verification.confidence * 100)}% Confidence
                </Badge>
              </div>

              <div className="text-sm text-gray-600">
                <strong>Detected Type:</strong> {verification.documentType}
              </div>

              {Object.keys(verification.extractedData).length > 0 && (
                <div className="mt-3">
                  <div className="text-xs font-medium text-gray-700 mb-1">Extracted Information:</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    {Object.entries(verification.extractedData).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {verification.issues.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Issues Detected:</div>
                {verification.issues.map((issue, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm text-orange-700 bg-orange-50 p-2 rounded">
                    <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentVerifier;
