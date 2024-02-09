'use server'
import { PrismaClient } from "@prisma/client";

import { unstable_noStore as noStore } from 'next/cache';

import { auth } from '@/auth';


const prisma = new PrismaClient();
export async function fetchCardData(addo: string, startDate: string, endDate: string) {
    try {

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Calculate total sales associated with the addo
        const totalSale = await prisma.sale.aggregate({
            _sum: {
                total: true,
            },
            where: {
                sellingDate: {
                    gte: start,
                    lte: end,
                },
                addo: addo,
            },
        });

        const totalDiscount = await prisma.sale.aggregate({
            _sum: {
                discount: true,
            },
            where: {
                sellingDate: {
                    gte: start,
                    lte: end,
                },
                addo: addo,
            },
        });

        const totalSales =
            (totalSale?._sum?.total || 0) - (totalDiscount?._sum?.discount || 0);

        // Calculate total expenses associated with the addo
        const totalExpenses = await prisma.expense.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
                addo: addo,
            },
        });

        // Calculate total revenue
        const totalRevenue = totalSales - (totalExpenses?._sum?.amount || 0);

        // Count sales associated with the addo
        const saleCount = await prisma.sale.count({
            where: {
                sellingDate: {
                    gte: start,
                    lte: end,
                },
                addo: addo,
            },
        });

        // Count expenses associated with the addo
        const expenseCount = await prisma.expense.count({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
                addo: addo,
            },
        });

        return {
            totalSales: totalSales,
            totalExpenses: totalExpenses?._sum?.amount || 0,
            totalRevenue,
            saleCount,
            expenseCount,
        };
    } catch (error) {
        console.error('Error fetching card data:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export async function fetchProductStock(addo: string) {
    try {
        const stock = await prisma.productStock.findMany({
            where: {
                addo: addo,
            },
            include: {
                ADDOProduct: {
                    select: {
                        brandName: true,
                        genericName: true,
                        medicineStrength: true,
                    }
                },
                SpecialProduct: {
                    select: {
                        brandName: true,
                        genericName: true,
                        medicineStrength: true,
                    }
                }
            }
        });

        const ProductStock = stock.map((product) => {
            return {
                id: product.id,
                quantity: product.quantity,
                reorderQuantity: product.reorderQuantity,
                ProductName: product.ADDOProduct ? `${product.ADDOProduct.brandName} ${product.ADDOProduct.genericName} ${product.ADDOProduct.medicineStrength}`.trim() : product.SpecialProduct ? `${product.SpecialProduct.brandName} ${product.SpecialProduct.genericName} ${product.SpecialProduct.medicineStrength}` : ''.trim(),
                sellingPricePerStorageUnit: product.sellingPricePerStorageUnit,
                pricePerStorageUnit: product.pricePerStorageUnit,
                expiryDate: product.expiryDate,
                supplier: product.supplier,
                sellingUnit: product.sellingUnit,
                storageUnit: product.storageUnit,
            };
        });
        console.log(ProductStock);
        return ProductStock;
    } catch (error) {
        console.error('Error fetching product stock:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export async function fetchTopProducts(
    addo: string,
    startDate: string,
    endDate: string,
) {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const sales = await prisma.productSale.findMany({
            where: {
                addo: addo,
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
            include: {
                ADDOProduct: {
                    select: {
                        brandName: true,
                        genericName: true,
                        medicineStrength: true,
                    },
                },
                SpecialProduct: {
                    select: {
                        brandName: true,
                        genericName: true,
                        medicineStrength: true,
                    },
                },
            },
        });

        const productQuantities: { [key: string]: number } = {};

        sales.forEach((sale) => {
            // const product = sale.ADDOProduct || sale.specialProduct;

            if (sale && sale.quantity) {
                const productName = sale.ADDOProduct
                    ? `${sale.ADDOProduct.brandName} ${sale.ADDOProduct.genericName} ${sale.ADDOProduct.medicineStrength}`
                    : sale.SpecialProduct
                        ? `${sale.SpecialProduct.brandName} ${sale.SpecialProduct.genericName} ${sale.SpecialProduct.medicineStrength}`
                        : '';

                if (!productQuantities[productName]) {
                    productQuantities[productName] = 0;
                }

                productQuantities[productName] += sale.quantity;
            }
        });

        const sortedProducts = Object.keys(productQuantities).sort(
            (a, b) => productQuantities[b] - productQuantities[a],
        );

        const frequentlySoldReport = sortedProducts.map((productName) => ({
            'Medicine Name': productName.trim(),
            'Total Quantity Sold': productQuantities[productName],
        }));

        console.log("Frequently Sold Report:", frequentlySoldReport);

        // Set the store property with the sorted report if needed
        // store.setProp("FrequentlySoldReport", frequentlySoldReport);
    } catch (error) {
        console.error('Error fetching top products:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}







export async function fetchUserAddo() {
    try {
        const user = await auth();
        const userMail = user?.user?.email;
        if (userMail === null) {
            throw new Error('User email is null');
        }
        const UserData = await prisma.user.findUnique({
            where: {
                email: userMail,
            },
            include: {
                Addo_User_addo: true,
            },
        });
        const addo = UserData?.Addo_User_addo[0].id;

        return addo;

    } catch (error) {
        console.error('Error fetching user addo:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export async function getUser() {
    const prisma = new PrismaClient();

    const userEmail = await auth();

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: userEmail?.user?.email ?? undefined,
            },
        });
        return user?.name;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export async function fetchUser(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export async function fetchProductData() {
    const prisma = new PrismaClient();
    noStore();
    try {
        const products = await prisma.product.findMany();
        return products;
    } catch (error) {
        console.log(error);
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function fetchSaleData() {
    const prisma = new PrismaClient();
    noStore();
    try {
        const sales = await prisma.sale.findMany();
        return sales;
    } catch (error) {
        console.log(error);
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function fetchProductDataById(id: number) {
    const prisma = new PrismaClient();
    noStore();
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: id,
            },
        });
        return product;
    } catch (error) {
        console.log(error);
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function fetchSaleDataById(id: number) {
    const prisma = new PrismaClient();
    noStore();
    try {
        const sale = await prisma.sale.findUnique({
            where: {
                id: id,
            },
        });
        return sale;
    } catch (error) {
        console.log(error);
    }
    finally {
        await prisma.$disconnect();
    }
}

export async function fetchUserDataByEmail(email: string) {
    const prisma = new PrismaClient();
    noStore();
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        return user;
    } catch (error) {
        console.log(error);
    }
    finally {
        await prisma.$disconnect();
    }
}
