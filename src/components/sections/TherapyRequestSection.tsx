import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { submitTherapyRequest, getPatientTherapyRequests } from '../../utils/supabase/client';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Calendar, 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Plus,
  Activity,
  Heart,
  Brain,
  Droplets,
  Wind
} from 'lucide-react';

interface TherapyRequestSectionProps {
  user: any;
}

export function TherapyRequestSection({ user }: TherapyRequestSectionProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const [formData, setFormData] = useState({
    therapyType: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    symptoms: [] as string[],
    notes: '',
    preferredDoctorId: ''
  });

  const therapyTypes = [
    { id: 'vamanam', name: 'Vamanam', icon: <Wind className="h-5 w-5" />, description: 'Therapeutic vomiting for Kapha dosha imbalance' },
    { id: 'virechana', name: 'Virechana', icon: <Droplets className="h-5 w-5" />, description: 'Purgation therapy for Pitta dosha cleansing' },
    { id: 'basti', name: 'Basti', icon: <Activity className="h-5 w-5" />, description: 'Medicated enemas for Vata dosha balance' },
    { id: 'nasya', name: 'Nasya', icon: <Brain className="h-5 w-5" />, description: 'Nasal administration for head and neck cleansing' },
    { id: 'raktamokshana', name: 'Raktamokshana', icon: <Heart className="h-5 w-5" />, description: 'Blood purification therapy' }
  ];

  const commonSymptoms = [
    'Chronic fatigue', 'Joint pain', 'Digestive issues', 'Headaches',
    'Sleep disorders', 'Stress and anxiety', 'Skin problems', 'Respiratory issues',
    'High blood pressure', 'Diabetes complications', 'Arthritis', 'Migraine'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    loadRequests();
  }, [user.id]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const result = await getPatientTherapyRequests(user.id);
      if (result.error) {
        toast.error('Failed to load therapy requests');
      } else {
        setRequests(result.requests || []);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      toast.error('Failed to load therapy requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.therapyType) {
      toast.error('Please select a therapy type');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitTherapyRequest({
        patientId: user.id,
        therapyType: formData.therapyType,
        urgency: formData.urgency,
        symptoms: formData.symptoms,
        notes: formData.notes,
        preferredDoctorId: formData.preferredDoctorId || undefined
      });

      if (result.success) {
        toast.success('Therapy request submitted successfully! You will be notified when a doctor accepts your request.');
        setShowRequestForm(false);
        setFormData({
          therapyType: '',
          urgency: 'medium',
          symptoms: [],
          notes: '',
          preferredDoctorId: ''
        });
        loadRequests();
      } else {
        toast.error(result.error || 'Failed to submit therapy request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit therapy request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setFormData(prev => ({
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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Therapy Requests</h1>
          <p className="text-gray-600">Request Panchkarma therapies and track your treatment schedule</p>
        </div>
        <Button 
          onClick={() => setShowRequestForm(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-800">Request Panchkarma Therapy</CardTitle>
            <CardDescription>
              Submit a request for the therapy you need. Our doctors will review and schedule your treatment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Therapy Type Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-4 block">
                  Select Therapy Type *
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {therapyTypes.map((therapy) => (
                    <Card 
                      key={therapy.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        formData.therapyType === therapy.id 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'hover:border-purple-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, therapyType: therapy.id }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            {therapy.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{therapy.name}</h3>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{therapy.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Urgency Level */}
              <div>
                <Label htmlFor="urgency">Priority Level</Label>
                <Select value={formData.urgency} onValueChange={(value: 'low' | 'medium' | 'high') => 
                  setFormData(prev => ({ ...prev, urgency: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={level.color}>
                            {level.label}
                          </Badge>
                        </div>
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonSymptoms.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={formData.symptoms.includes(symptom)}
                        onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                      />
                      <Label htmlFor={symptom} className="text-sm text-gray-700">
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
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Describe your condition, specific symptoms, or any preferences..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      <div>
        <h2 className="text-xl font-medium text-gray-900 mb-4">Your Therapy Requests</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No therapy requests yet</h3>
              <p className="text-gray-600 mb-4">
                Submit your first therapy request to get started with your Panchkarma journey.
              </p>
              <Button 
                onClick={() => setShowRequestForm(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Request Therapy
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        {therapyTypes.find(t => t.id === request.therapyType)?.icon || <Activity className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {therapyTypes.find(t => t.id === request.therapyType)?.name || request.therapyType}
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

                  {request.notes && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Notes:</h4>
                      <p className="text-sm text-gray-600">{request.notes}</p>
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
                          <p className="text-gray-700">
                            <strong>Specialization:</strong> {request.doctorInfo.specialization}
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
                      {request.treatmentPlan && (
                        <div className="mt-2">
                          <p className="text-gray-700">
                            <strong>Treatment Plan:</strong> {request.treatmentPlan}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}