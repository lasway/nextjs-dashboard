import Form from '@/app/ui/Stock-Management/edit-form';
import Breadcrumbs from '@/app/ui/Stock-Management/breadcrumbs';
import { fetchProductStockAddoById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit Invoice',
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'stock-management', href: '/dashboard/stock-management' },
                    {
                        label: 'Edit Invoice',
                        href: `/dashboard/stock-management/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form id={id} />
        </main>
    );
}