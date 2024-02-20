import { formatDateToLocal, generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchExpenses, fetchExpensesSupervisor, fetchSalesSupervisor, getUser } from '@/app/lib/data';
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

export default function ExpensesLine(
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
    }, [region, district, startDate, endDate]);

    const data = {
        labels: expenses.map(expense => formatDateToLocal(expense.date)),
        datasets: [
            {
                data: expenses.map(expense => expense.amount),
                backgroundColor: "rgba(49, 130, 206, 1)",
            },
        ],
    }

    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Dates'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Total Amounts'
                },
                beginAtZero: true
            }
        }
    };


    return (
        <div className="w-full md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Expenses Trends in Line Chart
            </h2>
            <div className="rounded-xl bg-gray-50 p-4">
                <div className="mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 sm:grid-cols-13 md:gap-4">
                    <Line data={data} options={options} />
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">From {startDate} to {endDate}</h3>
                </div>
            </div>
        </div>
    );
}
