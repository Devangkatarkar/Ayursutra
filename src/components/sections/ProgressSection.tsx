import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { HealthChart } from '../HealthChart';
import { Calendar, TrendingUp, Target, Award, Activity } from 'lucide-react';

export function ProgressSection() {
  const [selectedTherapy, setSelectedTherapy] = useState('overall');

  // Mock data for different therapy progress
  const therapyProgress = {
    overall: {
      wellnessScoreData: [
        { month: 'Nov', score: 60 },
        { month: 'Dec', score: 68 },
        { month: 'Jan', score: 85 }
      ],
      doshaData: [
        { week: 'Week 1', vata: 60, pitta: 55, kapha: 40 },
        { week: 'Week 2', vata: 55, pitta: 50, kapha: 38 },
        { week: 'Week 3', vata: 50, pitta: 45, kapha: 35 },
        { week: 'Week 4', vata: 45, pitta: 40, kapha: 32 }
      ],
      symptoms: [
        { symptom: 'Digestive Issues', initial: 8, current: 3, improvement: 62 },
        { symptom: 'Sleep Quality', initial: 4, current: 8, improvement: 100 },
        { symptom: 'Energy Levels', initial: 5, current: 8, improvement: 60 },
        { symptom: 'Stress Levels', initial: 9, current: 4, improvement: 56 },
        { symptom: 'Joint Pain', initial: 7, current: 2, improvement: 71 }
      ]
    },
    vamanam: {
      sessions: [
        { session: 'Prep 1', toxins: 20, energy: 6 },
        { session: 'Prep 2', toxins: 15, energy: 7 },
        { session: 'Session 1', toxins: 10, energy: 8 },
        { session: 'Session 2', toxins: 5, energy: 9 }
      ]
    }
  };

  const milestones = [
    {
      date: '2024-12-01',
      title: 'Treatment Started',
      description: 'Initial consultation and Panchkarma planning',
      status: 'completed'
    },
    {
      date: '2024-12-15',
      title: 'Virechana Completed',
      description: 'Successfully completed 7 sessions of Virechana therapy',
      status: 'completed'
    },
    {
      date: '2025-01-10',
      title: 'Vamanam in Progress',
      description: '4 out of 5 sessions completed',
      status: 'in-progress'
    },
    {
      date: '2025-01-25',
      title: 'Basti Therapy',
      description: 'Scheduled to begin 12-session Basti treatment',
      status: 'upcoming'
    }
  ];

  const achievements = [
    { title: 'First Week Completed', icon: Calendar, earned: true },
    { title: '50% Treatment Done', icon: Target, earned: true },
    { title: 'Consistent Progress', icon: TrendingUp, earned: true },
    { title: 'Health Milestone', icon: Activity, earned: false },
    { title: 'Treatment Champion', icon: Award, earned: false }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl text-gray-900 mb-2">Progress Tracking</h1>
        <p className="text-muted-foreground">
          Monitor your healing journey and track improvements across all therapies
        </p>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-medium text-green-600">85%</p>
              <p className="text-sm text-muted-foreground">Overall Wellness</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-medium text-blue-600">67%</p>
              <p className="text-sm text-muted-foreground">Treatment Complete</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-medium text-orange-600">18</p>
              <p className="text-sm text-muted-foreground">Sessions Done</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-medium text-purple-600">3</p>
              <p className="text-sm text-muted-foreground">Milestones</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Charts Section */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="wellness" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="wellness">Wellness Score</TabsTrigger>
              <TabsTrigger value="dosha">Dosha Balance</TabsTrigger>
              <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="wellness" className="mt-4">
              <HealthChart
                title="Wellness Score Over Time"
                description="Your overall health improvement journey"
                data={therapyProgress.overall.wellnessScoreData}
                dataKey="score"
                xAxisKey="month"
                type="line"
                color="hsl(var(--chart-1))"
              />
            </TabsContent>
            
            <TabsContent value="dosha" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dosha Balance Progress</CardTitle>
                  <CardDescription>Tracking constitutional balance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Vata', 'Pitta', 'Kapha'].map((dosha, index) => (
                      <div key={dosha} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{dosha}</span>
                          <span className="text-sm text-muted-foreground">
                            {dosha === 'Vata' ? '45%' : dosha === 'Pitta' ? '40%' : '32%'}
                          </span>
                        </div>
                        <Progress 
                          value={dosha === 'Vata' ? 45 : dosha === 'Pitta' ? 40 : 32}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="symptoms" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Symptom Improvement</CardTitle>
                  <CardDescription>Before and after treatment comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {therapyProgress.overall.symptoms.map((symptom, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{symptom.symptom}</span>
                          <Badge 
                            className="bg-green-100 text-green-700"
                          >
                            {symptom.improvement}% better
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Initial</span>
                            <span>{symptom.initial}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Current</span>
                            <span>{symptom.current}/10</span>
                          </div>
                        </div>
                        <Progress 
                          value={symptom.improvement}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Achievements */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span>Achievements</span>
              </CardTitle>
              <CardDescription>Milestones in your healing journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div 
                      key={index} 
                      className={`flex items-center space-x-3 p-2 rounded-lg ${
                        achievement.earned 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <Icon 
                        className={`h-5 w-5 ${
                          achievement.earned ? 'text-green-600' : 'text-gray-400'
                        }`} 
                      />
                      <span 
                        className={`text-sm ${
                          achievement.earned ? 'text-green-800' : 'text-gray-500'
                        }`}
                      >
                        {achievement.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Treatment Timeline</CardTitle>
          <CardDescription>Key milestones in your Panchkarma journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div 
                  className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                    milestone.status === 'completed' 
                      ? 'bg-green-500' 
                      : milestone.status === 'in-progress' 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{milestone.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(milestone.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {milestone.description}
                  </p>
                  <Badge 
                    className={`mt-2 text-xs ${
                      milestone.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : milestone.status === 'in-progress' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {milestone.status === 'completed' ? 'Completed' : 
                     milestone.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}