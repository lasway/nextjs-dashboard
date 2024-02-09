'use client'
import CardWrapper from '@/app/ui/dashboard/cards';
import { Header } from '@/app/ui/dashboard/header';
import TopSoldItems from '@/app/ui/dashboard/TopSoldItems';
import { Suspense, use, useEffect, useState } from 'react';
import {
    CardsSkeleton,
} from '@/app/ui/skeletons';

import { fetchUserAddo } from '@/app/lib/data';


export default function Page() {

    const [addo, setAddo] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const addo = await fetchUserAddo();
                setAddo(addo);
            } catch (error) {
                console.error('Error fetching addo:', error);
            }
        };

        fetchData();
    }, []);

    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const handleFilterChange = (startDate, endDate) => {
        console.log(startDate, endDate);
        setStartDate(startDate);
        setEndDate(endDate);
    };
    return (

        <>

            <main>

                <Header onFilterChange={handleFilterChange} />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* <Card title="Collected" value={totalPaidInvoices} type="collected" />
                    <Card title="Pending" value={totalPendingInvoices} type="pending" />
                    <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
                    <Card
                        title="Total Customers"
                        value={numberOfCustomers}
                        type="customers"
                    /> */}
                    <Suspense fallback={<CardsSkeleton />}>
                        <CardWrapper addo={addo} startDate={startDate} endDate={endDate} />
                    </Suspense>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                    {/* <TopSoldItems addo={addo} startDate={startDate} endDate={endDate} /> */}
                </div>
            </main>
        </>

    );
}

