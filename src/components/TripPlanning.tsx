
import React, { useState } from 'react';
import { useTripContext } from '@/context/TripContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TripForm } from './TripForm';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Plus, Edit } from 'lucide-react';
import { toast } from 'sonner';

export const TripPlanning = () => {
  const { activeTrip, trips, setActiveTrip } = useTripContext();
  const [showTripForm, setShowTripForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEditTrip = () => {
    setIsEditing(true);
    setShowTripForm(true);
  };
  
  const handleTripCreated = () => {
    setShowTripForm(false);
    setIsEditing(false);
    toast.success(isEditing ? "Trip updated successfully" : "Trip created successfully");
  };
  
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Trip Planning</h2>
          <Dialog open={showTripForm} onOpenChange={setShowTripForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Trip' : 'Create New Trip'}</DialogTitle>
              </DialogHeader>
              <TripForm 
                onSuccess={handleTripCreated}
                tripId={isEditing && activeTrip ? activeTrip.id : undefined}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        {activeTrip && (
          <Card className="glass-card">
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-xl">{activeTrip.name}</CardTitle>
                  <CardDescription>{activeTrip.destination}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleEditTrip}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Dates</p>
                  <p className="font-medium">
                    {format(parseISO(activeTrip.startDate), 'MMM d')} - {format(parseISO(activeTrip.endDate), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {differenceInDays(parseISO(activeTrip.endDate), parseISO(activeTrip.startDate)) + 1} days
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">${activeTrip.budget.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {activeTrip.baseCurrency}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Companions</p>
                  <p className="font-medium">
                    {activeTrip.companions.length > 0 
                      ? activeTrip.companions.join(', ') 
                      : 'No companions added'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activeTrip.companions.length + 1} {activeTrip.companions.length === 0 ? 'traveler' : 'travelers'}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Expenses</p>
                  <p className="font-medium">{activeTrip.expenses.length} items</p>
                  <p className="text-sm text-muted-foreground">
                    ${activeTrip.expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {trips.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Your Trips</CardTitle>
              <CardDescription>Select a trip to view and manage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trips.map(trip => (
                  <Card 
                    key={trip.id}
                    className={`cursor-pointer hover:bg-gray-50/50 ${activeTrip?.id === trip.id ? 'border-macos-accent' : ''}`}
                    onClick={() => setActiveTrip(trip)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{trip.name}</CardTitle>
                      <CardDescription className="text-xs">{trip.destination}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="text-sm space-y-1">
                        <p>{format(parseISO(trip.startDate), 'MMM d')} - {format(parseISO(trip.endDate), 'MMM d')}</p>
                        <p>${trip.budget.toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TripPlanning;
