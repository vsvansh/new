
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from './ui/button';
import { 
  Users,
  UserPlus,
  Link as LinkIcon,
  Mail,
  Send,
  Copy,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface CollaboratorProps {
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending';
  avatar?: string;
}

const collaborators: CollaboratorProps[] = [
  {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'admin',
    status: 'active',
    avatar: ''
  },
  {
    name: 'Jamie Smith',
    email: 'jamie@example.com',
    role: 'editor',
    status: 'active',
    avatar: ''
  },
  {
    name: 'Taylor Brown',
    email: 'taylor@example.com',
    role: 'viewer',
    status: 'pending',
    avatar: ''
  }
];

export const CollaborateView = () => {
  const copyShareLink = () => {
    navigator.clipboard.writeText('https://trip-budget.app/share/abc123');
    toast.success('Share link copied to clipboard!');
  };

  const sendInvite = () => {
    toast.success('Invitation sent successfully!');
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold">Collaborate</h2>
          <p className="text-muted-foreground">Share and collaborate on your trip budget with travel companions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Invite Collaborators</CardTitle>
                <CardDescription>
                  Share your budget with friends or family members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <Input 
                      placeholder="Enter email address" 
                      type="email"
                      className="w-full"
                    />
                  </div>
                  <Button onClick={sendInvite}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Invite
                  </Button>
                </div>
                
                <div className="bg-secondary p-3 rounded-lg flex gap-2 items-center">
                  <Input 
                    value="https://trip-budget.app/share/abc123" 
                    readOnly 
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={copyShareLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Choose what permissions collaborators will have:</p>
                  <div className="flex gap-3 flex-wrap">
                    <Badge variant="outline" className="bg-white/20 dark:bg-black/20">
                      Can view ✓
                    </Badge>
                    <Badge variant="outline" className="bg-white/20 dark:bg-black/20">
                      Can edit ✓
                    </Badge>
                    <Badge variant="outline" className="bg-white/20 dark:bg-black/20">
                      Can add expenses ✓
                    </Badge>
                    <Badge variant="outline" className="bg-white/20 dark:bg-black/20">
                      Can delete expenses ✓
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Collaborators</CardTitle>
                <CardDescription>
                  People with access to this trip budget
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {collaborators.map((collaborator) => (
                    <div 
                      key={collaborator.email} 
                      className="flex items-center justify-between p-4 hover:bg-secondary/40 dark:hover:bg-secondary/20"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={collaborator.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {collaborator.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{collaborator.name}</p>
                          <p className="text-sm text-muted-foreground">{collaborator.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={
                          collaborator.status === 'active' ? 
                            'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/30' : 
                            'bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/30'
                        }>
                          {collaborator.status === 'active' ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {collaborator.status.charAt(0).toUpperCase() + collaborator.status.slice(1)}
                        </Badge>
                        <Badge variant="outline">
                          {collaborator.role.charAt(0).toUpperCase() + collaborator.role.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Collaboration Features</CardTitle>
                <CardDescription>
                  Work together on your trip budget
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Shared Expenses</h3>
                    <p className="text-sm text-muted-foreground">Track who paid for what</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-full">
                    <UserPlus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Multiple Collaborators</h3>
                    <p className="text-sm text-muted-foreground">Add friends and family</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-full">
                    <LinkIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Shareable Link</h3>
                    <p className="text-sm text-muted-foreground">Quick access for anyone</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Stay updated on changes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
                <CardDescription>
                  Recent changes to your trip budget
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">AJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm"><span className="font-medium">Alex Johnson</span> added an expense</p>
                      <p className="text-xs text-muted-foreground">Hotel booking - $120.00</p>
                      <p className="text-xs text-muted-foreground">Today at 10:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm"><span className="font-medium">Jamie Smith</span> updated the budget</p>
                      <p className="text-xs text-muted-foreground">Changed from $1,000 to $1,200</p>
                      <p className="text-xs text-muted-foreground">Yesterday at 4:15 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">AJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm"><span className="font-medium">Alex Johnson</span> added a trip</p>
                      <p className="text-xs text-muted-foreground">Created "Summer Vacation 2025"</p>
                      <p className="text-xs text-muted-foreground">Yesterday at 2:45 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">TB</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm"><span className="font-medium">Taylor Brown</span> was invited</p>
                      <p className="text-xs text-muted-foreground">Invitation sent to taylor@example.com</p>
                      <p className="text-xs text-muted-foreground">May 16, 2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
