'use client'
import { getUser } from "@/app/lib/data";
import Salestable from "@/app/ui/Reports/Salestable";
import Breadcrumbs from "@/app/ui/Stock-Management/breadcrumbs";
import { Header } from "@/app/ui/dashboard/header";
import { Filter } from "@/app/ui/dashboard/headerFilter";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense, useEffect, useState } from "react";
export default function Page() {

    const [region, setRegion] = useState('');
    const [district, setDistrict] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const [user, setUser] = useState();

    const handleFilterChange = (region, district, startDate, endDate) => {
        setRegion(region);
        setDistrict(district);
        setStartDate(startDate);
        setEndDate(endDate);

    };
    const handleFilter = (startDate, endDate) => {
        setStartDate(startDate);
        setEndDate(endDate);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getUser();
                setUser(user);
            } catch (error) {
                console.error('Error fetching top sold items:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Reports', href: '/dashboard/reports' },
                    {
                        label: 'Sales Reports',
                        href: '/dashboard/report/sales',
                        active: true,
                    },
                ]}
            />
            <div className="w-full">
                {user?.roles === 'Owner' ? (
                    <Filter filterChange={handleFilter} />
                ) : (
                    <Header onFilterChange={handleFilterChange} />
                )}
                <Suspense fallback={<InvoicesTableSkeleton />}>
                    <Salestable region={region} district={district} startDate={startDate} endDate={endDate} user={user} />
                </Suspense>
            </div>
        </main>

    );
}