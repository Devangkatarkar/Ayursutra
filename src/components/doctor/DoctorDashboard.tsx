import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Users, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  MessageCircle,
  Activity,
  Bell,
  Eye
} from 'lucide-react';

interface DoctorDashboardProps {
  doctor: {
    id: string;
    name: string;
    specialization: string;
    experience: string;
  };
}

export function DoctorDashboard({ doctor }: DoctorDashboardProps) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'feedback',
      message: 'New health feedback from Arjun Sharma',
      time: '5 minutes ago',
      priority: 'high'
    },
    {
      id: 2,
      type: 'appointment',
      message: 'Upcoming consultation with Priya Mehta in 30 minutes',
      time: '25 minutes ago',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'report',
      message: 'Weekly progress report ready for review',
      time: '1 hour ago',
      priority: 'low'
    }
  ]);

  const [patientStats] = useState({
    totalPatients: 45,
    activeTherapies: 32,
    todayAppointments: 8,
    pendingReviews: 12,
    emergencyAlerts: 2
  });

  const [recentPatients] = useState([
    {
      id: 'p1',
      name: 'Arjun Sharma',
      therapy: 'Panchkarma Complete',
      lastVisit: '2024-01-18',
      status: 'active',
      progress: 78,
      alerts: 1
    },
    {
      id: 'p2',
      name: 'Priya Mehta',
      therapy: 'Virechana Therapy',
      lastVisit: '2024-01-17',
      status: 'active',
      progress: 65,
      alerts: 0
    },
    {
      id: 'p3',
      name: 'Ravi Kumar',
      therapy: 'Nasya Treatment',
      lastVisit: '2024-01-16',
      status: 'completed',
      progress: 100,
      alerts: 0
    },
    {
      id: 'p4',
      name: 'Sneha Patel',
      therapy: 'Basti Therapy',
      lastVisit: '2024-01-15',
      status: 'active',
      progress: 45,
      alerts: 2
    }
  ]);

  const [todaySchedule] = useState([
    {
      id: 1,
      time: '10:00 AM',
      patient: 'Arjun Sharma',
      type: 'Follow-up Consultation',
      status: 'confirmed'
    },
    {
      id: 2,
      time: '11:30 AM',
      patient: 'Priya Mehta',
      type: 'Therapy Review',
      status: 'confirmed'
    },
    {
      id: 3,
      time: '2:00 PM',
      patient: 'Rajesh Singh',
      type: 'Initial Consultation',
      status: 'pending'
    },
    {
      id: 4,
      time: '3:30 PM',
      patient: 'Meera Joshi',
      type: 'Progress Assessment',
      status: 'confirmed'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">Welcome back, {doctor.name}</h1>
        <p className="text-muted-foreground">{doctor.specialization} • {doctor.experience}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-xl">{patientStats.totalPatients}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Therapies</p>
                <p className="text-xl">{patientStats.activeTherapies}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
                <p className="text-xl">{patientStats.todayAppointments}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-xl">{patientStats.pendingReviews}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Priority Alerts</p>
                <p className="text-xl">{patientStats.emergencyAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Patients</span>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </CardTitle>
              <CardDescription>Monitor patient progress and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-green-100 text-green-700">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{patient.name}</h4>
                          {patient.alerts > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {patient.alerts} alert{patient.alerts > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{patient.therapy}</p>
                        <p className="text-xs text-muted-foreground">Last visit: {patient.lastVisit}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          Progress: {patient.progress}%
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Today's Schedule</span>
              </CardTitle>
              <CardDescription>Upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaySchedule.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{appointment.time}</p>
                      <p className="text-sm text-muted-foreground">{appointment.patient}</p>
                      <p className="text-xs text-muted-foreground">{appointment.type}</p>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Full Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Recent Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm">{notification.message}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Notifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}