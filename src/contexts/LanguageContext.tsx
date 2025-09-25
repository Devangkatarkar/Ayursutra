import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te' | 'kn';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const translations: Record<Language, Record<string, string>> = {
    en: {
      // App Navigation
      'nav.home': 'Home',
      'nav.prescription': 'Prescription',
      'nav.feedback': 'Feedback',
      'nav.report': 'Report',
      'nav.progress': 'Progress',
      'nav.help': 'Help',
      'nav.contact': 'Contact Doctor',
      'nav.logout': 'Logout',
      'nav.dashboard': 'Dashboard',
      'nav.patients': 'Patients',
      'nav.appointments': 'Appointments',
      
      // Introduction Page
      'intro.title': 'Welcome to Prankarma',
      'intro.subtitle': 'Your Complete Ayurvedic Therapy Management Platform',
      'intro.panchkarma.title': 'Understanding Panchkarma',
      'intro.panchkarma.description': 'Panchkarma is the cornerstone of Ayurvedic treatment, consisting of five powerful therapeutic procedures designed to detoxify and rejuvenate your body, mind, and spirit.',
      'intro.therapy.vamanam': 'Vamanam',
      'intro.therapy.vamanam.desc': 'Therapeutic vomiting to eliminate excess Kapha dosha from the upper body',
      'intro.therapy.virechana': 'Virechana',
      'intro.therapy.virechana.desc': 'Purgation therapy to cleanse excess Pitta dosha from the digestive system',
      'intro.therapy.basti': 'Basti',
      'intro.therapy.basti.desc': 'Medicated enemas to balance Vata dosha and strengthen the lower body',
      'intro.therapy.nasya': 'Nasya',
      'intro.therapy.nasya.desc': 'Nasal administration of medicines to cleanse the head and neck region',
      'intro.therapy.raktamokshana': 'Raktamokshana',
      'intro.therapy.raktamokshana.desc': 'Blood purification therapy to eliminate toxins from the circulatory system',
      'intro.benefits.title': 'Benefits of Panchkarma',
      'intro.benefits.detox': 'Complete Body Detoxification',
      'intro.benefits.immunity': 'Enhanced Immunity',
      'intro.benefits.balance': 'Dosha Balance Restoration',
      'intro.benefits.mental': 'Mental Clarity & Peace',
      'intro.benefits.vitality': 'Increased Vitality & Energy',
      'intro.benefits.longevity': 'Promotes Longevity',
      'intro.journey.title': 'Your Healing Journey',
      'intro.journey.description': 'Prankarma will guide you through every step of your Panchkarma therapy, tracking your progress, managing prescriptions, and connecting you with experienced Ayurvedic practitioners.',
      'intro.continue': 'Begin Your Journey',
      'intro.language': 'Choose Your Language',
      
      // Common
      'common.welcome': 'Welcome',
      'common.loading': 'Loading...',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.submit': 'Submit',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.close': 'Close',
      'common.yes': 'Yes',
      'common.no': 'No',
      
      // Login
      'login.title': 'Welcome to Prankarma',
      'login.subtitle': 'Your Ayurvedic Therapy Management Platform',
      'login.email': 'Email Address',
      'login.password': 'Password',
      'login.role': 'I am a',
      'login.patient': 'Patient',
      'login.doctor': 'Doctor',
      'login.signin': 'Sign In',
      'login.signup': 'Sign Up',
      'login.forgot': 'Forgot Password?',
      
      // Dashboard
      'dashboard.greeting': 'Good to see you',
      'dashboard.therapy.current': 'Current Therapy Plan',
      'dashboard.health.overview': 'Health Overview',
      'dashboard.appointments.upcoming': 'Upcoming Appointments',
      'dashboard.hospitals.nearby': 'Nearby Ayurvedic Hospitals',
      
      // Languages
      'lang.english': 'English',
      'lang.hindi': 'हिंदी',
      'lang.marathi': 'मराठी',
      'lang.gujarati': 'ગુજરાતી',
      'lang.tamil': 'தமிழ்',
      'lang.telugu': 'తెలుగు',
      'lang.kannada': 'ಕನ್ನಡ'
    },
    
    hi: {
      // App Navigation
      'nav.home': 'होम',
      'nav.prescription': 'प्रिस्क्रिप्शन',
      'nav.feedback': 'फीडबैक',
      'nav.report': 'रिपोर्ट',
      'nav.progress': 'प्रगति',
      'nav.help': 'सहायता',
      'nav.contact': 'डॉक्टर से संपर्क',
      'nav.logout': 'लॉग आउट',
      'nav.dashboard': 'डैशबोर्ड',
      'nav.patients': 'मरीज़',
      'nav.appointments': 'अपॉइंटमेंट',
      
      // Introduction Page
      'intro.title': 'प्रणकर्म में आपका स्वागत है',
      'intro.subtitle': 'आपका संपूर्ण आयुर्वेदिक चिकित्सा प्रबंधन मंच',
      'intro.panchkarma.title': 'पंचकर्म को समझना',
      'intro.panchkarma.description': 'पंचकर्म आयुर्वेदिक उपचार की आधारशिला है, जिसमें पांच शक्तिशाली चिकित्सीय प्रक्रियाएं शामिल हैं जो आपके शरीर, मन और आत्मा को विषमुक्त और कायाकल्प करने के लिए डिज़ाइन की गई हैं।',
      'intro.therapy.vamanam': 'वमन',
      'intro.therapy.vamanam.desc': 'शरीर के ऊपरी भाग से अतिरिक्त कफ दोष को निकालने के लिए चिकित्सीय वमन',
      'intro.therapy.virechana': 'विरेचन',
      'intro.therapy.virechana.desc': 'पाचन तंत्र से अतिरिक्त पित्त दोष को साफ करने के लिए विरेचन चिकित्सा',
      'intro.therapy.basti': 'बस्ति',
      'intro.therapy.basti.desc': 'वात दोष को संतुलित करने और निचले शरीर को मजबूत बनाने के लिए औषधीय एनीमा',
      'intro.therapy.nasya': 'नस्य',
      'intro.therapy.nasya.desc': 'सिर और गर्दन के क्षेत्र को साफ करने के लिए नाक के माध्यम से दवा देना',
      'intro.therapy.raktamokshana': 'रक्तमोक्षण',
      'intro.therapy.raktamokshana.desc': 'रक्त संचार तंत्र से विषाक्त पदार्थों को निकालने के लिए रक्त शुद्धीकरण चिकित्सा',
      'intro.benefits.title': 'पंचकर्म के लाभ',
      'intro.benefits.detox': 'संपूर्ण शरीर विषहरण',
      'intro.benefits.immunity': 'बढ़ी हुई प्रतिरक्षा',
      'intro.benefits.balance': 'दोष संतुलन बहाली',
      'intro.benefits.mental': 'मानसिक स्पष्टता और शांति',
      'intro.benefits.vitality': 'बढ़ी हुई जीवन शक्ति और ऊर्जा',
      'intro.benefits.longevity': 'दीर्घायु को बढ़ावा देता है',
      'intro.journey.title': 'आपकी उपचार यात्रा',
      'intro.journey.description': 'प्रणकर्म आपके पंचकर्म चिकित्सा के हर चरण में आपका मार्गदर्शन करेगा, आपकी प्रगति को ट्रैक करेगा, प्रिस्क्रिप्शन का प्रबंधन करेगा, और आपको अनुभवी आयुर्वेदिक चिकित्सकों से जोड़ेगा।',
      'intro.continue': 'अपनी यात्रा शुरू करें',
      'intro.language': 'अपनी भाषा चुनें',
      
      // Common
      'common.welcome': 'स्वागत है',
      'common.loading': 'लोड हो रहा है...',
      'common.save': 'सहेजें',
      'common.cancel': 'रद्द करें',
      'common.submit': 'जमा करें',
      'common.edit': 'संपादित करें',
      'common.delete': 'हटाएं',
      'common.close': 'बंद करें',
      'common.yes': 'हाँ',
      'common.no': 'नहीं',
      
      // Login
      'login.title': 'प्रणकर्म में आपका स्वागत है',
      'login.subtitle': 'आपका आयुर्वेदिक चिकित्सा प्रबंधन मंच',
      'login.email': 'ईमेल पता',
      'login.password': 'पासवर्ड',
      'login.role': 'मैं हूँ',
      'login.patient': 'मरीज़',
      'login.doctor': 'डॉक्टर',
      'login.signin': 'साइन इन',
      'login.signup': 'साइन अप',
      'login.forgot': 'पासवर्ड भूल गए?',
      
      // Dashboard
      'dashboard.greeting': 'आपको देखकर खुशी हुई',
      'dashboard.therapy.current': 'वर्तमान चिकित्सा योजना',
      'dashboard.health.overview': 'स्वास्थ्य सिंहावलोकन',
      'dashboard.appointments.upcoming': 'आगामी अपॉइंटमेंट',
      'dashboard.hospitals.nearby': 'नजदीकी आयुर्वेदिक अस्पताल',
      
      // Languages
      'lang.english': 'English',
      'lang.hindi': 'हिंदी',
      'lang.marathi': 'मराठी',
      'lang.gujarati': 'ગુજરાતી',
      'lang.tamil': 'தமிழ்',
      'lang.telugu': 'తెలుగు',
      'lang.kannada': 'ಕನ್ನಡ'
    },
    
    mr: {
      // App Navigation
      'nav.home': 'होम',
      'nav.prescription': 'प्रिस्क्रिप्शन',
      'nav.feedback': 'फीडबॅक',
      'nav.report': 'अहवाल',
      'nav.progress': 'प्रगती',
      'nav.help': 'मदत',
      'nav.contact': 'डॉक्टरांशी संपर्क',
      'nav.logout': 'लॉग आउट',
      'nav.dashboard': 'डॅशबोर्ड',
      'nav.patients': 'रुग्ण',
      'nav.appointments': 'भेटी',
      
      // Introduction Page
      'intro.title': 'प्राणकर्म मध्ये आपले स्वागत',
      'intro.subtitle': 'आपले संपूर्ण आयुर्वेदिक उपचार व्यवस्थापन मंच',
      'intro.panchkarma.title': 'पंचकर्म समजून घेणे',
      'intro.panchkarma.description': 'पंचकर्म हा आयुर्वेदिक उपचारांचा आधारस्तंभ आहे, ज्यामध्ये आपले शरीर, मन आणि आत्मा विषमुक्त आणि कायाकल्प करण्यासाठी डिझाइन केलेल्या पाच शक्तिशाली उपचारात्मक प्रक्रियांचा समावेश आहे.',
      'intro.therapy.vamanam': 'वमन',
      'intro.therapy.vamanam.desc': 'शरीराच्या वरच्या भागातून अतिरिक्त कफ दोष काढून टाकण्यासाठी उपचारात्मक वांती',
      'intro.therapy.virechana': 'विरेचन',
      'intro.therapy.virechana.desc': 'पाचन तंत्रातून अतिरिक्त पित्त दोष साफ करण्यासाठी विरेचन उपचार',
      'intro.therapy.basti': 'बस्ती',
      'intro.therapy.basti.desc': 'वात दोष संतुलित करण्यासाठी आणि खालच्या शरीराला बळकट करण्यासाठी औषधी एनिमा',
      'intro.therapy.nasya': 'नस्य',
      'intro.therapy.nasya.desc': 'डोके आणि मान भाग साफ करण्यासाठी नाकातून औषध देणे',
      'intro.therapy.raktamokshana': 'रक्तमोक्षण',
      'intro.therapy.raktamokshana.desc': 'रक्त संचार प्रणालीतून विषारी पदार्थ काढून टाकण्यासाठी रक्त शुद्धीकरण उपचार',
      'intro.benefits.title': 'पंचकर्माचे फायदे',
      'intro.benefits.detox': 'संपूर्ण शरीर विषमुक्तीकरण',
      'intro.benefits.immunity': 'वाढलेली प्रतिकारशक्ती',
      'intro.benefits.balance': 'दोष संतुलन पुनर्स्थापना',
      'intro.benefits.mental': 'मानसिक स्पष्टता आणि शांती',
      'intro.benefits.vitality': 'वाढलेली जीवनशक्ती आणि ऊर्जा',
      'intro.benefits.longevity': 'दीर्घायुष्याला प्रोत्साहन',
      'intro.journey.title': 'आपला उपचार प्रवास',
      'intro.journey.description': 'प्राणकर्म आपल्या पंचकर्म उपचारांच्या प्रत्येक टप्प्यावर आपले मार्गदर्शन करेल, आपली प्रगती ट्रॅक करेल, प्रिस्क्रिप्शन व्यवस्थापित करेल आणि आपल्याला अनुभवी आयुर्वेदिक चिकित्सकांशी जोडेल.',
      'intro.continue': 'आपला प्रवास सुरू करा',
      'intro.language': 'आपली भाषा निवडा',
      
      // Common
      'common.welcome': 'स्वागत',
      'common.loading': 'लोड होत आहे...',
      'common.save': 'जतन करा',
      'common.cancel': 'रद्द करा',
      'common.submit': 'सबमिट करा',
      'common.edit': 'संपादित करा',
      'common.delete': 'हटवा',
      'common.close': 'बंद करा',
      'common.yes': 'होय',
      'common.no': 'नाही',
      
      // Languages
      'lang.english': 'English',
      'lang.hindi': 'हिंदी',
      'lang.marathi': 'मराठी',
      'lang.gujarati': 'ગુજરાતી',
      'lang.tamil': 'தமிழ்',
      'lang.telugu': 'తెలుగు',
      'lang.kannada': 'ಕನ್ನಡ'
    },
    
    gu: {
      // App Navigation
      'nav.home': 'હોમ',
      'nav.prescription': 'પ્રિસ્ક્રિપ્શન',
      'nav.feedback': 'ફીડબેક',
      'nav.report': 'રિપોર્ટ',
      'nav.progress': 'પ્રગતિ',
      'nav.help': 'મદદ',
      'nav.contact': 'ડૉક્ટર સાથે સંપર્ક',
      'nav.logout': 'લૉગ આઉટ',
      'nav.dashboard': 'ડેશબોર્ડ',
      'nav.patients': 'દર્દીઓ',
      'nav.appointments': 'મુલાકાતો',
      
      // Introduction Page
      'intro.title': 'પ્રાણકર્મમાં આપનું સ્વાગત',
      'intro.subtitle': 'આપનું સંપૂર્ણ આયુર્વેદિક ઉપચાર વ્યવસ્થાપન પ્લેટફોર્મ',
      'intro.panchkarma.title': 'પંચકર્મ સમજવું',
      'intro.panchkarma.description': 'પંચકર્મ એ આયુર્વેદિક ઉપચારનો પાયાનો પથ્થર છે, જેમાં આપના શરીર, મન અને આત્માને વિષમુક્ત અને કાયાકલ્પ કરવા માટે રચાયેલી પાંચ શક્તિશાળી ઉપચારાત્મક પ્રક્રિયાઓનો સમાવેશ થાય છે.',
      'intro.therapy.vamanam': 'વમન',
      'intro.therapy.vamanam.desc': 'શરીરના ઉપરના ભાગમાંથી વધારાના કફ દોષને દૂર કરવા માટે ઉપચારાત્મક ઉલટી',
      'intro.therapy.virechana': 'વિરેચન',
      'intro.therapy.virechana.desc': 'પાચન તંત્રમાંથી વધારાના પિત્ત દોષને સાફ કરવા માટે વિરેચન ઉપચાર',
      'intro.therapy.basti': 'બસ્તિ',
      'intro.therapy.basti.desc': 'વાત દોષને સંતુલિત કરવા અને નીચલા શરીરને મજબૂત બનાવવા માટે દવાયુક્ત એનિમા',
      'intro.therapy.nasya': 'નસ્ય',
      'intro.therapy.nasya.desc': 'માથા અને ગરદનના વિસ્તારને સાફ કરવા માટે નાક દ્વારા દવાઓનું વહીવટ',
      'intro.therapy.raktamokshana': 'રક્તમોક્ષણ',
      'intro.therapy.raktamokshana.desc': 'રક્ત પરિભ્રમણ પ્રણાલીમાંથી ઝેરી તત્વોને દૂર કરવા માટે રક્ત શુદ્ધીકરણ ઉપચાર',
      'intro.benefits.title': 'પંચકર્મના ફાયદાઓ',
      'intro.benefits.detox': 'સંપૂર્ણ શરીર વિષમુક્તિકરણ',
      'intro.benefits.immunity': 'વધેલી રોગપ્રતિકારક શક્તિ',
      'intro.benefits.balance': 'દોષ સંતુલન પુનઃસ્થાપના',
      'intro.benefits.mental': 'માનસિક સ્પષ્ટતા અને શાંતિ',
      'intro.benefits.vitality': 'વધેલી જીવનશક્તિ અને ઊર્જા',
      'intro.benefits.longevity': 'આયુષ્યને પ્રોત્સાહન આપે છે',
      'intro.journey.title': 'આપની ઉપચાર યાત્રા',
      'intro.journey.description': 'પ્રાણકર્મ આપના પંચકર્મ ઉપચારના દરેક પગલે આપને માર્ગદર્શન આપશે, આપની પ્રગતિને ટ્રેક કરશે, પ્રિસ્ક્રિપ્શનનું વ્યવસ્થાપન કરશે અને આપને અનુભવી આયુર્વેદિક ચિકિત્સકો સાથે જોડશે.',
      'intro.continue': 'આપની યાત્રા શરૂ કરો',
      'intro.language': 'આપની ભાષા પસંદ કરો',
      
      // Common
      'common.welcome': 'સ્વાગત',
      'common.loading': 'લોડ થઈ રહ્યું છે...',
      'common.save': 'સેવ કરો',
      'common.cancel': 'રદ કરો',
      'common.submit': 'સબમિટ કરો',
      'common.edit': 'સંપાદિત કરો',
      'common.delete': 'ડિલીટ કરો',
      'common.close': 'બંધ કરો',
      'common.yes': 'હા',
      'common.no': 'ના',
      
      // Languages
      'lang.english': 'English',
      'lang.hindi': 'हिंदी',
      'lang.marathi': 'मराठी',
      'lang.gujarati': 'ગુજરાતી',
      'lang.tamil': 'தமிழ்',
      'lang.telugu': 'తెలుగు',
      'lang.kannada': 'ಕನ್ನಡ'
    },
    
    ta: {
      // App Navigation
      'nav.home': 'முகப்பு',
      'nav.prescription': 'மருந்துச்சீட்டு',
      'nav.feedback': 'கருத்து',
      'nav.report': 'அறிக்கை',
      'nav.progress': 'முன்னேற்றம்',
      'nav.help': 'உதவி',
      'nav.contact': 'மருத்துவரை தொடர்பு கொள்ளுங்கள்',
      'nav.logout': 'வெளியேறு',
      'nav.dashboard': 'டாஷ்போர்டு',
      'nav.patients': 'நோயாளிகள்',
      'nav.appointments': 'சந்திப்புகள்',
      
      // Introduction Page
      'intro.title': 'பிராணகர்மாவில் உங்களை வரவேற்கிறோம்',
      'intro.subtitle': 'உங்கள் முழுமையான ஆயுர்வேத சிகிச்சை மேலாண்மை தளம்',
      'intro.panchkarma.title': 'பஞ்சகர்மாவை புரிந்துகொள்ளுதல்',
      'intro.panchkarma.description': 'பஞ்சகர்மா என்பது ஆயுர்வேத சிகிச்சையின் அடிப்படைக் கல்லாகும், இது உங்கள் உடல், மனம் மற்றும் ஆன்மாவை நச்சுநீக்கம் செய்து புதுப்பிக்க வடிவமைக்கப்பட்ட ஐந்து சக்திவாய்ந்த சிகிச்சை நடைமுறைகளைக் கொண்டுள்ளது.',
      'intro.therapy.vamanam': 'வமனம்',
      'intro.therapy.vamanam.desc': 'உடலின் மேல் பகுதியிலிருந்து அதிகப்படியான கபம் தோஷத்தை நீக்க சிகிச்சை வாந்தி',
      'intro.therapy.virechana': 'விரேசனம்',
      'intro.therapy.virechana.desc': 'செரிமான மண்டலத்திலிருந்து அதிகப்படியான பித்த தோஷத்தை சுத்தப்படுத்த பேதி சிகிச்சை',
      'intro.therapy.basti': 'பஸ்தி',
      'intro.therapy.basti.desc': 'வாத தோஷத்தை சமநிலைப்படுத்தி கீழ் உடலை வலுப்படுத்த மருந்து எனிமா',
      'intro.therapy.nasya': 'நஸ்யம்',
      'intro.therapy.nasya.desc': 'தலை மற்றும் கழுத்து பகுதியை சுத்தம் செய்ய மூக்கு வழியாக மருந்து செலுத்துதல்',
      'intro.therapy.raktamokshana': 'ரக்தமோக்ஷணம்',
      'intro.therapy.raktamokshana.desc': 'இரத்த ஓட்ட அமைப்பிலிருந்து நச்சுகளை அகற்ற இரத்த சுத்திகரிப்பு சிகிச்சை',
      'intro.benefits.title': 'பஞ்சகர்மாவின் நன்மைகள்',
      'intro.benefits.detox': 'முழுமையான உடல் நச்சுநீக்கம்',
      'intro.benefits.immunity': 'மேம்பட்ட நோய் எதிர்ப்பு சக்தி',
      'intro.benefits.balance': 'தோஷ சமநிலை மீட்டெடுப்பு',
      'intro.benefits.mental': 'மன தெளிவு மற்றும் அமைதி',
      'intro.benefits.vitality': 'அதிகரித்த உயிர்ச்சக்தி மற்றும் ஆற்றல்',
      'intro.benefits.longevity': 'நீண்ட ஆயுளை ஊக்குவிக்கிறது',
      'intro.journey.title': 'உங்கள் குணப்படுத்தும் பயணம்',
      'intro.journey.description': 'பிராணகர்மா உங்கள் பஞ்சகர்மா சிகிச்சையின் ஒவ்வொரு அடியிலும் உங்களை வழிநடத்தும், உங்கள் முன்னேற்றத்தை கண்காணிக்கும், மருந்துச்சீட்டுகளை நிர்வகிக்கும், மற்றும் அனுபவமிக்க ஆயுர்வேத மருத்துவர்களுடன் உங்களை இணைக்கும்.',
      'intro.continue': 'உங்கள் பயணத்தைத் தொடங்குங்கள்',
      'intro.language': 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
      
      // Languages
      'lang.english': 'English',
      'lang.hindi': 'हिंदी',
      'lang.marathi': 'मराठी',
      'lang.gujarati': 'ગુજરાતી',
      'lang.tamil': 'தமிழ்',
      'lang.telugu': 'తెలుగు',
      'lang.kannada': 'ಕನ್ನಡ'
    },
    
    te: {
      // App Navigation
      'nav.home': 'హోమ్',
      'nav.prescription': 'ప్రిస్క్రిప్షన్',
      'nav.feedback': 'ఫీడ్‌బ్యాక్',
      'nav.report': 'రిపోర్ట్',
      'nav.progress': 'పురోగతి',
      'nav.help': 'సహాయం',
      'nav.contact': 'వైద్యుడిని సంప్రదించండి',
      'nav.logout': 'లాగ్ అవుట్',
      'nav.dashboard': 'డ్యాష్‌బోర్డ్',
      'nav.patients': 'రోగులు',
      'nav.appointments': 'అపాయింట్‌మెంట్లు',
      
      // Introduction Page
      'intro.title': 'ప్రాణకర్మకు మిమ్మల్ని స్వాగతం',
      'intro.subtitle': 'మీ పూర్తి ఆయుర్వేద చికిత్స నిర్వహణ వేదిక',
      'intro.panchkarma.title': 'పంచకర్మను అర్థం చేసుకోవడం',
      'intro.panchkarma.description': 'పంచకర్మ అనేది ఆయుర్వేద చికిత్సకు మూలస్తంభం, ఇది మీ శరీరం, మనస్సు మరియు ఆత్మను విషరహితం చేసి పునరుజ్జీవనం చేయడానికి రూపొందించబడిన ఐదు శక్తివంతమైన చికిత్సా ప్రక్రియలను కలిగి ఉంటుంది.',
      'intro.therapy.vamanam': 'వమనం',
      'intro.therapy.vamanam.desc': 'శరీరం యొక్క ఎగువ భాగం నుండి అధిక కఫ దోషాన్ని తొలగించడానికి చికిత్సా వాంతులు',
      'intro.therapy.virechana': 'విరేచనం',
      'intro.therapy.virechana.desc': 'జీర్ణవ్యవస్థ నుండి అధిక పిత్త దోషాన్ని శుభ్రపరచడానికి విరేచన చికిత్స',
      'intro.therapy.basti': 'బస్తి',
      'intro.therapy.basti.desc': 'వాత దోషాన్ని సమతుల్యం చేయడానికి మరియు దిగువ శరీరాన్ని బలపరచడానికి ఔషధ ఎనిమా',
      'intro.therapy.nasya': 'నస్యం',
      'intro.therapy.nasya.desc': 'తల మరియు మెడ ప్రాంతాన్ని శుభ్రపరచడానికి ముక్కు ద్వారా ఔషధాల అందించడం',
      'intro.therapy.raktamokshana': 'రక్తమోక్షణం',
      'intro.therapy.raktamokshana.desc': 'రక్త ప్రసరణ వ్యవస్థ నుండి విషాలను తొలగించడానికి రక్త శుద్ధీకరణ చికిత్స',
      'intro.benefits.title': 'పంచకర్మ యొక్క ప్రయోజనాలు',
      'intro.benefits.detox': 'పూర్తి శరీర విషరహితీకరణ',
      'intro.benefits.immunity': 'మెరుగైన రోగనిరోధక శక్తి',
      'intro.benefits.balance': 'దోష సమతుల్య పునరుద్ధరణ',
      'intro.benefits.mental': 'మానసిక స్పష్టత మరియు శాంతి',
      'intro.benefits.vitality': 'పెరిగిన జీవశక్తి మరియు శక్తి',
      'intro.benefits.longevity': 'దీర్ఘాయువును ప్రోత్సహిస్తుంది',
      'intro.journey.title': 'మీ వైద్య ప్రయాణం',
      'intro.journey.description': 'ప్రాణకర్మ మీ పంచకర్మ చికిత్స యొక్క ప్రతి దశలో మిమ్మల్ని మార్గనిర్దేశం చేస్తుంది, మీ పురోగతిని ట్రాక్ చేస్తుంది, ప్రిస్క్రిప్షన్లను నిర్వహిస్తుంది మరియు మిమ్మల్ని అనుభవజ్ఞులైన ఆయుర్వేద వైద్యులతో కలుపుతుంది.',
      'intro.continue': 'మీ ప్రయాణాన్ని ప్రారంభించండి',
      'intro.language': 'మీ భాషను ఎంచుకోండి',
      
      // Languages
      'lang.english': 'English',
      'lang.hindi': 'हिंदी',
      'lang.marathi': 'मराठी',
      'lang.gujarati': 'ગુજરાતી',
      'lang.tamil': 'தமிழ்',
      'lang.telugu': 'తెలుగు',
      'lang.kannada': 'ಕನ್ನಡ'
    },
    
    kn: {
      // App Navigation
      'nav.home': 'ಮುಖಪುಟ',
      'nav.prescription': 'ಔಷಧಿ ಪರಿಚಯ',
      'nav.feedback': 'ಪ್ರತಿಕ್ರಿಯೆ',
      'nav.report': 'ವರದಿ',
      'nav.progress': 'ಪ್ರಗತಿ',
      'nav.help': 'ಸಹಾಯ',
      'nav.contact': 'ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ',
      'nav.logout': 'ಲಾಗ್ ಔಟ್',
      'nav.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      'nav.patients': 'ರೋಗಿಗಳು',
      'nav.appointments': 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು',
      
      // Introduction Page
      'intro.title': 'ಪ್ರಾಣಕರ್ಮಕ್ಕೆ ನಿಮಗೆ ಸ್ವಾಗತ',
      'intro.subtitle': 'ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಆಯುರ್ವೇದ ಚಿಕಿತ್ಸೆ ನಿರ್ವಹಣೆ ವೇದಿಕೆ',
      'intro.panchkarma.title': 'ಪಂಚಕರ್ಮವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು',
      'intro.panchkarma.description': 'ಪಂಚಕರ್ಮವು ಆಯುರ್ವೇದ ಚಿಕಿತ್ಸೆಯ ಮೂಲಾಧಾರವಾಗಿದೆ, ಇದು ನಿಮ್ಮ ದೇಹ, ಮನಸ್ಸು ಮತ್ತು ಆತ್ಮವನ್ನು ವಿಷಮುಕ್ತಗೊಳಿಸಲು ಮತ್ತು ಪುನರುಜ್ಜೀವನಗೊಳಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಐದು ಶಕ್ತಿಶಾಲಿ ಚಿಕಿತ್ಸಕ ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ಒಳಗೊಂಡಿರುತ್ತದೆ.',
      'intro.therapy.vamanam': 'ವಮನ',
      'intro.therapy.vamanam.desc': 'ದೇಹದ ಮೇಲಿನ ಭಾಗದಿಂದ ಹೆಚ್ಚುವರಿ ಕಫ ದೋಷವನ್ನು ತೊಡೆದುಹಾಕಲು ಚಿಕಿತ್ಸಕ ವಾಂತಿ',
      'intro.therapy.virechana': 'ವಿರೇಚನ',
      'intro.therapy.virechana.desc': 'ಜೀರ್ಣಾಂಗ ವ್ಯವಸ್ಥೆಯಿಂದ ಹೆಚ್ಚುವರಿ ಪಿತ್ತ ದೋಷವನ್ನು ಶುದ್ಧೀಕರಿಸಲು ವಿರೇಚನ ಚಿಕಿತ್ಸೆ',
      'intro.therapy.basti': 'ಬಸ್ತಿ',
      'intro.therapy.basti.desc': 'ವಾತ ದೋಷವನ್ನು ಸಮತೋಲನಗೊಳಿಸಲು ಮತ್ತು ಕೆಳಗಿನ ದೇಹವನ್ನು ಬಲಪಡಿಸಲು ಔಷಧೀಯ ಎನಿಮಾ',
      'intro.therapy.nasya': 'ನಸ್ಯ',
      'intro.therapy.nasya.desc': 'ತಲೆ ಮತ್ತು ಕುತ್ತಿಗೆ ಪ್ರದೇಶವನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಲು ಮೂಗಿನ ಮೂಲಕ ಔಷಧಿಗಳ ಆಡಳಿತ',
      'intro.therapy.raktamokshana': 'ರಕ್ತಮೋಕ್ಷಣ',
      'intro.therapy.raktamokshana.desc': 'ರಕ್ತ ಪರಿಚಲನೆ ವ್ಯವಸ್ಥೆಯಿಂದ ವಿಷವನ್ನು ತೊಡೆದುಹಾಕಲು ರಕ್ತ ಶುದ್ಧೀಕರಣ ಚಿಕಿತ್ಸೆ',
      'intro.benefits.title': 'ಪಂಚಕರ್ಮದ ಪ್ರಯೋಜನಗಳು',
      'intro.benefits.detox': 'ಸಂಪೂರ್ಣ ದೇಹ ವಿಷಮುಕ್ತೀಕರಣ',
      'intro.benefits.immunity': 'ವರ್ಧಿತ ರೋಗನಿರೋಧಕ ಶಕ್ತಿ',
      'intro.benefits.balance': 'ದೋಷ ಸಮತೋಲನ ಮರುಸ್ಥಾಪನೆ',
      'intro.benefits.mental': 'ಮಾನಸಿಕ ಸ್ಪಷ್ಟತೆ ಮತ್ತು ಶಾಂತಿ',
      'intro.benefits.vitality': 'ಹೆಚ್ಚಿದ ಜೀವಶಕ್ತಿ ಮತ್ತು ಶಕ್ತಿ',
      'intro.benefits.longevity': 'ದೀರ್ಘಾಯುಷ್ಯವನ್ನು ಉತ್ತೇಜಿಸುತ್ತದೆ',
      'intro.journey.title': 'ನಿಮ್ಮ ಗುಣಪಡಿಸುವ ಪ್ರಯಾಣ',
      'intro.journey.description': 'ಪ್ರಾಣಕರ್ಮವು ನಿಮ್ಮ ಪಂಚಕರ್ಮ ಚಿಕಿತ್ಸೆಯ ಪ್ರತಿ ಹಂತದಲ್ಲಿ ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ, ನಿಮ್ಮ ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುತ್ತದೆ, ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ ಮತ್ತು ಅನುಭವಿ ಆಯುರ್ವೇದ ವೈದ್ಯರೊಂದಿಗೆ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.',
      'intro.continue': 'ನಿಮ್ಮ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ',
      'intro.language': 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      
      // Languages
      'lang.english': 'English',
      'lang.hindi': 'हिंदी',
      'lang.marathi': 'मराठी',
      'lang.gujarati': 'ગુજરાતી',
      'lang.tamil': 'தமிழ்',
      'lang.telugu': 'తెలుగు',
      'lang.kannada': 'ಕನ್ನಡ'
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};