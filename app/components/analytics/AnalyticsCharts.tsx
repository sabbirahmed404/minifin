"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Transaction } from '../../lib/data/FinanceContext';
import { useCurrency } from '../../lib/data/CurrencyContext';
import { format, subMonths, subDays, startOfMonth, endOfMonth } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Category colors
export const categoryColors: Record<string, string> = {
  food: '#FF6384',
  transportation: '#36A2EB',
  utilities: '#FFCE56',
  entertainment: '#4BC0C0',
  shopping: '#9966FF',
  health: '#FF9F40',
  education: '#C9CBCF',
  other: '#7F8FA6',
  salary: '#66BB6A',
  investments: '#26A69A',
  gifts: '#AB47BC',
};

// Helper to get color for a category
export const getColorForCategory = (category: string): string => {
  return categoryColors[category] || '#7F8FA6'; // Default to gray if category not found
};

// Component for Income vs Expenses line chart
export function IncomeVsExpensesChart({ 
  transactions, 
  timeRange 
}: { 
  transactions: Transaction[],
  timeRange: 'week' | 'month' | 'year' | 'all'
}) {
  const { currentCurrency } = useCurrency();
  
  // Generate date labels and filter transactions based on time range
  const { labels, filteredTransactions } = getTimeRangeData(transactions, timeRange);
  
  // Group transactions by date
  const incomeByDate = {} as Record<string, number>;
  const expensesByDate = {} as Record<string, number>;
  
  // Initialize with zero values
  labels.forEach(label => {
    incomeByDate[label] = 0;
    expensesByDate[label] = 0;
  });
  
  // Populate data
  filteredTransactions.forEach(transaction => {
    const dateStr = format(new Date(transaction.date), getDateFormat(timeRange));
    
    if (transaction.type === 'income') {
      incomeByDate[dateStr] = (incomeByDate[dateStr] || 0) + transaction.amount;
    } else {
      expensesByDate[dateStr] = (expensesByDate[dateStr] || 0) + transaction.amount;
    }
  });
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: labels.map(label => incomeByDate[label] || 0),
        borderColor: '#66BB6A',
        backgroundColor: 'rgba(102, 187, 106, 0.2)',
      },
      {
        label: 'Expenses',
        data: labels.map(label => expensesByDate[label] || 0),
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += currentCurrency.symbol + context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          callback: function(value: any) {
            return currentCurrency.symbol + value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Line options={chartOptions} data={data} />
    </div>
  );
}

// Component for Category Pie Chart
export function CategoryPieChart({ 
  transactions,
  type = 'expense' 
}: { 
  transactions: Transaction[],
  type?: 'income' | 'expense'
}) {
  const { currentCurrency } = useCurrency();
  const filteredTransactions = transactions.filter(t => t.type === type);
  
  // Group by category
  const categorySums = {} as Record<string, number>;
  
  filteredTransactions.forEach(transaction => {
    const { category, amount } = transaction;
    categorySums[category] = (categorySums[category] || 0) + amount;
  });
  
  // Convert to arrays for chart
  const categories = Object.keys(categorySums);
  const amounts = Object.values(categorySums);
  const backgroundColors = categories.map(category => getColorForCategory(category));
  
  const data = {
    labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [
      {
        data: amounts,
        backgroundColor: backgroundColors,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
    ],
  };
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / amounts.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
            return `${label}: ${currentCurrency.symbol}${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    cutout: type === 'expense' ? '60%' : undefined,
  };

  return (
    <div className="h-[300px]">
      {type === 'expense' ? (
        <Doughnut data={data} options={pieOptions} />
      ) : (
        <Pie data={data} options={pieOptions} />
      )}
    </div>
  );
}

// Component for Monthly Summary Bar Chart
export function MonthlySummaryChart({ transactions }: { transactions: Transaction[] }) {
  const { currentCurrency } = useCurrency();
  // Get data for last 6 months
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      label: format(date, 'MMM yyyy'),
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  }).reverse();
  
  // Calculate monthly totals
  const monthlyIncome = [] as number[];
  const monthlyExpenses = [] as number[];
  const monthlySavings = [] as number[];
  
  months.forEach(({ month, year }) => {
    const monthStart = startOfMonth(new Date(year, month));
    const monthEnd = endOfMonth(new Date(year, month));
    
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= monthStart && date <= monthEnd;
    });
    
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    monthlyIncome.push(income);
    monthlyExpenses.push(expenses);
    monthlySavings.push(income - expenses);
  });
  
  const data = {
    labels: months.map(m => m.label),
    datasets: [
      {
        label: 'Income',
        data: monthlyIncome,
        backgroundColor: 'rgba(102, 187, 106, 0.6)',
      },
      {
        label: 'Expenses',
        data: monthlyExpenses,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Savings',
        data: monthlySavings,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      }
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += currentCurrency.symbol + context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          callback: function(value: any) {
            return currentCurrency.symbol + value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Bar options={barOptions} data={data} />
    </div>
  );
}

// Helper functions
function getDateFormat(timeRange: 'week' | 'month' | 'year' | 'all'): string {
  const dateFormat = timeRange === 'week' ? 'EEE' 
    : timeRange === 'month' ? 'd MMM'
    : timeRange === 'year' ? 'MMM'
    : 'MMM yyyy';
  
  return dateFormat;
}

function getTimeRangeData(transactions: Transaction[], timeRange: 'week' | 'month' | 'year' | 'all') {
  const today = new Date();
  let startDate: Date;
  let dateFormat: string = getDateFormat(timeRange);
  let labels: string[] = [];
  
  // Set start date and generate labels based on time range
  switch (timeRange) {
    case 'week':
      startDate = subDays(today, 6);
      for (let i = 0; i < 7; i++) {
        const date = subDays(today, 6 - i);
        labels.push(format(date, dateFormat));
      }
      break;
    case 'month':
      startDate = subDays(today, 29);
      for (let i = 0; i < 30; i++) {
        const date = subDays(today, 29 - i);
        labels.push(format(date, dateFormat));
      }
      break;
    case 'year':
      startDate = subMonths(today, 11);
      for (let i = 0; i < 12; i++) {
        const date = subMonths(today, 11 - i);
        labels.push(format(date, dateFormat));
      }
      break;
    case 'all':
    default:
      startDate = new Date(0); // Beginning of time
      // For 'all', we'll get unique month-year combinations from transactions
      const monthYears = new Set(
        transactions.map(t => format(new Date(t.date), dateFormat))
      );
      labels = Array.from(monthYears).sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
      });
      break;
  }
  
  // Filter transactions based on time range
  const filteredTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= startDate && date <= today;
  });
  
  return { labels, filteredTransactions };
} 