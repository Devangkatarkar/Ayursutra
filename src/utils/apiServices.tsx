// External API Services for Prankarma
export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  recommendations: string[];
  doshaEffect: {
    vata: 'increase' | 'decrease' | 'neutral';
    pitta: 'increase' | 'decrease' | 'neutral';
    kapha: 'increase' | 'decrease' | 'neutral';
  };
}

export interface NutritionInfo {
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ayurvedicProperties: {
    taste: string[];
    virya: 'hot' | 'cold';
    vipaka: string;
    effect: string[];
  };
}

export interface LocationInfo {
  lat: number;
  lng: number;
  address: string;
  nearbyHospitals: Array<{
    name: string;
    distance: string;
    rating: number;
    specialties: string[];
    phone: string;
  }>;
}

export interface MeditationContent {
  title: string;
  duration: number;
  type: 'breathing' | 'mindfulness' | 'body-scan' | 'mantra';
  instructions: string[];
  benefits: string[];
}

// Weather API Service
export class WeatherService {
  private static readonly API_KEY = 'demo'; // Always start with demo mode
  private static readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';

  static async getWeatherByLocation(lat: number, lng: number): Promise<WeatherData> {
    try {
      const apiKey = APIConfig.getOpenWeatherKey();
      if (apiKey === 'demo') {
        return this.getMockWeatherData();
      }

      const response = await fetch(
        `${this.BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather API request failed');
      }

      const data = await response.json();
      return this.processWeatherData(data);
    } catch (error) {
      console.error('Weather API error:', error);
      return this.getMockWeatherData();
    }
  }

  static async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      const apiKey = APIConfig.getOpenWeatherKey();
      if (apiKey === 'demo') {
        return this.getMockWeatherData();
      }

      const response = await fetch(
        `${this.BASE_URL}/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather API request failed');
      }

      const data = await response.json();
      return this.processWeatherData(data);
    } catch (error) {
      console.error('Weather API error:', error);
      return this.getMockWeatherData();
    }
  }

  private static processWeatherData(data: any): WeatherData {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const condition = data.weather[0].main;

    // Ayurvedic recommendations based on weather
    const recommendations = this.getAyurvedicRecommendations(temp, humidity, condition);
    const doshaEffect = this.getDoshaEffect(temp, humidity, condition);

    return {
      temperature: temp,
      humidity,
      condition,
      recommendations,
      doshaEffect
    };
  }

  private static getMockWeatherData(): WeatherData {
    const conditions = ['Clear', 'Cloudy', 'Rain', 'Hot', 'Humid'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = 25 + Math.floor(Math.random() * 15); // 25-40°C
    const humidity = 40 + Math.floor(Math.random() * 40); // 40-80%

    return {
      temperature: temp,
      humidity,
      condition,
      recommendations: this.getAyurvedicRecommendations(temp, humidity, condition),
      doshaEffect: this.getDoshaEffect(temp, humidity, condition)
    };
  }

  private static getAyurvedicRecommendations(temp: number, humidity: number, condition: string): string[] {
    const recommendations: string[] = [];

    if (temp > 32) {
      recommendations.push('Drink cooling herbal teas like mint or coriander');
      recommendations.push('Avoid hot, spicy foods');
      recommendations.push('Practice cooling pranayama (Sheetali, Sheetkari)');
    } else if (temp < 20) {
      recommendations.push('Include warming spices like ginger and cinnamon');
      recommendations.push('Practice warming pranayama (Bhastrika)');
      recommendations.push('Drink warm herbal teas');
    }

    if (humidity > 70) {
      recommendations.push('Reduce heavy, oily foods');
      recommendations.push('Increase light, dry foods');
      recommendations.push('Practice energizing asanas');
    }

    if (condition === 'Rain') {
      recommendations.push('Boost immunity with Chyawanprash');
      recommendations.push('Avoid cold foods and drinks');
    }

    return recommendations.length > 0 ? recommendations : ['Maintain regular daily routine', 'Stay hydrated', 'Practice meditation'];
  }

  private static getDoshaEffect(temp: number, humidity: number, condition: string) {
    return {
      vata: temp < 20 || humidity < 50 ? 'increase' : 'neutral' as 'increase' | 'decrease' | 'neutral',
      pitta: temp > 30 ? 'increase' : 'decrease' as 'increase' | 'decrease' | 'neutral',
      kapha: humidity > 70 || condition === 'Rain' ? 'increase' : 'decrease' as 'increase' | 'decrease' | 'neutral'
    };
  }
}

// Nutrition API Service
export class NutritionService {
  private static readonly API_KEY = 'demo'; // Always start with demo mode
  private static readonly BASE_URL = 'https://api.nutritionix.com/v1_1';

  static async getFoodNutrition(foodName: string): Promise<NutritionInfo> {
    try {
      const apiKey = APIConfig.getNutritionKey();
      if (apiKey === 'demo') {
        return this.getMockNutritionData(foodName);
      }

      const response = await fetch(
        `${this.BASE_URL}/search/${foodName}?results=0:1&fields=item_name,brand_name,item_id,nf_calories,nf_total_fat,nf_total_carbohydrate,nf_protein`,
        {
          headers: {
            'X-APP-ID': 'your-app-id',
            'X-APP-KEY': apiKey
          }
        }
      );

      if (!response.ok) {
        throw new Error('Nutrition API request failed');
      }

      const data = await response.json();
      return this.processNutritionData(data.hits[0], foodName);
    } catch (error) {
      console.error('Nutrition API error:', error);
      return this.getMockNutritionData(foodName);
    }
  }

  private static processNutritionData(data: any, foodName: string): NutritionInfo {
    const fields = data.fields;
    return {
      food: foodName,
      calories: fields.nf_calories || 0,
      protein: fields.nf_protein || 0,
      carbs: fields.nf_total_carbohydrate || 0,
      fat: fields.nf_total_fat || 0,
      ayurvedicProperties: this.getAyurvedicProperties(foodName)
    };
  }

  private static getMockNutritionData(foodName: string): NutritionInfo {
    const baseCalories = 100 + Math.floor(Math.random() * 200);
    return {
      food: foodName,
      calories: baseCalories,
      protein: 5 + Math.floor(Math.random() * 15),
      carbs: 15 + Math.floor(Math.random() * 30),
      fat: 2 + Math.floor(Math.random() * 10),
      ayurvedicProperties: this.getAyurvedicProperties(foodName)
    };
  }

  private static getAyurvedicProperties(foodName: string) {
    const foodLower = foodName.toLowerCase();
    
    // Ayurvedic food database (simplified)
    const ayurvedicFoods: { [key: string]: any } = {
      'rice': { taste: ['sweet'], virya: 'cold', vipaka: 'sweet', effect: ['nourishing', 'grounding'] },
      'ginger': { taste: ['pungent'], virya: 'hot', vipaka: 'sweet', effect: ['digestive', 'warming'] },
      'turmeric': { taste: ['bitter', 'pungent'], virya: 'hot', vipaka: 'pungent', effect: ['anti-inflammatory', 'purifying'] },
      'coconut': { taste: ['sweet'], virya: 'cold', vipaka: 'sweet', effect: ['cooling', 'nourishing'] },
      'mango': { taste: ['sweet'], virya: 'hot', vipaka: 'sweet', effect: ['nourishing', 'strengthening'] },
      'lemon': { taste: ['sour'], virya: 'hot', vipaka: 'sour', effect: ['digestive', 'cleansing'] }
    };

    // Find matching food or return generic properties
    for (const [key, properties] of Object.entries(ayurvedicFoods)) {
      if (foodLower.includes(key)) {
        return properties;
      }
    }

    // Default properties
    return {
      taste: ['sweet'],
      virya: 'neutral' as 'hot' | 'cold',
      vipaka: 'sweet',
      effect: ['nourishing']
    };
  }
}

// Location Service
export class LocationService {
  private static readonly API_KEY = 'demo'; // Always start with demo mode

  static async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => resolve(null),
        { timeout: 10000 }
      );
    });
  }

  static async getLocationInfo(lat: number, lng: number): Promise<LocationInfo> {
    try {
      const address = await this.reverseGeocode(lat, lng);
      const nearbyHospitals = await this.findNearbyHospitals(lat, lng);

      return {
        lat,
        lng,
        address,
        nearbyHospitals
      };
    } catch (error) {
      console.error('Location service error:', error);
      return this.getMockLocationData(lat, lng);
    }
  }

  private static async reverseGeocode(lat: number, lng: number): Promise<string> {
    const apiKey = APIConfig.getGoogleMapsKey();
    if (apiKey === 'demo') {
      return 'Sample Address, City, State';
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();
      return data.results[0]?.formatted_address || 'Address not found';
    } catch (error) {
      return 'Address not found';
    }
  }

  private static async findNearbyHospitals(lat: number, lng: number) {
    const apiKey = APIConfig.getGoogleMapsKey();
    if (apiKey === 'demo') {
      return this.getMockHospitals();
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=hospital&key=${apiKey}`
      );
      const data = await response.json();
      
      return data.results.slice(0, 5).map((place: any) => ({
        name: place.name,
        distance: '2.5 km', // You'd calculate this properly
        rating: place.rating || 4.0,
        specialties: ['General Medicine', 'Ayurveda'],
        phone: place.formatted_phone_number || 'Contact for details'
      }));
    } catch (error) {
      return this.getMockHospitals();
    }
  }

  private static getMockLocationData(lat: number, lng: number): LocationInfo {
    return {
      lat,
      lng,
      address: 'Sample Address, City, State, India',
      nearbyHospitals: this.getMockHospitals()
    };
  }

  private static getMockHospitals() {
    return [
      {
        name: 'Ayurveda Wellness Hospital',
        distance: '1.2 km',
        rating: 4.5,
        specialties: ['Panchkarma', 'Ayurveda', 'General Medicine'],
        phone: '+91 98765 43210'
      },
      {
        name: 'Holistic Health Center',
        distance: '2.8 km',
        rating: 4.2,
        specialties: ['Ayurveda', 'Naturopathy', 'Yoga Therapy'],
        phone: '+91 98765 43211'
      },
      {
        name: 'Traditional Medicine Clinic',
        distance: '3.5 km',
        rating: 4.7,
        specialties: ['Panchkarma', 'Herbal Medicine', 'Constitutional Medicine'],
        phone: '+91 98765 43212'
      }
    ];
  }
}

// Meditation Content Service
export class MeditationService {
  private static meditationContent: MeditationContent[] = [
    {
      title: 'Morning Pranayama',
      duration: 10,
      type: 'breathing',
      instructions: [
        'Sit in a comfortable meditation posture',
        'Close your eyes and take 3 deep breaths',
        'Begin Anulom Vilom (alternate nostril breathing)',
        'Close right nostril, inhale through left for 4 counts',
        'Close both nostrils, hold for 2 counts',
        'Release right nostril, exhale for 4 counts',
        'Repeat on the other side'
      ],
      benefits: ['Balances nervous system', 'Reduces stress', 'Improves focus', 'Balances doshas']
    },
    {
      title: 'Body Awareness Meditation',
      duration: 15,
      type: 'body-scan',
      instructions: [
        'Lie down comfortably on your back',
        'Close your eyes and breathe naturally',
        'Start from the top of your head',
        'Slowly scan down through each body part',
        'Notice any sensations without judgment',
        'Send breath and awareness to each area',
        'Complete the scan at your toes'
      ],
      benefits: ['Increases body awareness', 'Releases tension', 'Promotes relaxation', 'Improves sleep']
    },
    {
      title: 'Om Mantra Meditation',
      duration: 20,
      type: 'mantra',
      instructions: [
        'Sit in a comfortable meditation posture',
        'Keep your spine straight and shoulders relaxed',
        'Begin chanting "Om" slowly and deeply',
        'Feel the vibration in your chest and head',
        'Continue for the full duration',
        'End with 2 minutes of silence'
      ],
      benefits: ['Calms the mind', 'Connects to universal energy', 'Improves concentration', 'Spiritual awakening']
    },
    {
      title: 'Mindful Awareness Practice',
      duration: 12,
      type: 'mindfulness',
      instructions: [
        'Sit comfortably with eyes closed',
        'Focus on your natural breath',
        'When thoughts arise, simply notice them',
        'Return attention gently to the breath',
        'Observe without trying to change anything',
        'Be present with whatever arises'
      ],
      benefits: ['Develops mindfulness', 'Reduces anxiety', 'Improves emotional regulation', 'Enhances clarity']
    }
  ];

  static async getMeditationByType(type: MeditationContent['type']): Promise<MeditationContent[]> {
    return this.meditationContent.filter(content => content.type === type);
  }

  static async getMeditationByDuration(maxDuration: number): Promise<MeditationContent[]> {
    return this.meditationContent.filter(content => content.duration <= maxDuration);
  }

  static async getRandomMeditation(): Promise<MeditationContent> {
    const randomIndex = Math.floor(Math.random() * this.meditationContent.length);
    return this.meditationContent[randomIndex];
  }

  static async getAllMeditations(): Promise<MeditationContent[]> {
    return this.meditationContent;
  }
}

// Ayurvedic Time Service
export class AyurvedicTimeService {
  static getCurrentDosha(): 'vata' | 'pitta' | 'kapha' {
    const hour = new Date().getHours();
    
    // Ayurvedic time cycles
    if ((hour >= 6 && hour < 10) || (hour >= 18 && hour < 22)) {
      return 'kapha';
    } else if ((hour >= 10 && hour < 14) || (hour >= 22 || hour < 2)) {
      return 'pitta';
    } else {
      return 'vata'; // 2-6 AM and 2-6 PM
    }
  }

  static getTimeRecommendations(): {
    dosha: string;
    activities: string[];
    foods: string[];
    avoid: string[];
  } {
    const currentDosha = this.getCurrentDosha();
    const hour = new Date().getHours();

    const recommendations = {
      kapha: {
        dosha: 'Kapha',
        activities: ['Light exercise', 'Energizing yoga', 'Planning tasks', 'Social activities'],
        foods: ['Light, warm meals', 'Spicy foods', 'Ginger tea', 'Fresh fruits'],
        avoid: ['Heavy meals', 'Cold foods', 'Excessive rest', 'Sweet foods']
      },
      pitta: {
        dosha: 'Pitta',
        activities: ['Focused work', 'Problem solving', 'Physical exercise', 'Learning'],
        foods: ['Moderate meals', 'Cool foods', 'Sweet fruits', 'Coconut water'],
        avoid: ['Spicy foods', 'Excessive heat', 'Skipping meals', 'Anger/stress']
      },
      vata: {
        dosha: 'Vata',
        activities: ['Creative work', 'Meditation', 'Gentle yoga', 'Breathing exercises'],
        foods: ['Warm, cooked foods', 'Healthy fats', 'Herbal teas', 'Nourishing meals'],
        avoid: ['Cold foods', 'Raw foods', 'Excessive activity', 'Irregular meals']
      }
    };

    return recommendations[currentDosha];
  }
}

// API Key Management
export const APIConfig = {
  setOpenWeatherKey: (key: string) => {
    localStorage.setItem('openweather_api_key', key);
  },
  
  getOpenWeatherKey: (): string => {
    return localStorage.getItem('openweather_api_key') || 'demo';
  },

  setNutritionKey: (key: string) => {
    localStorage.setItem('nutrition_api_key', key);
  },

  getNutritionKey: (): string => {
    return localStorage.getItem('nutrition_api_key') || 'demo';
  },

  setGoogleMapsKey: (key: string) => {
    localStorage.setItem('google_maps_api_key', key);
  },

  getGoogleMapsKey: (): string => {
    return localStorage.getItem('google_maps_api_key') || 'demo';
  }
};