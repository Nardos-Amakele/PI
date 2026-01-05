import { Suspense } from "react";
import EmailVerificationForm from "../../components/auth/EmailVerificationForm";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading verification...</div>}>
      <EmailVerificationForm />
    </Suspense>
  );
}
