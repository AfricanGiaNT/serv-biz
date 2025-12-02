/**
 * Chat utilities for phone normalization, lead detection, and urgency scoring
 */

// Phone number normalization for South African numbers
export function normalizePhoneNumber(phone: string): string | null {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Handle various formats:
  // 082 555 1234 -> +27825551234
  // +27 82 555 1234 -> +27825551234
  // 0825551234 -> +27825551234
  // 27825551234 -> +27825551234
  
  if (digits.length < 10) return null;
  
  // If starts with 0, replace with +27
  if (digits.startsWith('0')) {
    return `+27${digits.substring(1)}`;
  }
  
  // If starts with 27, add +
  if (digits.startsWith('27')) {
    return `+${digits}`;
  }
  
  // If already has country code but missing +
  if (digits.length === 11 && digits.startsWith('27')) {
    return `+${digits}`;
  }
  
  // If 10 digits, assume it's missing the leading 0
  if (digits.length === 10) {
    return `+27${digits}`;
  }
  
  return null;
}

// Extract phone number from text
export function extractPhoneNumber(text: string): string | null {
  // Match various phone formats
  const patterns = [
    /(\+?27|0)[0-9]{2}[-\s]?[0-9]{3}[-\s]?[0-9]{4}/g, // +27 82 555 1234 or 082 555 1234
    /0[0-9]{2}[-\s]?[0-9]{3}[-\s]?[0-9]{4}/g, // 082-555-1234
    /\b[0-9]{10}\b/g, // 0825551234
  ];
  
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches && matches[0]) {
      const normalized = normalizePhoneNumber(matches[0]);
      if (normalized) return normalized;
    }
  }
  
  return null;
}

// Extract email from text
export function extractEmail(text: string): string | null {
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = text.match(emailPattern);
  return matches && matches[0] ? matches[0].toLowerCase() : null;
}

// Extract name from text (simple heuristic)
export function extractName(text: string): string | null {
  // Look for patterns like "My name is X" or "I'm X" or "This is X"
  const patterns = [
    /(?:my name is|i'm|i am|this is|it's|its|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+here/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

// Detect urgency from text
export function detectUrgency(text: string): { urgency: 'EMERGENCY' | 'URGENT' | 'NORMAL' | 'LOW'; priority: number } {
  const lowerText = text.toLowerCase();
  
  // Emergency keywords
  const emergencyKeywords = ['emergency', 'burst', 'flooding', 'flood', 'water everywhere', 'urgent now', 'asap'];
  const urgentKeywords = ['urgent', 'as soon as possible', 'quickly', 'soon', 'rush'];
  const lowKeywords = ['eventually', 'sometime', 'when convenient', 'not urgent'];
  
  // Check for emergency
  if (emergencyKeywords.some(keyword => lowerText.includes(keyword))) {
    return { urgency: 'EMERGENCY', priority: 10 };
  }
  
  // Check for urgent
  if (urgentKeywords.some(keyword => lowerText.includes(keyword))) {
    return { urgency: 'URGENT', priority: 8 };
  }
  
  // Check for low priority
  if (lowKeywords.some(keyword => lowerText.includes(keyword))) {
    return { urgency: 'LOW', priority: 3 };
  }
  
  // Default to normal
  return { urgency: 'NORMAL', priority: 5 };
}

// Detect if location is out of service area
export function isOutOfServiceArea(location: string, serviceArea: string = 'Johannesburg'): boolean {
  const lowerLocation = location.toLowerCase();
  const lowerServiceArea = serviceArea.toLowerCase();
  
  // If location mentions the service area, it's in service area
  if (lowerLocation.includes(lowerServiceArea)) {
    return false;
  }
  
  // Common out-of-area locations for Johannesburg
  const outOfAreaKeywords = ['pretoria', 'cape town', 'durban', 'bloemfontein', 'port elizabeth', 'east london'];
  
  return outOfAreaKeywords.some(keyword => lowerLocation.includes(keyword));
}

// Calculate token count (approximate)
export function estimateTokenCount(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4);
}

// Simple text sanitization (removes potentially dangerous characters and scripts)
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') return '';
  
  // Remove script tags and their content
  let sanitized = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove other potentially dangerous HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Remove javascript: and data: URLs
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:/gi, '');
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

