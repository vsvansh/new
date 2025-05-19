
import React from 'react';
import { useTripContext } from '@/context/TripContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { PieChart, LineChart, Table } from '@/components/charts';
import { ExpenseCategory } from '@/types';

const categoryLabels: Record<ExpenseCategory, string> = {
  accommodation: 'Accommodation',
  transportation: 'Transportation',
  food: 'Food & Dining',
  activities: 'Activities',
  shopping: 'Shopping',
  emergency: 'Emergency',
  miscellaneous: 'Miscellaneous',
};

const categoryIcons: Record<ExpenseCategory, string> = {
  accommodation: '🏨',
  transportation: '✈️',
  food: '🍽️',
  activities: '🎭',
  shopping: '🛍️',
  emergency: '🏥',
  miscellaneous: '📦',
};

export const Dashboard = () => {
  const { activeTrip, getBudgetSummary } = useTripContext();
  
  if (!activeTrip) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card>
          <CardHeader>
            <CardTitle>No Trip Selected</CardTitle>
            <CardDescription>Please create or select a trip to start tracking your budget</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  const summary = getBudgetSummary();
  const start = new Date(activeTrip.startDate);
  const end = new Date(activeTrip.endDate);
  const today = new Date();
  
  // Calculate trip progress
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.max(0, Math.min(totalDays, Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))));
  const tripProgress = Math.round((daysPassed / totalDays) * 100);
  
  const isOverBudget = summary.remaining < 0;
  
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-4">
          <Card className="flex-1 min-w-[300px] glass-card hover-card transition-transform duration-300 hover:-translate-y-2 dark:hover:shadow-[var(--neon-blue)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center justify-between">
                <span>{activeTrip.name}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {activeTrip.destination}
                </span>
              </CardTitle>
              <CardDescription>
                {format(start, 'MMM d, yyyy')} - {format(end, 'MMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Trip Progress</span>
                    <span>{daysPassed} of {totalDays} days ({tripProgress}%)</span>
                  </div>
                  <Progress value={tripProgress} className="h-2" />
                </div>
                
                <div className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Trip Budget</p>
                      <p className="text-2xl font-bold">${summary.totalBudget.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                      <p className="text-2xl font-bold">${summary.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`flex-1 min-w-[300px] glass-card hover-card transition-transform duration-300 hover:-translate-y-2 
            ${isOverBudget 
              ? 'border-macos-red/30 dark:hover:shadow-[var(--neon-red)]' 
              : 'border-macos-green/30 dark:hover:shadow-[var(--neon-green)]'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Budget Overview</CardTitle>
              <CardDescription>
                {isOverBudget ? 'You are over budget!' : 'You are under budget'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Budget Used</span>
                    <span className={isOverBudget ? "text-macos-red" : "text-macos-green"}>
                      {Math.min(100, Math.round(summary.percentageSpent))}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(100, summary.percentageSpent)} 
                    className={`h-2 ${isOverBudget ? "bg-macos-red/20" : "bg-macos-green/20"}`} 
                    indicatorClassName={isOverBudget ? "bg-macos-red" : "bg-macos-green"} 
                  />
                </div>
                
                <div className="pt-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Remaining Budget</p>
                    <p className={`text-2xl font-bold ${isOverBudget ? "text-macos-red" : "text-macos-green"}`}>
                      ${Math.abs(summary.remaining).toLocaleString()}
                      {isOverBudget && ' over'}
                    </p>
                  </div>
                  <div className="space-y-1 pt-2">
                    <p className="text-xs text-muted-foreground">Daily Average</p>
                    <p className="text-lg font-medium">${summary.dailyAverage.toFixed(2)}/day</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card hover-card transition-transform duration-300 hover:-translate-y-2 dark:hover:shadow-[var(--neon-purple)]">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>
                Highest: {categoryLabels[summary.highestCategory.category]} (${summary.highestCategory.amount.toLocaleString()})
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <PieChart data={summary.categorySummary.map(cat => ({
                name: categoryLabels[cat.category],
                value: cat.amount,
                icon: categoryIcons[cat.category]
              }))} />
            </CardContent>
          </Card>
          
          <Card className="glass-card hover-card transition-transform duration-300 hover:-translate-y-2 dark:hover:shadow-[var(--neon-blue)]">
            <CardHeader>
              <CardTitle>Spending Timeline</CardTitle>
              <CardDescription>Daily expenses across the trip</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <LineChart expenses={activeTrip.expenses} startDate={activeTrip.startDate} endDate={activeTrip.endDate} />
            </CardContent>
          </Card>
        </div>
        
        <Card className="glass-card hover-card transition-transform duration-300 hover:-translate-y-2 dark:hover:shadow-[var(--neon-pink)]">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Last 5 expenses added</CardDescription>
          </CardHeader>
          <CardContent>
            <Table expenses={activeTrip.expenses.slice(-5).reverse()} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
