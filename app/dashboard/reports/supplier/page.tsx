import { fetchSupplier } from "@/app/lib/data";
import Suppliertable from "@/app/ui/Reports/Suppliertable";
import Breadcrumbs from "@/app/ui/Stock-Management/breadcrumbs";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Suppliers Reports`,
    description: "Suppliers Reports",
};
export default async function Page() {
    const supplier = await fetchSupplier();
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Reports', href: '/dashboard/reports' },
                    {
                        label: 'Suppliers Reports',
                        href: '/dashboard/report/supplier',
                        active: true,
                    },
                ]}
            />
            <div className="w-full">

                <Suspense fallback={<InvoicesTableSkeleton />}>
                    <Suppliertable supplier={supplier} />
                </Suspense>
            </div>
        </main>

    );
}