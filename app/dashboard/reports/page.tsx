'use client'
import { fetchProductStockPages, fetchUserAddo, getUser } from "@/app/lib/data";
import Expensestable from "@/app/ui/Reports/Expensestable";
import { CreateStock } from "@/app/ui/Stock-Management/buttons";
import Pagination from "@/app/ui/Stock-Management/pagination";
import Table from "@/app/ui/Stock-Management/table";
import { Header } from "@/app/ui/dashboard/header";
import { Filter } from "@/app/ui/dashboard/headerFilter";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { get } from "http";
import { Metadata } from "next";
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
            <div className="w-full">
                <div className="flex w-full items-center justify-between">
                    <h1 className={`${lusitana.className} text-2xl`}>REPORTS</h1>
                </div>
                {user?.roles === 'Owner' ? (
                    <Filter filterChange={handleFilter} />
                ) : (
                    <Header onFilterChange={handleFilterChange} />
                )}
                <Suspense fallback={<InvoicesTableSkeleton />}>
                    <Expensestable region={region} district={district} startDate={startDate} endDate={endDate} />
                </Suspense>
                <div className="mt-5 flex w-full justify-center">
                    {/* <Pagination query={query} /> */}
                </div>
            </div>
        </main>

    );
}