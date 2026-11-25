import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCustomers, useDeleteCustomer } from '../hooks/useCustomers'

export default function CustomerListPage() {
  const [search, setSearch] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const customers = useCustomers(submittedSearch)
  const deletion = useDeleteCustomer()

  return (
    <section>
      <h1>Customers</h1>
      <Link to="/customers/new">Create customer</Link>
      <form onSubmit={event => { event.preventDefault(); setSubmittedSearch(search) }}>
        <label>Search <input value={search} maxLength={200} onChange={event => setSearch(event.target.value)} /></label>
        <button type="submit">Search</button>
      </form>
      <p>Showing up to 100 matches.</p>
      {customers.isLoading && <p>Loading customers...</p>}
      {customers.error && <p role="alert">{customers.error.message}</p>}
      {deletion.error && <p role="alert">{deletion.error.message}</p>}
      {customers.data && (
        customers.data.length === 0 ? <p>No customers found.</p> :
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Actions</th></tr></thead>
            <tbody>{customers.data.map(customer => (
              <tr key={customer.id}>
                <td>{customer.name}</td><td>{customer.email}</td>
                <td>
                  <Link to={`/customers/${customer.id}/edit`}>Edit</Link>{' '}
                  <button disabled={deletion.isPending} onClick={() => {
                    if (window.confirm('Delete this customer?')) deletion.mutate(customer.id)
                  }}>Delete</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
      )}
    </section>
  )
}
