import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { fetchUserAddo } from '@/app/lib/data';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const addo = "e34daa74-e292-4bdb-a3ab-3988969ee573"
    const startDate = "11-01-2023"
    const endDate = "11-30-2023"

    const start = new Date(startDate);
    const end = new Date(endDate);

    try {
        const salesData = await prisma.productSale.findMany({
            where: {
                addo: addo,
                createdAt: {
                    gte: start,
                    lte: end,
                }
            },
        })

        return res.status(200).json({ salesData });
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
