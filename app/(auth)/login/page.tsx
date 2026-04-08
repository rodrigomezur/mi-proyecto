'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/app/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import GoogleButton from '@/components/auth/google-button'

function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [pending, setPending] = useState(false)

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
        <CardDescription className="text-slate-400">Sign in to your account</CardDescription>
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
            await login(formData)
            setPending(false)
          }}
          className="space-y-4"
        >
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
              autoComplete="current-password"
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]"
            />
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-slate-900 font-semibold cursor-pointer disabled:opacity-70"
          >
            {pending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-800 px-2 text-slate-400">or</span>
          </div>
        </div>

        <GoogleButton />

        <p className="text-center text-sm text-slate-400 mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[var(--color-accent)] hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto px-4 pt-28 pb-12">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
