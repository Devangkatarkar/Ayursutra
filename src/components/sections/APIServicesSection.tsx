import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner@2.0.3';
import {
  WeatherService,
  NutritionService,
  LocationService,
  MeditationService,
  AyurvedicTimeService,
  APIConfig,
  type WeatherData,
  type NutritionInfo,
  type LocationInfo,
  type MeditationContent
} from '../../utils/apiServices';
import {
  Cloud,
  CloudRain,
  Sun,
  Thermometer,
  Droplets,
  Wind,
  MapPin,
  Navigation,
  Hospital,
  Star,
  Phone,
  Apple,
  Activity,
  Calculator,
  Clock,
  Circle,
  Brain,
  Heart,
  Settings,
  Key,
  Loader2,
  Leaf,
  Sunrise,
  Info
} from 'lucide-react';

interface APIServicesSectionProps {
  user: any;
}

export function APIServicesSection({ user }: APIServicesSectionProps) {
  const [activeTab, setActiveTab] = useState('weather');
  const [loading, setLoading] = useState(false);
  
  // Weather data
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherCity, setWeatherCity] = useState('Mumbai');
  
  // Nutrition data
  const [nutritionData, setNutritionData] = useState<NutritionInfo | null>(null);
  const [foodQuery, setFoodQuery] = useState('rice');
  
  // Location data
  const [locationData, setLocationData] = useState<LocationInfo | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Meditation data
  const [meditationContent, setMeditationContent] = useState<MeditationContent[]>([]);
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationContent | null>(null);
  
  // Ayurvedic time
  const [timeRecommendations, setTimeRecommendations] = useState<any>(null);
  
  // API Keys
  const [apiKeys, setApiKeys] = useState({
    openweather: APIConfig.getOpenWeatherKey(),
    nutrition: APIConfig.getNutritionKey(),
    googlemaps: APIConfig.getGoogleMapsKey()
  });

  useEffect(() => {
    loadInitialData();
    updateTimeRecommendations();
    
    // Update time recommendations every minute
    const interval = setInterval(updateTimeRecommendations, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadInitialData = async () => {
    try {
      // Load meditation content
      const meditations = await MeditationService.getAllMeditations();
      setMeditationContent(meditations);
      
      // Get current location
      const location = await LocationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
      }
      
      // Load weather for default city
      loadWeatherData();
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const updateTimeRecommendations = () => {
    const recommendations = AyurvedicTimeService.getTimeRecommendations();
    setTimeRecommendations(recommendations);
  };

  const loadWeatherData = async () => {
    setLoading(true);
    try {
      const weather = await WeatherService.getWeatherByCity(weatherCity);
      setWeatherData(weather);
    } catch (error) {
      toast.error('Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const loadNutritionData = async () => {
    if (!foodQuery.trim()) return;
    
    setLoading(true);
    try {
      const nutrition = await NutritionService.getFoodNutrition(foodQuery);
      setNutritionData(nutrition);
    } catch (error) {
      toast.error('Failed to load nutrition data');
    } finally {
      setLoading(false);
    }
  };

  const loadLocationData = async () => {
    if (!currentLocation) {
      const location = await LocationService.getCurrentLocation();
      if (!location) {
        toast.error('Unable to get current location');
        return;
      }
      setCurrentLocation(location);
    }
    
    setLoading(true);
    try {
      const locationInfo = await LocationService.getLocationInfo(
        currentLocation.lat, 
        currentLocation.lng
      );
      setLocationData(locationInfo);
    } catch (error) {
      toast.error('Failed to load location data');
    } finally {
      setLoading(false);
    }
  };

  const loadRandomMeditation = async () => {
    try {
      const meditation = await MeditationService.getRandomMeditation();
      setSelectedMeditation(meditation);
    } catch (error) {
      toast.error('Failed to load meditation content');
    }
  };

  const saveAPIKey = (type: string, key: string) => {
    setApiKeys(prev => ({ ...prev, [type]: key }));
    
    switch (type) {
      case 'openweather':
        APIConfig.setOpenWeatherKey(key);
        break;
      case 'nutrition':
        APIConfig.setNutritionKey(key);
        break;
      case 'googlemaps':
        APIConfig.setGoogleMapsKey(key);
        break;
    }
    
    toast.success(`${type} API key saved successfully`);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'rain':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'cloud':
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getMeditationTypeIcon = (type: string) => {
    switch (type) {
      case 'breathing':
        return <Wind className="h-5 w-5" />;
      case 'mindfulness':
        return <Brain className="h-5 w-5" />;
      case 'body-scan':
        return <Activity className="h-5 w-5" />;
      case 'mantra':
        return <Circle className="h-5 w-5" />;
      default:
        return <Heart className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl text-gray-900 mb-2">API Services & Integrations</h1>
        <p className="text-muted-foreground">
          Enhance your Ayurvedic journey with real-time data and smart recommendations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="weather" className="flex items-center space-x-2">
            <Cloud className="h-4 w-4" />
            <span>Weather</span>
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center space-x-2">
            <Apple className="h-4 w-4" />
            <span>Nutrition</span>
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Location</span>
          </TabsTrigger>
          <TabsTrigger value="meditation" className="flex items-center space-x-2">
            <Circle className="h-4 w-4" />
            <span>Meditation</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>API Keys</span>
          </TabsTrigger>
        </TabsList>

        {/* Weather Tab */}
        <TabsContent value="weather">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Cloud className="h-5 w-5" />
                    <span>Weather-Based Ayurvedic Recommendations</span>
                  </CardTitle>
                  <CardDescription>
                    Get personalized recommendations based on current weather conditions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 mb-4">
                    <Input
                      placeholder="Enter city name"
                      value={weatherCity}
                      onChange={(e) => setWeatherCity(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={loadWeatherData} disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get Weather'}
                    </Button>
                  </div>

                  {weatherData && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getWeatherIcon(weatherData.condition)}
                          <div>
                            <h3 className="font-medium">{weatherCity}</h3>
                            <p className="text-sm text-muted-foreground">{weatherData.condition}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Thermometer className="h-4 w-4" />
                            <span>{weatherData.temperature}°C</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Droplets className="h-4 w-4" />
                            <span>{weatherData.humidity}%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Dosha Effects</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {Object.entries(weatherData.doshaEffect).map(([dosha, effect]) => (
                            <div key={dosha} className="p-2 rounded text-center text-xs">
                              <div className="font-medium capitalize">{dosha}</div>
                              <Badge 
                                className={`mt-1 ${
                                  effect === 'increase' ? 'bg-red-100 text-red-800' :
                                  effect === 'decrease' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {effect}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Weather Recommendations</h4>
                        <div className="space-y-2">
                          {weatherData.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start space-x-2 p-2 bg-green-50 rounded">
                              <Leaf className="h-4 w-4 text-green-600 mt-0.5" />
                              <span className="text-sm">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Ayurvedic Time</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {timeRecommendations && (
                    <div className="space-y-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="font-medium">Current Dosha Period</div>
                        <div className="text-2xl font-bold text-purple-600 capitalize">
                          {timeRecommendations.dosha}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date().toLocaleTimeString()}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Recommended Activities</h4>
                        <div className="space-y-1">
                          {timeRecommendations.activities.map((activity: string, index: number) => (
                            <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                              • {activity}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Recommended Foods</h4>
                        <div className="space-y-1">
                          {timeRecommendations.foods.map((food: string, index: number) => (
                            <div key={index} className="text-sm p-2 bg-green-50 rounded">
                              • {food}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Apple className="h-5 w-5" />
                  <span>Food Nutrition & Ayurvedic Properties</span>
                </CardTitle>
                <CardDescription>
                  Get nutritional data and Ayurvedic properties of foods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-4">
                  <Input
                    placeholder="Enter food name (e.g., rice, mango)"
                    value={foodQuery}
                    onChange={(e) => setFoodQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={loadNutritionData} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Analyze'}
                  </Button>
                </div>

                {nutritionData && (
                  <div className="space-y-4">
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h3 className="font-medium mb-3 capitalize">{nutritionData.food}</h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-2 bg-white rounded">
                          <div className="text-2xl font-bold text-orange-600">{nutritionData.calories}</div>
                          <div className="text-xs text-muted-foreground">Calories</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded">
                          <div className="text-lg font-bold text-blue-600">{nutritionData.protein}g</div>
                          <div className="text-xs text-muted-foreground">Protein</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded">
                          <div className="text-lg font-bold text-green-600">{nutritionData.carbs}g</div>
                          <div className="text-xs text-muted-foreground">Carbs</div>
                        </div>
                        <div className="text-center p-2 bg-white rounded">
                          <div className="text-lg font-bold text-yellow-600">{nutritionData.fat}g</div>
                          <div className="text-xs text-muted-foreground">Fat</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Ayurvedic Properties</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <strong>Taste:</strong> {nutritionData.ayurvedicProperties.taste.join(', ')}
                          </div>
                          <div>
                            <strong>Virya:</strong> {nutritionData.ayurvedicProperties.virya}
                          </div>
                          <div className="col-span-2">
                            <strong>Effects:</strong> {nutritionData.ayurvedicProperties.effect.join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Food Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['Rice', 'Ginger', 'Turmeric', 'Coconut', 'Mango', 'Lemon'].map((food) => (
                    <Button
                      key={food}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setFoodQuery(food);
                        NutritionService.getFoodNutrition(food).then(setNutritionData);
                      }}
                    >
                      <Leaf className="h-4 w-4 mr-2" />
                      {food}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Nearby Ayurvedic Centers</span>
                </CardTitle>
                <CardDescription>
                  Find Ayurvedic hospitals and clinics near you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={loadLocationData} disabled={loading} className="w-full mb-4">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Navigation className="h-4 w-4 mr-2" />}
                  Find Nearby Centers
                </Button>

                {locationData && (
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{locationData.address}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Nearby Hospitals & Clinics</h4>
                      <div className="space-y-3">
                        {locationData.nearbyHospitals.map((hospital, index) => (
                          <Card key={index} className="p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium">{hospital.name}</h5>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{hospital.distance}</span>
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span>{hospital.rating}</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {hospital.specialties.map((specialty, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {specialty}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Services Info</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    We use your location to find nearby Ayurvedic centers and provide weather-based recommendations. 
                    Your location data is not stored permanently.
                  </AlertDescription>
                </Alert>
                
                {currentLocation && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="text-sm">
                      <strong>Current Coordinates:</strong><br />
                      Lat: {currentLocation.lat.toFixed(6)}<br />
                      Lng: {currentLocation.lng.toFixed(6)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Meditation Tab */}
        <TabsContent value="meditation">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Circle className="h-5 w-5" />
                    <span>Guided Meditation Library</span>
                  </CardTitle>
                  <CardDescription>
                    Curated meditation practices for your Ayurvedic journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {meditationContent.map((meditation, index) => (
                      <Card 
                        key={index} 
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedMeditation?.title === meditation.title 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'hover:border-purple-300'
                        }`}
                        onClick={() => setSelectedMeditation(meditation)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1 bg-purple-100 rounded text-purple-600">
                              {getMeditationTypeIcon(meditation.type)}
                            </div>
                            <h3 className="font-medium text-sm">{meditation.title}</h3>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{meditation.duration} min</span>
                            <Badge variant="outline" className="capitalize">
                              {meditation.type}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button onClick={loadRandomMeditation} variant="outline" className="w-full">
                    <Sunrise className="h-4 w-4 mr-2" />
                    Get Random Meditation
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div>
              {selectedMeditation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {getMeditationTypeIcon(selectedMeditation.type)}
                      <span>{selectedMeditation.title}</span>
                    </CardTitle>
                    <CardDescription>
                      {selectedMeditation.duration} minute {selectedMeditation.type} practice
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Instructions</h4>
                        <ol className="space-y-2 text-sm">
                          {selectedMeditation.instructions.map((instruction, index) => (
                            <li key={index} className="flex space-x-2">
                              <span className="font-medium text-purple-600">{index + 1}.</span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Benefits</h4>
                        <div className="space-y-1">
                          {selectedMeditation.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <Heart className="h-3 w-3 text-green-600" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Start Meditation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* API Settings Tab */}
        <TabsContent value="settings">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>API Configuration</span>
                </CardTitle>
                <CardDescription>
                  Configure external API keys for enhanced functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    API keys are stored locally in your browser and are not sent to our servers. 
                    Demo data is used when API keys are not provided.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="openweather-key">OpenWeather API Key</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        id="openweather-key"
                        type="password"
                        placeholder="Enter OpenWeather API key"
                        value={apiKeys.openweather === 'demo' ? '' : apiKeys.openweather}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, openweather: e.target.value }))}
                      />
                      <Button 
                        onClick={() => saveAPIKey('openweather', apiKeys.openweather)}
                        size="sm"
                      >
                        Save
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Get your free API key from <a href="https://openweathermap.org/api" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">OpenWeather</a>
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="nutrition-key">Nutrition API Key</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        id="nutrition-key"
                        type="password"
                        placeholder="Enter Nutrition API key"
                        value={apiKeys.nutrition === 'demo' ? '' : apiKeys.nutrition}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, nutrition: e.target.value }))}
                      />
                      <Button 
                        onClick={() => saveAPIKey('nutrition', apiKeys.nutrition)}
                        size="sm"
                      >
                        Save
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Get your API key from Nutritionix or similar nutrition APIs
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="googlemaps-key">Google Maps API Key</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        id="googlemaps-key"
                        type="password"
                        placeholder="Enter Google Maps API key"
                        value={apiKeys.googlemaps === 'demo' ? '' : apiKeys.googlemaps}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, googlemaps: e.target.value }))}
                      />
                      <Button 
                        onClick={() => saveAPIKey('googlemaps', apiKeys.googlemaps)}
                        size="sm"
                      >
                        Save
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Get your API key from <a href="https://developers.google.com/maps" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Current Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Weather Service</span>
                      <Badge className={apiKeys.openweather === 'demo' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                        {apiKeys.openweather === 'demo' ? 'Demo Mode' : 'Live API'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Nutrition Service</span>
                      <Badge className={apiKeys.nutrition === 'demo' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                        {apiKeys.nutrition === 'demo' ? 'Demo Mode' : 'Live API'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Location Service</span>
                      <Badge className={apiKeys.googlemaps === 'demo' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                        {apiKeys.googlemaps === 'demo' ? 'Demo Mode' : 'Live API'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}