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
import { formatDateToLocal } from '@/app/lib/utils';

ChartJS.register(
    CategoryScale,
    BarController,
    BarElement,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip
);

export default function SalesBar({ region, district, startDate, endDate }: { region: string, district: string, startDate: string, endDate: string }) {

    const [sales, setSales] = useState([]);

    useEffect(() => {
        try {
            const fetchData = async () => {
                const user = await getUser();
                if (user?.roles === 'Supervisor') {
                    if (startDate && endDate && region && district) {
                        const salesData = await fetchSalesSupervisor(region, district, startDate, endDate);
                        setSales(salesData);
                    }
                } else if (user?.roles === 'Owner') {
                    if (startDate && endDate) {
                        const salesData = await fetchSales(startDate, endDate);
                        setSales(salesData);
                    }
                }
            };
            fetchData();

        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    }, [region, district, startDate, endDate]);

    const data = {
        labels: sales.map(sale => formatDateToLocal(sale.sellingDate)),
        datasets: [
            {
                label: 'Expenses',
                data: sales.map(sale => sale.total),
                backgroundColor: 'rgba(49, 130, 206, 1)',
            },
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
                    text: 'Total Sales'
                },
                beginAtZero: true
            }
        }
    };

    return (
        <div className="w-full md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Sales Trends in Bar Chart
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
