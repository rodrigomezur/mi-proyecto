'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { register } from '../actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

function RegisterForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [pending, setPending] = useState(false)

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Create account</CardTitle>
        <CardDescription className="text-slate-400">Get started with Creatiq</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <form
          action={async (formData) => {
            setPending(true)
            await register(formData)
            setPending(false)
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-slate-300">Full name</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              autoComplete="new-password"
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]"
            />
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-slate-900 font-semibold cursor-pointer disabled:opacity-70"
          >
            {pending ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--color-accent)] hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default function RegisterPage() {
  return (
    <div className="max-w-sm mx-auto px-4 pt-28 pb-12">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
