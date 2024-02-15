'use client'
import { fetchProductStockPages, fetchUserAddo } from "@/app/lib/data";
import { CreateStock } from "@/app/ui/Stock-Management/buttons";
import Pagination from "@/app/ui/Stock-Management/pagination";
import Table from "@/app/ui/Stock-Management/table";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Metadata } from "next";
import { Suspense, useEffect, useState } from "react";



export default function Page(
    {
        searchParams,
    }: {
        searchParams?: {
            query?: string;
            page?: string;
        }
    }
) {
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;


    return (
        <main>
            <div className="w-full">
                <div className="flex w-full items-center justify-between">
                    <h1 className={`${lusitana.className} text-2xl`}>Stock Management</h1>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                    <Search placeholder="Search invoices..." />
                    <CreateStock />
                </div>
                {/* <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}> */}
                {/* <Table query={query} currentPage={currentPage} /> */}
                <Suspense fallback={<InvoicesTableSkeleton />}>
                    <Table query={query} currentPage={currentPage} />
                </Suspense>
                <div className="mt-5 flex w-full justify-center">
                    <Pagination query={query} />
                </div>
            </div>
        </main>

    );
}