import { formatDateToLocal } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchExpenses, fetchExpensesSupervisor, fetchSales, fetchSalesSupervisor, getUser } from '@/app/lib/data';
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

interface Expense {
    date: string;
    amount: number;
}

interface Sale {
    sellingDate: string;
    total: number;
}

export default function ExpensesLine(
    { region, district, startDate, endDate }: { region: string, district: string, startDate: string, endDate: string }
) {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);

    useEffect(() => {
        try {
            const fetchData = async () => {
                const user = await getUser();
                let expensesData = [];
                let salesData = [];

                if (user?.roles === 'Supervisor') {

                    if (region && district && startDate && endDate) {
                        expensesData = await fetchExpensesSupervisor('all', startDate, endDate, region, district);
                    } else if (region && startDate && endDate) {
                        expensesData = await fetchExpensesSupervisor('region', startDate, endDate, region, undefined);
                    } else if (startDate && endDate) {
                        expensesData = await fetchExpensesSupervisor('dates', startDate, endDate, undefined, undefined);
                    }

                    if (region && district && startDate && endDate) {
                        salesData = await fetchSalesSupervisor('all', startDate, endDate, region, district);
                    } else if (region && startDate && endDate) {
                        salesData = await fetchSalesSupervisor('region', startDate, endDate, region, undefined);
                    } else if (startDate && endDate) {
                        salesData = await fetchSalesSupervisor('dates', startDate, endDate, undefined, undefined);
                    }
                } else if (user?.roles === 'Owner') {

                    if (startDate && endDate) {
                        expensesData = await fetchExpenses(startDate, endDate);
                    }

                    if (startDate && endDate) {
                        salesData = await fetchSales(startDate, endDate);
                    }
                }

                setExpenses(expensesData);
                setSales(salesData);
            };

            fetchData();

        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }, [region, district, startDate, endDate]);

    // Combine the date arrays from expenses and sales
    const allDates = [...expenses.map(expense => new Date(expense.date)), ...sales.map(sale => new Date(sale.sellingDate))];

    // Sort dates in ascending order and remove duplicates
    const uniqueSortedDates = Array.from(new Set(allDates)).sort((a, b) => a.getTime() - b.getTime());

    // Map amounts and totals to the sorted dates
    const data = {
        labels: uniqueSortedDates.map(date => formatDateToLocal(date)),
        datasets: [
            {
                label: 'Expenses',
                data: uniqueSortedDates.map(date => expenses.find(expense => new Date(expense.date).getTime() === date.getTime())?.amount || 0),
                backgroundColor: "rgba(49, 130, 206, 1)",
            },
            {
                label: 'Sales',
                data: uniqueSortedDates.map(date => sales.find(sale => new Date(sale.sellingDate).getTime() === date.getTime())?.total || 0),
                backgroundColor: "rgba(255, 99, 132, 1)",
            }
        ],
    };

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
