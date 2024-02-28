import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { deleteMasterList, deleteProductStock } from '@/app/lib/actions'

export function CreateStock() {
  return (
    <Link
      href="/dashboard/stock-management/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">ADD</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateStock({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/stock-management/${id}/edit`}
      className="rounded-md border p-2 color text-blue-700"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteStock({ id }: { id: string }) {
  const deleteProductStockwithId = deleteProductStock.bind(null, id);
  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductStockwithId();
    }
  }
  return (
    <button className="rounded-md border p-2 text-red-700" onClick={handleDeleteClick}>
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  );
}

export function DeleteMasterList({ id }: { id: string }) {
  const deleteMasterListwithID = deleteMasterList.bind(null, id);
  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMasterListwithID();
    }
  }
  return (
    <button className="rounded-md border p-2 text-red-700" onClick={handleDeleteClick}>
      <span className="sr-only">Delete</span>
      <TrashIcon className="w-5" />
    </button>
  )
}
