import CryptoJS from 'crypto-js';
import { 
  rot47Tool, atbashTool, base58Tool, base85Tool, vigenereTool, 
  railFenceTool, baconianTool, jwtTool, punycodeTool, 
  quotedPrintableTool, uuencodeTool, brainfuckTool, ookTool,
  utf16Tool, utf32Tool, vigenereBruteTool, gzipTool,
  frequencyAnalysisTool, unicodeAnalysisTool, xorTool, 
  substitutionSolverTool, base91Tool, bitRotationTool,
  affineCipherTool, playfairTool, hillCipherTool, polybiusSquareTool,
  freqAnalysisDetailedTool, steganographyTool
} from './advancedEncoders';

export interface EncodeTool {
  id: string;
  name: string;
  category: string;
  description: string;
  encode: (input: string) => string;
  decode: (input: string) => string;
}

export interface DetectionResult {
  toolId: string;
  toolName: string;
  confidence: number;
  reason: string;
}

// Function to detect encoding type
export function detectEncodings(input: string): DetectionResult[] {
  const results: DetectionResult[] = [];
  const trimmed = input.trim();
  
  // JWT detection
  if (/^[\w-]+\.[\w-]+\.[\w-]+$/.test(trimmed)) {
    results.push({
      toolId: 'jwt',
      toolName: 'JWT Decoder',
      confidence: 95,
      reason: 'Valid JWT format (3 Base64Url parts)'
    });
  }
  
  // Base64 detection
  if (/^[A-Za-z0-9+/]*={0,2}$/.test(trimmed) && trimmed.length % 4 === 0 && trimmed.length > 4) {
    results.push({
      toolId: 'base64',
      toolName: 'Base64',
      confidence: 85,
      reason: 'Valid Base64 format (A-Z, a-z, 0-9, +, /, =)'
    });
  }

  // Base58 detection (Bitcoin)
  if (/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/.test(trimmed) && trimmed.length > 20) {
    results.push({
      toolId: 'base58',
      toolName: 'Base58',
      confidence: 70,
      reason: 'Possible Base58 (Bitcoin address pattern)'
    });
  }

  // Base32 detection
  if (/^[A-Z2-7=]+$/.test(trimmed) && trimmed.length % 8 === 0) {
    results.push({
      toolId: 'base32',
      toolName: 'Base32',
      confidence: 75,
      reason: 'Valid Base32 format (A-Z, 2-7, =)'
    });
  }

  // Hex detection
  if (/^[0-9a-fA-F\s]*$/.test(trimmed) && trimmed.length > 0 && (trimmed.length % 2 === 0)) {
    results.push({
      toolId: 'hex',
      toolName: 'Hexadecimal',
      confidence: 80,
      reason: 'Valid Hex format (only 0-9, a-f)'
    });
  }

  // URL Encoding detection
  if (/%[0-9A-Fa-f]{2}/.test(trimmed)) {
    results.push({
      toolId: 'url',
      toolName: 'URL Encoding',
      confidence: 90,
      reason: 'Contains URL encoded patterns (%xx)'
    });
  }

  // HTML Entity detection
  if (/&[a-z]+;|&#\d+;|&#x[0-9a-f]+;/i.test(trimmed)) {
    results.push({
      toolId: 'html',
      toolName: 'HTML Entity',
      confidence: 85,
      reason: 'Contains HTML entity patterns (&...;)'
    });
  }

  // JSON detection
  if (/^[\s]*[{[]/.test(trimmed) && /[\]}][\s]*$/.test(trimmed)) {
    results.push({
      toolId: 'json',
      toolName: 'JSON Formatter',
      confidence: 95,
      reason: 'Valid JSON structure detected'
    });
  }

  // Content-Transfer-Encoding (Email)
  if (/^[A-Za-z0-9+/]*={0,2}$/.test(trimmed) && trimmed.includes('=')) {
    results.push({
      toolId: 'quotedprintable',
      toolName: 'Quoted-Printable',
      confidence: 60,
      reason: 'Possible email encoding'
    });
  }

  // Morse Code detection
  if (/^[\s.\-/]+$/.test(trimmed) && trimmed.includes('.') && trimmed.includes('-')) {
    results.push({
      toolId: 'morseTool',
      toolName: 'Morse Code',
      confidence: 80,
      reason: 'Contains Morse code patterns (dots and dashes)'
    });
  }

  // Binary detection
  if (/^[01\s]+$/.test(trimmed) && trimmed.length > 8) {
    results.push({
      toolId: 'binary',
      toolName: 'Binary',
      confidence: 85,
      reason: 'Contains only binary digits (0 and 1)'
    });
  }

  // ASCII decimal detection
  if (/^[\d\s]+$/.test(trimmed)) {
    const numbers = trimmed.split(/\s+/).filter(n => n);
    if (numbers.every(n => parseInt(n) >= 0 && parseInt(n) <= 127)) {
      results.push({
        toolId: 'ascii',
        toolName: 'ASCII Values',
        confidence: 75,
        reason: 'Contains ASCII decimal values (0-127)'
      });
    }
  }

  // Punnycode detection (IDN)
  if (trimmed.startsWith('xn--')) {
    results.push({
      toolId: 'punnycode',
      toolName: 'Punnycode',
      confidence: 90,
      reason: 'Punnycode format (IDN domain)'
    });
  }

  // Text cipher detection (ROT/Caesar)
  if (/^[a-zA-Z\s]+$/.test(trimmed) && trimmed.length > 5) {
    results.push({
      toolId: 'rot13',
      toolName: 'ROT13',
      confidence: 35,
      reason: 'Might be ROT13 or text cipher'
    });
    results.push({
      toolId: 'rot47',
      toolName: 'ROT47',
      confidence: 30,
      reason: 'Might be ROT47'
    });
    results.push({
      toolId: 'atbash',
      toolName: 'Atbash Cipher',
      confidence: 25,
      reason: 'Might be Atbash'
    });
    results.push({
      toolId: 'caesar',
      toolName: 'Caesar Cipher',
      confidence: 30,
      reason: 'Might be Caesar cipher'
    });
  }

  // Brainfuck detection
  if (/^[><+.\-,\[\]\s]+$/.test(trimmed) && /[><+.\-\[\]]/.test(trimmed)) {
    const complexity = (trimmed.match(/\[/g) || []).length + (trimmed.match(/]/g) || []).length;
    if (complexity > 0 || trimmed.match(/[><+.\-]/g)?.length! > 5) {
      results.push({
        toolId: 'brainfuck',
        toolName: 'Brainfuck',
        confidence: 65,
        reason: 'Looks like Brainfuck code (><+-.,[])'
      });
    }
  }

  // Ook! detection
  if (/\bOok[\.!?]\s+Ook[\.!?]/i.test(trimmed)) {
    results.push({
      toolId: 'ook',
      toolName: 'Ook!',
      confidence: 75,
      reason: 'Contains Ook! language patterns'
    });
  }

  // Gzip detection (magic bytes)
  if (trimmed.startsWith('H4s') || /^[A-Za-z0-9+/]*={0,2}$/.test(trimmed)) {
    // If it's base64 and starts with H4 (gzip magic), likely gzip
    try {
      const decoded = atob(trimmed);
      if (decoded.charCodeAt(0) === 0x1f && decoded.charCodeAt(1) === 0x8b) {
        results.push({
          toolId: 'gzip',
          toolName: 'Gzip/Deflate',
          confidence: 85,
          reason: 'Gzip magic bytes detected (1f 8b)'
        });
      }
    } catch (e) {
      // Not base64, skip
    }
  }

  // UTF-16/UTF-32 detection (hex format like XXXX XXXX)
  if (/^[0-9A-Fa-f]{4}(\s[0-9A-Fa-f]{4})+$/.test(trimmed)) {
    const parts = trimmed.split(/\s+/).length;
    results.push({
      toolId: 'utf16',
      toolName: 'UTF-16',
      confidence: 70,
      reason: `Unicode hex values (${parts} characters)`
    });
  }

  if (/^[0-9A-Fa-f]{8}(\s[0-9A-Fa-f]{8})+$/.test(trimmed)) {
    results.push({
      toolId: 'utf32',
      toolName: 'UTF-32',
      confidence: 75,
      reason: 'UTF-32 Unicode hex format'
    });
  }

  // XOR detection (repeated non-ASCII patterns)
  const nonAscii = input.match(/[\x80-\xFF]/g);
  if (nonAscii && nonAscii.length > 5) {
    results.push({
      toolId: 'xor',
      toolName: 'XOR Cipher',
      confidence: 55,
      reason: 'Binary data detected, might be XORed'
    });
  }

  // Substitution cipher detection (all letters, unusual frequency)
  if (/^[a-zA-Z\s]+$/.test(trimmed) && trimmed.length > 20) {
    results.push({
      toolId: 'substitution-solver',
      toolName: 'Substitution Solver',
      confidence: 40,
      reason: 'Possible substitution cipher (letter-only text)'
    });
  }

  // Sort by confidence
  return results.sort((a, b) => b.confidence - a.confidence);
}

// Base64 Tool
export const base64Tool: EncodeTool = {
  id: 'base64',
  name: 'Base64',
  category: 'Encoding',
  description: 'Encode/Decode text to Base64 format',
  encode: (input: string) => {
    try {
      return btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16))));
    } catch (e) {
      return 'Error: Invalid input';
    }
  },
  decode: (input: string) => {
    try {
      return decodeURIComponent(atob(input).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    } catch (e) {
      return 'Error: Invalid Base64';
    }
  }
};

// URL Encoding Tool
export const urlTool: EncodeTool = {
  id: 'url',
  name: 'URL Encoding',
  category: 'Encoding',
  description: 'Encode/Decode URL parameters',
  encode: (input: string) => encodeURIComponent(input),
  decode: (input: string) => {
    try {
      return decodeURIComponent(input);
    } catch (e) {
      return 'Error: Invalid URL encoded string';
    }
  }
};

// Hex Tool
export const hexTool: EncodeTool = {
  id: 'hex',
  name: 'Hexadecimal',
  category: 'Encoding',
  description: 'Convert text to/from Hex format',
  encode: (input: string) => {
    return input.split('').map((c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  },
  decode: (input: string) => {
    try {
      const hex = input.replace(/\s/g, '');
      return hex.match(/.{1,2}/g)?.map((byte) => String.fromCharCode(parseInt(byte, 16))).join('') || 'Error: Invalid hex';
    } catch (e) {
      return 'Error: Invalid Hex string';
    }
  }
};

// JSON Tool
export const jsonTool: EncodeTool = {
  id: 'json',
  name: 'JSON Formatter',
  category: 'Formatting',
  description: 'Format/Minify JSON',
  encode: (input: string) => {
    try {
      const parsed = JSON.parse(input);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return 'Error: Invalid JSON - ' + (e instanceof Error ? e.message : '');
    }
  },
  decode: (input: string) => {
    try {
      const parsed = JSON.parse(input);
      return JSON.stringify(parsed);
    } catch (e) {
      return 'Error: Invalid JSON - ' + (e instanceof Error ? e.message : '');
    }
  }
};

// HTML Entity Tool
export const htmlTool: EncodeTool = {
  id: 'html',
  name: 'HTML Entity',
  category: 'Encoding',
  description: 'Encode/Decode HTML entities',
  encode: (input: string) => {
    const textarea = document.createElement('textarea');
    textarea.textContent = input;
    return textarea.innerHTML;
  },
  decode: (input: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = input;
    return textarea.value;
  }
};

// ROT13 Tool
export const rot13Tool: EncodeTool = {
  id: 'rot13',
  name: 'ROT13',
  category: 'Cipher',
  description: 'ROT13 substitution cipher',
  encode: (input: string) => {
    return input.replace(/[a-zA-Z]/g, (c) => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + 13) % 26) + 65);
      } else {
        return String.fromCharCode(((code - 97 + 13) % 26) + 97);
      }
    });
  },
  decode: (input: string) => {
    return input.replace(/[a-zA-Z]/g, (c) => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + 13) % 26) + 65);
      } else {
        return String.fromCharCode(((code - 97 + 13) % 26) + 97);
      }
    });
  }
};

// Caesar Cipher Tool
export const caesarTool: EncodeTool = {
  id: 'caesar',
  name: 'Caesar Cipher',
  category: 'Cipher',
  description: 'Caesar cipher (shift 3)',
  encode: (input: string) => {
    const shift = 3;
    return input.replace(/[a-zA-Z]/g, (c) => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else {
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
    });
  },
  decode: (input: string) => {
    const shift = 3;
    return input.replace(/[a-zA-Z]/g, (c) => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      } else {
        return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
      }
    });
  }
};

// MD5 Hash Tool
export const md5Tool: EncodeTool = {
  id: 'md5',
  name: 'MD5 Hash',
  category: 'Hash',
  description: 'Generate MD5 hash',
  encode: (input: string) => CryptoJS.MD5(input).toString(),
  decode: () => 'MD5 is one-way encryption. Cannot decode.'
};

// SHA256 Hash Tool
export const sha256Tool: EncodeTool = {
  id: 'sha256',
  name: 'SHA256 Hash',
  category: 'Hash',
  description: 'Generate SHA256 hash',
  encode: (input: string) => CryptoJS.SHA256(input).toString(),
  decode: () => 'SHA256 is one-way encryption. Cannot decode.'
};

// SHA1 Hash Tool
export const sha1Tool: EncodeTool = {
  id: 'sha1',
  name: 'SHA1 Hash',
  category: 'Hash',
  description: 'Generate SHA1 hash',
  encode: (input: string) => CryptoJS.SHA1(input).toString(),
  decode: () => 'SHA1 is one-way encryption. Cannot decode.'
};

// Text Reverse
export const reverseTool: EncodeTool = {
  id: 'reverse',
  name: 'Text Reverse',
  category: 'Text Transform',
  description: 'Reverse text',
  encode: (input: string) => input.split('').reverse().join(''),
  decode: (input: string) => input.split('').reverse().join('')
};

// Uppercase Tool
export const uppercaseTool: EncodeTool = {
  id: 'uppercase',
  name: 'Uppercase',
  category: 'Text Transform',
  description: 'Convert to uppercase',
  encode: (input: string) => input.toUpperCase(),
  decode: (input: string) => input.toUpperCase()
};

// Lowercase Tool
export const lowercaseTool: EncodeTool = {
  id: 'lowercase',
  name: 'Lowercase',
  category: 'Text Transform',
  description: 'Convert to lowercase',
  encode: (input: string) => input.toLowerCase(),
  decode: (input: string) => input.toLowerCase()
};

// Base32 Tool
export const base32Tool: EncodeTool = {
  id: 'base32',
  name: 'Base32',
  category: 'Encoding',
  description: 'Encode/Decode Base32',
  encode: (input: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    for (let i = 0; i < input.length; i++) {
      bits += input.charCodeAt(i).toString(2).padStart(8, '0');
    }
    bits = bits.padEnd(Math.ceil(bits.length / 5) * 5, '0');
    let output = '';
    for (let i = 0; i < bits.length; i += 5) {
      output += chars[parseInt(bits.substr(i, 5), 2)];
    }
    return output.padEnd(Math.ceil(input.length * 8 / 5), '=');
  },
  decode: (input: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== '=') {
        bits += chars.indexOf(input[i]).toString(2).padStart(5, '0');
      }
    }
    let output = '';
    for (let i = 0; i < bits.length; i += 8) {
      const byte = bits.substr(i, 8);
      if (byte.length === 8) {
        output += String.fromCharCode(parseInt(byte, 2));
      }
    }
    return output;
  }
};

// ASCII to Decimal
export const asciiTool: EncodeTool = {
  id: 'ascii',
  name: 'ASCII Values',
  category: 'Conversion',
  description: 'Convert text to ASCII decimal values',
  encode: (input: string) => input.split('').map((c) => c.charCodeAt(0)).join(' '),
  decode: (input: string) => {
    try {
      return input.split(' ').map((code) => String.fromCharCode(parseInt(code))).join('');
    } catch (e) {
      return 'Error: Invalid ASCII codes';
    }
  }
};

// Binary Tool
export const binaryTool: EncodeTool = {
  id: 'binary',
  name: 'Binary',
  category: 'Encoding',
  description: 'Convert text to binary',
  encode: (input: string) => input.split('').map((c) => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' '),
  decode: (input: string) => {
    try {
      return input.split(' ').map((binary) => String.fromCharCode(parseInt(binary, 2))).join('');
    } catch (e) {
      return 'Error: Invalid binary';
    }
  }
};

// Morse Code
export const morseTool: EncodeTool = {
  id: 'morse',
  name: 'Morse Code',
  category: 'Encoding',
  description: 'Convert text to Morse code',
  encode: (input: string) => {
    const morseMap: Record<string, string> = {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
      'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
      'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
      'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
      'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
      '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
      '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
      "'": '.----.', '"': '.-..-.', '!': '-.-.--', '/': '-..-.', '(': '-.--.-',
      ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
      '+': '.-.-.', '-': '-....-', '_': '..--.-', '$': '...-..-',
      '@': '.--.-.' 
    };
    
    return input.toUpperCase().split('').map((char) => {
      if (char === ' ') return ' / ';
      return morseMap[char] || char;
    }).join(' ');
  },
  decode: () => 'Morse code decoding is complex. Use encoder to decode manually.'
};

// Character Count
export const charCountTool: EncodeTool = {
  id: 'charcount',
  name: 'Character Counter',
  category: 'Analysis',
  description: 'Count characters, words, and lines',
  encode: (input: string) => {
    const chars = input.length;
    const charsNoSpace = input.replace(/\s/g, '').length;
    const words = input.trim().split(/\s+/).filter((w) => w.length > 0).length;
    const lines = input.split('\n').length;
    return `Characters: ${chars}\nCharacters (no spaces): ${charsNoSpace}\nWords: ${words}\nLines: ${lines}`;
  },
  decode: () => 'This is an analysis tool. No decoding available.'
};

export const allTools: EncodeTool[] = [
  // Encoding
  base64Tool,
  urlTool,
  hexTool,
  base32Tool,
  base58Tool,
  base85Tool,
  
  // Hash
  md5Tool,
  sha256Tool,
  sha1Tool,
  
  // Cipher
  rot13Tool,
  rot47Tool,
  caesarTool,
  atbashTool,
  vigenereTool,
  railFenceTool,
  baconianTool,
  
  // Text Transform
  reverseTool,
  uppercaseTool,
  lowercaseTool,
  
  // Formatting & Web
  jsonTool,
  htmlTool,
  jwtTool,
  punycodeTool,
  quotedPrintableTool,
  
  // Compression
  uuencodeTool,
  
  // Analysis & Conversion
  asciiTool,
  binaryTool,
  morseTool,
  charCountTool,
  frequencyAnalysisTool,
  unicodeAnalysisTool,
  
  // Encoding - Unicode & Misc
  utf16Tool,
  utf32Tool,
  base91Tool,
  
  // Cipher - Standard & Advanced
  xorTool,
  bitRotationTool,
  affineCipherTool,
  playfairTool,
  hillCipherTool,
  polybiusSquareTool,
  
  // Cipher - Cracking/Solvers
  vigenereBruteTool,
  substitutionSolverTool,
  freqAnalysisDetailedTool,
  
  // Compression
  gzipTool,
  
  // Steganography
  steganographyTool,
  
  // Esoteric Languages
  brainfuckTool,
  ookTool
];
