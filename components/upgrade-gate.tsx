import Link from 'next/link'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UpgradeGate({
  feature,
  requiredPlan = 'Solo',
}: {
  feature: string
  requiredPlan?: string
}) {
  return (
    <div className="flex-1 flex items-center justify-center p-7">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--dash-bg3)] border border-[var(--dash-border)] flex items-center justify-center">
          <Lock className="w-7 h-7 text-[var(--dash-text-muted)]" />
        </div>
        <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold text-[var(--dash-text)] mb-2">
          Upgrade to unlock {feature}
        </h2>
        <p className="text-sm text-[var(--dash-text-muted)] mb-6">
          This feature requires the {requiredPlan} plan or higher. Start your free trial to get access.
        </p>
        <Link href="/pricing">
          <Button className="bg-[var(--acid)] hover:bg-[var(--acid)] text-black font-semibold cursor-pointer">
            View Plans
          </Button>
        </Link>
      </div>
    </div>
  )
}
