import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Calendar, Clock, Pill, Download, Eye } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function PrescriptionSection() {
  const prescriptions = [
    {
      id: '1',
      date: '2025-01-15',
      doctor: 'Dr. Raghav Sharma',
      therapyPhase: 'Vamanam Preparation',
      medicines: [
        {
          name: 'Triphala Churna',
          dosage: '1 tsp twice daily',
          duration: '7 days',
          timing: 'Before meals',
          instructions: 'Mix with warm water'
        },
        {
          name: 'Ghrita Preparation',
          dosage: '2 tbsp daily',
          duration: '5 days',
          timing: 'Empty stomach',
          instructions: 'On an empty stomach, 1 hour before breakfast'
        },
        {
          name: 'Herbal Tea Blend',
          dosage: '1 cup twice daily',
          duration: '10 days',
          timing: 'Morning & Evening',
          instructions: 'Steep for 5 minutes before drinking'
        }
      ],
      dietaryGuidelines: [
        'Avoid heavy, oily, and spicy foods',
        'Include light, warm, and easily digestible meals',
        'Drink plenty of warm water throughout the day',
        'Avoid cold beverages and ice cream',
        'Include fresh fruits and vegetables'
      ],
      lifestyleInstructions: [
        'Maintain regular sleep schedule (10 PM - 6 AM)',
        'Practice light yoga and breathing exercises',
        'Avoid strenuous physical activities',
        'Take warm oil baths as recommended',
        'Practice meditation for 15 minutes daily'
      ]
    },
    {
      id: '2',
      date: '2025-01-08',
      doctor: 'Dr. Priya Nair',
      therapyPhase: 'Virechana Post-Treatment',
      medicines: [
        {
          name: 'Saraswatarishta',
          dosage: '15 ml twice daily',
          duration: '21 days',
          timing: 'After meals',
          instructions: 'Dilute with equal amount of water'
        },
        {
          name: 'Brahmi Tablets',
          dosage: '2 tablets twice daily',
          duration: '30 days',
          timing: 'After meals',
          instructions: 'Take with warm milk'
        }
      ],
      dietaryGuidelines: [
        'Gradual reintroduction of normal diet',
        'Start with rice gruel and light soups',
        'Include buttermilk and yogurt',
        'Avoid raw vegetables for 1 week'
      ],
      lifestyleInstructions: [
        'Resume normal activities gradually',
        'Continue oil massage twice weekly',
        'Maintain regular meal timings'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl text-gray-900 mb-2">Prescriptions</h1>
        <p className="text-muted-foreground">
          Your personalized medicine and lifestyle prescriptions from Ayurvedic doctors
        </p>
      </div>

      <div className="space-y-6">
        {prescriptions.map((prescription) => (
          <Card key={prescription.id} className="overflow-hidden">
            <CardHeader className="bg-green-50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{prescription.therapyPhase}</span>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Prescribed by {prescription.doctor}
                  </CardDescription>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(prescription.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Medicines Section */}
              <div className="mb-6">
                <h3 className="flex items-center space-x-2 mb-4">
                  <Pill className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Prescribed Medicines</span>
                </h3>
                <div className="grid gap-4">
                  {prescription.medicines.map((medicine, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-lg">{medicine.name}</h4>
                        <Badge variant="outline">{medicine.duration}</Badge>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Dosage</p>
                          <p className="font-medium">{medicine.dosage}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Timing</p>
                          <p className="font-medium">{medicine.timing}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Instructions</p>
                          <p className="font-medium">{medicine.instructions}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Dietary Guidelines */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Dietary Guidelines</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {prescription.dietaryGuidelines.map((guideline, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                        <span>{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Lifestyle Instructions */}
              <div>
                <h3 className="font-medium mb-3">Lifestyle Instructions</h3>
                <div className="bg-orange-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {prescription.lifestyleInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Medicine Image */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Ayurvedic Medicine Guide</CardTitle>
            <CardDescription>
              Understanding your herbal prescriptions and their benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1667904498869-933d459ddb1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxheXVydmVkaWMlMjBoZXJicyUyMHRyZWF0bWVudHxlbnwxfHx8fDE3NTc4NzQ5MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Ayurvedic herbs and medicines"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-2/3 space-y-3">
              <h4 className="font-medium">Key Points to Remember:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <Clock className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <span>Take medicines at prescribed times for maximum effectiveness</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Pill className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>Complete the full course even if you feel better</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Calendar className="h-4 w-4 mt-0.5 text-orange-600 flex-shrink-0" />
                  <span>Set reminders to maintain consistency in medication</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}