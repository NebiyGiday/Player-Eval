import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center gap-2 bg-brand-green-light text-brand-green-dark text-sm font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-brand-green inline-block"></span>
          Youth Soccer Development
        </div>

        <h1 className="text-4xl font-semibold text-gray-900 mb-4 leading-tight">
          Player development,{" "}
          <span className="text-brand-green">made simple</span>
        </h1>

        <p className="text-gray-500 text-base mb-10 leading-relaxed">
          Coaches evaluate in under 60 seconds. Parents understand progress in
          under 10 seconds. Players get clear next steps.
        </p>

        <div className="flex flex-col gap-3 mb-12">
          <Link
            href="/auth/sign-up"
            className="w-full py-3.5 bg-brand-green text-white rounded-xl font-medium text-sm text-center hover:opacity-90 transition-opacity"
          >
            Get started — it&apos;s free
          </Link>
          <Link
            href="/auth/sign-in"
            className="w-full py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium text-sm text-center hover:bg-gray-50 transition-colors"
          >
            Sign in
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: "Evaluate", sub: "under 60 sec" },
            { label: "Understand", sub: "under 10 sec" },
            { label: "Improve", sub: "with clear drills" },
          ].map((item) => (
            <div key={item.label} className="card">
              <div className="text-sm font-500 text-gray-900 font-medium">
                {item.label}
              </div>
              <div className="text-xs text-gray-400 mt-1">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
