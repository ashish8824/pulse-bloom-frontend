interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-72 md:w-96 h-72 md:h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-72 md:w-96 h-72 md:h-96 bg-brand-800/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 md:mb-8">
          <div className="text-4xl md:text-5xl mb-3">🌸</div>
          <h1 className="text-xl md:text-2xl font-bold text-brand-400">
            PulseBloom
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your pulse. Bloom with intention.
          </p>
        </div>

        {/* Card */}
        <div className="card p-5 md:p-6">{children}</div>
      </div>
    </div>
  );
}
