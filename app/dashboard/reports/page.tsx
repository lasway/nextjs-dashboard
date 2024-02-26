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
import Link from "next/link";
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
                <div className="gap-4 grid ">
                    <div className="flex w-full items-center justify-between">
                        <h1 className={`${lusitana.className} text-2xl`}>List of Reports</h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Link href="/dashboard/reports/expenses">
                            <div className="bg-blue-500 rounded-md shadow-md cursor-pointer">
                                <div className="p-4">
                                    <h2 className="text-white text-2xl">Expenses</h2>
                                    <p className="text-white">View expenses report</p>
                                </div>
                            </div>
                        </Link>
                        <Link href="/dashboard/reports/sales">
                            <div className="bg-blue-500 rounded-md shadow-md cursor-pointer">
                                <div className="p-4">
                                    <h2 className="text-white text-2xl">Sales</h2>
                                    <p className="text-white">View sales report</p>
                                </div>
                            </div>
                        </Link>
                        <Link href="/dashboard/reports/topSold">
                            <div className="bg-blue-500 rounded-md shadow-md cursor-pointer">
                                <div className="p-4">
                                    <h2 className="text-white text-2xl">Top Sold Products</h2>
                                    <p className="text-white">View top sold report</p>
                                </div>
                            </div>
                        </Link>
                        <Link href="/dashboard/reports/leastSold">
                            <div className="bg-blue-500 rounded-md shadow-md cursor-pointer">
                                <div className="p-4">
                                    <h2 className="text-white text-2xl">Least Sold Products</h2>
                                    <p className="text-white">View least sold report</p>
                                </div>
                            </div>
                        </Link>
                        <Link href="/dashboard/reports/supplier">
                            <div className="bg-blue-500 rounded-md shadow-md cursor-pointer">
                                <div className="p-4">
                                    <h2 className="text-white text-2xl">Suppliers</h2>
                                    <p className="text-white">View suppliers report</p>
                                </div>
                            </div>
                        </Link>
                        <Link href="/products-report">
                            <div className="bg-blue-500 rounded-md shadow-md cursor-pointer">
                                <div className="p-4">
                                    <h2 className="text-white text-2xl">Products</h2>
                                    <p className="text-white">View products report</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </main>

    );
}