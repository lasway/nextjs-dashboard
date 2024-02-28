import Form from '@/app/ui/Stock-Management/edit-form';
import Breadcrumbs from '@/app/ui/Stock-Management/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit Product',
};

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'stock-management', href: '/dashboard/stock-management' },
                    {
                        label: 'Edit Product',
                        href: `/dashboard/stock-management/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form id={id} />
        </main>
    );
}