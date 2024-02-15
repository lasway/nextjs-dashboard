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
        // Assuming revalidatePath is a custom function to trigger revalidation, 
        // you may need to modify it accordingly for Prisma
        // revalidatePath('/dashboard/stock-management');
        // redirect('/dashboard/stock-management')
        return { message: 'deleted stock' };
    } catch (error) {
        throw error;
    }
}