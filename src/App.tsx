import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { PrescriptionSection } from './components/sections/PrescriptionSection';
import { FeedbackSection } from './components/sections/FeedbackSection';
import { ReportSection } from './components/sections/ReportSection';
import { ProgressSection } from './components/sections/ProgressSection';
import { HelpChatSection } from './components/sections/HelpChatSection';
import { ContactDoctorSection } from './components/sections/ContactDoctorSection';
import { TherapyRequestSection } from './components/sections/TherapyRequestSection';

import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { PatientManagement } from './components/doctor/PatientManagement';
import { TherapyManagement } from './components/doctor/TherapyManagement';
import { IntroductionPage } from './components/IntroductionPage';
import { LanguageProvider } from './contexts/LanguageContext';


interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor';
  therapyPlan?: string;
  joinDate?: string;
  specialization?: string;
  licenseNumber?: string;
  experience?: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [showIntroduction, setShowIntroduction] = useState(true);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setShowIntroduction(true); // Show introduction after login
    setActiveSection(userData.role === 'doctor' ? 'dashboard' : 'home');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveSection('home');
    setShowIntroduction(true);
  };

  const handleIntroductionComplete = () => {
    setShowIntroduction(false);
  };

  const renderActiveSection = () => {
    if (!user) return null;

    if (user.role === 'doctor') {
      // Doctor sections
      switch (activeSection) {
        case 'dashboard':
          return <DoctorDashboard doctor={user} />;
        case 'patients':
          return <PatientManagement doctor={user} />;
        case 'appointments':
          return <TherapyManagement doctor={user} />;
        case 'consultations':
          return <div className="p-8 text-center">Consultations Coming Soon</div>;
        case 'reports':
          return <div className="p-8 text-center">Patient Reports Coming Soon</div>;
        case 'prescriptions':
          return <div className="p-8 text-center">Prescription Management Coming Soon</div>;
        case 'help':
          return <HelpChatSection />;
        default:
          return <DoctorDashboard doctor={user} />;
      }
    } else {
      // Patient sections
      switch (activeSection) {
        case 'home':
          return <Dashboard user={user} />;
        case 'prescription':
          return <PrescriptionSection />;
        case 'feedback':
          return <FeedbackSection user={user} />;
        case 'report':
          return <ReportSection />;
        case 'progress':
          return <ProgressSection />;
        case 'help':
          return <HelpChatSection />;
        case 'contact':
          return <ContactDoctorSection user={user} />;

        default:
          return <Dashboard user={user} />;
      }
    }
  };

  return (
    <LanguageProvider>
      {!user ? (
        <LoginForm onLogin={handleLogin} />
      ) : showIntroduction ? (
        <IntroductionPage onContinue={handleIntroductionComplete} />
      ) : (
        <div className="min-h-screen bg-gray-50">
          <Navigation 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onLogout={handleLogout}
            user={user}
          />
          <main>
            {renderActiveSection()}
          </main>
        </div>
      )}
    </LanguageProvider>
  );
}