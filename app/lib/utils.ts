import { Revenue } from './definitions';

export const formatCurrency = (amount: number) => {
  return (amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'TZS', // Tanzanian Shillings currency code
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (data: { date: string, amount: number }[], step: number = 1000, prefix: string = '') => {
  // Extract amounts from the expense data
  const amounts = data.map(expense => expense.amount);

  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...amounts);
  const topLabel = Math.ceil(highestRecord / step) * step;

  for (let i = topLabel; i >= 0; i -= step) {
    yAxisLabels.push(`${prefix}${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export function getWeeksInMonth(date: Date): number {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const firstDayOfWeek = getStartOfWeek(firstDayOfMonth);
  const lastDayOfWeek = getEndOfWeek(lastDayOfMonth);
  return Math.ceil((lastDayOfWeek.getTime() - firstDayOfWeek.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
}

export function getStartOfWeek(date: Date): Date {
  const dayOfWeek = date.getDay();
  const startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
}

export function getEndOfWeek(date: Date): Date {
  const dayOfWeek = date.getDay();
  const endOfWeek = new Date(date);
  endOfWeek.setDate(endOfWeek.getDate() + (6 - dayOfWeek));
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
}

export function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

export function getEndOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

