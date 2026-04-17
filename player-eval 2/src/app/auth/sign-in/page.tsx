import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="text-brand-green font-semibold text-xl">PlayerEval</span>
        </div>
        <SignIn />
      </div>
    </main>
  );
}
