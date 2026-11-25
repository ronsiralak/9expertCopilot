import { afterEach, describe, expect, it, vi } from 'vitest'
import { customerService } from './customerService'

afterEach(() => { vi.unstubAllGlobals() })

describe('customerService', () => {
  it('encodes the search term in the API request', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('[]', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await customerService.search('a&b')

    expect(fetchMock).toHaveBeenCalledWith('/api/customers?search=a%26b', undefined)
  })

  it('reports an email conflict to the user', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 409 })))

    await expect(customerService.create({ name: 'Jane', email: 'jane@example.com' }))
      .rejects.toThrow('This email is already in use.')
  })
})
