
import { Supplier } from '@prisma/client';
import { lusitana } from '../fonts';
export default async function supplierTable({
    supplier
}: {
    supplier: Supplier[]
}) {
    return (
        <div className="mt-6 flow-root">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Suppliers Report
            </h2>
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <table className="min-w-full text-gray-900">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Name
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Address
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Phone
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Email
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {supplier.map((item) => (
                                <tr key={item.id} className="border-b">
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {item.name}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {item.address}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {item.phone}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {item.email}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}



