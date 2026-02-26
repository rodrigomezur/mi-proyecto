import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Blocks */}
        <div className="grid sm:grid-cols-12 lg:grid-cols-10 gap-8 py-8 md:py-12 border-t border-slate-800">
          {/* 1st block — Brand */}
          <div className="sm:col-span-12 lg:col-span-2 lg:max-w-xs">
            <div className="mb-2">
              <Link className="inline-flex" href="/" aria-label="Creatiq">
                <span className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-widest text-[var(--color-accent)]">
                  CREATIQ
                </span>
              </Link>
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">Know why your ads work.</p>
          </div>
          {/* 2nd block — Product */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-xs text-[var(--color-text-primary)] font-semibold uppercase underline mb-3">Product</h6>
            <ul className="text-sm space-y-2">
              {['Features', 'Pricing', 'Changelog', 'Roadmap'].map((item) => (
                <li key={item}>
                  <a className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition duration-150 ease-in-out" href="#0">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          {/* 3rd block — Resources */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-xs text-[var(--color-text-primary)] font-semibold uppercase underline mb-3">Resources</h6>
            <ul className="text-sm space-y-2">
              {['Docs', 'API Reference', 'Blog', 'Status'].map((item) => (
                <li key={item}>
                  <a className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition duration-150 ease-in-out" href="#0">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          {/* 4th block — Company */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-xs text-[var(--color-text-primary)] font-semibold uppercase underline mb-3">Company</h6>
            <ul className="text-sm space-y-2">
              {['About', 'Careers', 'Contact', 'Press'].map((item) => (
                <li key={item}>
                  <a className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition duration-150 ease-in-out" href="#0">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          {/* 5th block — Legal */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-xs text-[var(--color-text-primary)] font-semibold uppercase underline mb-3">Legal</h6>
            <ul className="text-sm space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Security'].map((item) => (
                <li key={item}>
                  <a className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition duration-150 ease-in-out" href="#0">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Bottom area */}
        <div className="md:flex md:items-center md:justify-between pb-4 md:pb-8">
          {/* Social links */}
          <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0">
            <li>
              <a className="flex justify-center items-center text-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition duration-150 ease-in-out" href="#0" aria-label="Twitter">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z" />
                </svg>
              </a>
            </li>
            <li className="ml-2">
              <a className="flex justify-center items-center text-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition duration-150 ease-in-out" href="#0" aria-label="LinkedIn">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 8H9a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1Zm-1.708 3.791-.858.823a.251.251 0 0 0-.1.241V18.9a.251.251 0 0 0 .1.241l.838.823v.181h-4.215v-.181l.868-.843c.085-.085.085-.11.085-.241v-4.887l-2.41 6.131h-.329l-2.81-6.13V18.1a.567.567 0 0 0 .156.472l1.129 1.37v.181h-3.2v-.181l1.129-1.37a.547.547 0 0 0 .146-.472v-4.749a.416.416 0 0 0-.138-.351l-1-1.209v-.181H13.8l2.4 5.283 2.122-5.283h2.971l-.001.181Z" />
                </svg>
              </a>
            </li>
          </ul>
          {/* Copyright */}
          <div className="text-sm text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} Creatiq. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
