import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MandalaLogo } from './MandalaLogo';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Lock, User, Phone, Stethoscope, Users } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LoginFormProps {
  onLogin: (userData: any) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [activeTab, setActiveTab] = useState('patient');
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    specialization: '',
    licenseNumber: ''
  });

  // Mock user databases  
  const mockPatients = [
    {
      id: 'john-doe-complete',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 99999 00000',
      therapyPlan: 'All Therapies Showcase',
      joinDate: '2024-01-01',
      role: 'patient'
    },
    {
      id: 'p1',
      name: 'Arjun Sharma',
      email: 'arjun.sharma@email.com',
      phone: '+91 98765 43210',
      therapyPlan: 'Panchkarma Complete',
      joinDate: '2024-01-15',
      role: 'patient'
    },
    {
      id: 'p2',
      name: 'Priya Mehta',
      email: 'priya.mehta@email.com',
      phone: '+91 87654 32109',
      therapyPlan: 'Virechana Therapy',
      joinDate: '2024-02-20',
      role: 'patient'
    },
    {
      id: 'p3',
      name: 'Ravi Kumar',
      email: 'ravi.kumar@email.com',
      phone: '+91 76543 21098',
      therapyPlan: 'Nasya Treatment',
      joinDate: '2024-03-10',
      role: 'patient'
    },
    {
      id: 'p4',
      name: 'Kavya Reddy',
      email: 'kavya.reddy@email.com',
      phone: '+91 65432 10987',
      therapyPlan: 'Vamanam Therapy',
      joinDate: '2024-02-05',
      role: 'patient'
    },
    {
      id: 'p5',
      name: 'Vikram Singh',
      email: 'vikram.singh@email.com',
      phone: '+91 54321 09876',
      therapyPlan: 'Basti Treatment',
      joinDate: '2024-03-25',
      role: 'patient'
    },
    {
      id: 'p6',
      name: 'Ananya Gupta',
      email: 'ananya.gupta@email.com',
      phone: '+91 43210 98765',
      therapyPlan: 'Raktamokshana',
      joinDate: '2024-01-30',
      role: 'patient'
    }
  ];

  const mockDoctors = [
    {
      id: 'd1',
      name: 'Dr. Anjali Patel',
      email: 'dr.anjali@prankarma.com',
      phone: '+91 99999 11111',
      specialization: 'Panchkarma Specialist',
      licenseNumber: 'AYU12345',
      experience: '15 years',
      role: 'doctor'
    },
    {
      id: 'd2',
      name: 'Dr. Suresh Gupta',
      email: 'dr.suresh@prankarma.com',
      phone: '+91 88888 22222',
      specialization: 'Ayurvedic Physician',
      licenseNumber: 'AYU67890',
      experience: '12 years',
      role: 'doctor'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        // Try Supabase authentication first
        try {
          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3066d3c4/auth/signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            }),
          });

          if (response.ok) {
            const data = await response.json();
            // Store session data
            if (data.session) {
              localStorage.setItem('supabase_session', JSON.stringify(data.session));
            }
            onLogin(data.user);
            return;
          }
        } catch (supabaseError) {
          console.warn('Supabase authentication unavailable, falling back to demo mode');
        }

        // Fallback: Check mock users for demo mode
        const allMockUsers = [...mockPatients, ...mockDoctors];
        const mockUser = allMockUsers.find(user => 
          user.email === formData.email && activeTab === user.role
        );

        if (mockUser) {
          alert('Connected in Demo Mode - using mock data');
          onLogin({ ...mockUser, demoMode: true });
          return;
        }

        alert('Authentication service unavailable. Please try demo users or try again later.');
      } else {
        // Try Supabase signup first
        try {
          const userData = {
            name: formData.name,
            phone: formData.phone,
            role: activeTab,
            ...(activeTab === 'patient' ? {
              therapyPlan: 'New Patient Assessment',
              joinDate: new Date().toISOString().split('T')[0]
            } : {
              specialization: formData.specialization,
              licenseNumber: formData.licenseNumber,
              experience: 'New Doctor'
            })
          };

          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3066d3c4/auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              userData
            }),
          });

          if (response.ok) {
            const data = await response.json();
            onLogin(data.user);
            return;
          }
        } catch (supabaseError) {
          console.warn('Supabase signup unavailable, falling back to demo mode');
        }

        // Fallback: Create demo user
        const newUser = {
          id: `demo-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: activeTab,
          demoMode: true,
          ...(activeTab === 'patient' ? {
            therapyPlan: 'New Patient Assessment',
            joinDate: new Date().toISOString().split('T')[0]
          } : {
            specialization: formData.specialization,
            licenseNumber: formData.licenseNumber,
            experience: 'New Doctor'
          })
        };

        alert('Service unavailable - creating demo account with limited functionality');
        onLogin(newUser);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed. Please try the demo users below or try again later.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuickLogin = (user: any) => {
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-amber-50 to-orange-50 p-4">
      <div className="w-full max-w-6xl flex bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1730977806307-3351cb73a9b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxheXVydmVkYSUyMG1lZGl0YXRpb24lMjB0aGVyYXB5JTIwd2VsbG5lc3N8ZW58MXx8fHwxNzU3ODc0ODkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Ayurveda therapy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
            <div className="p-8 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <MandalaLogo size={40} />
                <h2 className="text-3xl">Prankarma</h2>
              </div>
              <p className="text-lg opacity-90">Comprehensive Ayurvedic therapy management platform</p>
              <p className="text-sm opacity-75 mt-2">For patients and healthcare providers</p>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <MandalaLogo size={40} />
                <h1 className="text-3xl text-green-800">Prankarma</h1>
              </div>
              <p className="text-muted-foreground">{t('login.subtitle')}</p>
              
              {/* Language Selector */}
              <div className="mt-4 flex justify-center">
                <LanguageSelector variant="compact" />
              </div>
            </div>

            <Card>
              <CardHeader className="text-center">
                <CardTitle>{isLogin ? 'Welcome Back' : 'Create Account'}</CardTitle>
                <CardDescription>
                  {isLogin ? 'Sign in to continue your journey' : 'Join the Prankarma community'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="patient" className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Patient</span>
                    </TabsTrigger>
                    <TabsTrigger value="doctor" className="flex items-center space-x-2">
                      <Stethoscope className="h-4 w-4" />
                      <span>Doctor</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="patient">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {!isLogin && (
                        <>
                          <div>
                            <Label htmlFor="name" className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>Full Name</span>
                            </Label>
                            <Input
                              id="name"
                              type="text"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Enter your full name"
                              required={!isLogin}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone" className="flex items-center space-x-2">
                              <Phone className="h-4 w-4" />
                              <span>Phone Number</span>
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="+91 98765 43210"
                            />
                          </div>
                        </>
                      )}
                      <div>
                        <Label htmlFor="email" className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="patient@example.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="password" className="flex items-center space-x-2">
                          <Lock className="h-4 w-4" />
                          <span>Password</span>
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                        {isLogin ? 'Sign In as Patient' : 'Create Patient Account'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="doctor">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {!isLogin && (
                        <>
                          <div>
                            <Label htmlFor="doctor-name" className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>Full Name</span>
                            </Label>
                            <Input
                              id="doctor-name"
                              type="text"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Dr. Your Name"
                              required={!isLogin}
                            />
                          </div>
                          <div>
                            <Label htmlFor="specialization">Specialization</Label>
                            <Input
                              id="specialization"
                              type="text"
                              value={formData.specialization}
                              onChange={(e) => handleInputChange('specialization', e.target.value)}
                              placeholder="e.g., Panchkarma Specialist"
                            />
                          </div>
                          <div>
                            <Label htmlFor="license">License Number</Label>
                            <Input
                              id="license"
                              type="text"
                              value={formData.licenseNumber}
                              onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                              placeholder="AYU12345"
                            />
                          </div>
                        </>
                      )}
                      <div>
                        <Label htmlFor="doctor-email" className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </Label>
                        <Input
                          id="doctor-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="doctor@prankarma.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="doctor-password" className="flex items-center space-x-2">
                          <Lock className="h-4 w-4" />
                          <span>Password</span>
                        </Label>
                        <Input
                          id="doctor-password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        {isLogin ? 'Sign In as Doctor' : 'Create Doctor Account'}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-green-600"
                  >
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                  </Button>
                </div>

                {/* Quick Login Demo Users */}
                {isLogin && (
                  <div className="mt-6 pt-6 border-t">
                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground">Quick Demo Login</p>
                    </div>
                    
                    {activeTab === 'patient' ? (
                      <div className="space-y-2">
                        {mockPatients.map((patient) => {
                          const therapyIcons = {
                            'All Therapies Showcase': '🌟',
                            'Panchkarma Complete': '🌟',
                            'Virechana Therapy': '💧',
                            'Nasya Treatment': '🌬️',
                            'Vamanam Therapy': '💨',
                            'Basti Treatment': '⚡',
                            'Raktamokshana': '❤️'
                          };
                          
                          return (
                            <Button
                              key={patient.id}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickLogin(patient)}
                              className="w-full text-left justify-start hover:bg-gradient-to-r hover:from-purple-50 hover:to-green-50"
                            >
                              <span className="mr-2">{therapyIcons[patient.therapyPlan] || '🧘'}</span>
                              <span className="text-xs">
                                <span className="font-medium">{patient.name}</span>
                                <br />
                                <span className="text-muted-foreground">{patient.therapyPlan}</span>
                              </span>
                            </Button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {mockDoctors.map((doctor) => (
                          <Button
                            key={doctor.id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickLogin(doctor)}
                            className="w-full text-left justify-start hover:bg-blue-50"
                          >
                            <Stethoscope className="h-4 w-4 mr-2" />
                            <span className="text-xs">
                              <span className="font-medium">{doctor.name}</span>
                              <br />
                              <span className="text-muted-foreground">{doctor.specialization}</span>
                            </span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}