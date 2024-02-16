
import Image from 'next/image';
import { UpdateStock, DeleteStock, CreateStock } from '@/app/ui/Stock-Management/buttons';
import InvoiceStatus from '@/app/ui/Stock-Management/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
// import { fetchFilteredInvoices } from '@/pages/api/data';
import { fetchExpensesReport, fetchExpensesReportSupervisor, fetchMasterList, fetchProductStock, getUser } from '@/app/lib/data';
import { use, useEffect, useState } from 'react';
import { lusitana } from '../fonts';
export default async function ProductStockTable({
  region, district, startDate, endDate
}: {
  region: string;
  district: string;
  startDate: string;
  endDate: string;
}) {

  const [expenses, setExpenses] = useState([]);

  const [user, setUser] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          const user = await getUser();
          setUser(user);
        }
        if (user?.roles === 'Supervisor') {
          if (startDate && endDate && region && district) {
            const expenses = await fetchExpensesReportSupervisor(region, district, startDate, endDate);
            setExpenses(expenses);
          }
        }
        else if (user?.roles === 'Owner') {
          const expenses = await fetchExpensesReport(startDate, endDate);
          setExpenses(expenses);
        }

      } catch (error) {
        console.error('Error fetching top products:', error);
      }
    };
    fetchData();
  }, [region, district, startDate, endDate, user]);

  return (
    <>
      {user?.roles === 'Owner' ? (
        <div className="mt-6 flow-root">
          <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            Expenses Report
          </h2>
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <table className="min-w-full text-gray-900">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Expense Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b">
                      <td className="whitespace-nowrap py-3 px-4">
                        {formatDateToLocal(expense.Date)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {expense.Expense || expense.Description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {expense.Amount}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateStock id={expense.id} />
                          <DeleteStock id={expense.id} />
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
          <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            Expenses Report
          </h2>
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
              <table className="min-w-full text-gray-900">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Expense Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Description
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Addo Name
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b">
                      <td className="whitespace-nowrap py-3 px-4">
                        {formatDateToLocal(expense.Date)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {expense.Expense}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {expense.Description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {expense.Amount}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {expense.Addo}
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateStock id={expense.id} />
                          <DeleteStock id={expense.id} />
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

