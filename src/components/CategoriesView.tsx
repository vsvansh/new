
import React from 'react';
import { useTripContext } from '@/context/TripContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Expense, ExpenseCategory } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryData {
  name: string;
  value: number;
  icon: string;
  color: string;
}

const CATEGORY_COLORS = {
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

const categoryDescriptions: Record<ExpenseCategory, string> = {
  accommodation: 'Hotels, Airbnb, hostels, and other lodging expenses',
  transportation: 'Flights, trains, car rentals, taxis, and fuel costs',
  food: 'Restaurants, cafes, groceries, and all food-related expenses',
  activities: 'Tours, attractions, events, and entertainment costs',
  shopping: 'Souvenirs, clothing, and other retail purchases',
  emergency: 'Medical expenses, unexpected fees, and urgent costs',
  miscellaneous: 'Other expenses that don\'t fit in the above categories'
};

const getCategoryData = (expenses: Expense[]): CategoryData[] => {
  const categoryTotals = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categoryTotals).map(([category, total]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: total,
    icon: categoryIcons[category as ExpenseCategory],
    color: CATEGORY_COLORS[category as ExpenseCategory]
  }));
};

export const CategoriesView = () => {
  const { activeTrip } = useTripContext();

  if (!activeTrip) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Card className="w-full max-w-md glass-card">
          <CardHeader>
            <CardTitle>No Trip Selected</CardTitle>
            <CardDescription>Please create or select a trip to view expense categories</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const categoryData = getCategoryData(activeTrip.expenses);
  const totalSpent = categoryData.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold">Expense Categories</h2>
          <p className="text-muted-foreground">Analyze your spending by category</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>
                Breakdown of expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              {activeTrip.expenses.length > 0 ? (
                <div className="w-full h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value, percent }) => 
                          `${name}: $${Math.round(value)} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-lg">No expense data available</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add expenses to see your category distribution
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Spending Summary</CardTitle>
                <CardDescription>
                  Overview of your trip expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Total Spent:</span>
                  <span className="text-xl font-medium">${totalSpent.toLocaleString()}</span>
                </div>
                
                {categoryData.length > 0 && (
                  <>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground">Highest Category:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {categoryData.sort((a, b) => b.value - a.value)[0]?.icon}
                        </span>
                        <span className="font-medium">
                          {categoryData.sort((a, b) => b.value - a.value)[0]?.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground">Lowest Category:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {categoryData.sort((a, b) => a.value - b.value)[0]?.icon}
                        </span>
                        <span className="font-medium">
                          {categoryData.sort((a, b) => a.value - b.value)[0]?.name}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Category Descriptions</CardTitle>
                <CardDescription>
                  Understanding expense categories
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[400px] overflow-y-auto">
                {Object.entries(categoryDescriptions).map(([category, description]) => (
                  <div key={category} className="mb-4 last:mb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{categoryIcons[category as ExpenseCategory]}</span>
                      <span className="font-medium capitalize">{category}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
