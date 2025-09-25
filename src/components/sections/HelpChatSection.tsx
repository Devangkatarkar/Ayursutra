import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Send, Bot, User, Clock, Lightbulb } from 'lucide-react';
import { DhanviAvatar } from '../DhanviAvatar';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion';
}

export function HelpChatSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Namaste! I\'m Dhanvi, your Ayurvedic AI assistant. I can help you with questions about your therapy, medicines, lifestyle recommendations, and general Ayurvedic principles. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date(Date.now() - 60000),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const commonQuestions = [
    'What should I eat during Panchkarma?',
    'How to prepare for Vamanam therapy?',
    'Side effects of my current medicines?',
    'Best time to take Triphala?',
    'Yoga poses for my dosha type?',
    'When will I see improvement?'
  ];

  // Mock AI responses
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('vamanam') || lowerMessage.includes('vamana')) {
      return 'For Vamanam therapy preparation, it\'s important to follow a specific diet for 3-5 days before the procedure. Consume light, easily digestible foods like rice gruel, warm milk, and ghee. Avoid heavy, oily, or spicy foods. Your doctor will provide detailed instructions based on your constitution. Make sure to stay hydrated with warm water.';
    }
    
    if (lowerMessage.includes('triphala')) {
      return 'Triphala is best taken on an empty stomach, either early morning or before bedtime. The typical dosage is 1 teaspoon mixed with warm water. For detox purposes, take it 30 minutes before meals. For digestive support, take it 2 hours after meals. Start with a smaller dose and gradually increase as your body adjusts.';
    }
    
    if (lowerMessage.includes('diet') || lowerMessage.includes('food')) {
      return 'During Panchkarma, follow a light, warm, and easily digestible diet. Include: rice gruel, steamed vegetables, warm milk, herbal teas, and fresh fruits. Avoid: cold foods, raw vegetables, processed foods, caffeine, and alcohol. Eat at regular times and chew food thoroughly. Your specific dietary plan depends on your current therapy phase.';
    }
    
    if (lowerMessage.includes('side effect') || lowerMessage.includes('reaction')) {
      return 'Mild reactions during Ayurvedic treatments are normal as your body detoxifies. Common experiences include temporary fatigue, mild digestive changes, or emotional releases. However, if you experience severe symptoms, nausea, or allergic reactions, please contact your doctor immediately. Always report any concerns to your healthcare provider.';
    }
    
    if (lowerMessage.includes('improvement') || lowerMessage.includes('results')) {
      return 'Ayurvedic treatments work gradually and holistically. Initial improvements in energy and digestion may be noticed within 1-2 weeks. Significant changes in chronic conditions typically occur after 4-8 weeks of consistent treatment. Remember, healing happens on multiple levels - physical, mental, and emotional. Track your daily symptoms to notice subtle positive changes.';
    }
    
    return 'I understand your concern. For personalized advice about your specific condition and treatment, I recommend discussing this with your assigned Ayurvedic physician. They can provide detailed guidance based on your constitution and current therapy phase. Is there anything else about general Ayurvedic principles I can help you with?';
  };

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(messageToSend),
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl text-gray-900 mb-2">Dhanvi - AI Health Assistant</h1>
        <p className="text-muted-foreground">
          Get instant answers about Ayurveda, your treatments, and wellness guidance from Dhanvi
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center space-x-2">
                <DhanviAvatar size={40} />
                <div>
                  <CardTitle className="text-lg">Dhanvi</CardTitle>
                  <CardDescription>Your Ayurvedic AI Assistant • Online</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-700 ml-auto">Online</Badge>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    {message.sender === 'ai' && (
                      <DhanviAvatar size={32} />
                    )}
                    
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock className="h-3 w-3 opacity-50" />
                        <span className="text-xs opacity-50">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {message.sender === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <DhanviAvatar size={32} isTyping={true} />
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Dhanvi anything about Ayurveda, your treatment, or wellness..."
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Common Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span>Common Questions</span>
              </CardTitle>
              <CardDescription>
                Click on any question to get instant answers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {commonQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3 whitespace-normal"
                    onClick={() => handleSendMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dhanvi's Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle>What Dhanvi Can Help With</CardTitle>
              <CardDescription>Your personal Ayurvedic wellness guide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Therapy preparation and aftercare</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Medicine timing and dosage guidance</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Dietary recommendations</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Lifestyle and yoga suggestions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>General Ayurvedic principles</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Emotional and mental wellness support</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-800">
                  <strong>Dhanvi's Promise:</strong> I'm here to support your healing journey with compassionate guidance rooted in ancient Ayurvedic wisdom. For medical emergencies, please contact your doctor immediately.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}