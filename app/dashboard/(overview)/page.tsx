'use client'
import CardWrapper from '@/app/ui/dashboard/cards';
import { Header } from '@/app/ui/dashboard/header';
import TopSoldItems from '@/app/ui/dashboard/TopSoldItems';
import ExpensesChart from '@/app/ui/dashboard/ExpensesTrend';
import { Suspense, useEffect, useState } from 'react';
import {
    CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton,
} from '@/app/ui/skeletons';
import expenses from '@/app/ui/dashboard/data.json'

import LeastSoldItems from '@/app/ui/dashboard/LeastSoldItems';
import Test from '@/app/ui/dashboard/test';
import { set } from 'zod';
import { Filter } from '@/app/ui/dashboard/headerFilter';
import { getUser } from '@/app/lib/data';

export default function Page() {

    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const [region, setRegion] = useState('');
    const [district, setDistrict] = useState('');

    const [user, setUser] = useState();

    const handleFilterChange = (region, district, startDate, endDate) => {
        setStartDate(startDate);
        setEndDate(endDate);
        setRegion(region);
        setDistrict(district);
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
        <>
            <main>
                {user?.roles === 'Owner' ? (
                    <Filter filterChange={handleFilter} />
                ) : (
                    <Header onFilterChange={handleFilterChange} />
                )}

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
                        <CardWrapper region={region} district={district} startDate={startDate} endDate={endDate} />
                    </Suspense>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                    <Suspense fallback={<LatestInvoicesSkeleton />}>
                        <TopSoldItems region={region} district={district} startDate={startDate} endDate={endDate} />
                    </Suspense>
                    <Suspense fallback={<LatestInvoicesSkeleton />}>
                        <LeastSoldItems region={region} district={district} startDate={startDate} endDate={endDate} />
                    </Suspense>

                    <Suspense fallback={<RevenueChartSkeleton />}>
                        <ExpensesChart region={region} district={district} startDate={startDate} endDate={endDate} />
                    </Suspense>
                    {/* <Suspense fallback={<RevenueChartSkeleton />}>
                        <Test />
                    </Suspense> */}
                </div>
            </main>
        </>

    );
}

