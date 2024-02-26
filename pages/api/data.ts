import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const sellingUnitData = await prisma.option.findMany({
            where: {
                OptionType: {
                    name: 'medicalType'
                }
            },
            select: {
                id: true,
                type: true,
                key: true,
                en: true,
                sw: true,
            },
        });
        console.log(sellingUnitData)
        return res.status(200).json({ sellingUnitData });
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
