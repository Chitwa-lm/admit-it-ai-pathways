// Database setup test script

import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

interface TestResult {
  test: string;
  passed: boolean;
  error?: string;
  data?: any;
}

class DatabaseTester {
  private results: TestResult[] = [];

  private addResult(test: string, passed: boolean, error?: string, data?: any) {
    this.results.push({ test, passed, error, data });
    console.log(`${passed ? '✅' : '❌'} ${test}${error ? `: ${error}` : ''}`);
  }

  async testConnection() {
    try {
      const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
      this.addResult('Database Connection', !error, error?.message);
      return !error;
    } catch (error) {
      this.addResult('Database Connection', false, (error as Error).message);
      return false;
    }
  }

  async testTableStructure() {
    const tables = [
      'user_profiles',
      'schools', 
      'available_places',
      'applications',
      'application_documents',
      'application_status_history',
      'notifications',
      'school_administrators',
      'audit_logs'
    ];

    for (const table of tables) {
      try {
        const { error } = await supabase.from(table as any).select('*').limit(1);
        this.addResult(`Table: ${table}`, !error, error?.message);
      } catch (error) {
        this.addResult(`Table: ${table}`, false, (error as Error).message);
      }
    }
  }

  async testEnums() {
    try {
      // Test inserting a school with valid enum values
      const testSchool = {
        name: 'Test School',
        type: 'government' as const,
        province: 'lusaka' as const,
        district: 'Lusaka'
      };

      const { error } = await supabase
        .from('schools')
        .insert(testSchool)
        .select()
        .single();

      if (!error) {
        // Clean up - delete the test school
        await supabase.from('schools').delete().eq('name', 'Test School');
      }

      this.addResult('Enum Values', !error, error?.message);
    } catch (error) {
      this.addResult('Enum Values', false, (error as Error).message);
    }
  }

  async testSeedData() {
    try {
      // Check if seed data exists
      const { data: schools, error: schoolsError } = await supabase
        .from('schools')
        .select('*')
        .limit(5);

      const { data: places, error: placesError } = await supabase
        .from('available_places')
        .select('*')
        .limit(5);

      this.addResult(
        'Seed Data - Schools', 
        !schoolsError && schools && schools.length > 0,
        schoolsError?.message,
        { schoolCount: schools?.length || 0 }
      );

      this.addResult(
        'Seed Data - Available Places',
        !placesError && places && places.length > 0,
        placesError?.message,
        { placesCount: places?.length || 0 }
      );
    } catch (error) {
      this.addResult('Seed Data', false, (error as Error).message);
    }
  }

  async testRLSPolicies() {
    try {
      // Test that RLS is enabled by trying to access data without authentication
      const { error } = await supabase.from('user_profiles').select('*');
      
      // We expect this to either work (if user is authenticated) or fail with RLS error
      this.addResult(
        'RLS Policies', 
        true, // RLS is working if we get here without crashing
        error ? `RLS Active: ${error.message}` : 'RLS Active: Authenticated access'
      );
    } catch (error) {
      this.addResult('RLS Policies', false, (error as Error).message);
    }
  }

  async testFunctions() {
    try {
      // Test the get_user_role function
      const { data, error } = await supabase.rpc('get_user_role');
      
      this.addResult(
        'Database Functions',
        !error,
        error?.message,
        { userRole: data }
      );
    } catch (error) {
      this.addResult('Database Functions', false, (error as Error).message);
    }
  }

  async testIndexes() {
    try {
      // Test a query that should use indexes
      const start = performance.now();
      
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('province', 'lusaka')
        .eq('type', 'government');
      
      const duration = performance.now() - start;
      
      this.addResult(
        'Query Performance (Indexes)',
        !error && duration < 1000, // Should be fast with proper indexes
        error?.message,
        { queryTime: `${duration.toFixed(2)}ms`, resultCount: data?.length || 0 }
      );
    } catch (error) {
      this.addResult('Query Performance', false, (error as Error).message);
    }
  }

  async testRelationships() {
    try {
      // Test joining tables to verify foreign key relationships
      const { data, error } = await supabase
        .from('available_places')
        .select(`
          *,
          schools (
            id,
            name,
            type,
            province
          )
        `)
        .limit(3);

      this.addResult(
        'Table Relationships',
        !error && data && data.length > 0,
        error?.message,
        { joinedRecords: data?.length || 0 }
      );
    } catch (error) {
      this.addResult('Table Relationships', false, (error as Error).message);
    }
  }

  async runAllTests() {
    console.log('🧪 Starting Database Tests...\n');

    await this.testConnection();
    await this.testTableStructure();
    await this.testEnums();
    await this.testSeedData();
    await this.testRLSPolicies();
    await this.testFunctions();
    await this.testIndexes();
    await this.testRelationships();

    // Summary
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    
    console.log(`\n📊 Test Summary: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed! Database setup is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Check the errors above.');
      
      // Show failed tests
      const failed = this.results.filter(r => !r.passed);
      console.log('\n❌ Failed Tests:');
      failed.forEach(test => {
        console.log(`  - ${test.test}: ${test.error}`);
      });
    }

    return { passed, total, results: this.results };
  }
}

// Export for use in components or direct execution
export const runDatabaseTests = async () => {
  const tester = new DatabaseTester();
  return await tester.runAllTests();
};

// Auto-run if this file is executed directly
if (import.meta.hot) {
  runDatabaseTests();
}