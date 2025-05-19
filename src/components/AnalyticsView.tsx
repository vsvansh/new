
import React from 'react';
import { useTripContext } from '@/context/TripContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { format, parseISO, eachDayOfInterval, isSameDay, addDays } from 'date-fns';
import { ExpenseCategory } from '@/types';
import { Button } from './ui/button';
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CATEGORY_COLORS = {
  accommodation: '#FF6384',
  transportation: '#36A2EB',
  food: '#FFCE56',
  activities: '#4BC0C0',
  shopping: '#9966FF',
  emergency: '#FF9F40',
  miscellaneous: '#C9CBCF'
};

export const AnalyticsView = () => {
  const { activeTrip } = useTripContext();

  if (!activeTrip) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Card className="w-full max-w-md glass-card">
          <CardHeader>
            <CardTitle>No Trip Selected</CardTitle>
            <CardDescription>Please create or select a trip to view analytics</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Get spending trends (daily expenses)
  const getDailySpendingData = () => {
    if (!activeTrip.expenses.length || !activeTrip.startDate || !activeTrip.endDate) {
      return [];
    }

    const start = parseISO(activeTrip.startDate);
    const end = parseISO(activeTrip.endDate);
    
    // Create an array of all days in the trip
    return eachDayOfInterval({ start, end }).map(day => {
      // Find expenses for this day
      const dayExpenses = activeTrip.expenses.filter(expense => 
        isSameDay(parseISO(expense.date), day)
      );
      
      // Calculate total spent this day
      const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Calculate running total
      const runningTotal = activeTrip.expenses
        .filter(expense => parseISO(expense.date) <= day)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      // Calculate daily budget (if budget exists)
      const dailyBudget = activeTrip.budget 
        ? activeTrip.budget / eachDayOfInterval({ start, end }).length
        : 0;
      
      // Calculate budget line (cumulative daily budget)
      const dayNumber = eachDayOfInterval({ start: start, end: day }).length;
      const budgetLine = dailyBudget * dayNumber;
      
      return {
        date: format(day, 'MMM dd'),
        fullDate: format(day, 'yyyy-MM-dd'),
        spent: total,
        runningTotal,
        budgetLine: activeTrip.budget ? budgetLine : undefined
      };
    });
  };

  // Get category breakdown data
  const getCategoryBreakdownData = () => {
    if (!activeTrip.expenses.length) {
      return [];
    }

    const categoryTotals = activeTrip.expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([category, value]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value,
      color: CATEGORY_COLORS[category as ExpenseCategory]
    }));
  };

  // Get daily spending by category
  const getDailySpendingByCategory = () => {
    if (!activeTrip.expenses.length || !activeTrip.startDate || !activeTrip.endDate) {
      return [];
    }

    const start = parseISO(activeTrip.startDate);
    const end = parseISO(activeTrip.endDate);
    
    // Get all categories from expenses
    const categories = Array.from(
      new Set(activeTrip.expenses.map(expense => expense.category))
    );

    // Create data for each day
    return eachDayOfInterval({ start, end }).map(day => {
      const data: any = {
        date: format(day, 'MMM dd'),
      };
      
      // Add amount for each category
      categories.forEach(category => {
        const categoryExpenses = activeTrip.expenses.filter(expense => 
          expense.category === category && isSameDay(parseISO(expense.date), day)
        );
        data[category] = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      });
      
      return data;
    });
  };

  const dailySpendingData = getDailySpendingData();
  const categoryBreakdownData = getCategoryBreakdownData();
  const dailySpendingByCategory = getDailySpendingByCategory();

  const totalSpent = activeTrip.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudget = activeTrip.budget || 0;
  const budgetRemaining = totalBudget - totalSpent;
  const budgetStatus = budgetRemaining >= 0 ? 'under' : 'over';

  // Calculate trip insights
  const getTripInsights = () => {
    if (!activeTrip.expenses.length) {
      return {
        highestDaySpending: { date: 'N/A', amount: 0 },
        lowestDaySpending: { date: 'N/A', amount: 0 },
        averageDailySpend: 0,
        mostExpensiveCategory: 'N/A',
        topExpense: { description: 'N/A', amount: 0 }
      };
    }

    // Find highest spending day
    const highestDay = [...dailySpendingData]
      .sort((a, b) => b.spent - a.spent)[0];
    
    // Find lowest spending day (with spending > 0)
    const daysWithSpending = dailySpendingData.filter(day => day.spent > 0);
    const lowestDay = daysWithSpending.length > 0 
      ? [...daysWithSpending].sort((a, b) => a.spent - b.spent)[0]
      : { date: 'N/A', spent: 0 };
    
    // Calculate average daily spend
    const totalDays = dailySpendingData.length || 1;
    const averageDailySpend = totalSpent / totalDays;
    
    // Find most expensive category
    const mostExpensiveCategory = categoryBreakdownData.length > 0
      ? [...categoryBreakdownData].sort((a, b) => b.value - a.value)[0].name
      : 'N/A';
    
    // Find top expense
    const topExpense = activeTrip.expenses.length > 0
      ? [...activeTrip.expenses].sort((a, b) => b.amount - a.amount)[0]
      : { description: 'N/A', amount: 0 };
    
    return {
      highestDaySpending: { 
        date: highestDay?.date || 'N/A', 
        amount: highestDay?.spent || 0 
      },
      lowestDaySpending: { 
        date: lowestDay?.date || 'N/A', 
        amount: lowestDay?.spent || 0 
      },
      averageDailySpend,
      mostExpensiveCategory,
      topExpense: {
        description: topExpense.description,
        amount: topExpense.amount
      }
    };
  };

  const insights = getTripInsights();

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold">Analytics</h2>
          <p className="text-muted-foreground">Gain insights into your spending patterns</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`glass-card ${budgetStatus === 'under' ? 'border-green-300 dark:border-green-700' : 'border-red-300 dark:border-red-700'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Budget Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className={budgetStatus === 'under' ? 'text-green-500' : 'text-red-500'}>
                  {budgetStatus === 'under' ? 'Under Budget' : 'Over Budget'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {budgetStatus === 'under' 
                  ? `$${budgetRemaining.toLocaleString()} remaining` 
                  : `$${Math.abs(budgetRemaining).toLocaleString()} over budget`}
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalSpent.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {activeTrip.expenses.length} transactions
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Daily Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${insights.averageDailySpend.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                per day on average
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="spending-trends">
          <TabsList className="mb-4">
            <TabsTrigger value="spending-trends" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" /> Spending Trends
            </TabsTrigger>
            <TabsTrigger value="category-breakdown" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" /> Category Breakdown
            </TabsTrigger>
            <TabsTrigger value="daily-breakdown" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Daily Breakdown
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="spending-trends">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
                <CardDescription>See how your spending evolves over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {dailySpendingData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={dailySpendingData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <RechartsTooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
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
                        dataKey="spent" 
                        name="Daily Expenses" 
                        stroke="#FF6384" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="runningTotal" 
                        name="Cumulative Spending" 
                        stroke="#36A2EB" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                      {activeTrip.budget && (
                        <Line 
                          type="monotone" 
                          dataKey="budgetLine" 
                          name="Budget Line" 
                          stroke="#4BC0C0"
                          strokeWidth={2} 
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No expense data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="category-breakdown">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>See how your money is distributed across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="h-[400px] flex items-center justify-center">
                    {categoryBreakdownData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryBreakdownData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-muted-foreground">No expense data available</p>
                    )}
                  </div>
                  
                  <div className="self-center">
                    <h3 className="text-lg font-medium mb-4">Category Summary</h3>
                    {categoryBreakdownData.length > 0 ? (
                      <div className="space-y-3">
                        {categoryBreakdownData
                          .sort((a, b) => b.value - a.value)
                          .map((category) => (
                            <div key={category.name} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: category.color }}
                                ></div>
                                <span>{category.name}</span>
                              </div>
                              <span className="font-medium">${category.value.toLocaleString()}</span>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No data to display</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="daily-breakdown">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Daily Spending by Category</CardTitle>
                <CardDescription>Compare category spending patterns each day</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                {dailySpendingByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dailySpendingByCategory}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <RechartsTooltip
                        formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                        contentStyle={{ 
                          backgroundColor: 'var(--tooltip-bg, rgba(255, 255, 255, 0.9))', 
                          border: 'none', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                        <Bar 
                          key={category} 
                          dataKey={category} 
                          name={category.charAt(0).toUpperCase() + category.slice(1)}
                          stackId="a" 
                          fill={color} 
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No expense data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Trip Insights</CardTitle>
            <CardDescription>Key statistics from your trip expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Spending Extremes</h3>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Highest Spending Day</div>
                  <div className="flex justify-between items-center">
                    <span>{insights.highestDaySpending.date}</span>
                    <span className="font-medium">${insights.highestDaySpending.amount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Lowest Spending Day</div>
                  <div className="flex justify-between items-center">
                    <span>{insights.lowestDaySpending.date}</span>
                    <span className="font-medium">${insights.lowestDaySpending.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Category Insights</h3>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Most Expensive Category</div>
                  <div className="text-lg font-medium capitalize">{insights.mostExpensiveCategory}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Category Distribution</div>
                  <div className="text-lg font-medium">{categoryBreakdownData.length} categories used</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Notable Expenses</h3>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Largest Single Expense</div>
                  <div>
                    <div className="font-medium">${insights.topExpense.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground mt-1">{insights.topExpense.description}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
