import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '../fonts';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
} from "chart.js";
import { fetchExpenses, fetchExpensesSupervisor, getUser } from '@/app/lib/data';
import { formatDateToLocal } from '@/app/lib/utils';

ChartJS.register(
    ArcElement,
    Tooltip
);

export default function ExpensesDoughnut({ region, district, startDate, endDate }: { region: string, district: string, startDate: string, endDate: string }) {

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
    }, [region, district, startDate, endDate]);

    const data = {
        labels: expenses.map(expense => formatDateToLocal(expense.date)),
        datasets: [
            {
                data: expenses.map(expense => expense.amount),
                backgroundColor: ['rgba(49, 130, 206, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(255, 99, 132, 1)',
                    , 'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(231, 233, 237, 1)',
                    'rgba(255, 100, 1)',
                    `rgba(255, 99, 255)`,],
            },
        ],
    };

    const options = {}

    return (
        <div className="w-full md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Expenses Doughnut Chart
            </h2>
            <div className="rounded-xl bg-gray-50 p-4">
                <div className="mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 sm:grid-cols-13 md:gap-4">
                    <Doughnut data={data} options={options} />
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">From {startDate} to {endDate}</h3>
                </div>
            </div>
        </div>
    );
}
