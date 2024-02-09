// import { User } from '@prisma/client';
import { useState } from 'react';

interface HeaderProps {
    onFilterChange: (startDate: string, endDate: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onFilterChange }) => {


    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        onFilterChange(e.target.value, endDate);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
        onFilterChange(startDate, e.target.value);
    };

    return (
        <div className="header p-4 flex flex-row">
            <div className="flex flex-col mr-4">
                <label htmlFor="startDate" className="mb-2">Start Date:</label>
                <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="border rounded px-2 py-1"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="endDate" className="mb-2">End Date:</label>
                <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="border rounded px-2 py-1"
                />
            </div>
        </div>
    );
};
