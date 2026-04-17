import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="text-brand-green font-semibold text-xl">PlayerEval</span>
        </div>
        <SignUp />
      </div>
    </main>
  );
}
