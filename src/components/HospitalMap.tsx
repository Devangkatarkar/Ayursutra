import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Phone, Clock, Star, Navigation } from 'lucide-react';

interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  phone: string;
  specialties: string[];
  openHours: string;
  coordinates: { lat: number; lng: number };
}

export function HospitalMap() {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  // Mock hospital data
  const hospitals: Hospital[] = [
    {
      id: '1',
      name: 'Ayurveda Wellness Center',
      address: '123 Green Street, Medical District',
      distance: '0.8 km',
      rating: 4.8,
      phone: '+91 98765 43210',
      specialties: ['Panchkarma', 'Abhyanga', 'Shirodhara'],
      openHours: '9:00 AM - 8:00 PM',
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    {
      id: '2',
      name: 'Traditional Ayurveda Clinic',
      address: '456 Herbal Lane, City Center',
      distance: '1.2 km',
      rating: 4.6,
      phone: '+91 98765 43211',
      specialties: ['Virechana', 'Basti', 'Nasya'],
      openHours: '8:00 AM - 7:00 PM',
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    {
      id: '3',
      name: 'Holistic Healing Institute',
      address: '789 Wellness Road, Health Zone',
      distance: '2.1 km',
      rating: 4.7,
      phone: '+91 98765 43212',
      specialties: ['Raktamokshana', 'Yoga Therapy', 'Meditation'],
      openHours: '7:00 AM - 9:00 PM',
      coordinates: { lat: 12.9716, lng: 77.5946 }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-green-600" />
          <span>Nearby Ayurvedic Hospitals</span>
        </CardTitle>
        <CardDescription>
          Find certified Ayurvedic hospitals and clinics near you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Map Placeholder */}
          <div className="bg-green-50 rounded-lg p-4 h-80 flex items-center justify-center border-2 border-dashed border-green-200">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-green-400 mx-auto mb-2" />
              <p className="text-green-600 mb-1">Interactive Map</p>
              <p className="text-sm text-muted-foreground">Map integration would display here</p>
              <p className="text-xs text-muted-foreground mt-2">
                Showing hospitals within 5 km radius
              </p>
            </div>
          </div>

          {/* Hospital List */}
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {hospitals.map((hospital) => (
              <div
                key={hospital.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedHospital?.id === hospital.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
                onClick={() => setSelectedHospital(hospital)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{hospital.name}</h4>
                  <div className="flex items-center space-x-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{hospital.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{hospital.address}</p>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {hospital.specialties.slice(0, 2).map((specialty, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs bg-green-100 text-green-700"
                    >
                      {specialty}
                    </Badge>
                  ))}
                  {hospital.specialties.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{hospital.specialties.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Navigation className="h-3 w-3" />
                    <span>{hospital.distance}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{hospital.openHours}</span>
                  </div>
                </div>

                {selectedHospital?.id === hospital.id && (
                  <div className="mt-3 pt-3 border-t border-green-200 flex space-x-2">
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                      <Navigation className="h-4 w-4 mr-1" />
                      Get Directions
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}