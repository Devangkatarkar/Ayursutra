import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from 'sonner@2.0.3';
import { getUserNotifications } from '../utils/supabase/client';
import { 
  Bell, 
  BellOff, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  User, 
  Activity,
  Heart,
  Brain,
  Droplets,
  Wind,
  Stethoscope,
  MessageCircle
} from 'lucide-react';

interface NotificationCenterProps {
  user: any;
}

export function NotificationCenter({ user }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    // Only fetch notifications for real users (those with UUID format or from Supabase)
    // Skip for mock/demo users to avoid fetch errors
    if (user?.id && isRealUser(user.id)) {
      loadNotifications();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  // Helper function to check if user is a real user (not mock)
  const isRealUser = (userId: string) => {
    // Mock users have simple IDs like 'john-doe-complete', 'd1', 'p1', etc.
    // Real Supabase users have UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(userId);
  };

  const loadNotifications = async () => {
    if (!user?.id || !isRealUser(user.id)) return;
    
    setLoading(true);
    try {
      const result = await getUserNotifications(user.id);
      if (result.error) {
        console.error('Failed to load notifications:', result.error);
      } else {
        setNotifications(result.notifications || []);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'therapy_request':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'therapy_accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'patient_feedback':
        return <MessageCircle className="h-4 w-4 text-orange-500" />;
      case 'prescription_updated':
        return <Stethoscope className="h-4 w-4 text-purple-500" />;
      case 'appointment':
        return <Clock className="h-4 w-4 text-indigo-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') {
      return 'border-l-4 border-red-500 bg-red-50';
    } else if (priority === 'medium') {
      return 'border-l-4 border-yellow-500 bg-yellow-50';
    } else {
      return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const markAsRead = async (notificationId: string) => {
    // Update local state immediately for better UX
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    
    // TODO: Implement API call to mark as read
    // For now, we'll just update the local state
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    // TODO: Implement API call to mark all as read
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>
            <CardDescription>
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <BellOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !notification.read ? getNotificationColor(notification.type, notification.priority) : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                              {notification.message}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          
                          {/* Notification details based on type */}
                          {notification.data && (
                            <div className="mt-2">
                              {notification.type === 'therapy_request' && (
                                <div className="text-xs text-gray-600">
                                  <p>Therapy: {notification.data.therapyType}</p>
                                  <p>Priority: {notification.data.urgency}</p>
                                </div>
                              )}
                              
                              {notification.type === 'therapy_accepted' && (
                                <div className="text-xs text-gray-600">
                                  <p>Date: {new Date(notification.data.scheduledDate).toLocaleDateString()}</p>
                                  <p>Time: {notification.data.scheduledTime}</p>
                                </div>
                              )}
                              
                              {notification.type === 'patient_feedback' && (
                                <div className="text-xs text-gray-600">
                                  {notification.data.hasComplications && (
                                    <Badge variant="outline" className="bg-red-100 text-red-800 text-xs mr-2">
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      Complications
                                    </Badge>
                                  )}
                                  <p>Pain Level: {notification.data.painLevel}/10</p>
                                  {notification.data.symptoms && notification.data.symptoms.length > 0 && (
                                    <p>Symptoms: {notification.data.symptoms.join(', ')}</p>
                                  )}
                                </div>
                              )}
                              
                              {notification.type === 'prescription_updated' && (
                                <div className="text-xs text-gray-600">
                                  <p>Doctor: {notification.data.doctorName}</p>
                                  <p>{notification.data.medicationCount} medications prescribed</p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <p className="text-xs text-gray-500 mt-2">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}