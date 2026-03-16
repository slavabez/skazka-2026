import { Suspense } from "react";
import FullPageLoader from "@/components/FullPageLoader";
import GoodsPageClient from "./GoodsPageClient";

export default function ReportsGoodsPage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <GoodsPageClient />
    </Suspense>
  );
}
