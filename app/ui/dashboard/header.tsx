
import { fetchDistrict, fetchRegion, getUser } from '@/app/lib/data';
import { use, useEffect, useState } from 'react';
import { set } from 'zod';

interface HeaderProps {
    onFilterChange: (region: string, district: string, startDate: string, endDate: string) => void;
}


export const Header: React.FC<HeaderProps> = ({ onFilterChange }) => {


    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [region, setRegion] = useState('');
    const [regionValues, setRegionValues] = useState([]);
    const [district, setDistrict] = useState('');
    const [districtValues, setDistrictValues] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const regionData = await fetchRegion();
            setRegionValues(regionData);
            const districtDate = await fetchDistrict(region);
            setDistrictValues(districtDate)
        };
        fetchData();
    }, [startDate, endDate, region, district]);

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        onFilterChange(region, district, e.target.value, endDate);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
        onFilterChange(region, district, startDate, e.target.value);
    };

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRegion(e.target.value);
        onFilterChange(e.target.value, district, startDate, endDate);
    };
    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDistrict(e.target.value);
        onFilterChange(region, e.target.value, startDate, endDate);
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
                    className="border rounded py-1 "
                >
                    <option value="" disabled>Select Region</option>
                    {regionValues.map((region) => (
                        <option key={region.name} value={region.name}>{region.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col">
                <label htmlFor="district" className="mb-2">District:</label>
                <select
                    id="district"
                    name="district"
                    value={district}
                    onChange={handleDistrictChange}
                    className="border rounded py-1"
                >
                    <option value="" disabled>Select District</option>
                    {districtValues.map((district) => (
                        <option key={district.name} value={district.name}>{district.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};
