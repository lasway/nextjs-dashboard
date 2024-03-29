'use client'
import CardWrapper from '@/app/ui/dashboard/cards';
import { Header } from '@/app/ui/dashboard/header';
import TopSoldItems from '@/app/ui/dashboard/TopSoldItems';
import { Suspense, useEffect, useState } from 'react';
import {
    CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton,
} from '@/app/ui/skeletons';

import LeastSoldItems from '@/app/ui/dashboard/LeastSoldItems';
import { Filter } from '@/app/ui/dashboard/headerFilter';
import { getUser } from '@/app/lib/data';
import ExpensesLine from '@/app/ui/dashboard/ExpensesLine';
import ExpensesBar from '@/app/ui/dashboard/ExpensesBar';
import ExpensesDoughnut from '@/app/ui/dashboard/ExpenseDoug';
import SalesLine from '@/app/ui/dashboard/SalesLine';
import SalesBar from '@/app/ui/dashboard/SalesBar';
import Image from 'next/image';
import { FunnelIcon } from '@heroicons/react/24/outline';


export default function Page() {

    // Set default values for startDate and endDate
    const [startDate, setStartDate] = useState(getFirstDayOfMonth()); // First day of current month
    const [endDate, setEndDate] = useState(getTodayDate()); // Today's date

    // Function to get the first day of the current month
    function getFirstDayOfMonth() {
        const today = new Date();
        return today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-01';
    }

    // Function to get today's date
    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }

        return `${year}-${month}-${day}`;
    }

    const [showFilters, setShowFilters] = useState(false);
    const [region, setRegion] = useState('');
    const [district, setDistrict] = useState('');

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

    const handleToggleFilters = () => {
        setShowFilters(!showFilters);
    };

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
                <div className="flex flex-row my-3 items-center gap-4">
                    <button className="flex rounded-md bg-blue-500 w-50 h-7" onClick={handleToggleFilters}>
                        <FunnelIcon className="h-6 w-9 text-white" />
                        filters
                    </button>
                    {showFilters && (
                        <div className="filters">
                            {user?.roles === 'Owner' ? (
                                <Filter filterChange={handleFilter} />
                            ) : (
                                <Header onFilterChange={handleFilterChange} />
                            )}
                        </div>
                    )}
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                        <SalesLine region={region} district={district} startDate={startDate} endDate={endDate} />
                    </Suspense>

                    <Suspense fallback={<RevenueChartSkeleton />}>
                        <SalesBar region={region} district={district} startDate={startDate} endDate={endDate} />
                    </Suspense>

                    <Suspense fallback={<RevenueChartSkeleton />}>
                        <ExpensesLine region={region} district={district} startDate={startDate} endDate={endDate} />
                    </Suspense>

                    <Suspense fallback={<RevenueChartSkeleton />}>
                        <ExpensesBar region={region} district={district} startDate={startDate} endDate={endDate} />
                    </Suspense>

                    {/* <Suspense fallback={<RevenueChartSkeleton />}>
                        <ExpensesDoughnut region={region} district={district} startDate={startDate} endDate={endDate} />
                    </Suspense> */}
                </div>
            </main>
        </>

    );
}

