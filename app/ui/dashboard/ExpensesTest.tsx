import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '../fonts';
import {
    Chart as ChartJS,
    CategoryScale,
    BarController,
    BarElement,
    LinearScale,
    Tooltip,
    PointElement,
    LineElement,
} from "chart.js";
import { fetchExpenses, fetchExpensesSupervisor, fetchSales, fetchSalesSupervisor, getUser } from '@/app/lib/data';
import { formatDateToLocal, getEndOfMonth, getEndOfWeek, getStartOfMonth, getStartOfWeek, getWeeksInMonth } from '@/app/lib/utils';

ChartJS.register(
    CategoryScale,
    BarController,
    BarElement,
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

export default function ExpensesBar({ region, district, startDate, endDate }: { region: string, district: string, startDate: string, endDate: string }) {

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

    // Determine if the range is within a single month or spans multiple months
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startOfMonth = getStartOfMonth(start);
    const endOfMonth = getEndOfMonth(end);
    const weeksInMonth = getWeeksInMonth(startOfMonth);

    const labels: string[] = [];
    const datasets: { label: string, data: number[], backgroundColor: string }[] = [];

    if (weeksInMonth === 4) {
        // If the range is within a single month, group data by weeks
        let currentDate = startOfMonth;
        while (currentDate <= endOfMonth) {
            const startOfWeek = getStartOfWeek(currentDate);
            const endOfWeek = getEndOfWeek(currentDate);
            const weekLabel = `${formatDateToLocal(startOfWeek)} - ${formatDateToLocal(endOfWeek)}`;
            labels.push(weekLabel);

            const expenseTotal = expenses.reduce((total, expense) => {
                const expenseDate = new Date(expense.date);
                if (expenseDate >= startOfWeek && expenseDate <= endOfWeek) {
                    total += expense.amount;
                }
                return total;
            }, 0);

            const saleTotal = sales.reduce((total, sale) => {
                const saleDate = new Date(sale.sellingDate);
                if (saleDate >= startOfWeek && saleDate <= endOfWeek) {
                    total += sale.total;
                }
                return total;
            }, 0);

            datasets.push({
                label: 'Expenses',
                data: [expenseTotal],
                backgroundColor: "rgba(49, 130, 206, 1)",
            },
                {
                    label: 'Sales',
                    data: [saleTotal],
                    backgroundColor: "rgba(255, 99, 132, 1)",
                });

            currentDate = new Date(endOfWeek);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    } else {
        // If the range spans multiple months, group data by months
        let currentDate = startOfMonth;
        while (currentDate <= endOfMonth) {
            const startOfMonth = getStartOfMonth(currentDate);
            const endOfMonth = getEndOfMonth(currentDate);
            const monthLabel = `${startOfMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}`;
            labels.push(monthLabel);

            const expenseTotal = expenses.reduce((total, expense) => {
                const expenseDate = new Date(expense.date);
                if (expenseDate >= startOfMonth && expenseDate <= endOfMonth) {
                    total += expense.amount;
                }
                return total;
            }, 0);

            const saleTotal = sales.reduce((total, sale) => {
                const saleDate = new Date(sale.sellingDate);
                if (saleDate >= startOfMonth && saleDate <= endOfMonth) {
                    total += sale.total;
                }
                return total;
            }, 0);

            datasets.push({
                label: 'Expenses',
                data: [expenseTotal],
                backgroundColor: "rgba(49, 130, 206, 1)",
            },
                {
                    label: 'Sales',
                    data: [saleTotal],
                    backgroundColor: "rgba(255, 99, 132, 1)",
                });

            currentDate.setMonth(currentDate.getMonth() + 1);
        }
    }

    const data = {
        labels,
        datasets,
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
                Expenses Trends in Bar Chart
            </h2>
            <div className="rounded-xl bg-gray-50 p-4">
                <div className="mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 sm:grid-cols-13 md:gap-4">
                    <Bar data={data} options={options} />
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">From {startDate} to {endDate}</h3>
                </div>
            </div>
        </div>
    );
}
