'use client'
import { getUser } from "@/app/lib/data";
import LeastSoldtable from "@/app/ui/Reports/LeastSoldtable";
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
                console.error('Error fail to fetch user:', error);
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
                        label: 'Least Sold Product Reports',
                        href: '/dashboard/report/leastSold',
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
                    <LeastSoldtable region={region} district={district} startDate={startDate} endDate={endDate} user={user} />
                </Suspense>
            </div>
        </main>

    );
}