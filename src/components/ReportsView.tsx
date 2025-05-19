
import React from 'react';
import { useTripContext } from '@/context/TripContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO, eachDayOfInterval, isSameDay } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { ExpenseCategory } from '@/types';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

const categoryColors: Record<ExpenseCategory, string> = {
  accommodation: '#FF6384',
  transportation: '#36A2EB',
  food: '#FFCE56',
  activities: '#4BC0C0',
  shopping: '#9966FF',
  emergency: '#FF9F40',
  miscellaneous: '#C9CBCF'
};

const categoryIcons: Record<ExpenseCategory, string> = {
  accommodation: '🏨',
  transportation: '✈️',
  food: '🍽️',
  activities: '🎭',
  shopping: '🛍️',
  emergency: '🏥',
  miscellaneous: '📦'
};

export const ReportsView = () => {
  const { activeTrip } = useTripContext();

  if (!activeTrip) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Card className="w-full max-w-md glass-card">
          <CardHeader>
            <CardTitle>No Trip Selected</CardTitle>
            <CardDescription>Please create or select a trip to view reports</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Generate daily expense data
  const generateDailyExpenseData = () => {
    if (!activeTrip?.startDate || !activeTrip?.endDate || activeTrip.expenses.length === 0) {
      return [];
    }

    const start = parseISO(activeTrip.startDate);
    const end = parseISO(activeTrip.endDate);
    
    return eachDayOfInterval({ start, end }).map(day => {
      const dayExpenses = activeTrip.expenses.filter(expense => 
        isSameDay(parseISO(expense.date), day)
      );
      
      const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        date: format(day, 'MMM dd'),
        value: total,
        expenses: dayExpenses.length
      };
    });
  };

  // Generate category expense data
  const generateCategoryExpenseData = () => {
    if (!activeTrip?.expenses.length) return [];

    const categoryTotals = {} as Record<string, number>;
    
    activeTrip.expenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });
    
    return Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      total,
      fill: categoryColors[category as ExpenseCategory],
      icon: categoryIcons[category as ExpenseCategory]
    }));
  };

  const dailyData = generateDailyExpenseData();
  const categoryData = generateCategoryExpenseData();

  const handleExportPDF = () => {
    toast.success("Report exported successfully!");
    // In a real app, this would generate and download a PDF
  };

  const handleExportCSV = () => {
    if (!activeTrip?.expenses.length) {
      toast.error("No expenses to export");
      return;
    }

    // Create CSV content
    const headers = ["Date", "Category", "Description", "Amount", "Currency", "Notes"];
    const rows = activeTrip.expenses.map(expense => [
      format(parseISO(expense.date), 'yyyy-MM-dd'),
      expense.category,
      expense.description,
      expense.amount,
      expense.currency,
      expense.notes || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create virtual link and trigger download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTrip.name}_expenses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV exported successfully!");
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Reports</h2>
            <p className="text-muted-foreground">Detailed reports of your trip expenses</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Daily Expenses</CardTitle>
            <CardDescription>
              Track how your spending changes throughout your trip
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'var(--text-color, inherit)' }}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--text-color, inherit)' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <RechartsTooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Expenses']}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{ 
                      backgroundColor: 'var(--tooltip-bg, rgba(255, 255, 255, 0.9))', 
                      border: 'none', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Amount" 
                    stroke="#0071e3" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No expense data available for this trip</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>
              Compare spending across different expense categories
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fill: 'var(--text-color, inherit)' }}
                    tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--text-color, inherit)' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total']}
                    labelFormatter={(category) => `${category.charAt(0).toUpperCase() + category.slice(1)}`}
                    contentStyle={{ 
                      backgroundColor: 'var(--tooltip-bg, rgba(255, 255, 255, 0.9))', 
                      border: 'none', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="total" name="Amount" fill="#0071e3" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No expense data available for this trip</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Trip Summary</CardTitle>
            <CardDescription>
              Overview of {activeTrip.name} trip expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Expenses</div>
                <div className="text-2xl font-bold mt-1">
                  ${activeTrip.expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Budget</div>
                <div className="text-2xl font-bold mt-1">
                  ${activeTrip.budget?.toLocaleString() || 'Not set'}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Number of Expenses</div>
                <div className="text-2xl font-bold mt-1">
                  {activeTrip.expenses.length}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Trip Duration</div>
                <div className="text-2xl font-bold mt-1">
                  {activeTrip.startDate && activeTrip.endDate ? (
                    `${eachDayOfInterval({
                      start: parseISO(activeTrip.startDate),
                      end: parseISO(activeTrip.endDate)
                    }).length} days`
                  ) : (
                    'Not set'
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
