/**
 * Intelligent NPCI UTR Checksum & Bank Routing Verification Utility
 * National Payments Corporation of India (NPCI) 12-Digit UTR Standard Rules
 */

// Known NPCI Bank Routing Prefixes for Indian Banks & Payment Service Providers
const VALID_NPCI_PREFIXES = [
  '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
  '50', '51', '52', '53', '54', '55', '56', '57', '58', '59',
  '60', '61', '62', '63', '64', '65', '66', '67', '68', '69',
  '70', '71', '72', '73', '74', '75', '76', '77', '78', '79',
  '80', '81', '82', '83', '84', '85', '86', '87', '88', '89',
  '90', '91', '92', '93', '94', '95', '96', '97', '98', '99',
  '30', '31', '32', '33', '34', '35', '36', '37', '38', '39'
];

/**
 * Validates Luhn Checksum on 12-digit UTR string
 */
function checkLuhn(utr: string): boolean {
  let sum = 0;
  let shouldDouble = false;
  for (let i = utr.length - 1; i >= 0; i--) {
    let digit = parseInt(utr.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export interface UTRValidationResult {
  isValid: boolean;
  bankName?: string;
  errorMessage?: string;
}

/**
 * Intelligent NPCI UTR Verification
 */
export function verifyNpciUtr(utrRaw: string): UTRValidationResult {
  const cleanUtr = utrRaw.replace(/\D/g, '');

  if (!cleanUtr) {
    return {
      isValid: false,
      errorMessage: '⚠️ Please enter the 12-digit Bank UTR / Ref No from your payment successful screen.'
    };
  }

  if (cleanUtr.length !== 12) {
    return {
      isValid: false,
      errorMessage: `⚠️ Invalid Length (${cleanUtr.length}/12 digits). Bank UTR must be exactly 12 digits long.`
    };
  }

  // 1. Check for repeated single digits (e.g. 000000000000, 111111111111, 999999999999)
  if (/^(\d)\1{11}$/.test(cleanUtr)) {
    return {
      isValid: false,
      errorMessage: '❌ Invalid UTR! Dummy or repeated numbers (e.g. 000000000000) are rejected by NPCI.'
    };
  }

  // 2. Check for ascending or descending sequential digits (e.g. 123456789012, 987654321098)
  const isAscending = '01234567890123456789'.includes(cleanUtr);
  const isDescending = '98765432109876543210'.includes(cleanUtr);
  if (isAscending || isDescending) {
    return {
      isValid: false,
      errorMessage: '❌ Invalid UTR! Sequential test numbers (e.g. 123456789012) are not valid NPCI transaction references.'
    };
  }

  // 3. Check for valid NPCI Bank Routing Prefix (first 2 digits)
  const prefix = cleanUtr.substring(0, 2);
  if (!VALID_NPCI_PREFIXES.includes(prefix)) {
    return {
      isValid: false,
      errorMessage: `❌ Unrecognized NPCI Bank Node (Prefix '${prefix}'). Please check the 12-digit Ref No on your GPay/PhonePe receipt.`
    };
  }

  // 4. Determine Bank Node from Routing Prefix
  let bankNode = 'NPCI Bank Node';
  if (['40', '41', '42', '43'].includes(prefix)) bankNode = 'State Bank of India / SBI UPI Gateway';
  else if (['60', '61', '62'].includes(prefix)) bankNode = 'HDFC Bank UPI Node';
  else if (['50', '51', '52'].includes(prefix)) bankNode = 'PhonePe / YES Bank Node';
  else if (['70', '71', '72'].includes(prefix)) bankNode = 'ICICI Bank Gateway';
  else if (['80', '81', '82'].includes(prefix)) bankNode = 'Paytm Payments Bank Node';
  else if (['90', '91', '92'].includes(prefix)) bankNode = 'Axis Bank UPI Node';

  // 5. Check Luhn Modulus Checksum
  if (!checkLuhn(cleanUtr)) {
    return {
      isValid: false,
      errorMessage: '❌ Checksum Validation Failed! The UTR entered does not match NPCI banking mathematical checksum.'
    };
  }

  return {
    isValid: true,
    bankName: bankNode
  };
}
