import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { toast } from 'sonner@2.0.3';
import { 
  submitTherapyRequest, 
  getPatientTherapyRequests,
  sendNotification 
} from '../../utils/supabase/client';
import { 
  Phone, 
  Video, 
  MessageCircle, 
  Calendar, 
  Clock, 
  Star, 
  Send,
  MapPin,
  Award,
  BookOpen,
  Activity,
  Heart,
  Brain,
  Droplets,
  Wind,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Stethoscope,
  Users
} from 'lucide-react';

interface ContactDoctorSectionProps {
  user: any;
}

export function ContactDoctorSection({ user }: ContactDoctorSectionProps) {
  const [consultationType, setConsultationType] = useState('');
  const [urgency, setUrgency] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('doctors');
  const [showTherapyDialog, setShowTherapyDialog] = useState(false);
  const [therapyRequests, setTherapyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Therapy request form state
  const [therapyForm, setTherapyForm] = useState({
    therapyType: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    symptoms: [] as string[],
    notes: '',
    preferredDoctorId: 'none'
  });

  // Mock doctor data
  const assignedDoctors = [
    {
      id: '1',
      name: 'Dr. Raghav Sharma',
      specialization: 'Panchkarma Specialist',
      experience: '15 years',
      rating: 4.8,
      languages: ['English', 'Hindi', 'Sanskrit'],
      qualifications: ['BAMS', 'MD (Ayurveda)', 'PhD'],
      nextAvailable: '2025-01-16 10:00 AM',
      consultationFee: '₹500',
      status: 'Available',
      image: '',
      phone: '+91 98765 43210',
      email: 'dr.sharma@ayursutra.com',
      clinic: 'Ayurveda Wellness Center'
    },
    {
      id: '2',
      name: 'Dr. Priya Nair',
      specialization: 'Constitutional Medicine',
      experience: '12 years',
      rating: 4.9,
      languages: ['English', 'Malayalam', 'Tamil'],
      qualifications: ['BAMS', 'MD (Kayachikitsa)'],
      nextAvailable: '2025-01-17 2:00 PM',
      consultationFee: '₹400',
      status: 'Available',
      image: '',
      phone: '+91 98765 43211',
      email: 'dr.priya@ayursutra.com',
      clinic: 'Traditional Ayurveda Clinic'
    }
  ];

  const consultationTypes = [
    'Treatment Review',
    'Side Effects Concern',
    'Prescription Renewal',
    'General Consultation',
    'Emergency'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - Within 2-3 days', color: 'bg-green-100 text-green-700' },
    { value: 'medium', label: 'Medium - Within 24 hours', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'high', label: 'High - Within 6 hours', color: 'bg-orange-100 text-orange-700' },
    { value: 'urgent', label: 'Urgent - Immediate', color: 'bg-red-100 text-red-700' }
  ];

  const therapyTypes = [
    { 
      id: 'vamanam', 
      name: 'Vamanam', 
      icon: <Wind className="h-5 w-5" />, 
      description: 'Therapeutic vomiting for Kapha dosha imbalance',
      color: 'bg-blue-100 text-blue-800'
    },
    { 
      id: 'virechana', 
      name: 'Virechana', 
      icon: <Droplets className="h-5 w-5" />, 
      description: 'Purgation therapy for Pitta dosha cleansing',
      color: 'bg-green-100 text-green-800'
    },
    { 
      id: 'basti', 
      name: 'Basti', 
      icon: <Activity className="h-5 w-5" />, 
      description: 'Medicated enemas for Vata dosha balance',
      color: 'bg-yellow-100 text-yellow-800'
    },
    { 
      id: 'nasya', 
      name: 'Nasya', 
      icon: <Brain className="h-5 w-5" />, 
      description: 'Nasal administration for head and neck cleansing',
      color: 'bg-purple-100 text-purple-800'
    },
    { 
      id: 'raktamokshana', 
      name: 'Raktamokshana', 
      icon: <Heart className="h-5 w-5" />, 
      description: 'Blood purification therapy',
      color: 'bg-red-100 text-red-800'
    }
  ];

  const commonSymptoms = [
    'Chronic fatigue', 'Joint pain', 'Digestive issues', 'Headaches',
    'Sleep disorders', 'Stress and anxiety', 'Skin problems', 'Respiratory issues',
    'High blood pressure', 'Diabetes complications', 'Arthritis', 'Migraine'
  ];

  const recentConsultations = [
    {
      date: '2025-01-12',
      type: 'Video Consultation',
      doctor: 'Dr. Raghav Sharma',
      duration: '30 mins',
      notes: 'Discussed Vamanam preparation and dietary guidelines',
      status: 'Completed'
    },
    {
      date: '2025-01-05',
      type: 'In-person',
      doctor: 'Dr. Priya Nair',
      duration: '45 mins',
      notes: 'Post-Virechana assessment and next phase planning',
      status: 'Completed'
    }
  ];

  useEffect(() => {
    loadTherapyRequests();
  }, [user.id]);

  const loadTherapyRequests = async () => {
    setLoading(true);
    try {
      const result = await getPatientTherapyRequests(user.id);
      if (result.error) {
        console.error('Failed to load therapy requests:', result.error);
      } else {
        setTherapyRequests(result.requests || []);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactDoctor = (doctorId: string, method: string) => {
    console.log(`Contacting doctor ${doctorId} via ${method}`);
    toast.success(`Connecting you via ${method}...`);
    // Handle contact logic
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationType || !urgency || !message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Send consultation request notification to all doctors
      const doctorNotification = assignedDoctors.map(doctor => 
        sendNotification(
          doctor.id,
          `New consultation request: ${consultationType}`,
          'consultation_request',
          urgency === 'urgent' ? 'high' : urgency,
          user.id
        )
      );

      await Promise.all(doctorNotification);
      
      toast.success('Consultation request sent successfully!');
      setConsultationType('');
      setUrgency('');
      setMessage('');
    } catch (error) {
      console.error('Error sending consultation request:', error);
      toast.error('Failed to send consultation request');
    }
  };

  const handleTherapySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!therapyForm.therapyType) {
      toast.error('Please select a therapy type');
      return;
    }

    try {
      const result = await submitTherapyRequest({
        patientId: user.id,
        therapyType: therapyForm.therapyType,
        urgency: therapyForm.urgency,
        symptoms: therapyForm.symptoms,
        notes: therapyForm.notes,
        preferredDoctorId: therapyForm.preferredDoctorId === 'none' ? undefined : therapyForm.preferredDoctorId || undefined
      });

      if (result.success) {
        toast.success('Therapy request submitted successfully!');
        setShowTherapyDialog(false);
        setTherapyForm({
          therapyType: '',
          urgency: 'medium',
          symptoms: [],
          notes: '',
          preferredDoctorId: 'none'
        });
        loadTherapyRequests();
      } else {
        toast.error(result.error || 'Failed to submit therapy request');
      }
    } catch (error) {
      console.error('Error submitting therapy request:', error);
      toast.error('Failed to submit therapy request');
    }
  };

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setTherapyForm(prev => ({
      ...prev,
      symptoms: checked 
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter(s => s !== symptom)
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl text-gray-900 mb-2">Doctor Connect Center</h1>
        <p className="text-muted-foreground">
          Connect with your Ayurvedic physicians, request therapies, and manage your treatment
        </p>
      </div>

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="doctors" className="flex items-center space-x-2">
            <Stethoscope className="h-4 w-4" />
            <span>Your Doctors</span>
          </TabsTrigger>
          <TabsTrigger value="therapy" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Therapy Requests</span>
          </TabsTrigger>
          <TabsTrigger value="consultations" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Consultations</span>
          </TabsTrigger>
        </TabsList>

        {/* Your Doctors Tab */}
        <TabsContent value="doctors">{renderDoctorsSection()}</TabsContent>

        {/* Therapy Requests Tab */}
        <TabsContent value="therapy">{renderTherapySection()}</TabsContent>

        {/* Consultations Tab */}
        <TabsContent value="consultations">{renderConsultationsSection()}</TabsContent>
      </Tabs>
    </div>
  );

  function renderDoctorsSection() {
    return (

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Doctor Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg">Your Assigned Doctors</h2>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{assignedDoctors.length} Doctors</span>
            </Badge>
          </div>
          
          {assignedDoctors.map((doctor) => (
            <Card key={doctor.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Doctor Avatar */}
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={doctor.image} />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  {/* Doctor Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{doctor.name}</h3>
                        <p className="text-muted-foreground">{doctor.specialization}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4" />
                            <span>{doctor.experience}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{doctor.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        className={
                          doctor.status === 'Available' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }
                      >
                        {doctor.status}
                      </Badge>
                    </div>

                    {/* Qualifications */}
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {doctor.qualifications.map((qual, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {qual}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        Languages: {doctor.languages.join(', ')}
                      </p>
                    </div>

                    {/* Clinic Info */}
                    <div className="flex items-center space-x-1 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{doctor.clinic}</span>
                    </div>

                    {/* Next Availability */}
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span><strong>Next Available:</strong> {doctor.nextAvailable}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm mt-1">
                        <span className="font-medium">Consultation Fee: {doctor.consultationFee}</span>
                      </div>
                    </div>

                    {/* Contact Actions */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button 
                        size="sm" 
                        onClick={() => handleContactDoctor(doctor.id, 'video')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Video Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleContactDoctor(doctor.id, 'phone')}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Phone Call
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleContactDoctor(doctor.id, 'message')}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setTherapyForm(prev => ({ ...prev, preferredDoctorId: doctor.id }));
                          setShowTherapyDialog(true);
                        }}
                      >
                        <Activity className="h-4 w-4 mr-1" />
                        Request Therapy
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Consultation Request Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Consultation</CardTitle>
              <CardDescription>
                Send a message to your doctor with your concern
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <Label htmlFor="consultation-type">Consultation Type</Label>
                  <Select value={consultationType} onValueChange={setConsultationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultationTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select value={urgency} onValueChange={setUrgency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your concern or question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!consultationType || !urgency || !message.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Request
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Emergency Contact</CardTitle>
              <CardDescription className="text-red-700">
                For medical emergencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Helpline
                </Button>
                <p className="text-xs text-red-700 text-center">
                  Available 24/7 for urgent medical concerns
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  function renderTherapySection() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">Panchkarma Therapy Requests</h2>
          <Dialog open={showTherapyDialog} onOpenChange={setShowTherapyDialog}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Request New Therapy
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Request Panchkarma Therapy</DialogTitle>
                <DialogDescription>
                  Submit a request for the therapy you need. Our doctors will review and schedule your treatment.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleTherapySubmit} className="space-y-6">
                {/* Therapy Type Selection */}
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-4 block">
                    Select Therapy Type *
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {therapyTypes.map((therapy) => (
                      <Card 
                        key={therapy.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          therapyForm.therapyType === therapy.id 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'hover:border-purple-300'
                        }`}
                        onClick={() => setTherapyForm(prev => ({ ...prev, therapyType: therapy.id }))}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1 bg-purple-100 rounded text-purple-600">
                              {therapy.icon}
                            </div>
                            <h3 className="font-medium text-sm">{therapy.name}</h3>
                          </div>
                          <p className="text-xs text-gray-600">{therapy.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Preferred Doctor */}
                <div>
                  <Label htmlFor="preferredDoctor">Preferred Doctor (Optional)</Label>
                  <Select value={therapyForm.preferredDoctorId} onValueChange={(value) => 
                    setTherapyForm(prev => ({ ...prev, preferredDoctorId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No preference</SelectItem>
                      {assignedDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority Level */}
                <div>
                  <Label htmlFor="urgency">Priority Level</Label>
                  <Select value={therapyForm.urgency} onValueChange={(value: 'low' | 'medium' | 'high') => 
                    setTherapyForm(prev => ({ ...prev, urgency: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.slice(0, 3).map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Symptoms */}
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Current Symptoms (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {commonSymptoms.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom}
                          checked={therapyForm.symptoms.includes(symptom)}
                          onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                        />
                        <Label htmlFor={symptom} className="text-xs text-gray-700">
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={therapyForm.notes}
                    onChange={(e) => setTherapyForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Describe your condition, specific symptoms, or any preferences..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTherapyDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Therapy Requests List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading therapy requests...</p>
          </div>
        ) : therapyRequests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No therapy requests yet</h3>
              <p className="text-gray-600 mb-4">
                Submit your first therapy request to get started with your Panchkarma journey.
              </p>
              <Button 
                onClick={() => setShowTherapyDialog(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Request Therapy
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {therapyRequests.map((request) => {
              const therapyInfo = therapyTypes.find(t => t.id === request.therapyType);
              return (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                          {therapyInfo?.icon || <Activity className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {therapyInfo?.name || request.therapyType}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Requested on {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </Badge>
                        <Badge variant="outline" className={
                          urgencyLevels.find(l => l.value === request.urgency)?.color || 'bg-gray-100 text-gray-800'
                        }>
                          {request.urgency} priority
                        </Badge>
                      </div>
                    </div>

                    {request.symptoms && request.symptoms.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Symptoms:</h4>
                        <div className="flex flex-wrap gap-2">
                          {request.symptoms.map((symptom: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {request.status === 'accepted' && request.doctorInfo && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <h4 className="font-medium text-green-800">Therapy Scheduled</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-700">
                              <strong>Doctor:</strong> {request.doctorInfo.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-700">
                              <strong>Date:</strong> {formatDate(request.scheduledDate)}
                            </p>
                            <p className="text-gray-700">
                              <strong>Time:</strong> {request.scheduledTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  function renderConsultationsSection() {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Consultation Request Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Request Consultation</CardTitle>
              <CardDescription>
                Send a message to your doctor with your concern
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <Label htmlFor="consultation-type">Consultation Type</Label>
                  <Select value={consultationType} onValueChange={setConsultationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultationTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select value={urgency} onValueChange={setUrgency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your concern or question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!consultationType || !urgency || !message.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Emergency Contact</CardTitle>
              <CardDescription className="text-red-700">
                For medical emergencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Helpline
                </Button>
                <p className="text-xs text-red-700 text-center">
                  Available 24/7 for urgent medical concerns
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('therapy')}
              >
                <Activity className="h-4 w-4 mr-2" />
                Request Therapy
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setActiveTab('doctors')}
              >
                <Video className="h-4 w-4 mr-2" />
                Video Consultation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Consultations */}
        <div className="lg:col-span-3 mt-8">
          <h2 className="text-lg mb-4">Recent Consultations</h2>
          <div className="space-y-4">
            {recentConsultations.map((consultation, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{consultation.type}</h4>
                        <Badge className="bg-green-100 text-green-700">{consultation.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        with {consultation.doctor} • {consultation.duration}
                      </p>
                      <p className="text-sm">{consultation.notes}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(consultation.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }
}