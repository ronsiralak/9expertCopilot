import { Link, useNavigate, useParams } from 'react-router-dom'
import CustomerForm from '../components/CustomerForm'
import { useCustomer, useSaveCustomer } from '../hooks/useCustomers'

export default function CustomerFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const customer = useCustomer(id)
  const save = useSaveCustomer(id)

  return (
    <section>
      <h1>{id ? 'Edit customer' : 'Create customer'}</h1>
      <Link to="/customers">Back to customers</Link>
      {id && customer.isLoading && <p>Loading customer...</p>}
      {id && customer.error && <p role="alert">{customer.error.message}</p>}
      {save.error && <p role="alert">{save.error.message}</p>}
      {(!id || customer.data) && (
        <CustomerForm
          key={id ?? 'new'}
          initialValue={customer.data}
          pending={save.isPending}
          onSubmit={input => save.mutate(input, { onSuccess: () => navigate('/customers') })}
        />
      )}
    </section>
  )
}
