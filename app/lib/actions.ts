'use server'
import { fetchUserAddo } from '@/app/lib/data';
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod';

const prisma = new PrismaClient()
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



const FormSchema = z.object({
    id: z.string(),
    AddedDate: z.string({
        invalid_type_error: 'Incorrect date format',
    }),
    supplierId: z.string({
        invalid_type_error: 'supplier required',
    }),
    productType: z.string({
        invalid_type_error: 'product type required',
    }),
    medicineType: z.string({
        invalid_type_error: 'medicine type required',
    }),
    sellingUnit: z.string({
        invalid_type_error: 'selling unit required',
    }),
    genericName: z.string({
        invalid_type_error: 'Incorrect generic name',
    }),
    brandName: z.string({
        invalid_type_error: 'Incorrect brand name',
    }),
    MedicineStrength: z.string({
        invalid_type_error: 'Incorrect medicine strength',
    }),
    quantity: z.coerce
        .number()
        .gt(0, { message: 'Quantity must be greater than 0' }),
    reOrder: z.coerce
        .number()
        .gt(0, { message: 'reorder level must be greater than 0' }),
    buyingPrice: z.coerce
        .number()
        .gt(0, { message: 'buying price must be greater than 0' }),
    sellingPrice: z.coerce
        .number()
        .gt(0, { message: 'selling price must be greater than 0' }),
    expiryDate: z.string({
        invalid_type_error: 'Incorrect date format',
    }),
});


const CreateProductStock = FormSchema.omit({ id: true });

// console.log('formschema:', CreateProductStock);

// For update, you might want to remove some fields that shouldn't be updated
const UpdateProductStock = FormSchema.omit({ id: true });

// This is temporary
export type State = {
    errors?: {
        AddedDate?: string[];
        supplierId?: string[];
        productType?: string[];
        medicineType?: string[];
        sellingUnit?: string[];
        genericName?: string[];
        brandName?: string[];
        MedicineStrength?: string[];
        quantity?: string[];
        reOrder?: string[];
        buyingPrice?: string[];
        sellingPrice?: string[];
        expiryDate?: string[];
    };
    message?: string | null;
};

export async function createStock(prevState: State, formData: FormData) {
    // console.log(formData);
    // Validate form data

    const validatedFields = CreateProductStock.safeParse({
        AddedDate: formData.get('AddedDate'),
        supplierId: formData.get('supplierId'),
        productType: formData.get('productType'),
        medicineType: formData.get('medicineType'),
        sellingUnit: formData.get('sellingUnit'),
        genericName: formData.get('genericName'),
        brandName: formData.get('brandName'),
        MedicineStrength: formData.get('MedicineStrength'),
        quantity: formData.get('quantity'),
        reOrder: formData.get('reOrder'),
        buyingPrice: formData.get('buyingPrice'),
        sellingPrice: formData.get('sellingPrice'),
        expiryDate: formData.get('expiryDate'),
    });

    if (!validatedFields.success) {
        const validationErrors = validatedFields.error.flatten().fieldErrors;
        console.log('Validation errors:', validationErrors);
        return {
            errors: validationErrors,
            message: 'Invalid form data. Please check the form and try again.'
        };
    }

    try {
        // prepare data for the insertion into database
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
        } = validatedFields.data;

        const isoAddedDate = new Date(AddedDate).toISOString();
        const isoExpiryDate = new Date(expiryDate).toISOString();

        const addo = await fetchUserAddo();
        // Check if the product already exists
        let productID = '';
        const existingProduct = await prisma.aDDOProduct.findFirst({
            where: {
                OR: [
                    { genericName: genericName },
                    { brandName: brandName },
                    { medicineStrength: MedicineStrength }
                ]
            }
        });

        // Create a new product if it doesn't exist
        if (!existingProduct) {
            const newProduct = await prisma.specialProduct.create({
                data: {
                    genericName,
                    brandName,
                    medicineStrength: MedicineStrength,
                    productType,
                    dosageType: sellingUnit,
                    addo: addo?.addo
                }
            });
            productID = newProduct.id;

            // Save product data in productStock table
            await prisma.productStock.create({
                data: {
                    addedDate: isoAddedDate,
                    supplier: supplierId,
                    sellingUnit,
                    quantity,
                    reorderQuantity: reOrder,
                    pricePerStorageUnit: buyingPrice,
                    sellingPricePerStorageUnit: sellingPrice,
                    expiryDate: isoExpiryDate,
                    addo: addo?.addo,
                    specialProduct: productID
                }
            });

        } else {
            productID = existingProduct.id;
            // Save product data in productStock table
            await prisma.productStock.create({
                data: {
                    addedDate: isoAddedDate,
                    supplier: supplierId,
                    sellingUnit,
                    quantity,
                    reorderQuantity: reOrder,
                    pricePerStorageUnit: buyingPrice,
                    sellingPricePerStorageUnit: sellingPrice,
                    expiryDate: isoExpiryDate,
                    addo: addo?.addo,
                    addoProduct: productID,
                }
            });
        }

        console.log('Product created successfully and redirect to another page');

        // console.log('complete redirect')
    } catch (error) {
        // throw error;
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to Create stock.',
        };
    }

    revalidatePath('/dashboard/stock-management');
    redirect('/dashboard/stock-management');
}


export async function deleteProductStock(id: string) {
    try {
        console.log(id)
        await prisma.productStock.delete({
            where: {
                id: id
            }
        });
        revalidatePath('/dashboard')
        redirect('/dashboard')

        return { message: 'deleted stock' };
    } catch (error) {
        throw error;
    }

}

export async function updateProductStock(id: string, prevState: State, formData: FormData) {
    //validate data
    const validatedFields = UpdateProductStock.safeParse({
        id: id,
        AddedDate: formData.get('AddedDate'),
        supplierId: formData.get('supplierId'),
        productType: formData.get('productType'),
        medicineType: formData.get('medicineType'),
        sellingUnit: formData.get('sellingUnit'),
        genericName: formData.get('genericName'),
        brandName: formData.get('brandName'),
        MedicineStrength: formData.get('MedicineStrength'),
        quantity: formData.get('quantity'),
        reOrder: formData.get('reOrder'),
        buyingPrice: formData.get('buyingPrice'),
        sellingPrice: formData.get('sellingPrice'),
        expiryDate: formData.get('expiryDate'),
    });
    if (!validatedFields.success) {
        const validationErrors = validatedFields.error.flatten().fieldErrors;
        console.log('Validation errors:', validationErrors);
        return {
            errors: validationErrors,
            message: 'Invalid form data. Please check the form and try again.'
        };
    }

    try {
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
        } = validatedFields.data;

        const isoAddedDate = new Date(AddedDate).toISOString();
        const isoExpiryDate = new Date(expiryDate).toISOString();

        await prisma.productStock.update({
            where: { id: id },
            data: {
                addedDate: isoAddedDate,
                supplier: supplierId,
                sellingUnit,
                quantity,
                reorderQuantity: reOrder,
                pricePerStorageUnit: buyingPrice,
                sellingPricePerStorageUnit: sellingPrice,
                expiryDate: isoExpiryDate,
            }
        });
        console.log('Product updated successfully and redirect to another page');
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to update stock.',
        };
    }

    revalidatePath('/dashboard/stock-management');
    redirect('/dashboard/stock-management');
}