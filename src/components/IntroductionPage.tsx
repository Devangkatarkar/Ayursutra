import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { LanguageSelector } from './LanguageSelector';
import { MandalaLogo } from './MandalaLogo';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Droplets, 
  Wind, 
  Zap, 
  Heart, 
  Brain, 
  Shield, 
  Sparkles,
  ChevronRight,
  Play,
  ArrowRight
} from 'lucide-react';

interface IntroductionPageProps {
  onContinue: () => void;
}

export function IntroductionPage({ onContinue }: IntroductionPageProps) {
  const { t } = useLanguage();
  const [activeTherapy, setActiveTherapy] = useState<number | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const therapies = [
    {
      name: t('intro.therapy.vamanam'),
      description: t('intro.therapy.vamanam.desc'),
      icon: <Wind className="h-8 w-8" />,
      color: 'bg-blue-500',
      position: { top: '15%', left: '8%' }
    },
    {
      name: t('intro.therapy.virechana'),
      description: t('intro.therapy.virechana.desc'),
      icon: <Droplets className="h-8 w-8" />,
      color: 'bg-green-500',
      position: { top: '15%', right: '8%' }
    },
    {
      name: t('intro.therapy.basti'),
      description: t('intro.therapy.basti.desc'),
      icon: <Zap className="h-8 w-8" />,
      color: 'bg-yellow-500',
      position: { bottom: '15%', left: '8%' }
    },
    {
      name: t('intro.therapy.nasya'),
      description: t('intro.therapy.nasya.desc'),
      icon: <Wind className="h-8 w-8" />,
      color: 'bg-purple-500',
      position: { top: '50%', left: '2%' }
    },
    {
      name: t('intro.therapy.raktamokshana'),
      description: t('intro.therapy.raktamokshana.desc'),
      icon: <Heart className="h-8 w-8" />,
      color: 'bg-red-500',
      position: { bottom: '15%', right: '8%' }
    }
  ];

  const benefits = [
    { icon: <Shield className="h-6 w-6" />, text: t('intro.benefits.detox') },
    { icon: <Sparkles className="h-6 w-6" />, text: t('intro.benefits.immunity') },
    { icon: <Heart className="h-6 w-6" />, text: t('intro.benefits.balance') },
    { icon: <Brain className="h-6 w-6" />, text: t('intro.benefits.mental') },
    { icon: <Zap className="h-6 w-6" />, text: t('intro.benefits.vitality') },
    { icon: <Sparkles className="h-6 w-6" />, text: t('intro.benefits.longevity') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-green-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-6"
            >
              <MandalaLogo size={80} />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl text-gray-900 mb-4"
            >
              {t('intro.title')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              {t('intro.subtitle')}
            </motion.p>

            {/* Language Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-12"
            >
              <LanguageSelector variant="intro" className="max-w-md mx-auto" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Panchkarma Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-6">
            {t('intro.panchkarma.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {t('intro.panchkarma.description')}
          </p>
        </motion.div>

        {/* Interactive Therapy Visualization */}
        <div className="relative mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-purple-100 to-green-100 rounded-3xl overflow-hidden"
          >
            {/* Central Mandala */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ rotate: showAnimation ? 360 : 0 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <MandalaLogo size={120} />
                <div className="absolute inset-0 bg-white/30 rounded-full blur-xl"></div>
              </motion.div>
            </div>

            {/* Therapy Points */}
            {therapies.map((therapy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                className="absolute p-6"
                style={therapy.position}
                onMouseEnter={() => setActiveTherapy(index)}
                onMouseLeave={() => setActiveTherapy(null)}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-16 h-16 rounded-full ${therapy.color} text-white flex items-center justify-center cursor-pointer shadow-lg relative z-20 transform -translate-x-1/2 -translate-y-1/2`}
                >
                  {therapy.icon}
                  
                  {/* Pulsing Ring */}
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 0, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.4
                    }}
                    className={`absolute inset-0 rounded-full ${therapy.color} opacity-30`}
                  ></motion.div>

                  {/* Connecting Lines */}
                  <motion.div
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ 
                      pathLength: activeTherapy === index ? 1 : 0,
                      opacity: activeTherapy === index ? 0.5 : 0
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <svg width="200" height="200" className="absolute -top-24 -left-24">
                      <motion.path
                        d="M 100 100 L 100 100"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-purple-400"
                      />
                    </svg>
                  </motion.div>
                </motion.div>

                {/* Therapy Info Card */}
                {activeTherapy === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className={`absolute w-64 md:w-72 z-50 pointer-events-none ${
                      index < 2 ? 'top-20' : 'bottom-20'
                    } ${
                      index === 0 || index === 2 || index === 3 ? 'left-0' : 'right-0'
                    }`}
                  >
                    <Card className="shadow-2xl border-2 border-purple-300 bg-white/95 backdrop-blur-sm relative">
                      {/* Arrow pointer */}
                      <div className={`absolute w-3 h-3 bg-white border-l-2 border-t-2 border-purple-300 transform rotate-45 ${
                        index < 2 ? '-top-1.5' : '-bottom-1.5'
                      } ${
                        index === 0 || index === 2 || index === 3 ? 'left-8' : 'right-8'
                      }`}></div>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-gray-900">{therapy.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 leading-relaxed">{therapy.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {/* Animation Control */}
            <div className="absolute bottom-4 right-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnimation(!showAnimation)}
                className="bg-white/80 backdrop-blur-sm"
              >
                <Play className="h-4 w-4 mr-2" />
                {showAnimation ? 'Pause' : 'Animate'}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl text-gray-900 text-center mb-12">
            {t('intro.benefits.title')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 hover:border-purple-300 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    {benefit.icon}
                  </div>
                  <span className="text-gray-800 font-medium">{benefit.text}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Journey Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="text-center mb-16"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-green-600 text-white border-0 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl md:text-3xl">
                {t('intro.journey.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg opacity-90 mb-8 max-w-3xl mx-auto">
                {t('intro.journey.description')}
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onContinue}
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3"
                >
                  {t('intro.continue')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 20, repeat: Infinity }}
          >
            <Sparkles className="h-8 w-8 text-purple-400" />
          </motion.div>
        </div>
        
        <div className="absolute top-40 right-20 opacity-20">
          <motion.div
            animate={{ 
              rotate: [360, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 15, repeat: Infinity }}
          >
            <Heart className="h-6 w-6 text-green-400" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}