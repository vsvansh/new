
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from './ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Settings, 
  User, 
  Globe, 
  Bell, 
  Shield, 
  RefreshCcw,
  Trash,
  AlertCircle,
  Save
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner';

export const SettingsView = () => {
  const handleResetData = () => {
    toast.success("Data reset successfully");
  };

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Customize your vacation budget tracker</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4 grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> General
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="currency" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> Currency
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Advanced
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic application settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-full max-w-sm">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger className="w-full max-w-sm">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-save">Auto-save data</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save changes as you make them
                    </p>
                  </div>
                  <Switch id="auto-save" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">Enable analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Send anonymous usage data to help us improve
                    </p>
                  </div>
                  <Switch id="analytics" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input id="display-name" placeholder="Enter your display name" defaultValue="Travel Buddy" className="max-w-lg" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" defaultValue="user@example.com" className="max-w-lg" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" /> Save Profile
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="currency">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Currency Settings</CardTitle>
                <CardDescription>Configure currency preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-currency">Default Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger className="w-full max-w-sm">
                      <SelectValue placeholder="Select default currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                      <SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
                      <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="aud">AUD - Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Currency Display Format</Label>
                  <RadioGroup defaultValue="symbol-before">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="symbol-before" id="symbol-before" />
                      <Label htmlFor="symbol-before">Symbol before amount ($100.00)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="symbol-after" id="symbol-after" />
                      <Label htmlFor="symbol-after">Symbol after amount (100.00$)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-convert">Automatic currency conversion</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically convert foreign currencies to your default currency
                    </p>
                  </div>
                  <Switch id="auto-convert" defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" /> Save Currency Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure alerts and reminders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Budget Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when nearing budget limits
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Recurring Expense Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminded about upcoming recurring expenses
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Spending Summary</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily summary of your expenses
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Trip Start/End Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notifications about trip start and end dates
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" /> Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Manage data and application settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Management</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Cloud Backup</Label>
                      <p className="text-sm text-muted-foreground">
                        Back up your data to the cloud
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Export Data</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">Export as CSV</Button>
                      <Button variant="outline" size="sm">Export as JSON</Button>
                      <Button variant="outline" size="sm">Export as PDF</Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-border space-y-4">
                  <h3 className="text-lg font-medium">Danger Zone</h3>
                  
                  <div className="flex items-center justify-between p-4 border border-red-300 dark:border-red-800 rounded-md bg-red-50 dark:bg-red-950/30">
                    <div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <h4 className="font-medium">Reset All Data</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Delete all trips and expenses. This action cannot be undone.
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleResetData}>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Reset Data
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-red-300 dark:border-red-800 rounded-md bg-red-50 dark:bg-red-950/30">
                    <div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <h4 className="font-medium">Delete Account</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Delete your account and all associated data.
                      </p>
                    </div>
                    <Button variant="destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
