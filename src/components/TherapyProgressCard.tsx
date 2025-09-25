import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

interface TherapyProgressCardProps {
  therapy: {
    name: string;
    description: string;
    progress: number;
    totalSessions: number;
    completedSessions: number;
    nextSession?: string;
    status: 'not-started' | 'in-progress' | 'completed';
    benefits: string[];
  };
}

export function TherapyProgressCard({ therapy }: TherapyProgressCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress > 60) return 'bg-blue-500';
    if (progress > 30) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{therapy.name}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {therapy.description}
            </CardDescription>
          </div>
          {getStatusBadge(therapy.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">{therapy.progress}%</span>
          </div>
          <Progress 
            value={therapy.progress} 
            className="h-2"
          />
        </div>

        {/* Session Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>{therapy.completedSessions}/{therapy.totalSessions} Sessions</span>
          </div>
          
          {therapy.nextSession && (
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{therapy.nextSession}</span>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Key Benefits:</p>
          <div className="flex flex-wrap gap-1">
            {therapy.benefits.slice(0, 3).map((benefit, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-green-50 text-green-700"
              >
                {benefit}
              </Badge>
            ))}
            {therapy.benefits.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{therapy.benefits.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}