import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { toast } from 'sonner@2.0.3';
import { 
  getPendingTherapyRequests, 
  acceptTherapyRequest, 
  getDoctorTherapyRequests,
  createPrescription 
} from '../../utils/supabase/client';
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
  Wind,
  Bell,
  Users,
  Stethoscope
} from 'lucide-react';

interface TherapyManagementProps {
  doctor: any;
}

export function TherapyManagement({ doctor }: TherapyManagementProps) {
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    treatmentPlan: ''
  });

  const [prescriptionData, setPrescriptionData] = useState({
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    instructions: '',
    duration: '',
    notes: ''
  });

  const therapyTypes = [
    { id: 'vamanam', name: 'Vamanam', icon: <Wind className="h-5 w-5" />, color: 'bg-blue-100 text-blue-800' },
    { id: 'virechana', name: 'Virechana', icon: <Droplets className="h-5 w-5" />, color: 'bg-green-100 text-green-800' },
    { id: 'basti', name: 'Basti', icon: <Activity className="h-5 w-5" />, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'nasya', name: 'Nasya', icon: <Brain className="h-5 w-5" />, color: 'bg-purple-100 text-purple-800' },
    { id: 'raktamokshana', name: 'Raktamokshana', icon: <Heart className="h-5 w-5" />, color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    loadData();
  }, [doctor.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pendingResult, myResult] = await Promise.all([
        getPendingTherapyRequests(),
        getDoctorTherapyRequests(doctor.id)
      ]);

      if (pendingResult.error) {
        toast.error('Failed to load pending requests');
      } else {
        setPendingRequests(pendingResult.requests || []);
      }

      if (myResult.error) {
        toast.error('Failed to load your requests');
      } else {
        setMyRequests(myResult.requests || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load therapy requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!selectedRequest || !scheduleData.date || !scheduleData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const result = await acceptTherapyRequest(
        selectedRequest.id,
        doctor.id,
        scheduleData.date,
        scheduleData.time,
        scheduleData.treatmentPlan
      );

      if (result.success) {
        toast.success('Therapy request accepted and scheduled successfully!');
        setShowAcceptDialog(false);
        setSelectedRequest(null);
        setScheduleData({ date: '', time: '', treatmentPlan: '' });
        loadData();
      } else {
        toast.error(result.error || 'Failed to accept therapy request');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept therapy request');
    }
  };

  const handleCreatePrescription = async () => {
    if (!selectedPatient || prescriptionData.medications.some(med => !med.name)) {
      toast.error('Please fill in all medication details');
      return;
    }

    try {
      const result = await createPrescription({
        patientId: selectedPatient.id,
        doctorId: doctor.id,
        medications: prescriptionData.medications.filter(med => med.name),
        instructions: prescriptionData.instructions,
        duration: prescriptionData.duration,
        notes: prescriptionData.notes
      });

      if (result.success) {
        toast.success('Prescription created successfully!');
        setShowPrescriptionDialog(false);
        setPrescriptionData({
          medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
          instructions: '',
          duration: '',
          notes: ''
        });
      } else {
        toast.error(result.error || 'Failed to create prescription');
      }
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast.error('Failed to create prescription');
    }
  };

  const addMedication = () => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '' }]
    }));
  };

  const updateMedication = (index: number, field: string, value: string) => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const removeMedication = (index: number) => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const getTherapyInfo = (therapyType: string) => {
    return therapyTypes.find(t => t.id === therapyType) || {
      id: therapyType,
      name: therapyType,
      icon: <Activity className="h-5 w-5" />,
      color: 'bg-gray-100 text-gray-800'
    };
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Therapy Management</h1>
          <p className="text-gray-600">Manage patient therapy requests and schedules</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Bell className="h-4 w-4" />
            <span>{pendingRequests.length} pending</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{myRequests.length} scheduled</span>
          </Badge>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading therapy requests...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Requests */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
              Pending Requests ({pendingRequests.length})
            </h2>
            
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                  <p className="text-gray-600">All therapy requests have been processed.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => {
                  const therapyInfo = getTherapyInfo(request.therapyType);
                  return (
                    <Card key={request.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                              {therapyInfo.icon}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{therapyInfo.name}</h3>
                              <p className="text-sm text-gray-600">
                                {request.patientInfo?.name || 'Unknown Patient'}
                              </p>
                              <p className="text-xs text-gray-500">
                                Requested {formatDate(request.createdAt)}
                              </p>
                            </div>
                          </div>
                          <Badge className={getUrgencyColor(request.urgency)}>
                            {request.urgency} priority
                          </Badge>
                        </div>

                        {request.symptoms && request.symptoms.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Symptoms:</h4>
                            <div className="flex flex-wrap gap-2">
                              {request.symptoms.slice(0, 3).map((symptom: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                              {request.symptoms.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{request.symptoms.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {request.notes && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-1">Notes:</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{request.notes}</p>
                          </div>
                        )}

                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedPatient(request.patientInfo);
                              setShowPrescriptionDialog(true);
                            }}
                          >
                            <Stethoscope className="h-4 w-4 mr-1" />
                            Prescribe
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowAcceptDialog(true);
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept & Schedule
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* My Scheduled Therapies */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-500" />
              My Scheduled Therapies ({myRequests.length})
            </h2>
            
            {myRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No scheduled therapies</h3>
                  <p className="text-gray-600">Accept pending requests to schedule therapies.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myRequests.map((request) => {
                  const therapyInfo = getTherapyInfo(request.therapyType);
                  return (
                    <Card key={request.id} className="border-green-200 bg-green-50">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                              {therapyInfo.icon}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{therapyInfo.name}</h3>
                              <p className="text-sm text-gray-600">
                                {request.patientInfo?.name || 'Unknown Patient'}
                              </p>
                              <p className="text-sm text-green-700 font-medium">
                                {formatDate(`${request.scheduledDate} ${request.scheduledTime}`)}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Scheduled
                          </Badge>
                        </div>

                        {request.treatmentPlan && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-1">Treatment Plan:</h4>
                            <p className="text-sm text-gray-600">{request.treatmentPlan}</p>
                          </div>
                        )}

                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedPatient(request.patientInfo);
                              setShowPrescriptionDialog(true);
                            }}
                          >
                            <Stethoscope className="h-4 w-4 mr-1" />
                            Update Prescription
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Accept & Schedule Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Accept & Schedule Therapy</DialogTitle>
            <DialogDescription>
              Set the schedule for {selectedRequest?.patientInfo?.name}'s {getTherapyInfo(selectedRequest?.therapyType).name} therapy.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={scheduleData.date}
                  onChange={(e) => setScheduleData(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={scheduleData.time}
                  onChange={(e) => setScheduleData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="treatmentPlan">Treatment Plan</Label>
              <Textarea
                id="treatmentPlan"
                value={scheduleData.treatmentPlan}
                onChange={(e) => setScheduleData(prev => ({ ...prev, treatmentPlan: e.target.value }))}
                placeholder="Describe the treatment approach, duration, and any special instructions..."
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAcceptRequest} className="bg-green-600 hover:bg-green-700">
                Accept & Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Prescription Dialog */}
      <Dialog open={showPrescriptionDialog} onOpenChange={setShowPrescriptionDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Prescription</DialogTitle>
            <DialogDescription>
              Create a prescription for {selectedPatient?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Medications *</Label>
                <Button variant="outline" size="sm" onClick={addMedication}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Medication
                </Button>
              </div>
              {prescriptionData.medications.map((medication, index) => (
                <Card key={index} className="p-4 mb-2">
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <Label>Medicine Name</Label>
                      <Input
                        value={medication.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        placeholder="e.g., Triphala Churna"
                      />
                    </div>
                    <div>
                      <Label>Dosage</Label>
                      <Input
                        value={medication.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        placeholder="e.g., 1 teaspoon"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Frequency</Label>
                      <Input
                        value={medication.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                        placeholder="e.g., Twice daily"
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="flex-1">
                        <Label>Duration</Label>
                        <Input
                          value={medication.duration}
                          onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                          placeholder="e.g., 30 days"
                        />
                      </div>
                      {prescriptionData.medications.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-2"
                          onClick={() => removeMedication(index)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div>
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={prescriptionData.instructions}
                onChange={(e) => setPrescriptionData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Special instructions for taking the medications..."
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="duration">Overall Treatment Duration</Label>
              <Input
                id="duration"
                value={prescriptionData.duration}
                onChange={(e) => setPrescriptionData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 3 months"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={prescriptionData.notes}
                onChange={(e) => setPrescriptionData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes or recommendations..."
                rows={2}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowPrescriptionDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePrescription} className="bg-blue-600 hover:bg-blue-700">
                Create Prescription
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}