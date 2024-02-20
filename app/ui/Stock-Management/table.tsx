'use client'
import { UpdateStock, DeleteStock } from '@/app/ui/Stock-Management/buttons';
import { formatDateToLocal } from '@/app/lib/utils';
import { fetchMasterList, fetchProductStock, getUser } from '@/app/lib/data';
import { useEffect, useState } from 'react';
export default function ProductStockTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {

  const [productStock, setProductStock] = useState([]);

  const [user, setUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          const user = await getUser();
          setUser(user);
        }
        if (user?.roles === 'Supervisor') {
          const productStock = await fetchMasterList(query, currentPage);
          setProductStock(productStock);
        }
        else if (user?.roles === 'Owner') {
          const productStock = await fetchProductStock(query, currentPage);
          setProductStock(productStock);
        }

      } catch (error) {
        console.error('Error fetching top products:', error);
      }
    };
    fetchData();
  }, [query, currentPage, user]);

  return (
    <>
      {user?.roles === 'Owner' ? (
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <table className="min-w-full text-gray-900">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Product Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Supplier
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Quantity
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Reorder Quantity
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Selling Price
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Buying Price
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Expiry Date
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {productStock.map((productStock) => (
                    <tr key={productStock.id} className="border-b">
                      <td className="whitespace-nowrap py-3 px-4">
                        {productStock.ProductName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {productStock.supplier}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {productStock.quantity}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {productStock.reorderQuantity}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {productStock.sellingPricePerStorageUnit}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {productStock.pricePerStorageUnit}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {formatDateToLocal(productStock.expiryDate)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <button
                          className={`rounded-md px-2 py-1 ${productStock.stockStatus === 'In Stock'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                            }`}
                        >
                          {productStock.stockStatus}
                        </button>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateStock id={productStock.id} />
                          <DeleteStock id={productStock.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <table className="min-w-full text-gray-900">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Generic Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Brand Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Dosage Type
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Medicine Strength
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {productStock.map((productStock) => (
                    <tr key={productStock.id} className="border-b">
                      <td className="whitespace-nowrap py-3 px-4">
                        {productStock.genericName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {productStock.brandName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {productStock.dosageType}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {productStock.medicineStrength}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateStock id={productStock.id} />
                          <DeleteStock id={productStock.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </>

  );
}

