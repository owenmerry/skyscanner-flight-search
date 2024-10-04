export interface GoogleDetailsResponse {
  name: string;
  id: string;
  types: string[];
  nationalPhoneNumber: string;
  internationalPhoneNumber: string;
  formattedAddress: string;
  addressComponents: AddressComponent[];
  plusCode: PlusCode;
  location: Location;
  viewport: Viewport;
  rating: number;
  googleMapsUri: string;
  websiteUri: string;
  regularOpeningHours: RegularOpeningHours;
  utcOffsetMinutes: number;
  adrFormatAddress: string;
  businessStatus: string;
  userRatingCount: number;
  iconMaskBaseUri: string;
  iconBackgroundColor: string;
  displayName: DisplayName;
  primaryTypeDisplayName: PrimaryTypeDisplayName;
  currentOpeningHours: CurrentOpeningHours;
  primaryType: string;
  shortFormattedAddress: string;
  editorialSummary: EditorialSummary;
  reviews: Review[];
  photos: Photo[];
  goodForChildren: boolean;
  accessibilityOptions: AccessibilityOptions;
}

export interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
  languageCode: string;
}

export interface PlusCode {
  globalCode: string;
  compoundCode: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Viewport {
  low: Low;
  high: High;
}

export interface Low {
  latitude: number;
  longitude: number;
}

export interface High {
  latitude: number;
  longitude: number;
}

export interface RegularOpeningHours {
  openNow: boolean;
  periods: Period[];
  weekdayDescriptions: string[];
}

export interface Period {
  open: Open;
  close: Close;
}

export interface Open {
  day: number;
  hour: number;
  minute: number;
}

export interface Close {
  day: number;
  hour: number;
  minute: number;
}

export interface DisplayName {
  text: string;
  languageCode: string;
}

export interface PrimaryTypeDisplayName {
  text: string;
  languageCode: string;
}

export interface CurrentOpeningHours {
  openNow: boolean;
  periods: Period2[];
  weekdayDescriptions: string[];
}

export interface Period2 {
  open: OpenPeriod;
  close: ClosePeriod;
}

export interface OpenPeriod {
  day: number;
  hour: number;
  minute: number;
  date: DatePeriod;
}

export interface DatePeriod {
  year: number;
  month: number;
  day: number;
}

export interface ClosePeriod {
  day: number;
  hour: number;
  minute: number;
  date: DatePeriod;
}

export interface EditorialSummary {
  text: string;
  languageCode: string;
}

export interface Review {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text: Text;
  originalText: OriginalText;
  authorAttribution: AuthorAttribution;
  publishTime: string;
}

export interface Text {
  text: string;
  languageCode: string;
}

export interface OriginalText {
  text: string;
  languageCode: string;
}

export interface AuthorAttribution {
  displayName: string;
  uri: string;
  photoUri: string;
}

export interface Photo {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions: AuthorAttribution2[];
}

export interface AuthorAttribution2 {
  displayName: string;
  uri: string;
  photoUri: string;
}

export interface AccessibilityOptions {
  wheelchairAccessibleEntrance: boolean;
  wheelchairAccessibleRestroom: boolean;
  wheelchairAccessibleSeating: boolean;
}
