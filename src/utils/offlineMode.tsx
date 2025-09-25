/**
 * Offline Mode Utilities for Prankarma
 * Provides fallback functionality when Supabase is unavailable
 */

import { projectId, publicAnonKey } from './supabase/info';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  isOffline?: boolean;
}

// Check if we're in demo/offline mode
export const isDemoMode = (user: any): boolean => {
  return user?.demoMode === true;
};

// Generic API wrapper with offline fallback
export const apiCall = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData?: T
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-3066d3c4${endpoint}`,
      {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          ...options.headers,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API call failed');
    }
  } catch (error) {
    console.warn(`API call failed for ${endpoint}:`, error);
    
    if (fallbackData !== undefined) {
      return { 
        success: true, 
        data: fallbackData, 
        isOffline: true 
      };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error',
      isOffline: true 
    };
  }
};

// Mock data generators for offline mode
export const generateMockTherapyRequests = (patientId: string) => [
  {
    id: 'mock-req-1',
    patientId,
    therapyType: 'Virechana Therapy',
    urgency: 'medium',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    symptoms: ['digestive issues', 'fatigue'],
    notes: 'Experiencing digestive discomfort for 2 weeks'
  },
  {
    id: 'mock-req-2',
    patientId,
    therapyType: 'Nasya Treatment',
    urgency: 'low',
    status: 'scheduled',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: '10:00',
    assignedDoctorId: 'd1',
    doctorInfo: {
      name: 'Dr. Anjali Patel',
      specialization: 'Panchkarma Specialist',
      phone: '+91 99999 11111'
    }
  }
];

export const generateMockFeedback = (userId: string) => [
  {
    id: 'mock-feedback-1',
    userId,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    symptoms: ['mild headache', 'improved digestion'],
    painLevel: 2,
    energyLevel: 7,
    digestiveIssues: [],
    sleepQuality: 8,
    mood: 7,
    complications: [],
    notes: 'Feeling much better after the treatment',
    medications: ['Triphala Churna'],
    therapyPhase: 'Post-treatment recovery',
    status: 'reviewed'
  },
  {
    id: 'mock-feedback-2',
    userId,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    symptoms: ['fatigue', 'digestive issues'],
    painLevel: 4,
    energyLevel: 5,
    digestiveIssues: ['bloating', 'irregular bowel'],
    sleepQuality: 6,
    mood: 6,
    complications: [],
    notes: 'Some improvement but still experiencing issues',
    medications: ['Ashwagandha', 'Triphala'],
    therapyPhase: 'Active treatment',
    status: 'pending_review'
  }
];

export const generateMockPrescriptions = (patientId: string) => [
  {
    id: 'mock-prescription-1',
    patientId,
    doctorId: 'd1',
    medications: [
      {
        name: 'Triphala Churna',
        dosage: '1 tsp',
        frequency: 'Twice daily',
        timing: 'Before meals'
      },
      {
        name: 'Ashwagandha Powder',
        dosage: '1/2 tsp',
        frequency: 'Once daily',
        timing: 'With warm milk at night'
      }
    ],
    instructions: 'Take medications as prescribed. Maintain light diet during treatment.',
    duration: '15 days',
    notes: 'Follow up after completing course',
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    doctorInfo: {
      name: 'Dr. Anjali Patel',
      specialization: 'Panchkarma Specialist'
    }
  }
];

export const generateMockAppointments = (userId: string, userRole: 'patient' | 'doctor') => [
  {
    id: 'mock-appointment-1',
    patientId: userRole === 'patient' ? userId : 'p1',
    doctorId: userRole === 'doctor' ? userId : 'd1',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    type: 'consultation',
    status: 'scheduled',
    notes: 'Regular follow-up consultation',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mock-appointment-2',
    patientId: userRole === 'patient' ? userId : 'p2',
    doctorId: userRole === 'doctor' ? userId : 'd1',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '14:30',
    type: 'therapy',
    status: 'scheduled',
    notes: 'Virechana therapy session',
    createdAt: new Date().toISOString()
  }
];

// Offline notification manager
export const OfflineNotificationManager = {
  show: (message: string, type: 'info' | 'warning' | 'error' = 'info') => {
    // Create a simple notification system for offline mode
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-black' :
      'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="flex-1">${message}</div>
        <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">×</button>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }
};