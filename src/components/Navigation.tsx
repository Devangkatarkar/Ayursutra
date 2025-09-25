import React, { useState } from 'react';
import { Button } from './ui/button';
import { 
  Home, 
  FileText, 
  MessageCircle, 
  BarChart3, 
  TrendingUp, 
  Bot, 
  Phone, 
  LogOut,
  Menu,
  X,
  Users,
  Calendar,
  Stethoscope,
  Globe
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MandalaLogo } from './MandalaLogo';
import { LanguageSelector } from './LanguageSelector';
import { NotificationCenter } from './NotificationCenter';
import { useLanguage } from '../contexts/LanguageContext';
import { isDemoMode } from '../utils/offlineMode';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  user: any;
}

export function Navigation({ activeSection, onSectionChange, onLogout, user }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const isDemo = isDemoMode(user);
  
  // Different navigation items based on user role
  const patientNavItems = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'prescription', label: t('nav.prescription'), icon: FileText },
    { id: 'feedback', label: t('nav.feedback'), icon: MessageCircle },
    { id: 'report', label: t('nav.report'), icon: BarChart3 },
    { id: 'progress', label: t('nav.progress'), icon: TrendingUp },
    { id: 'help', label: t('nav.help'), icon: Bot },
    { id: 'contact', label: 'Doctor Connect', icon: Calendar },
  ];

  const doctorNavItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
    { id: 'patients', label: t('nav.patients'), icon: Users },
    { id: 'appointments', label: 'Therapy Requests', icon: Calendar },
    { id: 'consultations', label: 'Consultations', icon: Stethoscope },
    { id: 'reports', label: 'Patient Reports', icon: BarChart3 },
    { id: 'prescriptions', label: t('nav.prescription'), icon: FileText },
    { id: 'help', label: t('nav.help'), icon: Bot },
  ];

  const navItems = user?.role === 'doctor' ? doctorNavItems : patientNavItems;

  const handleMobileNavClick = (sectionId: string) => {
    onSectionChange(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-green-100 relative">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
        <div className="flex items-center h-16">
          {/* Logo with Status Indicator */}
          <div className="flex items-center space-x-3 flex-shrink-0 mr-6">
            <div className="relative">
              <MandalaLogo size={32} />
              {/* Simple colored dot indicator */}
              <div 
                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  isDemo ? 'bg-orange-400' : 'bg-green-400'
                }`}
                title={isDemo ? 'Demo Mode' : 'Live Mode'}
              />
            </div>
            <span className="text-lg text-green-800 hidden sm:inline">Prankarma</span>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex space-x-1 flex-1 justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  onClick={() => onSectionChange(item.id)}
                  className={`flex items-center space-x-1 whitespace-nowrap px-2 text-xs ${
                    activeSection === item.id 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                  size="sm"
                >
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="hidden lg:inline">{item.label}</span>
                  <span className="lg:hidden">{item.label.split(' ')[0]}</span>
                </Button>
              );
            })}
          </div>

          {/* User Profile & Controls - Moved left with better spacing */}
          <div className="flex items-center space-x-1 ml-4">
            {/* Notifications */}
            <NotificationCenter user={user} />
            
            {/* Language Selector */}
            <div className="hidden sm:block">
              <LanguageSelector variant="compact" />
            </div>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </Button>

            {/* User info - desktop only with tighter spacing */}
            <div className="hidden lg:flex items-center space-x-1.5">
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-900 truncate max-w-24">{user.name}</span>
                <span className="text-xs text-gray-500 truncate max-w-24">{user.therapyPlan}</span>
              </div>
              
              <Avatar className="h-7 w-7">
                <AvatarImage src="" />
                <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                  {user.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <Button variant="ghost" size="sm" onClick={onLogout} className="p-1.5">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-green-100 shadow-lg">
          <div className="px-4 py-2 space-y-1">
            {/* User Info on Mobile */}
            <div className="flex items-center space-x-3 py-3 border-b border-gray-100">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-green-100 text-green-700">
                  {user.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.therapyPlan}</p>
              </div>
              {/* Status indicator on mobile */}
              <div className="flex items-center space-x-1">
                <div 
                  className={`w-2 h-2 rounded-full ${
                    isDemo ? 'bg-orange-400' : 'bg-green-400'
                  }`}
                />
                <span className={`text-xs ${
                  isDemo ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {isDemo ? 'Demo' : 'Live'}
                </span>
              </div>
            </div>

            {/* Navigation Items */}
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => handleMobileNavClick(item.id)}
                  className={`w-full justify-start space-x-3 py-3 ${
                    activeSection === item.id 
                      ? 'bg-green-50 text-green-700 border-r-2 border-green-600' 
                      : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              );
            })}

            {/* Language Selector on Mobile */}
            <div className="py-3 border-t border-gray-100">
              <LanguageSelector variant="intro" className="w-full" />
            </div>

            {/* Logout Button */}
            <div className="pt-2 border-t border-gray-100">
              <Button
                variant="ghost"
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start space-x-3 py-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span>{t('nav.logout')}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}