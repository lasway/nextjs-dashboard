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
import { fetchExpenses, fetchExpensesSupervisor, fetchExpensesSupervisors, getUser } from '@/app/lib/data';
import { formatDateToLocal } from '@/app/lib/utils';
import { start } from 'repl';

ChartJS.register(
    CategoryScale,
    BarController,
    BarElement,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip
);

export default function ExpensesBar({ region, district, startDate, endDate }: { region: string, district: string, startDate: string, endDate: string }) {

    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        try {
            const fetchData = async () => {
                const user = await getUser();
                if (user?.roles === 'Supervisor') {
                    if (region && district && startDate && endDate) {
                        // const cardData = await fetchCardDataSupervisorByAll(region, district, startDate, endDate);
                        const cardData = await fetchExpensesSupervisor('all', startDate, endDate, region, district);
                        setExpenses(cardData);
                    } else if (region && startDate && endDate) {
                        // const cardData = await fetchCardDataSupervisorByRegion(region, startDate, endDate);
                        const cardData = await fetchExpensesSupervisor('region', startDate, endDate, region, undefined);
                        setExpenses(cardData);
                    } else if (startDate && endDate) {
                        // const cardData = await fetchCardDataSupervisorByDates(startDate, endDate);
                        const cardData = await fetchExpensesSupervisor('dates', startDate, endDate, undefined, undefined);
                        setExpenses(cardData);
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
                label: 'Expenses',
                data: expenses.map(expense => expense.amount),
                backgroundColor: 'rgba(49, 130, 206, 1)',
            },
            // {
            //     label: 'sales',
            //     data: [28, 48, 40, 19, 86, 27, 90, 28, 48, 40, 19, 86],
            //     backgroundColor: 'rgba(54, 162, 235, 0.5)',
            // }
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
