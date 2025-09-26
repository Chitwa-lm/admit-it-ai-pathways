import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, CheckCircle, XCircle, Database } from 'lucide-react';
import { runDatabaseTests } from '@/test/database-test';

interface TestResult {
  test: string;
  passed: boolean;
  error?: string;
  data?: any;
}

const DatabaseTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<{ passed: number; total: number } | null>(null);

  const handleRunTests = async () => {
    setIsRunning(true);
    setResults([]);
    setSummary(null);

    try {
      const testResults = await runDatabaseTests();
      setResults(testResults.results);
      setSummary({ passed: testResults.passed, total: testResults.total });
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (passed: boolean) => {
    return (
      <Badge variant={passed ? 'default' : 'destructive'}>
        {passed ? 'PASS' : 'FAIL'}
      </Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Setup Test
          </CardTitle>
          <CardDescription>
            Test the database schema, seed data, and functionality to ensure everything is working correctly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleRunTests} 
            disabled={isRunning}
            className="w-full sm:w-auto"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run Database Tests
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold">
                {summary.passed}/{summary.total}
              </div>
              <div className="text-sm text-muted-foreground">
                tests passed
              </div>
              {summary.passed === summary.total ? (
                <Badge className="bg-green-500">All Tests Passed</Badge>
              ) : (
                <Badge variant="destructive">Some Tests Failed</Badge>
              )}
            </div>
            
            {summary.passed === summary.total ? (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Database setup is working correctly!</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  All database tables, relationships, and functions are properly configured.
                </p>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Some tests failed</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Check the detailed results below and ensure your Supabase migrations have been applied.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(result.passed)}
                    <div className="flex-1">
                      <div className="font-medium">{result.test}</div>
                      {result.error && (
                        <div className="text-sm text-red-600 mt-1">
                          {result.error}
                        </div>
                      )}
                      {result.data && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {typeof result.data === 'object' 
                            ? Object.entries(result.data).map(([key, value]) => 
                                `${key}: ${value}`
                              ).join(', ')
                            : String(result.data)
                          }
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(result.passed)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <strong>If tests are failing:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>Ensure your Supabase project is set up and running</li>
              <li>Check that environment variables are configured (.env file)</li>
              <li>Run the database migrations in your Supabase dashboard</li>
              <li>Verify your Supabase URL and API keys are correct</li>
            </ul>
          </div>
          
          <div className="text-sm">
            <strong>If all tests pass:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>Your database setup is complete and working</li>
              <li>You can proceed with implementing the authentication system</li>
              <li>Start building the frontend components</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseTest;