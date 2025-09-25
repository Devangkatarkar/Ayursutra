// Patient Progress Generator - Creates unique therapy journeys for each login
export interface TherapyJourney {
  id: string;
  currentPhase: 'preparation' | 'purification' | 'rejuvenation' | 'maintenance';
  therapyType: 'vamanam' | 'virechana' | 'basti' | 'nasya' | 'raktamokshana';
  daysCompleted: number;
  totalDays: number;
  symptoms: string[];
  improvements: string[];
  nextAppointment: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    taken: boolean;
  }>;
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    weight: number;
    temperature: number;
  };
  doshaBalance: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  therapyProgress: Array<{
    date: string;
    activity: string;
    notes: string;
    rating: number;
  }>;
}

const therapyTypes = ['vamanam', 'virechana', 'basti', 'nasya', 'raktamokshana'] as const;
const phases = ['preparation', 'purification', 'rejuvenation', 'maintenance'] as const;

const symptomsList = [
  'Joint pain relief', 'Better digestion', 'Improved sleep', 'Reduced stress',
  'Clear skin', 'Increased energy', 'Better focus', 'Reduced headaches',
  'Lower blood pressure', 'Weight management', 'Improved immunity', 'Better circulation'
];

const improvementsList = [
  'Significant pain reduction', 'Enhanced mental clarity', 'Improved sleep quality',
  'Better stress management', 'Increased flexibility', 'Enhanced digestion',
  'Improved skin texture', 'Better energy levels', 'Reduced inflammation',
  'Improved breathing', 'Better emotional balance', 'Enhanced overall wellness'
];

const medicationsList = [
  { name: 'Triphala Churna', dosages: ['1 tsp', '2 tsp', '1 tbsp'], frequencies: ['Once daily', 'Twice daily', 'Three times daily'] },
  { name: 'Ashwagandha Capsules', dosages: ['250mg', '500mg', '750mg'], frequencies: ['Once daily', 'Twice daily'] },
  { name: 'Brahmi Tablets', dosages: ['300mg', '500mg'], frequencies: ['Once daily', 'Twice daily'] },
  { name: 'Giloy Juice', dosages: ['10ml', '15ml', '20ml'], frequencies: ['Once daily', 'Twice daily'] },
  { name: 'Arjuna Powder', dosages: ['1 tsp', '2 tsp'], frequencies: ['Once daily', 'Twice daily'] },
  { name: 'Neem Capsules', dosages: ['250mg', '500mg'], frequencies: ['Once daily', 'Twice daily'] }
];

const activitiesList = [
  'Morning meditation session', 'Therapeutic oil massage', 'Herbal steam bath',
  'Yoga and pranayama', 'Dietary consultation', 'Pulse diagnosis',
  'Panchakarma preparation', 'Detoxification treatment', 'Rejuvenation therapy',
  'Lifestyle counseling', 'Herbal medicine adjustment', 'Progress assessment'
];

// Generate random but realistic data
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals: number = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateRecentDates(count: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * 2); // Every other day
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

function generateFutureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

export function generateUniquePatientJourney(patientId: string): TherapyJourney {
  // Use patient ID to seed randomness for consistency per user
  const baseSeed = patientId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  let seedCounter = baseSeed;
  
  const seededRandom = () => {
    const x = Math.sin(seedCounter++) * 10000;
    return x - Math.floor(x);
  };

  // Use seeded random functions instead of global Math.random
  function seededGetRandomElement<T>(array: T[]): T {
    return array[Math.floor(seededRandom() * array.length)];
  }

  function seededGetRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - seededRandom());
    return shuffled.slice(0, count);
  }

  function seededGetRandomNumber(min: number, max: number): number {
    return Math.floor(seededRandom() * (max - min + 1)) + min;
  }

  function seededGetRandomFloat(min: number, max: number, decimals: number = 1): number {
    return parseFloat((seededRandom() * (max - min) + min).toFixed(decimals));
  }

  const therapyType = seededGetRandomElement(therapyTypes);
  const currentPhase = seededGetRandomElement(phases);
  const daysCompleted = seededGetRandomNumber(5, 45);
  const totalDays = seededGetRandomNumber(daysCompleted + 10, 60);
  
  // Generate medications (2-4 medications)
  const medicationCount = seededGetRandomNumber(2, 4);
  const medications = seededGetRandomElements(medicationsList, medicationCount).map(med => ({
    name: med.name,
    dosage: seededGetRandomElement(med.dosages),
    frequency: seededGetRandomElement(med.frequencies),
    taken: seededRandom() > 0.3 // 70% chance of being taken
  }));

  // Generate therapy progress (5-10 entries)
  const progressCount = seededGetRandomNumber(5, 10);
  const recentDates = generateRecentDates(progressCount);
  const therapyProgress = recentDates.map(date => ({
    date,
    activity: seededGetRandomElement(activitiesList),
    notes: `${seededGetRandomElement(['Excellent', 'Good', 'Satisfactory', 'Moderate'])} response to treatment. ${seededGetRandomElement(['Patient feeling better', 'Some improvement noted', 'Positive changes observed', 'Steady progress'])}`,
    rating: seededGetRandomNumber(3, 5)
  }));

  // Generate vital signs
  const vitalSigns = {
    bloodPressure: `${seededGetRandomNumber(110, 140)}/${seededGetRandomNumber(70, 90)}`,
    heartRate: seededGetRandomNumber(65, 85),
    weight: seededGetRandomFloat(55, 85, 1),
    temperature: seededGetRandomFloat(97.8, 99.2, 1)
  };

  // Generate dosha balance (should add up to 100)
  const vata = seededGetRandomNumber(20, 40);
  const pitta = seededGetRandomNumber(20, 40);
  const kapha = 100 - vata - pitta;

  const doshaBalance = { vata, pitta, kapha };

  // Generate symptoms and improvements
  const symptoms = seededGetRandomElements(symptomsList, seededGetRandomNumber(3, 6));
  const improvements = seededGetRandomElements(improvementsList, seededGetRandomNumber(2, 5));

  return {
    id: `journey_${patientId}_${Date.now()}`,
    currentPhase,
    therapyType,
    daysCompleted,
    totalDays,
    symptoms,
    improvements,
    nextAppointment: generateFutureDate(seededGetRandomNumber(3, 14)),
    medications,
    vitalSigns,
    doshaBalance,
    therapyProgress
  };
}

// Generate patient profile variations
export interface PatientProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  occupation: string;
  location: string;
  primaryConcerns: string[];
  medicalHistory: string[];
  lifestyle: {
    exerciseFrequency: string;
    sleepHours: number;
    stressLevel: number;
    dietType: string;
  };
  constitution: {
    primary: 'vata' | 'pitta' | 'kapha';
    secondary: 'vata' | 'pitta' | 'kapha';
  };
}

const occupations = [
  'Software Engineer', 'Teacher', 'Doctor', 'Business Owner', 'Student',
  'Marketing Manager', 'Accountant', 'Artist', 'Lawyer', 'Consultant',
  'Engineer', 'Designer', 'Sales Executive', 'Writer', 'Therapist'
];

const locations = [
  'Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka', 'Chennai, Tamil Nadu',
  'Hyderabad, Telangana', 'Pune, Maharashtra', 'Kolkata, West Bengal', 'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan', 'Lucknow, Uttar Pradesh', 'Kochi, Kerala', 'Indore, Madhya Pradesh'
];

const concerns = [
  'Chronic stress', 'Sleep disorders', 'Digestive issues', 'Joint pain',
  'Skin problems', 'Weight management', 'Anxiety', 'Fatigue',
  'High blood pressure', 'Diabetes', 'Arthritis', 'Migraine'
];

const medicalHistoryItems = [
  'No significant history', 'Hypertension', 'Diabetes Type 2', 'Thyroid disorder',
  'Anxiety disorder', 'Back injury', 'Allergies', 'Asthma',
  'Heart disease family history', 'Arthritis', 'Depression', 'PCOD/PCOS'
];

const dietTypes = ['Vegetarian', 'Non-vegetarian', 'Vegan', 'Balanced mixed diet'];
const exerciseFrequencies = ['Rarely', '1-2 times/week', '3-4 times/week', '5+ times/week'];

export function generatePatientProfile(patientId: string): PatientProfile {
  // Use patient ID for consistent randomization
  const seed = patientId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  let seedCounter = seed;
  const seededRandom = () => {
    const x = Math.sin(seedCounter++) * 10000;
    return x - Math.floor(x);
  };

  const age = Math.floor(seededRandom() * 50) + 20; // 20-70 years
  const gender = ['male', 'female'][Math.floor(seededRandom() * 2)] as 'male' | 'female';
  
  const constitution = {
    primary: ['vata', 'pitta', 'kapha'][Math.floor(seededRandom() * 3)] as 'vata' | 'pitta' | 'kapha',
    secondary: ['vata', 'pitta', 'kapha'][Math.floor(seededRandom() * 3)] as 'vata' | 'pitta' | 'kapha'
  };

  return {
    age,
    gender,
    occupation: occupations[Math.floor(seededRandom() * occupations.length)],
    location: locations[Math.floor(seededRandom() * locations.length)],
    primaryConcerns: concerns.sort(() => 0.5 - seededRandom()).slice(0, Math.floor(seededRandom() * 3) + 2),
    medicalHistory: medicalHistoryItems.sort(() => 0.5 - seededRandom()).slice(0, Math.floor(seededRandom() * 2) + 1),
    lifestyle: {
      exerciseFrequency: exerciseFrequencies[Math.floor(seededRandom() * exerciseFrequencies.length)],
      sleepHours: Math.floor(seededRandom() * 4) + 6, // 6-10 hours
      stressLevel: Math.floor(seededRandom() * 5) + 1, // 1-5 scale
      dietType: dietTypes[Math.floor(seededRandom() * dietTypes.length)]
    },
    constitution
  };
}

// Storage utilities for patient data
export const PatientStorage = {
  saveJourney: (patientId: string, journey: TherapyJourney) => {
    localStorage.setItem(`patient_journey_${patientId}`, JSON.stringify(journey));
  },

  loadJourney: (patientId: string): TherapyJourney | null => {
    const stored = localStorage.getItem(`patient_journey_${patientId}`);
    return stored ? JSON.parse(stored) : null;
  },

  saveProfile: (patientId: string, profile: PatientProfile) => {
    localStorage.setItem(`patient_profile_${patientId}`, JSON.stringify(profile));
  },

  loadProfile: (patientId: string): PatientProfile | null => {
    const stored = localStorage.getItem(`patient_profile_${patientId}`);
    return stored ? JSON.parse(stored) : null;
  },

  clearPatientData: (patientId: string) => {
    localStorage.removeItem(`patient_journey_${patientId}`);
    localStorage.removeItem(`patient_profile_${patientId}`);
  }
};

// Special showcase journey for John Doe - demonstrates all therapy types and stages
export interface ShowcaseTherapy {
  therapyType: 'vamanam' | 'virechana' | 'basti' | 'nasya' | 'raktamokshana';
  status: 'completed' | 'in-progress' | 'pending';
  phase: 'preparation' | 'purification' | 'rejuvenation' | 'maintenance';
  daysCompleted: number;
  totalDays: number;
  completionPercentage: number;
  lastActivity: string;
  nextScheduled: string;
  benefits: string[];
}

export function generateJohnDoeShowcase(): {
  therapies: ShowcaseTherapy[];
  overallProgress: number;
  currentTherapy: string;
  completedTherapies: number;
  totalTherapies: number;
} {
  const therapies: ShowcaseTherapy[] = [
    {
      therapyType: 'vamanam',
      status: 'completed',
      phase: 'maintenance',
      daysCompleted: 21,
      totalDays: 21,
      completionPercentage: 100,
      lastActivity: 'Final assessment and maintenance plan',
      nextScheduled: 'Follow-up in 3 months',
      benefits: ['Complete respiratory system cleansing', 'Improved lung capacity', 'Enhanced immunity']
    },
    {
      therapyType: 'virechana',
      status: 'completed',
      phase: 'maintenance',
      daysCompleted: 28,
      totalDays: 28,
      completionPercentage: 100,
      lastActivity: 'Rejuvenation therapy completed',
      nextScheduled: 'Quarterly review',
      benefits: ['Digestive system purification', 'Improved metabolism', 'Better nutrient absorption']
    },
    {
      therapyType: 'basti',
      status: 'in-progress',
      phase: 'purification',
      daysCompleted: 15,
      totalDays: 30,
      completionPercentage: 50,
      lastActivity: 'Therapeutic enema - Day 15',
      nextScheduled: 'Tomorrow 9:00 AM',
      benefits: ['Nervous system balancing', 'Joint pain relief', 'Improved mobility']
    },
    {
      therapyType: 'nasya',
      status: 'pending',
      phase: 'preparation',
      daysCompleted: 0,
      totalDays: 14,
      completionPercentage: 0,
      lastActivity: 'Initial consultation scheduled',
      nextScheduled: 'Next week - preparation phase',
      benefits: ['Sinuses and head region cleansing', 'Mental clarity', 'Improved breathing']
    },
    {
      therapyType: 'raktamokshana',
      status: 'pending',
      phase: 'preparation',
      daysCompleted: 0,
      totalDays: 7,
      completionPercentage: 0,
      lastActivity: 'Awaiting completion of Basti therapy',
      nextScheduled: 'To be scheduled after Nasya',
      benefits: ['Blood purification', 'Skin health improvement', 'Enhanced circulation']
    }
  ];

  const completedTherapies = therapies.filter(t => t.status === 'completed').length;
  const totalTherapies = therapies.length;
  const overallProgress = Math.round((completedTherapies / totalTherapies) * 100);
  const currentTherapy = therapies.find(t => t.status === 'in-progress')?.therapyType || 'basti';

  return {
    therapies,
    overallProgress,
    currentTherapy,
    completedTherapies,
    totalTherapies
  };
}