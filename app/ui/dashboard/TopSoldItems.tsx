import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchTopProducts } from '@/app/lib/data';
import { useEffect, useState } from 'react';
export default async function TopSoldItems({ addo, startDate, endDate }: { addo: string, startDate: string, endDate: string }) {

    console.log(addo);

    const [topProducts, setTopProducts] = useState();
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (addo && startDate && endDate) {
                    const topProducts = await fetchTopProducts(addo, startDate, endDate);
                    setTopProducts(topProducts);
                }

            } catch (error) {
                console.error('Error fetching top products:', error);
            }
        };
        fetchData();
    }, []);
    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Top Sold Items
            </h2>
            <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                {/* NOTE: comment in this code when you get to this point in the course */}

                {/* <div className="bg-white px-6">
                    {topProducts.map((product, i) => {
                        return (
                            <div
                                key={product.id}
                                className={clsx(
                                    'flex flex-row items-center justify-between py-4',
                                    {
                                        'border-t': i !== 0,
                                    },
                                )}
                            >
                                <div className="flex items-center">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold md:text-base">
                                            {product.name}
                                        </p>
                                        <p className="hidden text-sm text-gray-500 sm:block">
                                            {product.email}
                                        </p>
                                    </div>
                                </div>
                                <p
                                    className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                                >
                                    {product.amount}
                                </p>
                            </div>
                        );
                    })}
                </div> */}
                <div className="flex items-center pb-2 pt-6">
                    <ArrowPathIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
                </div>
            </div>
        </div>
    );
}