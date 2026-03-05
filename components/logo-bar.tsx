export default function LogoBar() {
  const logos = [
    'Momentum Agency',
    'Scale Digital',
    'Nomad Goods',
    'Vertex Media',
    'Polar Growth',
  ]

  return (
    <section className="border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-8 md:py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] text-center mb-6">
            Trusted by performance teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
            {logos.map((name) => (
              <span
                key={name}
                className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-widest text-[var(--color-text-muted)] opacity-60 hover:opacity-100 transition-opacity duration-200"
              >
                {name.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
