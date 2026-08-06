/**
 * African country dialling codes for the phone-entry screen.
 * Nigeria is the app default. Flags use regional-indicator emoji.
 */
export type Country = {
  iso: string;
  name: string;
  dial: string;
  flag: string;
};

export const AfricanCountries: Country[] = [
  { iso: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬" },
  { iso: "DZ", name: "Algeria", dial: "+213", flag: "🇩🇿" },
  { iso: "AO", name: "Angola", dial: "+244", flag: "🇦🇴" },
  { iso: "BJ", name: "Benin", dial: "+229", flag: "🇧🇯" },
  { iso: "BW", name: "Botswana", dial: "+267", flag: "🇧🇼" },
  { iso: "BF", name: "Burkina Faso", dial: "+226", flag: "🇧🇫" },
  { iso: "BI", name: "Burundi", dial: "+257", flag: "🇧🇮" },
  { iso: "CM", name: "Cameroon", dial: "+237", flag: "🇨🇲" },
  { iso: "CV", name: "Cape Verde", dial: "+238", flag: "🇨🇻" },
  { iso: "CF", name: "Central African Republic", dial: "+236", flag: "🇨🇫" },
  { iso: "TD", name: "Chad", dial: "+235", flag: "🇹🇩" },
  { iso: "KM", name: "Comoros", dial: "+269", flag: "🇰🇲" },
  { iso: "CG", name: "Congo", dial: "+242", flag: "🇨🇬" },
  { iso: "CD", name: "DR Congo", dial: "+243", flag: "🇨🇩" },
  { iso: "CI", name: "Côte d'Ivoire", dial: "+225", flag: "🇨🇮" },
  { iso: "DJ", name: "Djibouti", dial: "+253", flag: "🇩🇯" },
  { iso: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬" },
  { iso: "GQ", name: "Equatorial Guinea", dial: "+240", flag: "🇬🇶" },
  { iso: "ER", name: "Eritrea", dial: "+291", flag: "🇪🇷" },
  { iso: "SZ", name: "Eswatini", dial: "+268", flag: "🇸🇿" },
  { iso: "ET", name: "Ethiopia", dial: "+251", flag: "🇪🇹" },
  { iso: "GA", name: "Gabon", dial: "+241", flag: "🇬🇦" },
  { iso: "GM", name: "Gambia", dial: "+220", flag: "🇬🇲" },
  { iso: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭" },
  { iso: "GN", name: "Guinea", dial: "+224", flag: "🇬🇳" },
  { iso: "GW", name: "Guinea-Bissau", dial: "+245", flag: "🇬🇼" },
  { iso: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
  { iso: "LS", name: "Lesotho", dial: "+266", flag: "🇱🇸" },
  { iso: "LR", name: "Liberia", dial: "+231", flag: "🇱🇷" },
  { iso: "LY", name: "Libya", dial: "+218", flag: "🇱🇾" },
  { iso: "MG", name: "Madagascar", dial: "+261", flag: "🇲🇬" },
  { iso: "MW", name: "Malawi", dial: "+265", flag: "🇲🇼" },
  { iso: "ML", name: "Mali", dial: "+223", flag: "🇲🇱" },
  { iso: "MR", name: "Mauritania", dial: "+222", flag: "🇲🇷" },
  { iso: "MU", name: "Mauritius", dial: "+230", flag: "🇲🇺" },
  { iso: "MA", name: "Morocco", dial: "+212", flag: "🇲🇦" },
  { iso: "MZ", name: "Mozambique", dial: "+258", flag: "🇲🇿" },
  { iso: "NA", name: "Namibia", dial: "+264", flag: "🇳🇦" },
  { iso: "NE", name: "Niger", dial: "+227", flag: "🇳🇪" },
  { iso: "RW", name: "Rwanda", dial: "+250", flag: "🇷🇼" },
  { iso: "ST", name: "São Tomé and Príncipe", dial: "+239", flag: "🇸🇹" },
  { iso: "SN", name: "Senegal", dial: "+221", flag: "🇸🇳" },
  { iso: "SC", name: "Seychelles", dial: "+248", flag: "🇸🇨" },
  { iso: "SL", name: "Sierra Leone", dial: "+232", flag: "🇸🇱" },
  { iso: "SO", name: "Somalia", dial: "+252", flag: "🇸🇴" },
  { iso: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { iso: "SS", name: "South Sudan", dial: "+211", flag: "🇸🇸" },
  { iso: "SD", name: "Sudan", dial: "+249", flag: "🇸🇩" },
  { iso: "TZ", name: "Tanzania", dial: "+255", flag: "🇹🇿" },
  { iso: "TG", name: "Togo", dial: "+228", flag: "🇹🇬" },
  { iso: "TN", name: "Tunisia", dial: "+216", flag: "🇹🇳" },
  { iso: "UG", name: "Uganda", dial: "+256", flag: "🇺🇬" },
  { iso: "ZM", name: "Zambia", dial: "+260", flag: "🇿🇲" },
  { iso: "ZW", name: "Zimbabwe", dial: "+263", flag: "🇿🇼" },
];
