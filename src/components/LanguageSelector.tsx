import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useLanguage, Language } from '../contexts/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'default' | 'compact' | 'intro';
  className?: string;
}

export function LanguageSelector({ variant = 'default', className = '' }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  if (variant === 'intro') {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 text-center">
          {t('intro.language')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? 'default' : 'outline'}
              className={`flex flex-col items-center p-4 h-auto ${
                language === lang.code 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'hover:bg-purple-50'
              }`}
              onClick={() => setLanguage(lang.code)}
            >
              <span className="text-sm font-medium">{lang.name}</span>
              <span className="text-xs opacity-80">{lang.nativeName}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={`h-8 px-2 ${className}`}>
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={language === lang.code ? 'bg-purple-50' : ''}
            >
              <span className="flex items-center justify-between w-full">
                <span>{lang.name}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {lang.nativeName}
                </span>
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`flex items-center space-x-2 ${className}`}>
          <Globe className="h-4 w-4" />
          <span>{currentLanguage?.nativeName || 'English'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center justify-between ${
              language === lang.code ? 'bg-purple-50' : ''
            }`}
          >
            <span className="font-medium">{lang.name}</span>
            <span className="text-sm text-muted-foreground">
              {lang.nativeName}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}