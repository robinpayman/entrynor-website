export type Language = "no" | "en";

export const SUPPORTED_LANGUAGES: Language[] = ["no", "en"];
export const DEFAULT_LANGUAGE: Language = "no";

// Contact defaults
export const CONTACT_EMAIL = "info@entrynor.no";
export const COMPANY_NAME = "Entrynor AS";
export const COMPANY_ADDRESS = "Nye Vakås Vei 6, 1395 HVALSTAD";

export const translations = {
  no: {
    // Navigation & Header
    capabilities: "Muligheter",
    standard: "Standard",
    contact: "Kontakt",

    // Hero Section
    tagline: "Norsk leverandør - Globale kunder",
    heroTitle: "",
    heroDescription:
      "",
    startConversation: "Kontakt",
    discreetByDesign: "",

    // Capabilities Section
    whatWeDo: "Hva vi gjør",
    exclusiveProduction: "Eksklusiv produksjon, håndtert fra ende til ende.",
    capability1: "Privat merkevareproduksjon",
    capability2: "Presis sourcing",
    capability3: "Premium emballasje",
    capability4: "Kontrollert kvalitetssikring",

    // Statement Section
    statement:
      "Vi arbeider bak scenen for krevende merker der presentasjon, konsistens og pålitelighet betyr noe. Vår rolle er ikke å være høy. Det er å gjøre hvert levert produkt uunngåelig.",

    // Trust Section
    selective: "Ta kontakt",
    selectiveDesc: "Send mail til info@entrynor.no. Vi svarer deg innen 24 timer.",
    controlled: "Funksjonalitet",
    controlledDesc: "Gratis design. Vi blir enige om design. Har du ikke, hjelper vi deg med det.",
    confidential: "Levert på døren",
    confidentialDesc: "Produksjon. Vi sender dine produkter til deg – levert på døren hvor du vil.",

    // Contact Section
    privateInquiries: "Kontakt",
    forBrands: "For merker som søker en seriøs produksjonspartner.",
    tellUs: "",

    // Contact Form
    yourName: "Navn",
    fullName: "Fullt navn",
    company: "",
    companyName: "",
    email: "E-post",
    emailPlaceholder: "navn@bedrift.no",
    phone: "Telefon",
    phonePlaceholder: "+47 XX XX XX XX",
    tellUsAboutProject: "Melding",
    projectPlaceholder: "Beskriv ditt prosjekt",
    privacy: "Jeg godtar å bli kontaktet, send henvendelse",
    sendInquiry: "",
    formNotice: "Vi svarer vanligvis innen 24 timer.",
    messageSent: "Melding sendt",

    // Footer
    footerDescription: "Premium produksjonspartner for verdens mest krevende merker.",
    footerContact: "Kontakt",
    footerNavigate: "Naviger",
    footerLegal: "Juridisk",
    privacyPolicy: "Personvernpolicy",
    termsConditions: "Vilkår og betingelser",
    allRightsReserved: "© {{year}} Entrynor. Alle rettigheter forbeholdt.",
    exclusiveSupply: "Eksklusiv forsyning og produksjonssamarbeid.",

    // Error/General
    error: "Feil",
    errorSendingMessage: "Det oppstod en feil ved sending av meldingen. Vennligst prøv igjen.",
  },

  en: {
    // Navigation & Header
    capabilities: "Capabilities",
    standard: "Standard",
    contact: "Contact",

    // Hero Section
    tagline: "Norwegian supplier - Global customers",
    heroTitle: "",
    heroDescription:
      "",
    startConversation: "Contact",
    discreetByDesign: "",

    // Capabilities Section
    whatWeDo: "What we do",
    exclusiveProduction: "Exclusive production, handled end to end.",
    capability1: "Private label production",
    capability2: "Precision sourcing",
    capability3: "Premium packaging",
    capability4: "Controlled quality assurance",

    // Statement Section
    statement:
      "We work behind the scenes for demanding brands where presentation, consistency, and reliability matter. Our role is not to be loud. It is to make every delivered product feel inevitable.",

    // Trust Section
    selective: "Get in Touch",
    selectiveDesc: "Send email to info@entrynor.no. We respond within 24 hours.",
    controlled: "Functionality",
    controlledDesc: "Free design. We agree on the design. If you don't have one, we help you with it.",
    confidential: "Delivered to Your Door",
    confidentialDesc: "Production. We send your products to you – delivered to your door where you want.",

    // Contact Section
    privateInquiries: "Contact",
    forBrands: "For brands seeking a serious manufacturing partner.",
    tellUs: "",

    // Contact Form
    yourName: "Name",
    fullName: "Full name",
    company: "",
    companyName: "",
    email: "Email",
    emailPlaceholder: "name@company.com",
    phone: "Phone",
    phonePlaceholder: "+47 XX XX XX XX",
    tellUsAboutProject: "Message",
    projectPlaceholder: "Describe your project",
    privacy: "I agree to be contacted, send inquiry",
    sendInquiry: "",
    formNotice: "We typically respond within 24 hours.",
    messageSent: "Message Sent",

    // Footer
    footerDescription: "Premium manufacturing partner for the world's most discerning brands.",
    footerContact: "Contact",
    footerNavigate: "Navigate",
    footerLegal: "Legal",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
    allRightsReserved: "© {{year}} Entrynor. All rights reserved.",
    exclusiveSupply: "Exclusive supply and manufacturing partnerships.",

    // Error/General
    error: "Error",
    errorSendingMessage: "There was an error sending your message. Please try again.",
  },
};

export function getTranslation(lang: Language, key: keyof typeof translations.no): string {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    lang = DEFAULT_LANGUAGE;
  }
  return translations[lang][key as keyof typeof translations[typeof lang]];
}

export function isValidLanguage(lang: string | null | undefined): lang is Language {
  return SUPPORTED_LANGUAGES.includes(lang as Language);
}
