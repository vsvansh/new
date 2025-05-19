
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Trip, Expense, ExpenseCategory, BudgetSummary, CategoryTotal } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface TripContextType {
  activeTrip: Trip | null;
  setActiveTrip: (trip: Trip | null) => void;
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'expenses'>) => void;
  deleteTrip: (id: string) => void;
  updateTrip: (id: string, trip: Partial<Trip>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpensesByCategory: (category: ExpenseCategory) => Expense[];
  getBudgetSummary: () => BudgetSummary;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};

const DEMO_TRIP: Trip = {
  id: 'trip-1',
  name: 'Paris Vacation',
  destination: 'Paris, France',
  startDate: '2025-06-01',
  endDate: '2025-06-10',
  baseCurrency: 'USD',
  budget: 5000,
  companions: ['Alice', 'Bob'],
  expenses: [
    {
      id: 'expense-1',
      amount: 1200,
      category: 'accommodation',
      description: 'Hotel Booking',
      date: '2025-06-01',
      currency: 'USD',
      notes: 'Booked through Booking.com',
    },
    {
      id: 'expense-2',
      amount: 800,
      category: 'transportation',
      description: 'Round-trip Flights',
      date: '2025-06-01',
      currency: 'USD',
    },
    {
      id: 'expense-3',
      amount: 50,
      category: 'food',
      description: 'Dinner at Le Café',
      date: '2025-06-02',
      currency: 'USD',
    },
    {
      id: 'expense-4',
      amount: 120,
      category: 'activities',
      description: 'Louvre Museum Tickets',
      date: '2025-06-03',
      currency: 'USD',
    },
    {
      id: 'expense-5',
      amount: 200,
      category: 'shopping',
      description: 'Souvenirs',
      date: '2025-06-04',
      currency: 'USD',
    }
  ]
};

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([DEMO_TRIP]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(DEMO_TRIP);

  const addTrip = (newTrip: Omit<Trip, 'id' | 'expenses'>) => {
    const trip: Trip = {
      ...newTrip,
      id: `trip-${uuidv4()}`,
      expenses: [],
    };
    setTrips([...trips, trip]);
    setActiveTrip(trip);
  };

  const deleteTrip = (id: string) => {
    const updatedTrips = trips.filter(trip => trip.id !== id);
    setTrips(updatedTrips);
    if (activeTrip && activeTrip.id === id) {
      setActiveTrip(updatedTrips.length > 0 ? updatedTrips[0] : null);
    }
  };

  const updateTrip = (id: string, updatedFields: Partial<Trip>) => {
    const updatedTrips = trips.map(trip => 
      trip.id === id ? { ...trip, ...updatedFields } : trip
    );
    setTrips(updatedTrips);
    if (activeTrip && activeTrip.id === id) {
      setActiveTrip({ ...activeTrip, ...updatedFields });
    }
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    if (!activeTrip) return;
    
    const newExpense: Expense = {
      ...expense,
      id: `expense-${uuidv4()}`,
    };
    
    const updatedExpenses = [...activeTrip.expenses, newExpense];
    updateTrip(activeTrip.id, { expenses: updatedExpenses });
  };

  const updateExpense = (id: string, updatedFields: Partial<Expense>) => {
    if (!activeTrip) return;
    
    const updatedExpenses = activeTrip.expenses.map(expense => 
      expense.id === id ? { ...expense, ...updatedFields } : expense
    );
    
    updateTrip(activeTrip.id, { expenses: updatedExpenses });
  };

  const deleteExpense = (id: string) => {
    if (!activeTrip) return;
    
    const updatedExpenses = activeTrip.expenses.filter(expense => expense.id !== id);
    updateTrip(activeTrip.id, { expenses: updatedExpenses });
  };

  const getExpensesByCategory = (category: ExpenseCategory): Expense[] => {
    if (!activeTrip) return [];
    return activeTrip.expenses.filter(expense => expense.category === category);
  };

  const getBudgetSummary = (): BudgetSummary => {
    if (!activeTrip) {
      return {
        totalBudget: 0,
        totalSpent: 0,
        remaining: 0,
        percentageSpent: 0,
        categorySummary: [],
        dailyAverage: 0,
        highestCategory: {
          category: 'miscellaneous',
          amount: 0,
          percentage: 0,
        },
      };
    }

    const totalSpent = activeTrip.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = activeTrip.budget - totalSpent;
    const percentageSpent = (totalSpent / activeTrip.budget) * 100;
    
    // Calculate category totals
    const categoryMap = new Map<ExpenseCategory, number>();
    activeTrip.expenses.forEach(expense => {
      const currentAmount = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentAmount + expense.amount);
    });
    
    const categorySummary: CategoryTotal[] = Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalSpent) * 100,
    }));
    
    // Sort to find highest category
    categorySummary.sort((a, b) => b.amount - a.amount);
    const highestCategory = categorySummary[0] || {
      category: 'miscellaneous',
      amount: 0,
      percentage: 0,
    };
    
    // Calculate daily average
    const start = new Date(activeTrip.startDate);
    const end = new Date(activeTrip.endDate);
    const tripDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const dailyAverage = totalSpent / tripDays;

    return {
      totalBudget: activeTrip.budget,
      totalSpent,
      remaining,
      percentageSpent,
      categorySummary,
      dailyAverage,
      highestCategory,
    };
  };

  return (
    <TripContext.Provider value={{
      activeTrip,
      setActiveTrip,
      trips,
      addTrip,
      deleteTrip,
      updateTrip,
      addExpense,
      updateExpense,
      deleteExpense,
      getExpensesByCategory,
      getBudgetSummary,
    }}>
      {children}
    </TripContext.Provider>
  );
};
