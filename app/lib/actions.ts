import { CreateStock } from '@/app/ui/Stock-Management/buttons';
'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData)
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    return 'Something went wrong.'
            }
        }
        throw error
    }
}

const prisma = new PrismaClient()
export async function deleteProductStock(id: string) {
    try {
        await prisma.productStock.delete({
            where: {
                id: id
            }
        });
        return { message: 'deleted stock' };
    } catch (error) {
        throw error;
    }
}

export async function CreateProductStock(prevState: State, formData: FormData) {
    try {
        // Destructure form data
        const {
            AddedDate,
            supplierId,
            productType,
            medicineType,
            sellingUnit,
            genericName,
            brandName,
            MedicineStrength,
            quantity,
            reOrder,
            buyingPrice,
            sellingPrice,
            expiryDate
        } = formData;

        // Check if the product exists in addoproduct table
        const product = await prisma.aDDOProduct.findFirst({
            where: {
                genericName: genericName,
                brandName: brandName,
                medicineStrength: MedicineStrength
            }
        });

        // If product does not exist, create it
        if (!product) {
            await prisma.specialProduct.create({
                data: {
                    genericName: genericName,
                    brandName: brandName,
                    medicineStrength: MedicineStrength,
                    productType: productType,
                    dosageType: medicineType
                }
            });
        }

        return { message: 'created stock' };
    } catch (error) {
        throw error;
    } finally {
        await prisma.$disconnect(); // Disconnect Prisma client after operation
    }
}