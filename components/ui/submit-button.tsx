'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

export default function SubmitButton({
  label = 'Save',
  pendingLabel = 'Saving...',
  className = '',
}: {
  label?: string
  pendingLabel?: string
  className?: string
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className={`cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      {pending ? pendingLabel : label}
    </Button>
  )
}
