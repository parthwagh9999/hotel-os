// ─── HOTEL OS — Regional Language Dictionary (i18n) ─────────────────────────
// Native support for English, Hindi (हिंदी), and Marathi (मराठी)
// Tailored for hospitality operations across India
// ─────────────────────────────────────────────────────────────────────────────

export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface TranslationDictionary {
  appName: string;
  discoverHotels: string;
  hotelManagement: string;
  superAdmin: string;
  signIn: string;
  listYourHotel: string;
  liveOccupancy: string;
  todayArrivals: string;
  todayDepartures: string;
  todayRevenue: string;
  frontDeskPMS: string;
  roomInventory: string;
  housekeeping: string;
  financeGST: string;
  aiInsights: string;
  checkIn: string;
  checkOut: string;
  available: string;
  occupied: string;
  cleaningRequired: string;
  maintenance: string;
  newWalkIn: string;
  roomNumber: string;
  guestName: string;
  totalAmount: string;
  paid: string;
  quickCheckIn: string;
  contactlessCheckIn: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'HOTEL OS',
    discoverHotels: 'Discover Hotels',
    hotelManagement: 'Hotel Management (B2B)',
    superAdmin: 'Super Admin',
    signIn: 'Sign In',
    listYourHotel: 'List Your Hotel',
    liveOccupancy: 'Live Occupancy',
    todayArrivals: 'Today Arrivals',
    todayDepartures: 'Today Departures',
    todayRevenue: "Today's Revenue",
    frontDeskPMS: 'Front Desk PMS',
    roomInventory: 'Rooms & Inventory',
    housekeeping: 'Housekeeping',
    financeGST: 'Finance & GST',
    aiInsights: 'AI Revenue & Forecasts',
    checkIn: 'Check In',
    checkOut: 'Check Out',
    available: 'Available',
    occupied: 'Occupied',
    cleaningRequired: 'Cleaning Needed',
    maintenance: 'Maintenance',
    newWalkIn: 'New Walk-in Guest',
    roomNumber: 'Room #',
    guestName: 'Guest Name',
    totalAmount: 'Total Amount',
    paid: 'PAID',
    quickCheckIn: 'Express Check-In',
    contactlessCheckIn: 'Self Check-In',
  },
  hi: {
    appName: 'होटल ओएस',
    discoverHotels: 'होटल खोजें',
    hotelManagement: 'होटल प्रबंधन (B2B)',
    superAdmin: 'सुपर एडमिन',
    signIn: 'लॉग इन करें',
    listYourHotel: 'अपना होटल जोड़ें',
    liveOccupancy: 'वर्तमान रूम ऑक्यूपेंसी',
    todayArrivals: 'आज के आगमन (Arrivals)',
    todayDepartures: 'आज के प्रस्थान (Departures)',
    todayRevenue: 'आज की कुल कमाई (Revenue)',
    frontDeskPMS: 'फ्रंट डेस्क PMS',
    roomInventory: 'कमरे और इन्वेंटरी',
    housekeeping: 'हाउसकीपिंग व सफाई',
    financeGST: 'वित्तीय व GST बिलिंग',
    aiInsights: 'AI भविष्यवाणी व मूल्य निर्धारण',
    checkIn: 'चेक-इन करें',
    checkOut: 'चेक-आउट करें',
    available: 'उपलब्ध (Available)',
    occupied: 'व्यस्त (Occupied)',
    cleaningRequired: 'सफाई आवश्यक',
    maintenance: 'मरम्मत (Maintenance)',
    newWalkIn: 'नया वॉक-इन मेहमान',
    roomNumber: 'कमरा सं.',
    guestName: 'अतिथि का नाम',
    totalAmount: 'कुल राशि',
    paid: 'भुगतान संपन्न',
    quickCheckIn: 'त्वरित चेक-इन',
    contactlessCheckIn: 'मोबाइल सेल्फ चेक-इन',
  },
  mr: {
    appName: 'हॉटेल ओएस',
    discoverHotels: 'हॉटेल्स शोधा',
    hotelManagement: 'हॉटेल व्यवस्थापन (B2B)',
    superAdmin: 'सुपर ॲडमिन',
    signIn: 'लॉग इन करा',
    listYourHotel: 'तुमचे हॉटेल नोंदवा',
    liveOccupancy: 'सध्याची रूम ऑक्युपन्सी',
    todayArrivals: 'आजचे आगमन (Arrivals)',
    todayDepartures: 'आजचे निर्गमन (Departures)',
    todayRevenue: 'आजचा एकूण महसूल (Revenue)',
    frontDeskPMS: 'फ्रंट डेस्क PMS',
    roomInventory: 'खोल्या आणि इन्व्हेंटरी',
    housekeeping: 'हाऊसकीपिंग आणि स्वच्छता',
    financeGST: 'आर्थिक व GST बिलिंग',
    aiInsights: 'AI अंदाज व किंमत व्यवस्थापन',
    checkIn: 'चेक-इन करा',
    checkOut: 'चेक-आउट करा',
    available: 'उपलब्ध (Available)',
    occupied: 'भरलेली (Occupied)',
    cleaningRequired: 'स्वच्छता आवश्यक',
    maintenance: 'दुरुस्ती (Maintenance)',
    newWalkIn: 'नवीन वॉक-इन पाहुणे',
    roomNumber: 'खोली क्र.',
    guestName: 'पाहुण्यांचे नाव',
    totalAmount: 'एकूण रक्कम',
    paid: 'पैसे जमा',
    quickCheckIn: 'जलद चेक-इन',
    contactlessCheckIn: 'मोबाईल सेल्फ चेक-इन',
  },
};
