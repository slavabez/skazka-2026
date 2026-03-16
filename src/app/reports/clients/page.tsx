import { Suspense } from "react";
import FullPageLoader from "@/components/FullPageLoader";
import ClientsPageClient from "./ClientsPageClient";

export default function ReportsClientsPage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <ClientsPageClient />
    </Suspense>
  );
}
