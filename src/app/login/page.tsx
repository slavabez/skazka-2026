import { Suspense } from "react";
import FullPageLoader from "@/components/FullPageLoader";
import LoginPageClient from "./LoginPageClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <LoginPageClient />
    </Suspense>
  );
}
