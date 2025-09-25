import { projectId, publicAnonKey } from './info';

interface HealthFeedback {
  userId: string;
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
}

interface FeedbackResponse {
  id: string;
  userId: string;
  timestamp: string;
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
  status: string;
  doctorNotes?: string;
  prescriptionChanges?: string;
  reviewedAt?: string;
  patientInfo?: {
    name: string;
    phone: string;
    therapyPlan: string;
  };
}

interface TherapyRequest {
  patientId: string;
  therapyType: string;
  urgency: 'low' | 'medium' | 'high';
  symptoms: string[];
  notes: string;
  preferredDoctorId?: string;
}

interface Prescription {
  patientId: string;
  doctorId: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  instructions: string;
  duration: string;
  notes: string;
  feedbackId?: string;
}

interface Notification {
  id: string;
  userId: string;
  type: string;
  priority: string;
  message: string;
  data?: any;
  timestamp: string;
  read: boolean;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-3066d3c4`;

export const submitHealthFeedback = async (feedback: HealthFeedback): Promise<{ success: boolean; feedbackId?: string; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(feedback),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit feedback');
    }

    return { success: true, feedbackId: data.feedbackId };
  } catch (error) {
    console.error('Error submitting health feedback:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getUserFeedback = async (userId: string): Promise<{ feedback?: FeedbackResponse[]; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/feedback/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to retrieve feedback');
    }

    return { feedback: data.feedback };
  } catch (error) {
    console.error('Error retrieving user feedback:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Therapy Request API
export const submitTherapyRequest = async (request: TherapyRequest): Promise<{ success: boolean; requestId?: string; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/therapy/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit therapy request');
    }

    return { success: true, requestId: data.requestId };
  } catch (error) {
    console.error('Error submitting therapy request:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const acceptTherapyRequest = async (requestId: string, doctorId: string, scheduledDate: string, scheduledTime: string, treatmentPlan?: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/therapy/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        requestId,
        doctorId,
        scheduledDate,
        scheduledTime,
        treatmentPlan
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to accept therapy request');
    }

    return { success: true };
  } catch (error) {
    console.error('Error accepting therapy request:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getPendingTherapyRequests = async (): Promise<{ requests?: any[]; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/therapy/pending`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get pending requests');
    }

    return { requests: data.requests };
  } catch (error) {
    console.error('Error getting pending therapy requests:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getDoctorTherapyRequests = async (doctorId: string): Promise<{ requests?: any[]; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/doctor/${doctorId}/therapy-requests`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get therapy requests');
    }

    return { requests: data.requests };
  } catch (error) {
    console.error('Error getting doctor therapy requests:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getPatientTherapyRequests = async (patientId: string): Promise<{ requests?: any[]; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/patient/${patientId}/therapy-requests`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get therapy requests');
    }

    return { requests: data.requests };
  } catch (error) {
    console.error('Error getting patient therapy requests:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Prescription API
export const createPrescription = async (prescription: Prescription): Promise<{ success: boolean; prescriptionId?: string; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/prescriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(prescription),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create prescription');
    }

    return { success: true, prescriptionId: data.prescriptionId };
  } catch (error) {
    console.error('Error creating prescription:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getPatientPrescriptions = async (patientId: string): Promise<{ prescriptions?: any[]; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/patient/${patientId}/prescriptions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get prescriptions');
    }

    return { prescriptions: data.prescriptions };
  } catch (error) {
    console.error('Error getting patient prescriptions:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getDoctorPrescriptions = async (doctorId: string): Promise<{ prescriptions?: any[]; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/doctor/${doctorId}/prescriptions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get prescriptions');
    }

    return { prescriptions: data.prescriptions };
  } catch (error) {
    console.error('Error getting doctor prescriptions:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getDoctorPatients = async (doctorId: string): Promise<{ patients?: any[]; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/doctor/${doctorId}/patients`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get patients');
    }

    return { patients: data.patients };
  } catch (error) {
    console.error('Error getting doctor patients:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getDoctorPendingFeedback = async (doctorId: string): Promise<{ feedback?: FeedbackResponse[]; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/doctor/${doctorId}/pending-feedback`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get pending feedback');
    }

    return { feedback: data.feedback };
  } catch (error) {
    console.error('Error getting pending feedback:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Notifications API
export const getUserNotifications = async (userId: string): Promise<{ notifications?: Notification[]; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/notifications/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get notifications');
    }

    return { notifications: data.notifications };
  } catch (error) {
    console.error('Error getting notifications:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const sendNotification = async (userId: string, message: string, type: string, priority: string = 'medium', fromUserId?: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({
        userId,
        message,
        type,
        priority,
        fromUserId
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send notification');
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};