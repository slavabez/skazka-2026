import { Suspense } from "react";
import FullPageLoader from "@/components/FullPageLoader";
import GoodsAndClientsPageClient from "./GoodsAndClientsPageClient";

export default function ReportsGoodsAndClientsPage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <GoodsAndClientsPageClient />
    </Suspense>
  );
}
