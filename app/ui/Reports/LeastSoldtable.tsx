// import { fetchFilteredInvoices } from '@/pages/api/data';
import { fetchLeastSoldProductsSupervisor, fetchMostSoldProductsSupervisor, fetchTopProductAddo } from '@/app/lib/data';
import { lusitana } from '../fonts';
export default async function topSoldTable({
    region, district, startDate, endDate, user
}: {
    region: string;
    district: string;
    startDate: string;
    endDate: string;
    user: any;
}) {
    if (user?.roles === 'Supervisor') {
        if (startDate && endDate && region && district) {
            const products = await fetchLeastSoldProductsSupervisor(region, district, startDate, endDate);
            return (
                <div className="mt-6 flow-root">
                    <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                        Top Sold Products
                    </h2>
                    <div className="inline-block min-w-full align-middle">
                        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                            <table className="min-w-full text-gray-900">
                                <thead className="rounded-lg text-left text-sm font-normal">
                                    <tr>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Product Name
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Top Quantity Sold
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Addo Name
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {products.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="whitespace-nowrap py-3 px-4">
                                                {item['Medicine Name']}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3">
                                                {item['Total Quantity Sold']}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3">
                                                {item['addo name']}
                                            </td>

                                            {/* <td className="whitespace-nowrap py-3 pl-6 pr-3">
                     <div className="flex justify-end gap-3">
                       <UpdateStock id={expense.id} />
                       <DeleteStock id={expense.id} />
                     </div>
                   </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }
    } else if (user?.roles === 'Owner') {
        if (startDate && endDate) {
            const product = await fetchTopProductAddo(startDate, endDate);
            return (
                <div className="mt-6 flow-root">
                    <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                        Least Sold Product Report
                    </h2>
                    <div className="inline-block min-w-full align-middle">
                        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                            <table className="min-w-full text-gray-900">
                                <thead className="rounded-lg text-left text-sm font-normal">
                                    <tr>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Product Name
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Total Quantity Sold
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {product.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="whitespace-nowrap px-3 py-3">
                                                {item['Medicine Name']}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3">
                                                {item['Total Quantity Sold']}
                                            </td>
                                            {/* <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateStock id={expense.id} />
                          <DeleteStock id={expense.id} />
                        </div>
                      </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }
    }
}


