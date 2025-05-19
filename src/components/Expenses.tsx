import React, { useState } from 'react';
import { useTripContext } from '@/context/TripContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table } from '@/components/charts';
import { ExpenseForm } from './ExpenseForm';
import { Expense, ExpenseCategory } from '@/types';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, parseISO } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
const categoryIcons: Record<ExpenseCategory, string> = {
  accommodation: '🏨',
  transportation: '✈️',
  food: '🍽️',
  activities: '🎭',
  shopping: '🛍️',
  emergency: '🏥',
  miscellaneous: '📦'
};
const categoryLabels: Record<ExpenseCategory, string> = {
  accommodation: 'Lodging',
  transportation: 'Travel',
  food: 'Dining',
  activities: 'Events',
  shopping: 'Shop',
  emergency: 'Emergency',
  miscellaneous: 'Other'
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
const categoryTips: Record<ExpenseCategory, string> = {
  accommodation: 'Consider booking in advance to get better rates. Look for weekly discounts on Airbnb.',
  transportation: 'Compare prices across different services. Consider public transportation for city travel.',
  food: 'Local markets and street food can save money while providing authentic experiences.',
  activities: 'Look for free activities or city passes that bundle attractions together for discounts.',
  shopping: 'Set a specific budget for souvenirs to avoid overspending on impulse buys.',
  emergency: 'Check if your travel insurance covers medical emergencies before your trip.',
  miscellaneous: 'Keep small receipts organized to track miscellaneous expenses effectively.'
};
export const Expenses = () => {
  const {
    activeTrip,
    deleteExpense
  } = useTripContext();
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  if (!activeTrip) {
    return <div className="flex items-center justify-center h-full p-6">
        <Card className="w-full max-w-md glass-card">
          <CardHeader>
            <CardTitle>No Trip Selected</CardTitle>
            <CardDescription>Please create or select a trip to start tracking expenses</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => window.location.href = '#planning'}>
              Create a Trip
            </Button>
          </CardContent>
        </Card>
      </div>;
  }
  const filteredExpenses = selectedCategory === 'all' ? activeTrip.expenses : activeTrip.expenses.filter(expense => expense.category === selectedCategory);
  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
    toast.success("Expense deleted successfully");
  };
  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowExpenseForm(true);
  };
  const totalByCurrency = filteredExpenses.reduce((acc, expense) => {
    const {
      currency,
      amount
    } = expense;
    acc[currency] = (acc[currency] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);
  return <div className="h-full overflow-y-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Expenses</h2>
            <p className="text-muted-foreground">Track and manage your trip expenses</p>
          </div>
          <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 shadow-lg dark:shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] my-8 max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
              </DialogHeader>
              <ExpenseForm onSuccess={() => {
              setShowExpenseForm(false);
              setSelectedExpense(null);
              toast.success(selectedExpense ? "Expense updated successfully" : "Expense added successfully");
            }} initialValues={selectedExpense ? {
              amount: selectedExpense.amount,
              category: selectedExpense.category,
              description: selectedExpense.description,
              date: parseISO(selectedExpense.date),
              currency: selectedExpense.currency,
              isRecurring: selectedExpense.isRecurring || false,
              recurringFrequency: selectedExpense.recurringFrequency,
              notes: selectedExpense.notes
            } : undefined} expenseId={selectedExpense?.id} />
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Select a category to filter your expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" onValueChange={value => setSelectedCategory(value as ExpenseCategory | 'all')}>
              <TabsList className="grid grid-cols-4 md:grid-cols-8 gap-1 p-1 h-auto">
                <TabsTrigger value="all" className="py-2 px-3 whitespace-nowrap">
                  All
                </TabsTrigger>
                {Object.entries(categoryLabels).map(([category, label]) => <TabsTrigger key={category} value={category} className="flex flex-col items-center py-2 px-3 gap-1">
                    
                    <span className="text-xs font-medium">{label}</span>
                  </TabsTrigger>)}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card md:col-span-2 dark:bg-black/40 dark:border-white/5 dark:shadow-lg dark:shadow-primary/5">
            <CardHeader>
              <CardTitle>
                {filteredExpenses.length > 0 ? <div className="flex items-center justify-between">
                    <span>{selectedCategory === 'all' ? 'All Expenses' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Expenses`}</span>
                    <div className="flex gap-2">
                      {Object.entries(totalByCurrency).map(([currency, total]) => <Badge key={currency} variant="outline" className="bg-primary/10 dark:bg-primary/20 dark:text-white">
                          {currency}: {total.toLocaleString()}
                        </Badge>)}
                    </div>
                  </div> : <span>{selectedCategory === 'all' ? 'All Expenses' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Expenses`}</span>}
              </CardTitle>
              <CardDescription>
                {filteredExpenses.length === 0 ? 'No expenses in this category' : `${filteredExpenses.length} expense${filteredExpenses.length === 1 ? '' : 's'} found`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 text-xs text-muted-foreground">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-right p-2">Amount</th>
                      <th className="text-right p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map(expense => <tr key={expense.id} className="border-b border-gray-100/30 dark:border-gray-700/30 hover:bg-gray-50/30 dark:hover:bg-gray-800/30">
                        <td className="p-2 text-sm">{format(parseISO(expense.date), 'MMM d, yyyy')}</td>
                        <td className="p-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span>{categoryIcons[expense.category]}</span>
                            <span className="capitalize">{expense.category}</span>
                          </div>
                        </td>
                        <td className="p-2 text-sm">{expense.description}</td>
                        <td className="p-2 text-sm text-right font-medium">
                          {expense.currency} {expense.amount.toLocaleString()}
                          {expense.isRecurring && <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="ml-1 inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300">
                                    <Info className="h-3 w-3 mr-1" />
                                    recurring
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Recurring {expense.recurringFrequency} expense</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>}
                        </td>
                        <td className="p-2 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" className="border-primary/20 hover:border-primary/50 dark:border-primary/30 dark:hover:border-primary" onClick={() => handleEditExpense(expense)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="border-destructive/20 hover:border-destructive dark:border-destructive/30 dark:hover:border-destructive" onClick={() => handleDeleteExpense(expense.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>)}
                    {filteredExpenses.length === 0 && <tr>
                        <td colSpan={5} className="text-center p-4 text-muted-foreground">
                          <div className="py-8">
                            <p className="text-lg">No expenses to display</p>
                            <p className="text-sm mt-2">Add your first expense by clicking the "Add Expense" button above</p>
                          </div>
                        </td>
                      </tr>}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {selectedCategory !== 'all' && <Card className="glass-card dark:bg-black/40 dark:border-white/5 dark:shadow-lg dark:shadow-primary/5 dark:backdrop-blur-xl">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{categoryIcons[selectedCategory]}</span>
                  <CardTitle className="capitalize">{selectedCategory}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  <p className="text-sm">{categoryDescriptions[selectedCategory]}</p>
                </div>
                <Separator className="dark:bg-white/10" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Budget Tips</h3>
                  <p className="text-sm">{categoryTips[selectedCategory]}</p>
                </div>
                <Separator className="dark:bg-white/10" />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Statistics</h3>
                  {filteredExpenses.length > 0 ? <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span>Total Expenses:</span>
                        <span className="font-medium">{Object.entries(totalByCurrency).map(([currency, total]) => `${currency} ${total.toLocaleString()}`).join(', ')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Number of Entries:</span>
                        <span className="font-medium">{filteredExpenses.length}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Average Amount:</span>
                        {Object.entries(totalByCurrency).map(([currency, total]) => <span key={currency} className="font-medium">
                            {currency} {(total / filteredExpenses.filter(e => e.currency === currency).length).toFixed(2)}
                          </span>)}
                      </div>
                    </div> : <p className="text-sm text-muted-foreground">No data available</p>}
                </div>
              </CardContent>
            </Card>}
        </div>
      </div>
    </div>;
};
export default Expenses;