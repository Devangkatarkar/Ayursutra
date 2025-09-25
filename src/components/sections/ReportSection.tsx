import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { HealthChart } from '../HealthChart';
import { Download, FileText, Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export function ReportSection() {
  // Mock health report data
  const vitalStats = [
    { parameter: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal', trend: 'stable' },
    { parameter: 'Pulse Rate', value: '72', unit: 'bpm', status: 'normal', trend: 'improving' },
    { parameter: 'Body Weight', value: '68.5', unit: 'kg', status: 'normal', trend: 'decreasing' },
    { parameter: 'BMI', value: '22.1', unit: 'kg/m²', status: 'normal', trend: 'stable' },
  ];

  const labResults = [
    { test: 'Hemoglobin', value: '13.8', range: '12.0-16.0', unit: 'g/dL', status: 'normal' },
    { test: 'Blood Sugar (Fasting)', value: '95', range: '70-100', unit: 'mg/dL', status: 'normal' },
    { test: 'Cholesterol (Total)', value: '185', range: '<200', unit: 'mg/dL', status: 'normal' },
    { test: 'Liver Function (ALT)', value: '28', range: '7-35', unit: 'U/L', status: 'normal' },
  ];

  const constitutionalAssessment = {
    primary: 'Pitta',
    secondary: 'Vata',
    imbalances: ['Excess Pitta in digestive system', 'Mild Vata aggravation'],
    recommendations: [
      'Continue cooling and calming therapies',
      'Maintain regular meal times',
      'Practice stress reduction techniques',
      'Follow Pitta-pacifying diet'
    ]
  };

  const progressMetrics = [
    { week: 'Week 1', wellness: 65, symptoms: 7 },
    { week: 'Week 2', wellness: 68, symptoms: 6 },
    { week: 'Week 3', wellness: 72, symptoms: 5 },
    { week: 'Week 4', wellness: 75, symptoms: 4 },
    { week: 'Week 5', wellness: 78, symptoms: 3 },
    { week: 'Week 6', wellness: 82, symptoms: 3 },
    { week: 'Week 7', wellness: 85, symptoms: 2 }
  ];

  const reports = [
    {
      id: '1',
      title: 'Comprehensive Health Assessment',
      date: '2025-01-15',
      type: 'Full Report',
      status: 'Ready',
      description: 'Complete analysis including lab results, constitutional assessment, and progress tracking'
    },
    {
      id: '2',
      title: 'Virechana Treatment Report',
      date: '2025-01-08',
      type: 'Treatment Report',
      status: 'Ready',
      description: 'Detailed report on Virechana therapy outcomes and post-treatment analysis'
    },
    {
      id: '3',
      title: 'Monthly Progress Summary',
      date: '2025-01-01',
      type: 'Progress Report',
      status: 'Ready',
      description: 'Monthly summary of wellness scores, symptom improvements, and treatment milestones'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'attention':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'stable':
        return <div className="h-3 w-3 bg-blue-500 rounded-full" />;
      default:
        return <div className="h-3 w-3 bg-yellow-500 rounded-full" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl text-gray-900 mb-2">Health Reports</h1>
        <p className="text-muted-foreground">
          Comprehensive health analysis and progress tracking reports
        </p>
      </div>

      {/* Available Reports */}
      <div className="mb-8">
        <h2 className="text-lg mb-4">Available Reports</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{report.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {report.description}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700">{report.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(report.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Latest Comprehensive Report */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">Latest Comprehensive Report</h2>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              Download PDF
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="h-4 w-4 mr-1" />
              Share with Doctor
            </Button>
          </div>
        </div>

        {/* Vital Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Vital Statistics</CardTitle>
            <CardDescription>Current health parameters and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {vitalStats.map((vital, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(vital.status)}
                    <div>
                      <p className="font-medium">{vital.parameter}</p>
                      <p className="text-sm text-muted-foreground">
                        {vital.value} {vital.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(vital.trend)}
                    <Badge 
                      variant="outline" 
                      className={vital.status === 'normal' ? 'bg-green-50 text-green-700' : ''}
                    >
                      {vital.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Laboratory Results */}
        <Card>
          <CardHeader>
            <CardTitle>Laboratory Results</CardTitle>
            <CardDescription>Latest blood work and diagnostic tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Test</th>
                    <th className="text-left py-2">Result</th>
                    <th className="text-left py-2">Normal Range</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {labResults.map((result, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 font-medium">{result.test}</td>
                      <td className="py-2">{result.value} {result.unit}</td>
                      <td className="py-2 text-muted-foreground">{result.range} {result.unit}</td>
                      <td className="py-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(result.status)}
                          <Badge 
                            variant="outline" 
                            className={result.status === 'normal' ? 'bg-green-50 text-green-700' : ''}
                          >
                            {result.status}
                          </Badge>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Constitutional Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Ayurvedic Constitutional Assessment</CardTitle>
            <CardDescription>Dosha analysis and personalized recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Current Constitution</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Primary Dosha</span>
                    <Badge className="bg-orange-100 text-orange-700">{constitutionalAssessment.primary}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Secondary Dosha</span>
                    <Badge className="bg-blue-100 text-blue-700">{constitutionalAssessment.secondary}</Badge>
                  </div>
                </div>
                
                <h4 className="font-medium mt-4 mb-3">Current Imbalances</h4>
                <ul className="space-y-2">
                  {constitutionalAssessment.imbalances.map((imbalance, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{imbalance}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {constitutionalAssessment.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <HealthChart
            title="Wellness Score Progression"
            description="Overall wellness improvement over treatment period"
            data={progressMetrics}
            dataKey="wellness"
            xAxisKey="week"
            type="line"
            color="hsl(var(--chart-1))"
          />
          <HealthChart
            title="Symptom Severity Reduction"
            description="Decrease in symptom intensity over time"
            data={progressMetrics}
            dataKey="symptoms"
            xAxisKey="week"
            type="line"
            color="hsl(var(--chart-2))"
          />
        </div>

        {/* Report Footer */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Report generated on {new Date().toLocaleDateString()} | Ayursutra Health Management System</p>
              <p className="mt-1">For medical consultation, please contact your assigned Ayurvedic physician</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}