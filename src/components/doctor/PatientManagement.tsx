import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  MessageCircle, 
  Calendar, 
  AlertTriangle,
  TrendingUp,
  FileText,
  Phone,
  Mail,
  MapPin,
  Activity,
  Clock,
  User,
  Pill
} from 'lucide-react';
import { getUserFeedback } from '../../utils/supabase/client';

interface PatientManagementProps {
  doctor: any;
}

export function PatientManagement({ doctor }: PatientManagementProps) {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [patientFeedback, setPatientFeedback] = useState<any[]>([]);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');

  const [patients] = useState([
    {
      id: 'p1',
      name: 'Arjun Sharma',
      email: 'arjun.sharma@email.com',
      phone: '+91 98765 43210',
      age: 45,
      gender: 'Male',
      address: 'Mumbai, Maharashtra',
      therapyPlan: 'Panchkarma Complete',
      joinDate: '2024-01-15',
      status: 'active',
      progress: 78,
      alerts: 1,
      lastVisit: '2024-01-18',
      nextAppointment: '2024-01-22',
      currentMedications: ['Triphala Churna', 'Ashwagandha Capsules'],
      allergies: ['Dairy products'],
      medicalHistory: 'Hypertension, Joint pain',
      vitalSigns: {
        bloodPressure: '140/90',
        heartRate: '72 bpm',
        weight: '78 kg',
        height: '5\'8"'
      }
    },
    {
      id: 'p2',
      name: 'Priya Mehta',
      email: 'priya.mehta@email.com',
      phone: '+91 87654 32109',
      age: 32,
      gender: 'Female',
      address: 'Delhi, NCR',
      therapyPlan: 'Virechana Therapy',
      joinDate: '2024-02-20',
      status: 'active',
      progress: 65,
      alerts: 0,
      lastVisit: '2024-01-17',
      nextAppointment: '2024-01-24',
      currentMedications: ['Digestive Herbs', 'Ghrita Preparation'],
      allergies: ['None known'],
      medicalHistory: 'Digestive issues, IBS',
      vitalSigns: {
        bloodPressure: '110/70',
        heartRate: '68 bpm',
        weight: '58 kg',
        height: '5\'4"'
      }
    },
    {
      id: 'p3',
      name: 'Ravi Kumar',
      email: 'ravi.kumar@email.com',
      phone: '+91 76543 21098',
      age: 38,
      gender: 'Male',
      address: 'Bangalore, Karnataka',
      therapyPlan: 'Nasya Treatment',
      joinDate: '2024-03-10',
      status: 'completed',
      progress: 100,
      alerts: 0,
      lastVisit: '2024-01-16',
      nextAppointment: 'Follow-up scheduled',
      currentMedications: ['Saraswatarishta'],
      allergies: ['Pollen'],
      medicalHistory: 'Sinusitis, Headaches',
      vitalSigns: {
        bloodPressure: '120/80',
        heartRate: '70 bpm',
        weight: '72 kg',
        height: '5\'10"'
      }
    },
    {
      id: 'p4',
      name: 'Sneha Patel',
      email: 'sneha.patel@email.com',
      phone: '+91 65432 10987',
      age: 29,
      gender: 'Female',
      address: 'Ahmedabad, Gujarat',
      therapyPlan: 'Basti Therapy',
      joinDate: '2024-01-05',
      status: 'active',
      progress: 45,
      alerts: 2,
      lastVisit: '2024-01-15',
      nextAppointment: '2024-01-21',
      currentMedications: ['Herbal Tea Blend', 'Pain Relief Oil'],
      allergies: ['Seafood'],
      medicalHistory: 'Back pain, Stress',
      vitalSigns: {
        bloodPressure: '105/65',
        heartRate: '75 bpm',
        weight: '52 kg',
        height: '5\'3"'
      }
    }
  ]);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.therapyPlan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const loadPatientFeedback = async (patientId: string) => {
    try {
      const result = await getUserFeedback(patientId);
      if (result.feedback) {
        setPatientFeedback(result.feedback);
      }
    } catch (error) {
      console.error('Error loading patient feedback:', error);
    }
  };

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    loadPatientFeedback(patient.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handlePrescriptionUpdate = () => {
    // Here you would integrate with your backend to update prescription
    alert(`Prescription updated for ${selectedPatient?.name}`);
    setPrescriptionNotes('');
  };

  if (selectedPatient) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setSelectedPatient(null)}>
              ← Back to Patients
            </Button>
            <div>
              <h1 className="text-2xl text-gray-900">{selectedPatient.name}</h1>
              <p className="text-muted-foreground">{selectedPatient.therapyPlan}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {selectedPatient.alerts > 0 && (
              <Badge variant="destructive">
                {selectedPatient.alerts} Alert{selectedPatient.alerts > 1 ? 's' : ''}
              </Badge>
            )}
            <Badge className={getStatusColor(selectedPatient.status)}>
              {selectedPatient.status}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="feedback">Health Reports</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Patient Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Age: {selectedPatient.age} years</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Gender: {selectedPatient.gender}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedPatient.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedPatient.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedPatient.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Joined: {selectedPatient.joinDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Last Visit: {selectedPatient.lastVisit}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Progress: {selectedPatient.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vital Signs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Latest Vital Signs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Blood Pressure</p>
                        <p className="font-medium">{selectedPatient.vitalSigns.bloodPressure}</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Heart Rate</p>
                        <p className="font-medium">{selectedPatient.vitalSigns.heartRate}</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="font-medium">{selectedPatient.vitalSigns.weight}</p>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Height</p>
                        <p className="font-medium">{selectedPatient.vitalSigns.height}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Current Medications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Pill className="h-5 w-5" />
                      <span>Current Medications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPatient.currentMedications.map((med: string, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{med}</span>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-3">
                      Add Medication
                    </Button>
                  </CardContent>
                </Card>

                {/* Allergies & Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Allergies:</Label>
                        <p className="text-sm text-muted-foreground">{selectedPatient.allergies.join(', ')}</p>
                      </div>
                      <div>
                        <Label className="text-sm">Medical History:</Label>
                        <p className="text-sm text-muted-foreground">{selectedPatient.medicalHistory}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Health Reports & Feedback</CardTitle>
                <CardDescription>Patient-submitted health condition reports</CardDescription>
              </CardHeader>
              <CardContent>
                {patientFeedback.length > 0 ? (
                  <div className="space-y-4">
                    {patientFeedback.map((feedback, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">
                            {feedback.timestamp ? new Date(feedback.timestamp).toLocaleDateString() : 'Recent Report'}
                          </span>
                          <Badge className={feedback.status === 'reviewed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                            {feedback.status || 'pending_review'}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm font-medium">Symptoms:</p>
                            <p className="text-sm text-muted-foreground">{feedback.symptoms?.join(', ') || 'None reported'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Health Metrics:</p>
                            <div className="text-sm text-muted-foreground">
                              <p>Pain: {feedback.painLevel}/10</p>
                              <p>Energy: {feedback.energyLevel}/10</p>
                              <p>Sleep: {feedback.sleepQuality}/10</p>
                            </div>
                          </div>
                        </div>
                        {feedback.notes && (
                          <div className="mb-3">
                            <p className="text-sm font-medium">Patient Notes:</p>
                            <p className="text-sm text-muted-foreground">{feedback.notes}</p>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            Respond
                          </Button>
                          <Button size="sm">
                            Update Prescription
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No health reports available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <Card>
              <CardHeader>
                <CardTitle>Prescription Management</CardTitle>
                <CardDescription>Update and manage patient prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prescription">New Prescription Notes</Label>
                    <Textarea
                      id="prescription"
                      placeholder="Enter prescription details, dosage instructions, and recommendations..."
                      value={prescriptionNotes}
                      onChange={(e) => setPrescriptionNotes(e.target.value)}
                      rows={6}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={handlePrescriptionUpdate} disabled={!prescriptionNotes}>
                      Update Prescription
                    </Button>
                    <Button variant="outline">
                      View History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Next Appointment</p>
                      <p className="text-sm text-muted-foreground">{selectedPatient.nextAppointment}</p>
                    </div>
                    <Button variant="outline">
                      Reschedule
                    </Button>
                  </div>
                  <Button className="w-full">
                    Schedule New Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Medical History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Previous Conditions:</Label>
                    <p className="text-sm text-muted-foreground">{selectedPatient.medicalHistory}</p>
                  </div>
                  <div>
                    <Label>Treatment Timeline:</Label>
                    <p className="text-sm text-muted-foreground">Started {selectedPatient.therapyPlan} on {selectedPatient.joinDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl text-gray-900 mb-2">Patient Management</h1>
          <p className="text-muted-foreground">Monitor and manage your patients</p>
        </div>
        <Button>
          Add New Patient
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name, email, or therapy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Patients</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Patient List */}
      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium">{patient.name}</h3>
                      {patient.alerts > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {patient.alerts} alert{patient.alerts > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{patient.therapyPlan}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                      <span>Age: {patient.age}</span>
                      <span>Last visit: {patient.lastVisit}</span>
                      <span>Progress: {patient.progress}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(patient.status)}>
                    {patient.status}
                  </Badge>
                  <Button 
                    onClick={() => handlePatientSelect(patient)}
                    variant="outline"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No patients found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}