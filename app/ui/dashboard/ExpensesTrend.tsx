"use client";

import { formatDateToLocal, generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchExpenses, fetchExpensesSupervisor, getUser } from '@/app/lib/data';
import { useEffect, useState } from 'react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Tooltip,
    PointElement,
    LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components using ChartJS.register
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip
);

export default function ExpensesChart(
    { region, district, startDate, endDate }: { region: string, district: string, startDate: string, endDate: string }
) {

    const [expenses, setExpenses] = useState([]);

    const [sales, setSales] = useState([]);

    useEffect(() => {
        try {
            const fetchData = async () => {
                const user = await getUser();
                if (user?.roles === 'Supervisor') {
                    if (startDate && endDate && region && district) {
                        const expenses = await fetchExpensesSupervisor(region, district, startDate, endDate);

                        setExpenses(expenses);
                    }
                } else if (user?.roles === 'Owner') {
                    if (startDate && endDate) {
                        const expenses = await fetchExpenses(startDate, endDate);
                        setExpenses(expenses);
                    }
                }
            };
            fetchData();

        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }, [startDate, endDate, region, district,]);

    const data = {
        labels: expenses.map(expense => formatDateToLocal(expense.date)),
        datasets: [
            {
                data: expenses.map(expense => expense.amount),
                backgroundColor: "purple",
            },
            // {
            //     data: [111, 345, 667, 12, 34, 65, 355, 0, 213, 68, 45, 300],
            //     backgroundColor: "green",
            // }
        ],
    }


    return (
        <div className="w-full md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Recent Revenue
            </h2>
            <div className="rounded-xl bg-gray-50 p-4">
                <div className="mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 sm:grid-cols-13 md:gap-4">
                    <Line data={data} />
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
                </div>
            </div>
        </div>
    );
}
