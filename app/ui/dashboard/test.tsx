import React from 'react';
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

ChartJS.register(
    CategoryScale,
    BarController,
    BarElement,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip
);

export default function ExpensesChart() {

    const labels = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const data = {
        labels,
        datasets: [
            {
                label: 'Expenses',
                data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'sales',
                data: [28, 48, 40, 19, 86, 27, 90, 28, 48, 40, 19, 86],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            }
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: 'rgb(255, 99, 132)'
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Months'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Amount'
                },
                beginAtZero: true
            }
        }
    };

    return (
        <div className="w-full md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Recent Revenue
            </h2>
            <div className="rounded-xl bg-gray-50 p-4">
                <div className="mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 sm:grid-cols-13 md:gap-4">
                    <Bar data={data} options={options} />
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
                </div>
            </div>
        </div>
    );
}
