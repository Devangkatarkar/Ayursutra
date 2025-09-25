import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { OfflineWarningBanner } from '../OfflineStatusIndicator';
import { apiCall, isDemoMode, generateMockFeedback } from '../../utils/offlineMode';
import { 
  Heart, 
  Send, 
  Activity, 
  AlertTriangle, 
  Calendar, 
  Clock,
  Thermometer,
  Brain,
  Utensils,
  Moon,
  Pill,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

interface FeedbackSectionProps {
  user?: {
    id: string;
    name: string;
    therapyPlan: string;
  };
}

interface HealthFeedback {
  id?: string;
  timestamp?: string;
  symptoms: string[];
  painLevel: number;
  energyLevel: number;
  digestiveIssues: string[];
  sleepQuality: number;
  mood: number;
  complications: string[];
  notes: string;
  medications: string[];
  therapyPhase: string;
  status?: string;
  doctorNotes?: string;
  prescriptionChanges?: string;
}

export function FeedbackSection({ user }: FeedbackSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousFeedback, setPreviousFeedback] = useState<HealthFeedback[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<HealthFeedback>({
    symptoms: [],
    painLevel: 0,
    energyLevel: 5,
    digestiveIssues: [],
    sleepQuality: 5,
    mood: 5,
    complications: [],
    notes: '',
    medications: [],
    therapyPhase: user?.therapyPlan || 'Panchkarma Complete'
  });

  const availableSymptoms = [
    'Headache', 'Nausea', 'Dizziness', 'Fatigue', 'Joint Pain', 
    'Muscle Aches', 'Skin Issues', 'Digestive Discomfort', 
    'Sleep Problems', 'Anxiety', 'Weakness', 'Fever',
    'Respiratory Issues', 'Back Pain', 'Mood Changes'
  ];

  const digestiveIssueOptions = [
    'Constipation', 'Diarrhea', 'Bloating', 'Gas', 'Acid Reflux',
    'Loss of Appetite', 'Excessive Hunger', 'Stomach Pain', 'Indigestion'
  ];

  const complicationOptions = [
    'Allergic Reaction', 'Unexpected Side Effects', 'Severe Pain',
    'Difficulty Taking Medicines', 'Treatment Not Effective',
    'Worsening Symptoms', 'New Symptoms Appeared'
  ];

  const therapyPhases = [
    'Pre-treatment Preparation',
    'Vamanam Therapy',
    'Virechana Therapy', 
    'Basti Therapy',
    'Nasya Therapy',
    'Raktamokshana Therapy',
    'Post-treatment Recovery'
  ];

  const currentMedications = [
    'Triphala Churna', 'Ghrita Preparation', 'Herbal Tea Blend',
    'Saraswatarishta', 'Brahmi Tablets', 'Ashwagandha Capsules',
    'Digestive Herbs', 'Pain Relief Oil'
  ];

  useEffect(() => {
    if (user?.id) {
      loadPreviousFeedback();
    }
  }, [user?.id]);

  const loadPreviousFeedback = async () => {
    if (!user?.id) return;
    
    try {
      if (isDemoMode(user)) {
        // Use mock data for demo mode
        const mockFeedback = generateMockFeedback(user.id);
        setPreviousFeedback(mockFeedback);
      } else {
        // Try to load from API
        const result = await apiCall(`/feedback/${user.id}`, {}, { feedback: [] });
        if (result.success && result.data?.feedback) {
          setPreviousFeedback(result.data.feedback);
        }
      }
    } catch (error) {
      console.error('Error loading feedback:', error);
    }
  };

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setCurrentFeedback(prev => ({
      ...prev,
      symptoms: checked 
        ? [...prev.symptoms, symptom]
        : prev.symptoms.filter(s => s !== symptom)
    }));
  };

  const handleDigestiveIssueChange = (issue: string, checked: boolean) => {
    setCurrentFeedback(prev => ({
      ...prev,
      digestiveIssues: checked 
        ? [...prev.digestiveIssues, issue]
        : prev.digestiveIssues.filter(i => i !== issue)
    }));
  };

  const handleComplicationChange = (complication: string, checked: boolean) => {
    setCurrentFeedback(prev => ({
      ...prev,
      complications: checked 
        ? [...prev.complications, complication]
        : prev.complications.filter(c => c !== complication)
    }));
  };

  const handleMedicationChange = (medication: string, checked: boolean) => {
    setCurrentFeedback(prev => ({
      ...prev,
      medications: checked 
        ? [...prev.medications, medication]
        : prev.medications.filter(m => m !== medication)
    }));
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      alert('User not logged in');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isDemoMode(user)) {
        // Demo mode - simulate successful submission
        setTimeout(() => {
          // Reset form
          setCurrentFeedback({
            symptoms: [],
            painLevel: 0,
            energyLevel: 5,
            digestiveIssues: [],
            sleepQuality: 5,
            mood: 5,
            complications: [],
            notes: '',
            medications: [],
            therapyPhase: user?.therapyPlan || 'Panchkarma Complete'
          });
          
          // Add to mock feedback history
          const newFeedback = {
            id: `mock-feedback-${Date.now()}`,
            userId: user.id,
            timestamp: new Date().toISOString(),
            ...currentFeedback,
            status: 'pending_review'
          };
          setPreviousFeedback(prev => [newFeedback, ...prev]);
          
          alert('Demo: Health feedback submitted! (Mock data - not saved to real database)');
          setIsSubmitting(false);
        }, 1000);
        return;
      }

      // Try real API submission
      const result = await apiCall('/feedback', {
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          ...currentFeedback
        })
      });

      if (result.success) {
        // Reset form
        setCurrentFeedback({
          symptoms: [],
          painLevel: 0,
          energyLevel: 5,
          digestiveIssues: [],
          sleepQuality: 5,
          mood: 5,
          complications: [],
          notes: '',
          medications: [],
          therapyPhase: user?.therapyPlan || 'Panchkarma Complete'
        });

        // Reload feedback list
        await loadPreviousFeedback();
        
        alert('Health condition report submitted successfully! Your doctor will review and update your prescription if needed.');
      } else {
        alert(`Failed to submit feedback: ${result.error || 'Network error'}. ${result.isOffline ? 'Service temporarily unavailable.' : ''}`);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'reviewed':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Reviewed</Badge>;
      case 'prescription_updated':
        return <Badge className="bg-blue-100 text-blue-700"><Pill className="h-3 w-3 mr-1" />Prescription Updated</Badge>;
      case 'pending_review':
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl text-gray-900 mb-2">Health Condition Report</h1>
        <p className="text-muted-foreground">
          Report your current health condition, symptoms, and treatment progress. Your doctor will review this and adjust your prescription if necessary.
        </p>
      </div>

      <OfflineWarningBanner user={user} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Health Report Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span>Current Health Status</span>
              </CardTitle>
              <CardDescription>
                Please provide accurate information about your current condition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitFeedback} className="space-y-6">
                {/* Therapy Phase */}
                <div>
                  <Label>Current Therapy Phase</Label>
                  <Select 
                    value={currentFeedback.therapyPhase} 
                    onValueChange={(value) => setCurrentFeedback(prev => ({ ...prev, therapyPhase: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {therapyPhases.map((phase) => (
                        <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Current Symptoms */}
                <div>
                  <Label className="flex items-center space-x-2 mb-3">
                    <Thermometer className="h-4 w-4" />
                    <span>Current Symptoms (Check all that apply)</span>
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableSymptoms.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom}
                          checked={currentFeedback.symptoms.includes(symptom)}
                          onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                        />
                        <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pain Level */}
                <div>
                  <Label className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Pain Level (0 = No Pain, 10 = Severe Pain)</span>
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[currentFeedback.painLevel]}
                      onValueChange={([value]) => setCurrentFeedback(prev => ({ ...prev, painLevel: value }))}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>No Pain</span>
                      <span className="font-medium">{currentFeedback.painLevel}/10</span>
                      <span>Severe Pain</span>
                    </div>
                  </div>
                </div>

                {/* Energy Level */}
                <div>
                  <Label className="flex items-center space-x-2 mb-3">
                    <Activity className="h-4 w-4" />
                    <span>Energy Level (0 = Very Low, 10 = Very High)</span>
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[currentFeedback.energyLevel]}
                      onValueChange={([value]) => setCurrentFeedback(prev => ({ ...prev, energyLevel: value }))}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Very Low</span>
                      <span className="font-medium">{currentFeedback.energyLevel}/10</span>
                      <span>Very High</span>
                    </div>
                  </div>
                </div>

                {/* Digestive Issues */}
                <div>
                  <Label className="flex items-center space-x-2 mb-3">
                    <Utensils className="h-4 w-4" />
                    <span>Digestive Issues (Check all that apply)</span>
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {digestiveIssueOptions.map((issue) => (
                      <div key={issue} className="flex items-center space-x-2">
                        <Checkbox
                          id={issue}
                          checked={currentFeedback.digestiveIssues.includes(issue)}
                          onCheckedChange={(checked) => handleDigestiveIssueChange(issue, checked as boolean)}
                        />
                        <Label htmlFor={issue} className="text-sm">{issue}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sleep Quality */}
                <div>
                  <Label className="flex items-center space-x-2 mb-3">
                    <Moon className="h-4 w-4" />
                    <span>Sleep Quality (0 = Very Poor, 10 = Excellent)</span>
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[currentFeedback.sleepQuality]}
                      onValueChange={([value]) => setCurrentFeedback(prev => ({ ...prev, sleepQuality: value }))}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Very Poor</span>
                      <span className="font-medium">{currentFeedback.sleepQuality}/10</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                </div>

                {/* Mood */}
                <div>
                  <Label className="flex items-center space-x-2 mb-3">
                    <Brain className="h-4 w-4" />
                    <span>Overall Mood (0 = Very Low, 10 = Very Good)</span>
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={[currentFeedback.mood]}
                      onValueChange={([value]) => setCurrentFeedback(prev => ({ ...prev, mood: value }))}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Very Low</span>
                      <span className="font-medium">{currentFeedback.mood}/10</span>
                      <span>Very Good</span>
                    </div>
                  </div>
                </div>

                {/* Complications */}
                <div>
                  <Label className="flex items-center space-x-2 mb-3">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>Any Complications or Concerns?</span>
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {complicationOptions.map((complication) => (
                      <div key={complication} className="flex items-center space-x-2">
                        <Checkbox
                          id={complication}
                          checked={currentFeedback.complications.includes(complication)}
                          onCheckedChange={(checked) => handleComplicationChange(complication, checked as boolean)}
                        />
                        <Label htmlFor={complication} className="text-sm">{complication}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Medications */}
                <div>
                  <Label className="flex items-center space-x-2 mb-3">
                    <Pill className="h-4 w-4" />
                    <span>Medications Currently Taking</span>
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentMedications.map((medication) => (
                      <div key={medication} className="flex items-center space-x-2">
                        <Checkbox
                          id={medication}
                          checked={currentFeedback.medications.includes(medication)}
                          onCheckedChange={(checked) => handleMedicationChange(medication, checked as boolean)}
                        />
                        <Label htmlFor={medication} className="text-sm">{medication}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <Label>Additional Notes or Specific Concerns</Label>
                  <Textarea
                    placeholder="Please describe any other symptoms, concerns, or observations about your treatment progress..."
                    value={currentFeedback.notes}
                    onChange={(e) => setCurrentFeedback(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit Health Report'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Information Panel */}
        <div className="space-y-6">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Important Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Report your condition honestly and accurately</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Include all symptoms, even minor ones</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Your doctor will review within 24 hours</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Prescription changes will be notified promptly</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  <strong>Emergency:</strong> For severe symptoms or medical emergencies, contact your doctor immediately or visit the nearest hospital.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reports Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Reports</CardTitle>
              <CardDescription>Your latest health condition reports</CardDescription>
            </CardHeader>
            <CardContent>
              {previousFeedback.length > 0 ? (
                <div className="space-y-3">
                  {previousFeedback.slice(0, 3).map((feedback, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {feedback.timestamp ? new Date(feedback.timestamp).toLocaleDateString() : 'Recent'}
                        </span>
                        {getStatusBadge(feedback.status || 'pending_review')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <p>Symptoms: {feedback.symptoms.length} reported</p>
                        <p>Pain Level: {feedback.painLevel}/10</p>
                        <p>Energy: {feedback.energyLevel}/10</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No previous reports found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Previous Reports History */}
      {previousFeedback.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg mb-4">Report History</h2>
          <div className="space-y-4">
            {previousFeedback.map((feedback, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{feedback.therapyPhase}</h4>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>{feedback.timestamp ? new Date(feedback.timestamp).toLocaleDateString() : 'Date unknown'}</span>
                      </div>
                    </div>
                    {getStatusBadge(feedback.status || 'pending_review')}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Symptoms:</p>
                      <p className="text-sm text-muted-foreground">
                        {feedback.symptoms.length > 0 ? feedback.symptoms.join(', ') : 'None reported'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Health Metrics:</p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Pain: {feedback.painLevel}/10</p>
                        <p>Energy: {feedback.energyLevel}/10</p>
                        <p>Sleep: {feedback.sleepQuality}/10</p>
                        <p>Mood: {feedback.mood}/10</p>
                      </div>
                    </div>
                  </div>

                  {feedback.complications && feedback.complications.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-1">Complications:</p>
                      <p className="text-sm text-muted-foreground">{feedback.complications.join(', ')}</p>
                    </div>
                  )}

                  {feedback.notes && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-1">Patient Notes:</p>
                      <p className="text-sm text-muted-foreground">{feedback.notes}</p>
                    </div>
                  )}

                  {feedback.doctorNotes && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-1">Doctor's Response:</p>
                      <p className="text-sm text-muted-foreground">{feedback.doctorNotes}</p>
                      {feedback.prescriptionChanges && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-1">Prescription Changes:</p>
                          <p className="text-sm text-muted-foreground">{feedback.prescriptionChanges}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}