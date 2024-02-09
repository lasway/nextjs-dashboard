'use client'
import {
    BanknotesIcon,
    ClockIcon,
    UserGroupIcon,
    InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData, fetchProductStock, fetchTopProducts } from '@/app/lib/data';
import { start } from 'repl';
import { useEffect, useState } from 'react';
import { get } from 'http';
const iconMap = {
    collected: BanknotesIcon,
    customers: UserGroupIcon,
    pending: ClockIcon,
    invoices: InboxIcon,
};

export default function CardWrapper({ addo, startDate, endDate }:
    { addo: string, startDate: string, endDate: string }) {

    const [cardData, setCardData] = useState({
        totalSales: 0,
        totalExpenses: 0,
        totalRevenue: 0,
        saleCount: 0,
        expenseCount: 0,
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (startDate && endDate) {
                    const data = await fetchCardData(addo, startDate, endDate);
                    const stock = await fetchProductStock(addo);
                    console.log(stock);
                    // const product = await fetchTopProducts(addo, startDate, endDate);
                    // console.log(product);
                    setCardData(data);
                }

            } catch (error) {
                console.error('Error fetching card data:', error);
            }
        };

        fetchData();
    }, [addo, startDate, endDate]);

    return (
        <>
            {/* NOTE: comment in this code when you get to this point in the course */}

            <Card title="Total Sales" value={cardData.totalSales} type="collected" />
            <Card title="Total Expenses" value={cardData.totalExpenses} type="pending" />
            <Card title="Total Revenue" value={cardData.totalRevenue} type="invoices" />
            <Card
                title="Total Sales"
                value={cardData.saleCount}
                type="customers"
            />
        </>
    );
}

export async function Card({
    title,
    value,
    type,
}: {
    title: string;
    value: number | string;
    type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
    const Icon = iconMap[type];

    return (
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <div className="flex p-4">
                {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
                <h3 className="ml-2 text-sm font-medium">{title}</h3>
            </div>
            <p
                className={`${lusitana.className}
            truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
            >
                {value}
            </p>
        </div>
    );
}
