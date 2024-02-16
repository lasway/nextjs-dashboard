import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchTopProductAddo, fetchTopProductSupervisor, getUser } from '@/app/lib/data';
import { useEffect, useState } from 'react';
export default async function TopSoldItems({ region, district, startDate, endDate }: { region: string, district: string, startDate: string, endDate: string }) {

    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getUser();
                if (user?.roles === 'Supervisor') {
                    if (startDate && endDate && region && district) {
                        const topProducts = await fetchTopProductSupervisor(region, district, startDate, endDate);
                        setTopProducts(topProducts);
                    }
                }
                else if (user?.roles === 'Owner') {
                    if (startDate && endDate) {
                        const topProducts = await fetchTopProductAddo(startDate, endDate);
                        setTopProducts(topProducts);
                    }
                }
            } catch (error) {
                console.error('Error fetching top sold items:', error);
            }
        };
        fetchData();
    }, [region, district, startDate, endDate]);

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Top Sold Items
            </h2>


            <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                <div className="bg-white px-6">
                    <div className="flex justify-between py-2 border-b">
                        <p className="text-sm font-semibold md:text-base">List of Products</p>
                        <p className="text-sm font-semibold md:text-base">Total Quantity</p>
                    </div>
                    {topProducts.map((product, i) => (
                        <div
                            key={i}
                            className={`flex flex-row items-center justify-between py-4 ${i !== 0 ? 'border-t' : ''}`}
                        >
                            <div className="flex items-center">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold md:text-base">
                                        {product['Medicine Name']}
                                    </p>
                                </div>
                            </div>
                            <p className={`${lusitana.className} truncate text-sm font-medium md:text-base`}>
                                {product['Total Quantity Sold']}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex items-center pb-2 pt-6">
                    <ArrowPathIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
                </div>
            </div>
        </div>
    );
}