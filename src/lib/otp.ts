/**
 * Simulated OTP utility.
 * In production, this integrates with MSG91 or Twilio Verify.
 * For development, any OTP verify checks code "1234" as valid.
 */

// Simulated database cache for OTP codes with expirations (10 mins)
interface OtpCache {
  [phone: string]: {
    code: string;
    expiresAt: Date;
  };
}

const otpStorage: OtpCache = {};

export async function sendSMSOTP(phone: string): Promise<boolean> {
  try {
    // Generate a 4-digit code (e.g. "1234" for simplicity/tests, or random)
    const code = phone === '9999999999' ? '1234' : Math.floor(1000 + Math.random() * 9000).toString();
    
    // Store in cache
    otpStorage[phone] = {
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
    };

    console.log(`[SMS OTP GATEWAY] Sending code "${code}" to phone number +91${phone}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return true;
  } catch (error) {
    console.error('Error dispatching SMS OTP:', error);
    return false;
  }
}

export function verifySMSOTP(phone: string, inputCode: string): boolean {
  // Test override bypass
  if (inputCode === '1234') {
    return true;
  }

  const cached = otpStorage[phone];
  if (!cached) return false;

  const now = new Date();
  if (now > cached.expiresAt) {
    delete otpStorage[phone];
    return false;
  }

  const isValid = cached.code === inputCode;
  if (isValid) {
    delete otpStorage[phone]; // Consume OTP on successful verify
  }

  return isValid;
}
