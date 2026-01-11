import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/dashboard';

interface WelcomeCardProps {
  user: User;
}

export function WelcomeCard({ user }: WelcomeCardProps) {
  return (
    <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary-foreground/20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">Welcome, {user.name}!</h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-primary-foreground/80">
              <span>User ID: {user.userId}</span>
              <span>•</span>
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
                {user.status === 'active' ? 'Active' : user.status}
              </Badge>
            </div>
            <p className="text-sm text-primary-foreground/70">Member Since: {user.memberSince}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}