import Form from '@/app/ui/Stock-Management/create-form';
import Breadcrumbs from '@/app/ui/Stock-Management/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Import Data',
};

export default async function Page() {
    // const customers = await fetchCustomers();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'stock-management', href: '/dashboard/stock-management' },
                    {
                        label: 'Import Data',
                        href: '/dashboard/stock-management/create',
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    );
}
