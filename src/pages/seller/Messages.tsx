import { useState, useRef, useEffect } from 'react';
import { Send, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockMessages, mockSeller } from '@/data/mockSellerData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function Messages() {
  const { toast } = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // TODO: Connect to Express.js backend
    // POST /api/seller/messages
    // Body: { content: newMessage }

    const message = {
      id: `msg-${Date.now()}`,
      senderId: mockSeller.id,
      receiverId: 'admin',
      content: newMessage,
      isRead: true,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');

    toast({
      title: 'Message Sent',
      description: 'Your message has been sent to admin.',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, typeof messages>);

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 flex flex-col">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Admin Support</CardTitle>
              <p className="text-sm text-muted-foreground">Direct chat with platform admin</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-6">
              {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {date}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {dateMessages.map((message) => {
                      const isAdmin = message.senderId === 'admin';
                      return (
                        <div
                          key={message.id}
                          className={cn(
                            'flex items-end gap-2',
                            !isAdmin && 'flex-row-reverse'
                          )}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={isAdmin ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}>
                              {isAdmin ? 'A' : mockSeller.displayName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={cn(
                              'max-w-[70%] rounded-2xl px-4 py-2',
                              isAdmin
                                ? 'bg-muted rounded-bl-sm'
                                : 'bg-primary text-primary-foreground rounded-br-sm'
                            )}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={cn(
                              'text-xs mt-1',
                              isAdmin ? 'text-muted-foreground' : 'text-primary-foreground/70'
                            )}>
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="bg-background"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="gradient-btn-primary text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Messages are only between you and the platform admin
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
