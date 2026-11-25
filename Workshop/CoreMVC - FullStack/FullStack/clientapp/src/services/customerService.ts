import type { Customer, CustomerInput } from '../types/customer'

async function request(path: string, init?: RequestInit): Promise<Response> {
  let response: Response
  try {
    response = await fetch(path, init)
  } catch (error) {
    console.error('Customer API request failed', error)
    throw new Error('Unable to reach the server. Please try again.')
  }

  if (!response.ok) {
    if (response.status >= 500) console.error('Customer API returned an error', response.status)
    if (response.status === 409) throw new Error('This email is already in use.')
    if (response.status === 404) throw new Error('Customer not found.')
    if (response.status === 400) throw new Error('Please check the customer details.')
    throw new Error('Unable to complete the request. Please try again.')
  }
  return response
}

async function jsonResponse<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await request(path, init)
  try {
    return await response.json() as T
  } catch {
    console.error('Customer API returned invalid JSON', response.status)
    throw new Error('The server returned an invalid response. Please try again.')
  }
}

const json = (method: string, input: CustomerInput): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(input),
})

export const customerService = {
  search: (search: string) => jsonResponse<Customer[]>(`/api/customers?search=${encodeURIComponent(search)}`),
  get: (id: string) => jsonResponse<Customer>(`/api/customers/${encodeURIComponent(id)}`),
  create: (input: CustomerInput) => jsonResponse<Customer>('/api/customers', json('POST', input)),
  update: (id: string, input: CustomerInput) => jsonResponse<Customer>(`/api/customers/${encodeURIComponent(id)}`, json('PUT', input)),
  delete: async (id: string) => { await request(`/api/customers/${encodeURIComponent(id)}`, { method: 'DELETE' }) },
}
