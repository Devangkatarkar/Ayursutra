import React from 'react';
import { Badge } from './ui/badge';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { isDemoMode } from '../utils/offlineMode';

interface OfflineStatusIndicatorProps {
  user: any;
  className?: string;
}

export function OfflineStatusIndicator({ user, className = '' }: OfflineStatusIndicatorProps) {
  const isDemo = isDemoMode(user);

  if (!isDemo) {
    return (
      <Badge variant="outline" className={`text-green-600 border-green-200 ${className}`}>
        <Wifi className="h-3 w-3 mr-1" />
        Live Mode
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={`text-orange-600 border-orange-200 bg-orange-50 ${className}`}>
      <WifiOff className="h-3 w-3 mr-1" />
      Demo Mode
    </Badge>
  );
}

interface OfflineWarningBannerProps {
  user: any;
  className?: string;
}

export function OfflineWarningBanner({ user, className = '' }: OfflineWarningBannerProps) {
  const isDemo = isDemoMode(user);

  if (!isDemo) return null;

  return (
    <div className={`bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <div className="flex-1">
          <p className="text-sm text-orange-800">
            <strong>Demo Mode:</strong> You're using mock data. Real database features are unavailable.
          </p>
        </div>
      </div>
    </div>
  );
}