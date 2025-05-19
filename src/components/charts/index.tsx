
import React from 'react';
import { PieChart as RechartsIePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip } from 'recharts';
import { Expense } from '@/types';
import { format, eachDayOfInterval, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

type PieChartProps = {
  data: Array<{
    name: string;
    value: number;
    icon?: string;
  }>;
};

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsIePieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']}
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center" 
          formatter={(value) => {
            const item = data.find(d => d.name === value);
            return (
              <span style={{ color: '#666', fontSize: '12px' }}>
                {item?.icon && `${item.icon} `}{value}
              </span>
            );
          }}
        />
      </RechartsIePieChart>
    </ResponsiveContainer>
  );
};

type LineChartProps = {
  expenses: Expense[];
  startDate: string;
  endDate: string;
};

export const LineChart: React.FC<LineChartProps> = ({ expenses, startDate, endDate }) => {
  // Generate data for each day in the trip
  const dailyData = eachDayOfInterval({
    start: parseISO(startDate),
    end: parseISO(endDate)
  }).map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Sum expenses for this day
    const dayExpenses = expenses.filter(expense => expense.date === dateStr);
    const totalAmount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      date: dateStr,
      amount: totalAmount,
      formattedDate: format(date, 'MMM d')
    };
  });
  
  // Calculate cumulative spending
  let runningTotal = 0;
  const cumulativeData = dailyData.map(day => {
    runningTotal += day.amount;
    return {
      ...day,
      cumulative: runningTotal
    };
  });
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={cumulativeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
        <XAxis 
          dataKey="formattedDate" 
          tick={{ fontSize: 12 }} 
          interval="preserveStartEnd"
          tickMargin={5}
        />
        <YAxis 
          tickFormatter={value => `$${value}`}
          tick={{ fontSize: 12 }}
        />
        <LineTooltip 
          formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']}
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Line 
          type="monotone" 
          dataKey="amount" 
          stroke="#0088FE" 
          name="Daily Spending"
          strokeWidth={2} 
          dot={{ r: 3 }}
          activeDot={{ r: 8 }}
        />
        <Line 
          type="monotone" 
          dataKey="cumulative" 
          stroke="#FF8042" 
          name="Cumulative Spending"
          strokeWidth={2} 
          dot={{ r: 3 }}
          activeDot={{ r: 8 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

type TableProps = {
  expenses: Expense[];
};

export const Table: React.FC<TableProps> = ({ expenses }) => {
  const categoryIcons: Record<string, string> = {
    accommodation: '🏨',
    transportation: '✈️',
    food: '🍽️',
    activities: '🎭',
    shopping: '🛍️',
    emergency: '🏥',
    miscellaneous: '📦',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 text-xs text-muted-foreground">
            <th className="text-left p-2">Date</th>
            <th className="text-left p-2">Category</th>
            <th className="text-left p-2">Description</th>
            <th className="text-right p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id} className="border-b border-gray-100/30 hover:bg-gray-50/30">
              <td className="p-2 text-sm">{format(parseISO(expense.date), 'MMM d, yyyy')}</td>
              <td className="p-2 text-sm">
                <div className="flex items-center gap-1">
                  <span>{categoryIcons[expense.category]}</span>
                  <span className="capitalize">{expense.category}</span>
                </div>
              </td>
              <td className="p-2 text-sm">{expense.description}</td>
              <td className="p-2 text-sm text-right">${expense.amount.toLocaleString()}</td>
            </tr>
          ))}
          {expenses.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-4 text-muted-foreground">
                No expenses to display
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
