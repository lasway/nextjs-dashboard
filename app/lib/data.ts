'use server'
import { PrismaClient } from "@prisma/client";

import { unstable_noStore as noStore } from 'next/cache';

import { auth } from '@/auth';


const prisma = new PrismaClient();

const ITEMS_PER_PAGE = 8;

// Functions to fetch data for user role "Supervisor"

export async function fetchCardDataSupervisor(
    region: string,
    district: string,
    startDate: string,
    endDate: string,
) {
    noStore();
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const regionID = await prisma.region.findMany({
            where: {
                name: region
            },
            select: {
                id: true,
            }
        });

        const districtID = await prisma.district.findMany({
            where: {
                name: district
            },
            select: {
                id: true,
            }
        });

        const addoID = await prisma.addo.findMany({
            where: {
                region: regionID[0].id,
                district: districtID[0].id,
            },
            select: {
                id: true,
                name: true,
            }
        });


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
                addo: {
                    in: addoID.map((addo) => addo.id)
                },
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
                addo: {
                    in: addoID.map((addo) => addo.id)
                },
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
                addo: {
                    in: addoID.map((addo) => addo.id)
                },
            },
        });

        // Calculate total revenue
        const totalRevenue = totalSales - (totalExpenses?._sum?.amount || 0);

        // number Addos
        const addoCount = addoID.length;

        return {
            totalSales: totalSales,
            totalExpenses: totalExpenses?._sum?.amount || 0,
            totalRevenue,
            addoCount
        };
    } catch (error) {
        console.error('Error fetching card data:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
export async function fetchExpensesSupervisor(region: string, district: string, startDate: string, endDate: string) {
    noStore();
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const regionID = await prisma.region.findMany({
            where: {
                name: region
            },
            select: {
                id: true,
            }
        })

        const districtID = await prisma.district.findMany({
            where: {
                name: district
            },
            select: {
                id: true,
            }
        })

        const addoID = await prisma.addo.findMany({
            where: {
                region: regionID[0].id,
                district: districtID[0].id,
            },
            select: {
                id: true,

            }
        })

        const expenses = await prisma.expense.groupBy({
            by: ['date'],
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
                addo: {
                    in: addoID.map((addo) => addo.id)
                },
            },
            _sum: {
                amount: true,
            },
            orderBy: {
                date: 'asc',
            },
        });

        const formattedExpenses = expenses.map((expense) => {
            return {
                // id: expense.id,
                // option: expense.Option?.en,
                // description: expense.details,
                amount: expense._sum?.amount || 0,
                date: expense.date,
            };
        });

        // console.log(formattedExpenses)
        return formattedExpenses;
    } catch (error) {
        console.error('Error fetching expenses:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }


}

export async function fetchSalesSupervisor(region: string, district: string, startDate: string, endDate: string) {
    noStore();
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const regionID = await prisma.region.findMany({
            where: {
                name: region
            },
            select: {
                id: true,
            }
        })

        const districtID = await prisma.district.findMany({
            where: {
                name: district
            },
            select: {
                id: true,
            }
        })

        const addoID = await prisma.addo.findMany({
            where: {
                region: regionID[0].id,
                district: districtID[0].id,
            },
            select: {
                id: true,

            }
        })

        const salesData = await prisma.sale.groupBy({
            by: ['sellingDate'],
            where: {
                sellingDate: {
                    gte: start,
                    lte: end,
                },
                addo: {
                    in: addoID.map((addo) => addo.id)
                },
            },
            _sum: {
                total: true,
                discount: true,
            },
            orderBy: {
                sellingDate: 'asc',
            },
        });

        const formattedSales = salesData.map(({ _sum: { total, discount }, sellingDate }) => ({
            total: total - discount,
            sellingDate,
        }));

        // console.log(formattedSales)
        return formattedSales;
    } catch (error) {
        console.error('Error fetching expenses:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
export async function fetchMasterList(query: string, currentPage: number,) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const stock = await prisma.aDDOProduct.findMany({
            take: ITEMS_PER_PAGE,
            skip: offset,
            where: {
                compoundKey: {
                    contains: query,
                },
                OR: [
                    {
                        brandName: {
                            contains: query,
                        },
                    },
                    {
                        genericName: {
                            contains: query,
                        },
                    },
                    {
                        medicineStrength: {
                            contains: query,
                        },
                    },
                ],
            },
            include: {
                Option_ADDOProduct_dosageTypeToOption: true,
            }
        });

        const stockData = stock.map((product) => {
            return {
                id: product.id,
                compoundKey: product.compoundKey,
                brandName: product.brandName,
                genericName: product.genericName,
                medicineStrength: product.medicineStrength,
                dosageType: product.Option_ADDOProduct_dosageTypeToOption?.en,
            }
        });
        return stockData;
    } catch (error) {
        console.error('Error fetching Master list:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
export async function fetchMasterListPages(query: string) {
    noStore();
    try {
        const count = await prisma.aDDOProduct.count({
            where: {
                compoundKey: {
                    contains: query,
                },
                OR: [
                    {
                        brandName: {
                            contains: query,
                        },
                    },
                    {
                        genericName: {
                            contains: query,
                        },
                    },
                    {
                        medicineStrength: {
                            contains: query,
                        },
                    },
                ],
            },
        });

        const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Error fetching product stock pages:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }

}

export async function fetchTopProductSupervisor(
    region: string,
    district: string,
    startDate: string,
    endDate: string,
) {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const regionID = await prisma.region.findMany({
            where: {
                name: region
            },
            select: {
                id: true,
            }
        });

        const districtID = await prisma.district.findMany({
            where: {
                name: district
            },
            select: {
                id: true,
            }
        });

        const addoID = await prisma.addo.findMany({
            where: {
                region: regionID[0].id,
                district: districtID[0].id,
            },
            select: {
                id: true,

            }
        });

        const saleData = await prisma.productSale.findMany({
            where: {
                addo: {
                    in: addoID.map((addo) => addo.id),
                },
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


        // Initialize the product quantities with all products set to Zero
        const productQuantities: { [key: string]: number } = {};

        saleData.forEach((sale) => {
            if (sale && sale.quantity) {
                const productName = sale.ADDOProduct
                    ? `${sale.ADDOProduct.brandName} ${sale.ADDOProduct.genericName} ${sale.ADDOProduct.medicineStrength}`
                    : sale.SpecialProduct
                        ? `${sale.SpecialProduct.brandName} ${sale.SpecialProduct.genericName} ${sale.SpecialProduct.medicineStrength}`
                        : '';
                if (productName in productQuantities) {
                    productQuantities[productName] += sale.quantity;
                } else {
                    productQuantities[productName] = sale.quantity;
                }
            }
        });

        const sortedProducts = Object.keys(productQuantities).sort((a, b) => productQuantities[b] - productQuantities[a]);

        const topProducts = sortedProducts.slice(0, 5);

        const frequentlySoldReport = topProducts.map((productName) => ({
            'Medicine Name': productName.trim(),
            'Total Quantity Sold': productQuantities[productName],
        }));

        return frequentlySoldReport;

        // Set the store property with the sorted report if needed
        // store.setProp("FrequentlySoldReport", frequentlySoldReport);
    } catch (error) {
        console.error('Error fetching top products:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export async function fetchLeastSoldProductsSupervisor(
    region: string,
    district: string,
    startDate: string,
    endDate: string,
) {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const regionID = await prisma.region.findMany({
            where: {
                name: region
            },
            select: {
                id: true,
            }
        });

        const districtID = await prisma.district.findMany({
            where: {
                name: district
            },
            select: {
                id: true,
            }
        });

        const addoIDs = await prisma.addo.findMany({
            where: {
                region: regionID[0].id,
                district: districtID[0].id,
            },
            select: {
                id: true,
            }
        });

        const sales = await prisma.productSale.findMany({
            where: {
                addo: {
                    in: addoIDs.map((addo) => addo.id),
                },
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


        // Initialize the product quantities with all products set to Zero
        const productQuantities: { [key: string]: number } = {};

        sales.forEach((sale) => {
            if (sale && sale.quantity) {
                const productName = sale.ADDOProduct
                    ? `${sale.ADDOProduct.brandName} ${sale.ADDOProduct.genericName} ${sale.ADDOProduct.medicineStrength}`
                    : sale.SpecialProduct
                        ? `${sale.SpecialProduct.brandName} ${sale.SpecialProduct.genericName} ${sale.SpecialProduct.medicineStrength}`
                        : '';

                if (productName in productQuantities) {
                    productQuantities[productName] += sale.quantity;
                } else {
                    productQuantities[productName] = sale.quantity;
                }
            }
        });

        // Sort the products by quantity sold
        const sortedProducts = Object.keys(productQuantities).sort(
            (a, b) => productQuantities[a] - productQuantities[b],
        );

        const topTenProducts = sortedProducts.slice(0, 5);

        const leastSoldReport = topTenProducts.map((productName) => ({
            'Medicine Name': productName.trim(),
            'Total Quantity Sold': productQuantities[productName],
        }));

        return leastSoldReport;

        // Set the store property with the sorted report if needed
        // store.setProp("LeastSoldReport", leastSoldReport);
    } catch (error) {
        console.error('Error fetching least sold products:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
export async function fetchExpensesReportSupervisor(region: string, district: string, startDate: string, endDate: string) {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const regionID = await prisma.region.findMany({
            where: {
                name: region
            },
            select: {
                id: true,
            }
        });

        const districtID = await prisma.district.findMany({
            where: {
                name: district
            },
            select: {
                id: true,
            }
        });

        const addoIDs = await prisma.addo.findMany({
            where: {
                region: regionID[0].id,
                district: districtID[0].id,
            },
            select: {
                id: true,
            }
        });

        const expensesData = await prisma.expense.findMany({
            where: {
                addo: {
                    in: addoIDs.map((addo) => addo.id),
                },
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
            include: {
                Addo: {
                    select: {
                        name: true,
                    },
                },
                Option: {
                    select: {
                        en: true,
                    },
                },
            },
        });

        // console.log(expensesData)

        const expensesReport = expensesData.map((expense) => ({
            'id': expense.id,
            'Addo': expense.Addo?.name,
            'Expense': expense.Option?.en,
            'Description': expense.details,
            'Amount': expense.amount,
            'Date': expense.date,
        }));

        // console.log(expensesReport)

        return expensesReport;

    } catch (error) {
        console.error('Error fetching expenses report:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }

}

// functions to fetch data for user role "Owner"

export async function fetchCardDataAddo(
    startDate: string,
    endDate: string,
) {
    noStore();
    try {

        const addo = await fetchUserAddo();
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
                addo: addo?.addo,
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
                addo: addo?.addo,
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
                addo: addo?.addo,
            },
        });

        // Calculate total revenue
        const totalRevenue = totalSales - (totalExpenses?._sum?.amount || 0);

        // calculate number of users by the number sales

        const saleCount = await prisma.sale.count({
            where: {
                sellingDate: {
                    gte: start,
                    lte: end,
                },
                addo: addo?.addo,
            },
        });

        return {
            totalSales: totalSales,
            totalExpenses: totalExpenses?._sum?.amount || 0,
            totalRevenue,
            saleCount,
        };
    } catch (error) {
        console.error('Error fetching card data:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
export async function fetchExpenses(startDate: string, endDate: string) {
    noStore();
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const addo = await fetchUserAddo();

        const expenses = await prisma.expense.groupBy({
            by: ['date'],
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
                addo: addo?.addo,
            },
            _sum: {
                amount: true,
            },
            orderBy: {
                date: 'asc',
            },
        });

        const formattedExpenses = expenses.map((expense) => {
            return {
                // id: expense.id,
                // option: expense.Option?.en,
                // description: expense.details,
                amount: expense._sum?.amount || 0,
                date: expense.date,
            };
        });
        return formattedExpenses;
    } catch (error) {
        console.error('Error fetching expenses:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
export async function fetchExpensesReport(startDate: string, endDate: string) {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const addo = await fetchUserAddo();
        const expensesData = await prisma.expense.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                },
                addo: addo?.addo,
            },
            orderBy: {
                date: 'asc',
            },
            include: {
                Addo: {
                    select: {
                        name: true,
                    },
                },
                Option: {
                    select: {
                        en: true,
                    },
                },
            },
        });

        const expensesReport = expensesData.map((expense) => ({
            'id': expense.id,
            'Addo': expense.Addo?.name,
            'Expense': expense.Option?.en,
            'Description': expense.details,
            'Amount': expense.amount,
            'Date': expense.date,
        }));

        return expensesReport;
    } catch (error) {
        console.error('Error fetching expenses report:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
export async function fetchSales(startDate: string, endDate: string) {
    noStore();
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const addo = await fetchUserAddo();
        const sales = await prisma.sale.groupBy({
            by: ['sellingDate'],
            where: {
                sellingDate: {
                    gte: start,
                    lte: end,
                },
                addo: addo?.addo,
            },
            _sum: {
                total: true,
                discount: true,
            },
            orderBy: {
                sellingDate: 'asc',
            },
        });
        const formattedSales = sales.map(({ _sum: { total, discount }, sellingDate }) => ({
            total: total - discount,
            sellingDate,
        }));
        return formattedSales;
    }
    catch (error) {
        console.error('Error fetching sales:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
export async function fetchSalesReport(startDate: string, endDate: string) {
    noStore();
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const addo = await fetchUserAddo();

        const salesReport = await prisma.productSale.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end,
                },
                addo: addo?.addo,
            },
            orderBy: {
                createdAt: 'asc',
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
                },
            },
        });

        const formattedSalesReport = salesReport.map((sale) => {
            return {
                id: sale.id,
                product: sale.ADDOProduct
                    ? `${sale.ADDOProduct.brandName} ${sale.ADDOProduct.genericName} ${sale.ADDOProduct.medicineStrength}`.trim()
                    : sale.SpecialProduct
                        ? `${sale.SpecialProduct.brandName} ${sale.SpecialProduct.genericName} ${sale.SpecialProduct.medicineStrength}`
                        : ''.trim(),
                price: sale.price,
                quantity: sale.quantity,
                total: sale.subtotal,
                createdAt: sale.createdAt,
            };
        });

        return formattedSalesReport;
    } catch (error) {
        console.error('Error fetching sales report:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
export async function fetchProductStock(query: string, currentPage: number,) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const addo = await fetchUserAddo();

    try {
        const stock = await prisma.productStock.findMany({
            take: ITEMS_PER_PAGE,
            skip: offset,
            where: {
                addo: addo?.addo,
                OR: [
                    {
                        ADDOProduct: {
                            brandName: {
                                contains: query,
                            },
                        },
                    },
                    {
                        SpecialProduct: {
                            brandName: {
                                contains: query,
                            },
                        },
                    },
                    {
                        ADDOProduct: {
                            genericName: {
                                contains: query,
                            },
                        },
                    },
                    {
                        SpecialProduct: {
                            genericName: {
                                contains: query,
                            },
                        },
                    },
                    {
                        ADDOProduct: {
                            medicineStrength: {
                                contains: query,
                            },
                        },
                    },
                    {
                        SpecialProduct: {
                            medicineStrength: {
                                contains: query,
                            },
                        },
                    },
                ],
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

        const ProductStock = stock.map((product) => {
            const stockStatus = product.quantity > product.reorderQuantity ? 'In Stock' : 'Out Stock';
            return {
                id: product.id,
                quantity: product.quantity,
                reorderQuantity: product.reorderQuantity,
                ProductName: product.ADDOProduct
                    ? `${product.ADDOProduct.brandName} ${product.ADDOProduct.genericName} ${product.ADDOProduct.medicineStrength}`.trim()
                    : product.SpecialProduct
                        ? `${product.SpecialProduct.brandName} ${product.SpecialProduct.genericName} ${product.SpecialProduct.medicineStrength}`
                        : ''.trim(),
                sellingPricePerStorageUnit: product.sellingPricePerStorageUnit,
                pricePerStorageUnit: product.pricePerStorageUnit,
                expiryDate: product.expiryDate,
                supplier: product.supplier,
                sellingUnit: product.sellingUnit,
                storageUnit: product.storageUnit,
                stockStatus: stockStatus,
            };
        });
        return ProductStock;
    } catch (error) {
        console.error('Error fetching product stock:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
export async function fetchProductStockPages(query: string) {
    noStore();
    const addo = await fetchUserAddo();

    try {
        const count = await prisma.productStock.count({
            where: {
                addo: addo?.addo,
                OR: [
                    {
                        ADDOProduct: {
                            brandName: {
                                contains: query,
                            },
                        },
                    },
                    {
                        SpecialProduct: {
                            brandName: {
                                contains: query,
                            },
                        },
                    },
                    {
                        ADDOProduct: {
                            genericName: {
                                contains: query,
                            },
                        },
                    },
                    {
                        SpecialProduct: {
                            genericName: {
                                contains: query,
                            },
                        },
                    },
                    {
                        ADDOProduct: {
                            medicineStrength: {
                                contains: query,
                            },
                        },
                    },
                    {
                        SpecialProduct: {
                            medicineStrength: {
                                contains: query,
                            },
                        },
                    },
                ],
            },
        });

        const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Error fetching product stock pages:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }

}
export async function fetchTopProductAddo(
    startDate: string,
    endDate: string,
) {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const addo = await fetchUserAddo()

        const sales = await prisma.productSale.findMany({
            where: {
                addo: addo?.addo,
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

        // Slice the array to get only the top ten results
        const topTenProducts = sortedProducts.slice(0, 5);

        const frequentlySoldReport = topTenProducts.map((productName) => ({
            'Medicine Name': productName.trim(),
            'Total Quantity Sold': productQuantities[productName],
        }));

        return frequentlySoldReport;


        // Set the store property with the sorted report if needed
        // store.setProp("FrequentlySoldReport", frequentlySoldReport);
    } catch (error) {
        console.error('Error fetching top products:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
export async function fetchLeastSoldProductsAddo(
    startDate: string,
    endDate: string,
) {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const addo = await fetchUserAddo();

        const sales = await prisma.productSale.findMany({
            // take: 10,
            where: {
                addo: addo?.addo,
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


        // Initialize the product quantities with all products set to Zero
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

        // Sort the products by quantity sold
        const sortedProducts = Object.keys(productQuantities).sort(
            (a, b) => productQuantities[a] - productQuantities[b],
        );

        const topTenProducts = sortedProducts.slice(0, 5);

        const leastSoldReport = topTenProducts.map((productName) => ({
            'Medicine Name': productName.trim(),
            'Total Quantity Sold': productQuantities[productName],
        }));

        return leastSoldReport;

        // Set the store property with the sorted report if needed
        // store.setProp("LeastSoldReport", leastSoldReport);
    } catch (error) {
        console.error('Error fetching least sold products:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// General Functions

export async function fetchProductSales(startDate: string, endDate: string) {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const addo = await fetchUserAddo();

        const saleData = await prisma.sale.findMany({
            where: {
                addo: addo?.addo,
                sellingDate: {
                    gte: start,
                    lte: end,
                },
            }
        });

        return saleData;

    } catch (error) {
        console.error('Error fetching product sales:', error);
        throw error;
    }
}
export async function fetchUserAddo() {
    try {
        const user = await getUser();
        const userMail = user?.email;

        const UserData = await prisma.user.findUnique({
            where: {
                email: userMail,
            },
            include: {
                Addo_User_addo: true,
            },
        });

        if (UserData && UserData?.Addo_User_addo[0]) {
            const addo = UserData?.Addo_User_addo[0].id;
            const region = UserData?.Addo_User_addo[0].region;
            const district = UserData?.Addo_User_addo[0].district;
            return { addo, region, district };
        } else {
            return null;
        }
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
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export async function fetchRegion() {
    try {
        const regionData = await prisma.region.findMany();
        return regionData;
    } catch (error) {
        console.error('Error fetching region:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export async function fetchDistrict(region: string) {
    try {
        const regionID = await prisma.region.findUnique({
            where: {
                name: region,
            }
        });

        const districtData = await prisma.district.findMany(
            {
                where: {
                    region: regionID?.id,
                }
            }
        );
        return districtData;
    } catch (error) {
        console.error('Error fetching district:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}