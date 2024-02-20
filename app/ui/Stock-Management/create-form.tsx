'use client'
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { useEffect, useState } from 'react';
import { fetchMedicalType, fetchProductType, fetchSellingUnit, fetchSupplier, getUser } from '@/app/lib/data';
import { useFormState } from 'react-dom';
import { createStock } from '@/app/lib/actions';

export default function Form() {

  const initialState = { message: null, errors: {} };

  // const [state, dispatch] = useFormState(createStock, initialState);
  const [state, dispatch] = useFormState(createStock, initialState);

  const [file, setFile] = useState(null);

  const [user, setUser] = useState();
  const [supplier, setSupplier] = useState([]);
  const [productType, setProductType] = useState([]);
  const [medicalType, setMedicalType] = useState([]);
  const [sellingUnit, setSellingUnit] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser();
        setUser(user);
        const supplier = await fetchSupplier();
        setSupplier(supplier);
        const productType = await fetchProductType();
        setProductType(productType);
        const medicalType = await fetchMedicalType();
        setMedicalType(medicalType);
        const sellingUnit = await fetchSellingUnit();
        setSellingUnit(sellingUnit);
      } catch (error) {
        console.error('Error fetching top sold items:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {user?.roles === 'Owner' ? (
        <form action={dispatch} >
          <div className="rounded-md bg-gray-50 p-4 md:p-6">
            <div className="mb-4">
              <label htmlFor="AddedDate" className="mb-2 block text-sm font-medium">
                Added Date
              </label>
              <div className="relative">
                <input
                  type='date'
                  id="AddedDate"
                  name="AddedDate"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="addedDate-error"
                >
                </input>
              </div>
              <div id="addedDate-error" aria-live="polite" aria-atomic="true">
                {state.errors?.AddedDate &&
                  state.errors.AddedDate.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="supplier" className="mb-2 block text-sm font-medium">
                Choose supplier
              </label>
              <div className="relative">
                <select
                  id="supplier"
                  name="supplierId"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  defaultValue=""
                  aria-describedby="customer-error"
                >
                  <option value="" disabled>
                    Select a supplier
                  </option>
                  {supplier.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.name}
                    </option>
                  ))}
                </select>
              </div>
              <div id="supplier-error" aria-live="polite" aria-atomic="true">
                {state.errors?.supplierId &&
                  state.errors.supplierId.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="productType" className="mb-2 block text-sm font-medium">
                Choose Product Type
              </label>
              <div className="relative">
                <select
                  id="productType"
                  name="productType"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  defaultValue=""
                  aria-describedby="productType-error"
                >
                  <option value="" disabled>
                    Select a product type
                  </option>
                  {productType.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.key}
                    </option>
                  ))}
                </select>
              </div>

              <div id="productType-error" aria-live="polite" aria-atomic="true">
                {state.errors?.productType &&
                  state.errors.productType.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="medicineType" className="mb-2 block text-sm font-medium">
                Choose Product Form
              </label>
              <div className="relative">
                <select
                  id="medicineType"
                  name="medicineType"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  defaultValue=""
                  aria-describedby="medicineType-error"
                >
                  <option value="" disabled>
                    Select a product form
                  </option>
                  {medicalType.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.key}
                    </option>
                  ))}
                </select>
              </div>

              <div id="medicineType-error" aria-live="polite" aria-atomic="true">
                {state.errors?.medicineType &&
                  state.errors.medicineType.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="sellingUnit" className="mb-2 block text-sm font-medium">
                Selling Unit
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="sellingUnit"
                  name="sellingUnit"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  defaultValue=""
                  aria-describedby="sellingUnit-error"
                  required>
                  <option value="" disabled>
                    Select a selling unit
                  </option>
                  {sellingUnit.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.key}
                    </option>
                  ))}
                </select>
              </div>
              <div id="sellingUnit-error" aria-live="polite" aria-atomic="true">
                {state.errors?.sellingUnit &&
                  state.errors.sellingUnit.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="genericName" className="mb-2 block text-sm font-medium">
                Generic Name
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="genericName"
                  name="genericName"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  placeholder="Enter generic name"
                  aria-describedby="genericName-error"
                />

              </div>
              <div id="genericName-error" aria-live="polite" aria-atomic="true">
                {state.errors?.genericName &&
                  state.errors.genericName.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="brandName" className="mb-2 block text-sm font-medium">
                Brand Name
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="brandName"
                  name="brandName"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  placeholder="Enter brand name"
                  aria-describedby="brandName-error"
                />
              </div>
              <div id="brandName-error" aria-live="polite" aria-atomic="true">
                {state.errors?.brandName &&
                  state.errors.brandName.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="MedicineStrength" className="mb-2 block text-sm font-medium">
                Medicine Strength
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="MedicineStrength"
                  name="MedicineStrength"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  placeholder="Enter Medicine strength"
                  aria-describedby="MedicineStrength-error"
                />

              </div>
              <div id="MedicineStrength-error" aria-live="polite" aria-atomic="true">
                {state.errors?.MedicineStrength &&
                  state.errors.MedicineStrength.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="quantity" className="mb-2 block text-sm font-medium">
                Quantity
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  placeholder="Enter quantity"
                  aria-describedby="quantity-error"
                />
              </div>
              <div id="quantity-error" aria-live="polite" aria-atomic="true">
                {state.errors?.quantity &&
                  state.errors.quantity.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="reOrder" className="mb-2 block text-sm font-medium">
                Reorder Quantity
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="reOrder"
                  name="reOrder"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  placeholder="Enter reorder quantity"
                  aria-describedby="reOrder-error"
                />
              </div>
              <div id="reOrder-error" aria-live="polite" aria-atomic="true">
                {state.errors?.reOrder &&
                  state.errors.reOrder.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="BuyingPrice" className="mb-2 block text-sm font-medium">
                Buying Price
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="buyingPrice"
                  name="buyingPrice"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  placeholder="Enter buying price"
                  aria-describedby="buyingPrice-error"
                />
              </div>
              <div id="buyingPrice-error" aria-live="polite" aria-atomic="true">
                {state.errors?.buyingPrice &&
                  state.errors.buyingPrice.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="SellingPrice" className="mb-2 block text-sm font-medium">
                Selling Price
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="sellingPrice"
                  name="sellingPrice"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  placeholder="Enter selling price"
                  aria-describedby="sellingPrice-error"
                />
              </div>
              <div id="sellingPrice-error" aria-live="polite" aria-atomic="true">
                {state.errors?.sellingPrice &&
                  state.errors.sellingPrice.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="expiryDate" className="mb-2 block text-sm font-medium">
                Expiry Date
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  placeholder="Enter expiry date"
                  aria-describedby="expiryDate-error"
                />
              </div>
              <div id="expiryDate-error" aria-live="polite" aria-atomic="true">
                {state.errors?.expiryDate &&
                  state.errors.expiryDate.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <Link
                href="/dashboard/stock-management"
                className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                Cancel
              </Link>
              <Button type="submit">Add stock</Button>
            </div>

          </div >
        </form >
      ) : (

        <form>
          <div className="rounded-md bg-gray-50 p-4 md:p-6">
            <div className="mb-4">
              <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                Import File
              </label>
              <div className="relative">
                <input
                  type="file"
                  className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300
           rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500
           focus:border-blue-500"
                  onChange={handleFileChange}
                  id="stock"
                  placeholder="stock"
                />
              </div>
            </div >
          </div >
          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard/stock-management"
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <Button type="submit">Import</Button>
          </div>
        </form >
      )
      }
    </>
  );
}
