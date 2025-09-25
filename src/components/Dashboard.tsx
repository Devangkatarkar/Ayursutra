import React, { useMemo } from 'react';
import { TherapyProgressCard } from './TherapyProgressCard';
import { HealthChart } from './HealthChart';
import { HospitalMap } from './HospitalMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Activity, Target, Award, User, MapPin, Clock, TrendingUp } from 'lucide-react';

interface DashboardProps {
  user: any;
}



export function Dashboard({ user }: DashboardProps) {

  // For John Doe (All Therapies Showcase), show all 5 therapies 
  const therapies = useMemo(() => {
    if (user.id === 'john-doe-complete' && user.therapyPlan === 'All Therapies Showcase') {
      // Show all 5 therapies with different progress for showcase
      return [
        {
          name: 'Vamanam',
          description: 'Therapeutic vomiting for Kapha imbalances',
          progress: 100,
          totalSessions: 5,
          completedSessions: 5,
          status: 'completed' as const,
          benefits: ['Detoxification', 'Respiratory Health', 'Weight Management', 'Mental Clarity']
        },
        {
          name: 'Virechana',
          description: 'Purgation therapy for Pitta disorders',
          progress: 100,
          totalSessions: 7,
          completedSessions: 7,
          status: 'completed' as const,
          benefits: ['Liver Detox', 'Skin Health', 'Digestive Improvement', 'Inflammation Reduction']
        },
        {
          name: 'Basti',
          description: 'Medicated enema for Vata imbalances',
          progress: 50,
          totalSessions: 12,
          completedSessions: 6,
          nextSession: 'Jan 18, 2025',
          status: 'in-progress' as const,
          benefits: ['Joint Health', 'Nervous System', 'Digestive Health', 'Pain Relief']
        },
        {
          name: 'Nasya',
          description: 'Nasal administration of medicines',
          progress: 0,
          totalSessions: 3,
          completedSessions: 0,
          nextSession: 'Jan 25, 2025',
          status: 'not-started' as const,
          benefits: ['Sinus Health', 'Mental Clarity', 'Headache Relief', 'Respiratory Support']
        },
        {
          name: 'Raktamokshana',
          description: 'Bloodletting therapy for blood purification',
          progress: 0,
          totalSessions: 4,
          completedSessions: 0,
          nextSession: 'Jan 30, 2025',
          status: 'not-started' as const,
          benefits: ['Blood Purification', 'Skin Disorders', 'Circulation', 'Toxin Removal']
        }
      ];
    }

    // For other patients, show single therapy based on their plan
    return [
    {
      name: 'Vamanam',
      description: 'Therapeutic vomiting for Kapha imbalances',
      progress: 80,
      totalSessions: 5,
      completedSessions: 4,
      nextSession: 'Jan 20, 2025',
      status: 'in-progress' as const,
      benefits: ['Detoxification', 'Respiratory Health', 'Weight Management', 'Mental Clarity']
    }
    ];
  }, [user]);

  // Generate wellness score data 
  const wellnessScoreData = useMemo(() => {
    return [
    { week: 'Week 1', score: 65 },
    { week: 'Week 2', score: 68 },
    { week: 'Week 3', score: 72 },
    { week: 'Week 4', score: 75 },
    { week: 'Week 5', score: 78 },
    { week: 'Week 6', score: 82 },
    { week: 'Week 7', score: 85 }
    ];
  }, []);

  // Dosha balance data
  const doshaBalanceData = useMemo(() => {
    return [
      { dosha: 'Vata', level: 35 },
      { dosha: 'Pitta', level: 40 },
      { dosha: 'Kapha', level: 25 }
    ];
  }, []);

  const completedTherapies = therapies.filter(t => t.status === 'completed').length;
  const inProgressTherapies = therapies.filter(t => t.status === 'in-progress').length;
  const totalProgress = Math.round(therapies.reduce((acc, t) => acc + t.progress, 0) / therapies.length);
  
  // Get current wellness score from the latest data
  const currentWellnessScore = wellnessScoreData[wellnessScoreData.length - 1]?.score || 85;
  const daysActive = user.id === 'john-doe-complete' ? 45 : 18;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">Welcome back, {user.name}</h1>
        <p className="text-muted-foreground">
          Continue your Ayurvedic healing journey. Your next session is scheduled for tomorrow.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-medium">{completedTherapies}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-medium">{inProgressTherapies}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-medium">{totalProgress}%</p>
                <p className="text-xs text-muted-foreground">Overall Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-medium">{daysActive}</p>
                <p className="text-xs text-muted-foreground">Days Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Therapy Progress Section */}
        <div className="lg:col-span-2">
          <h2 className="text-xl mb-4">Panchkarma Therapy Progress</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {therapies.map((therapy, index) => (
              <TherapyProgressCard key={index} therapy={therapy} />
            ))}
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-6">
          {/* Next Appointment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Next Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Vamanam Session #5</p>
                  <p className="text-sm text-muted-foreground">Final session of the treatment</p>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>January 20, 2025 at 10:00 AM</span>
                </div>
                <Badge className="w-fit">Preparation Required</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Wellness Score</span>
                  <span className="font-medium">{currentWellnessScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Dosha Balance</span>
                  <Badge className="bg-green-100 text-green-700">Improving</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Treatment Phase</span>
                  <span className="text-sm font-medium">Purification</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <HealthChart
          title="Wellness Score Trend"
          description="Your overall wellness improvement over time"
          data={wellnessScoreData}
          dataKey="score"
          xAxisKey="week"
          type="line"
          color="hsl(var(--chart-1))"
        />
        <HealthChart
          title="Dosha Balance"
          description="Current constitution balance"
          data={doshaBalanceData}
          dataKey="level"
          xAxisKey="dosha"
          type="bar"
          color="hsl(var(--chart-2))"
        />
      </div>

      {/* Hospital Map */}
      <HospitalMap />
    </div>
  );
}