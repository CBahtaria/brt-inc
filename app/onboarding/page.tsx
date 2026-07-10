import { OnboardingForm } from '@/components/portal/OnboardingForm'

export default function OnboardingPage() {
  return (
    <main className="min-h-screen py-20 px-4" style={{ background: 'var(--background)' }}>
      <div className="max-w-xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-subtle)' }}>
          Start a Project
        </p>
        <h1 className="text-3xl font-bold mb-8">Tell me about your project.</h1>
        <OnboardingForm />
      </div>
    </main>
  )
}
