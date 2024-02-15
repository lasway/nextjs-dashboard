// import { User } from '@prisma/client';
import { useState } from 'react';

interface HeaderProps {
    onFilterChange: (startDate: string, endDate: string, region: string, district: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onFilterChange }) => {


    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [region, setRegion] = useState('');
    const [district, setDistrict] = useState('');

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        onFilterChange(e.target.value, endDate, region, district);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
        onFilterChange(startDate, e.target.value, region, district);
    };

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRegion(e.target.value);
        onFilterChange(startDate, endDate, e.target.value, district);
    };
    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDistrict(e.target.value);
        onFilterChange(startDate, endDate, region, e.target.value);
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
            <div className="flex flex-col mr-4">
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

            <div className="flex flex-col mr-4">
                <label htmlFor="region" className="mb-2">Region:</label>
                <select
                    id="region"
                    name="region"
                    value={region}
                    onChange={handleRegionChange}
                    className="border rounded px-2 py-1 "
                >
                    <option value="">Select Region</option>
                    <option value="pwani">pwani</option>
                    <option value="Region2">Dar-es-salaam</option>
                </select>
            </div>
            <div className="flex flex-col">
                <label htmlFor="district" className="mb-2">District:</label>
                <select
                    id="district"
                    name="district"
                    value={district}
                    onChange={handleDistrictChange}
                    className="border rounded px-2 py-1"
                >
                    <option value="">Select District</option>
                    <option value="kibaha">kibaha</option>
                    <option value="District2">District 2</option>
                </select>
            </div>
        </div>
    );
};
