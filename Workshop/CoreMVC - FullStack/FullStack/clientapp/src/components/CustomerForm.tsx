import { useState, type FormEvent } from 'react'
import type { CustomerInput } from '../types/customer'

interface Props {
  initialValue?: CustomerInput
  pending: boolean
  onSubmit: (input: CustomerInput) => void
}

export default function CustomerForm({ initialValue, pending, onSubmit }: Props) {
  const [name, setName] = useState(initialValue?.name ?? '')
  const [email, setEmail] = useState(initialValue?.email ?? '')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ name: name.trim(), email: email.trim() })
  }

  return (
    <form onSubmit={submit}>
      <label>Name <input value={name} onChange={event => setName(event.target.value)} required maxLength={200} /></label>
      <label>Email <input type="email" value={email} onChange={event => setEmail(event.target.value)} required maxLength={256} /></label>
      <button type="submit" disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>
    </form>
  )
}
