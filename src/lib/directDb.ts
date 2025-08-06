import { supabase } from '@/integrations/supabase/client'

export interface DirectDbResponse<T = any> {
  success: boolean
  data?: T[]
  rowCount?: number
  error?: string
}

export class DirectDb {
  private static baseUrl = 'https://atxejcaplvqgmggmwdsq.supabase.co/functions/v1/direct-db'

  static async query<T = any>(
    query: string, 
    params?: any[]
  ): Promise<DirectDbResponse<T>> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({ query, params }),
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Direct DB query error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Convenience methods for common operations
  static async select(table: string, where?: string, params?: any[]) {
    const query = where 
      ? `SELECT * FROM ${table} WHERE ${where}`
      : `SELECT * FROM ${table}`
    return this.query(query, params)
  }

  static async insert(table: string, data: Record<string, any>) {
    const columns = Object.keys(data).join(', ')
    const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(', ')
    const values = Object.values(data)
    
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`
    return this.query(query, values)
  }

  static async update(table: string, data: Record<string, any>, where: string, whereParams: any[]) {
    const setClauses = Object.keys(data).map((key, i) => 
      `${key} = $${i + 1}`
    ).join(', ')
    const values = [...Object.values(data), ...whereParams]
    
    const query = `UPDATE ${table} SET ${setClauses} WHERE ${where} RETURNING *`
    return this.query(query, values)
  }

  static async delete(table: string, where: string, params: any[]) {
    const query = `DELETE FROM ${table} WHERE ${where} RETURNING *`
    return this.query(query, params)
  }
}