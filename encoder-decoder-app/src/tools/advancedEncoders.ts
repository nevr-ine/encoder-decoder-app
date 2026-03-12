import { EncodeTool } from './encoders';
import * as pako from 'pako';

// ROT47 - Rotate all ASCII printable characters
export const rot47Tool: EncodeTool = {
  id: 'rot47',
  name: 'ROT47',
  category: 'Cipher',
  description: 'ROT47 - Rotate ASCII printable characters',
  encode: (input: string) => {
    return input.replace(/./g, (char) => {
      const code = char.charCodeAt(0);
      if (code >= 33 && code <= 126) {
        return String.fromCharCode(((code - 33 + 47) % 94) + 33);
      }
      return char;
    });
  },
  decode: (input: string) => {
    return input.replace(/./g, (char) => {
      const code = char.charCodeAt(0);
      if (code >= 33 && code <= 126) {
        return String.fromCharCode(((code - 33 + 47) % 94) + 33);
      }
      return char;
    });
  }
};

// Atbash Cipher - Reverse alphabet
export const atbashTool: EncodeTool = {
  id: 'atbash',
  name: 'Atbash Cipher',
  category: 'Cipher',
  description: 'Atbash cipher - Reverse alphabet (A↔Z, B↔Y)',
  encode: (input: string) => {
    return input.replace(/[a-zA-Z]/g, (char) => {
      if (char >= 'a' && char <= 'z') {
        return String.fromCharCode(122 - (char.charCodeAt(0) - 97));
      } else {
        return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
      }
    });
  },
  decode: (input: string) => {
    return input.replace(/[a-zA-Z]/g, (char) => {
      if (char >= 'a' && char <= 'z') {
        return String.fromCharCode(122 - (char.charCodeAt(0) - 97));
      } else {
        return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
      }
    });
  }
};

// Base58 - Used in Bitcoin addresses
export const base58Tool: EncodeTool = {
  id: 'base58',
  name: 'Base58',
  category: 'Encoding',
  description: 'Base58 encoding (Bitcoin addresses)',
  encode: (input: string) => {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let num = 0n;
    for (let i = 0; i < input.length; i++) {
      num = num * 256n + BigInt(input.charCodeAt(i));
    }
    let result = '';
    while (num > 0n) {
      result = alphabet[Number(num % 58n)] + result;
      num = num / 58n;
    }
    for (let i = 0; i < input.length && input.charCodeAt(i) === 0; i++) {
      result = '1' + result;
    }
    return result || '1';
  },
  decode: (input: string) => {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let num = 0n;
    for (let i = 0; i < input.length; i++) {
      const idx = alphabet.indexOf(input[i]);
      if (idx === -1) return 'Error: Invalid Base58 character';
      num = num * 58n + BigInt(idx);
    }
    let result = '';
    while (num > 0n) {
      result = String.fromCharCode(Number(num % 256n)) + result;
      num = num / 256n;
    }
    for (let i = 0; i < input.length && input[i] === '1'; i++) {
      result = '\0' + result;
    }
    return result;
  }
};

// Base85 / Ascii85 - Used in PDF
export const base85Tool: EncodeTool = {
  id: 'base85',
  name: 'Base85 (Ascii85)',
  category: 'Encoding',
  description: 'Base85/Ascii85 encoding (PDF)',
  encode: (input: string) => {
    let result = '';
    for (let i = 0; i < input.length; i += 4) {
      const chunk = input.substring(i, i + 4);
      let num = 0;
      for (let j = 0; j < chunk.length; j++) {
        num = num * 256 + chunk.charCodeAt(j);
      }
      if (chunk.length < 4) {
        num = num << (8 * (4 - chunk.length));
      }
      const encoded = [];
      for (let j = 0; j < 5; j++) {
        encoded.unshift(String.fromCharCode((num % 85) + 33));
        num = Math.floor(num / 85);
      }
      result += encoded.slice(0, chunk.length + 1).join('');
    }
    return result + '~>';
  },
  decode: (input: string) => {
    const clean = input.replace(/[\s~>]/g, '');
    let result = '';
    for (let i = 0; i < clean.length; i += 5) {
      const chunk = clean.substring(i, Math.min(i + 5, clean.length));
      let num = 0;
      for (let j = 0; j < chunk.length; j++) {
        num = num * 85 + (chunk.charCodeAt(j) - 33);
      }
      for (let j = 0; j < chunk.length - 1; j++) {
        result += String.fromCharCode((num >> (8 * (3 - j))) & 0xFF);
      }
    }
    return result;
  }
};

// Vigenère Cipher - Simple implementation
export const vigenereTool: EncodeTool = {
  id: 'vigenere',
  name: 'Vigenère Cipher',
  category: 'Cipher',
  description: 'Vigenère cipher (requires key guessing)',
  encode: (input: string) => {
    const key = 'KEY';
    let result = '';
    let keyIndex = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (/[a-zA-Z]/.test(char)) {
        const shift = key.charCodeAt(keyIndex % key.length) - 65;
        const base = char >= 'a' ? 97 : 65;
        result += String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
        keyIndex++;
      } else {
        result += char;
      }
    }
    return result;
  },
  decode: (input: string) => {
    return 'Vigenère requires key. Try common keys or use frequency analysis.';
  }
};

// Rail Fence Cipher
export const railFenceTool: EncodeTool = {
  id: 'railfence',
  name: 'Rail Fence Cipher',
  category: 'Cipher',
  description: 'Rail Fence cipher (2-rail default)',
  encode: (input: string) => {
    const rails = 2;
    const fence: string[][] = Array(rails).fill(null).map(() => []);
    let rail = 0;
    let direction = 1;
    for (const char of input) {
      fence[rail].push(char);
      if (rail === 0) direction = 1;
      else if (rail === rails - 1) direction = -1;
      rail += direction;
    }
    return fence.map(r => r.join('')).join('');
  },
  decode: (input: string) => {
    return 'Rail Fence decoding requires rails count. Manual decoding needed.';
  }
};

// Baconian Cipher (Simplified - shows pattern)
export const baconianTool: EncodeTool = {
  id: 'baconian',
  name: 'Baconian Cipher',
  category: 'Cipher',
  description: 'Baconian cipher (simplified view)',
  encode: (input: string) => {
    const baconMap: Record<string, string> = {
      'A': 'AAAAA', 'B': 'AAAAB', 'C': 'AAABA', 'D': 'AAABB', 'E': 'AABAA',
      'F': 'AABAB', 'G': 'AABBA', 'H': 'AABBB', 'I': 'ABAAA', 'J': 'ABAAB',
      'K': 'ABABA', 'L': 'ABABB', 'M': 'ABBAA', 'N': 'ABBAB', 'O': 'ABBBA',
      'P': 'ABBBB', 'Q': 'BAAAA', 'R': 'BAAAB', 'S': 'BAABA', 'T': 'BAABB',
      'U': 'BABAA', 'V': 'BABAB', 'W': 'BABBA', 'X': 'BABBB', 'Y': 'BBAAA',
      'Z': 'BBAAB'
    };
    return input.toUpperCase().split('').map(c => baconMap[c] || c).join(' ');
  },
  decode: (input: string) => {
    const baconMap: Record<string, string> = {
      'AAAAA': 'A', 'AAAAB': 'B', 'AAABA': 'C', 'AAABB': 'D', 'AABAA': 'E',
      'AABAB': 'F', 'AABBA': 'G', 'AABBB': 'H', 'ABAAA': 'I', 'ABAAB': 'J',
      'ABABA': 'K', 'ABABB': 'L', 'ABBAA': 'M', 'ABBAB': 'N', 'ABBBA': 'O',
      'ABBBB': 'P', 'BAAAA': 'Q', 'BAAAB': 'R', 'BAABA': 'S', 'BAABB': 'T',
      'BABAA': 'U', 'BABAB': 'V', 'BABBA': 'W', 'BABBB': 'X', 'BBAAA': 'Y',
      'BBAAB': 'Z'
    };
    return input.split(/\s+/).map(code => baconMap[code] || '').join('');
  }
};

// JWT (JSON Web Token) - Base64Url decoder
export const jwtTool: EncodeTool = {
  id: 'jwt',
  name: 'JWT Decoder',
  category: 'Web',
  description: 'Decode JWT (JSON Web Token)',
  encode: (input: string) => {
    return 'JWT is typically not encoded by users. It\'s token-based.';
  },
  decode: (input: string) => {
    try {
      const parts = input.split('.');
      if (parts.length !== 3) return 'Error: Invalid JWT format';
      const decode = (str: string) => {
        const padded = str + '='.repeat((4 - (str.length % 4)) % 4);
        return JSON.stringify(JSON.parse(atob(padded.replace(/-/g, '+').replace(/_/g, '/'))), null, 2);
      };
      return `Header:\n${decode(parts[0])}\n\nPayload:\n${decode(parts[1])}\n\nSignature: ${parts[2]}`;
    } catch (e) {
      return 'Error: Invalid JWT';
    }
  }
};

// Punnycode - IDN encoding
export const punycodeTool: EncodeTool = {
  id: 'punnycode',
  name: 'Punnycode',
  category: 'Web',
  description: 'Punnycode (IDN/International domain names)',
  encode: (input: string) => {
    try {
      return 'xn--' + input.split('').map(c => c.charCodeAt(0).toString(16)).join('');
    } catch (e) {
      return 'Error encoding Punnycode';
    }
  },
  decode: (input: string) => {
    if (input.startsWith('xn--')) {
      try {
        return decodeURIComponent('%' + input.substring(4).match(/.{1,2}/g)?.join('%'));
      } catch (e) {
        return 'Error decoding Punnycode';
      }
    }
    return input;
  }
};

// Quoted-Printable (Email encoding)
export const quotedPrintableTool: EncodeTool = {
  id: 'quotedprintable',
  name: 'Quoted-Printable',
  category: 'Compression',
  description: 'Quoted-Printable (email encoding)',
  encode: (input: string) => {
    return input.replace(/[^\x20-\x3C\x3E-\x7E]/g, (char) => {
      const code = char.charCodeAt(0).toString(16).toUpperCase();
      return '=' + (code.length === 1 ? '0' : '') + code;
    });
  },
  decode: (input: string) => {
    return input.replace(/=([0-9A-F]{2})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
  }
};

// Uuencode (Unix-to-Unix encoding)
export const uuencodeTool: EncodeTool = {
  id: 'uuencode',
  name: 'Uuencode',
  category: 'Compression',
  description: 'Uuencode (Unix encoding)',
  encode: (input: string) => {
    let result = 'begin 644 file\n';
    for (let i = 0; i < input.length; i += 3) {
      const chunk = input.substring(i, i + 3);
      const len = String.fromCharCode(32 + chunk.length);
      let encoded = '';
      for (let j = 0; j < chunk.length; j++) {
        encoded += String.fromCharCode(32 + ((chunk.charCodeAt(j) >> (2 - (j % 3) * 2)) & 0x3F));
      }
      result += len + encoded + '\n';
    }
    result += '`\nend\n';
    return result;
  },
  decode: (input: string) => {
    return 'Uuencode decoding is complex. Provide proper uuencoded data.';
  }
};

// Morse Code (with visual representation)
export const morseTool: EncodeTool = {
  id: 'morse2',
  name: 'Morse Code 2',
  category: 'Encoding',
  description: 'Morse code with dit-dah representation',
  encode: (input: string) => {
    const morseMap: Record<string, string> = {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
      'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
      'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
      'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
      'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
      '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
      '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', 'QST': '..--..',
      'APO': '.----.', 'QUOTE': '.-..-.', 'EXCL': '-.-.--', 'SLASH': '-..-.', 'LPAREN': '-.--.-',
      'RPAREN': '-.--.-', 'AND': '.-...', 'COLON': '---...', 'SEMI': '-.-.-.', 'EQUALS': '-...-',
      'PLUS': '.-.-.', 'MINUS': '-....-', 'UNDERSCORE': '..--.-', 'DOLLAR': '...-..-',
      'AT': '.--.-.'
    };
    return input.toUpperCase().split('').map((c) => morseMap[c] || c).join(' / ');
  },
  decode: (input: string) => {
    const morseMap: Record<string, string> = {
      '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
      '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
      '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
      '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
      '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
      '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
      '---..': '8', '----.': '9', '.-.-.-': '.', '--..--': ',', '..--..': '?'
    };
    return input.split(' / ').map(code => morseMap[code] || '').join('');
  }
};

// Brainfuck - Esoteric programming language
export const brainfuckTool: EncodeTool = {
  id: 'brainfuck',
  name: 'Brainfuck',
  category: 'Esoteric Languages',
  description: 'Brainfuck esoteric programming language decoder/encoder',
  
  encode: (input: string) => {
    // Simple encode: output each character value as increments and dot
    // This is NOT standard Brainfuck, but a way to represent text
    let code = '';
    for (const char of input) {
      const charCode = char.charCodeAt(0);
      if (charCode > 0) {
        code += '+'.repeat(charCode) + '.';
      }
    }
    return code || 'Empty input';
  },
  
  decode: (input: string) => {
    // Brainfuck interpreter
    const memory = new Uint8Array(30000);
    let ptr = 0;
    let pc = 0; // program counter
    let output = '';
    let iterations = 0;
    const maxIterations = 1000000; // Prevent infinite loops
    
    // Pre-calculate matching brackets
    const brackets = new Map<number, number>();
    const stack: number[] = [];
    for (let i = 0; i < input.length; i++) {
      if (input[i] === '[') {
        stack.push(i);
      } else if (input[i] === ']') {
        const openIdx = stack.pop();
        if (openIdx !== undefined) {
          brackets.set(openIdx, i);
          brackets.set(i, openIdx);
        }
      }
    }
    
    while (pc < input.length && iterations < maxIterations) {
      const cmd = input[pc];
      
      switch (cmd) {
        case '>': // Move pointer right
          ptr = (ptr + 1) % 30000;
          break;
          
        case '<': // Move pointer left
          ptr = (ptr - 1 + 30000) % 30000;
          break;
          
        case '+': // Increment value
          memory[ptr] = (memory[ptr] + 1) % 256;
          break;
          
        case '-': // Decrement value
          memory[ptr] = (memory[ptr] - 1 + 256) % 256;
          break;
          
        case '.': // Output value as ASCII character
          if (memory[ptr] !== 0) {
            output += String.fromCharCode(memory[ptr]);
          }
          break;
          
        case ',': // Input (not supported, skip)
          break;
          
        case '[': // Jump forward if value is 0
          if (memory[ptr] === 0) {
            const matchIdx = brackets.get(pc);
            if (matchIdx !== undefined) {
              pc = matchIdx;
            }
          }
          break;
          
        case ']': // Jump backward if value is not 0
          if (memory[ptr] !== 0) {
            const matchIdx = brackets.get(pc);
            if (matchIdx !== undefined) {
              pc = matchIdx;
            }
          }
          break;
      }
      
      pc++;
      iterations++;
    }
    
    if (iterations >= maxIterations) {
      output += '\n[WARNING: Max iterations reached, possible infinite loop]';
    }
    
    return output || '(no output)';
  }
};

// Ook! - Brainfuck variant using Ook words
export const ookTool: EncodeTool = {
  id: 'ook',
  name: 'Ook!',
  category: 'Esoteric Languages',
  description: 'Ook! esoteric language (Brainfuck variant using Ook/Eek words)',
  
  encode: (input: string) => {
    // Convert text to Ook! by representing as increments
    let code = '';
    for (const char of input) {
      const charCode = char.charCodeAt(0);
      if (charCode > 0) {
        code += 'Ook. '.repeat(charCode) + 'Ook! ';
      }
    }
    return code || 'Empty input';
  },
  
  decode: (input: string) => {
    // Convert Ook words back to Brainfuck commands
    let brainfuck = '';
    const tokens = input.split(/\s+/).filter(t => t);
    
    let i = 0;
    while (i < tokens.length) {
      const token = tokens[i];
      const nextToken = tokens[i + 1];
      
      if (token === 'Ook.' && nextToken === 'Ook.') brainfuck += '>';
      else if (token === 'Ook.' && nextToken === 'Ook?') brainfuck += '<';
      else if (token === 'Ook!' && nextToken === 'Ook.') brainfuck += '+';
      else if (token === 'Ook!' && nextToken === 'Ook!') brainfuck += '-';
      else if (token === 'Ook.' && nextToken === 'Ook!') brainfuck += '.';
      else if (token === 'Ook!' && nextToken === 'Ook?') brainfuck += ',';
      else if (token === 'Ook?' && nextToken === 'Ook.') brainfuck += '[';
      else if (token === 'Ook?' && nextToken === 'Ook?') brainfuck += ']';
      
      i += 2;
    }
    
    // Execute as Brainfuck
    const memory = new Uint8Array(30000);
    let ptr = 0;
    let pc = 0;
    let output = '';
    let iterations = 0;
    
    while (pc < brainfuck.length && iterations < 1000000) {
      const cmd = brainfuck[pc];
      switch (cmd) {
        case '>': ptr = (ptr + 1) % 30000; break;
        case '<': ptr = (ptr - 1 + 30000) % 30000; break;
        case '+': memory[ptr] = (memory[ptr] + 1) % 256; break;
        case '-': memory[ptr] = (memory[ptr] - 1 + 256) % 256; break;
        case '.': output += String.fromCharCode(memory[ptr]); break;
        case ',': break;
      }
      pc++;
      iterations++;
    }
    
    return output || '(no output)';
  }
};

// UTF-16 Encoding
export const utf16Tool: EncodeTool = {
  id: 'utf16',
  name: 'UTF-16',
  category: 'Encoding',
  description: 'UTF-16 Unicode encoding/decoding',
  
  encode: (input: string) => {
    let result = '';
    for (let i = 0; i < input.length; i++) {
      const code = input.charCodeAt(i);
      const hex = code.toString(16).toUpperCase().padStart(4, '0');
      result += hex + ' ';
    }
    return result.trim();
  },
  
  decode: (input: string) => {
    const hexes = input.split(/\s+/).filter(h => h);
    let result = '';
    for (const hex of hexes) {
      try {
        result += String.fromCharCode(parseInt(hex, 16));
      } catch (e) {
        result += '?';
      }
    }
    return result;
  }
};

// UTF-32 Encoding
export const utf32Tool: EncodeTool = {
  id: 'utf32',
  name: 'UTF-32',
  category: 'Encoding',
  description: 'UTF-32 Unicode encoding/decoding',
  
  encode: (input: string) => {
    let result = '';
    for (let i = 0; i < input.length; i++) {
      const code = input.charCodeAt(i);
      const hex = code.toString(16).toUpperCase().padStart(8, '0');
      result += hex + ' ';
    }
    return result.trim();
  },
  
  decode: (input: string) => {
    const hexes = input.split(/\s+/).filter(h => h);
    let result = '';
    for (const hex of hexes) {
      try {
        result += String.fromCharCode(parseInt(hex, 16));
      } catch (e) {
        result += '?';
      }
    }
    return result;
  }
};

// Vigenère Brute Force - Try common keys
export const vigenereBruteTool: EncodeTool = {
  id: 'vigenere-brute',
  name: 'Vigenère Brute Force',
  category: 'Cipher',
  description: 'Vigenère cipher brute force with common keys',
  
  encode: (input: string) => {
    return 'Use decode mode to brute force a Vigenère cipher\nCommon keys will be tried automatically';
  },
  
  decode: (input: string) => {
    const commonKeys = [
      'KEY', 'SECRET', 'PASSWORD', 'CIPHER', 'CRYPTO',
      'HELLO', 'WORLD', 'TEST', 'ADMIN', 'USER',
      'SECURITY', 'ENCODE', 'DECODE', 'FLAG', 'LEMON',
      'A', 'B', 'C', 'D', 'E', 'ABC', 'DEF', 'QWERTY'
    ];
    
    const results = [];
    
    for (const key of commonKeys) {
      let decrypted = '';
      const keyLen = key.length;
      
      for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const keyChar = key[i % keyLen];
        
        if (/[A-Z]/.test(char)) {
          const shift = keyChar.toUpperCase().charCodeAt(0) - 65;
          decrypted += String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
        } else if (/[a-z]/.test(char)) {
          const shift = keyChar.toUpperCase().charCodeAt(0) - 65;
          decrypted += String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
        } else {
          decrypted += char;
        }
      }
      
      results.push(`[${key}] ${decrypted}`);
    }
    
    return results.join('\n\n');
  }
};

// Gzip Decompression
export const gzipTool: EncodeTool = {
  id: 'gzip',
  name: 'Gzip/Deflate',
  category: 'Compression',
  description: 'Gzip and Deflate decompression',
  
  encode: (input: string) => {
    try {
      const compressed = pako.gzip(input);
      let result = '';
      for (let i = 0; i < compressed.length; i++) {
        result += String.fromCharCode(compressed[i]);
      }
      return btoa(result); // Base64 encode for display
    } catch (e) {
      return 'Error compressing: ' + String(e);
    }
  },
  
  decode: (input: string) => {
    try {
      // Try Base64 decode first (common format)
      let binary = '';
      try {
        binary = atob(input);
      } catch {
        // If not base64, treat as raw
        binary = input;
      }
      
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      
      const decompressed = pako.inflate(bytes, { to: 'string' });
      return decompressed;
    } catch (e) {
      return 'Error decompressing: ' + String(e);
    }
  }
};

// Frequency Analysis for Caesar/substitution
export const frequencyAnalysisTool: EncodeTool = {
  id: 'freq-analysis',
  name: 'Frequency Analysis',
  category: 'Analysis',
  description: 'Analyze character frequency (for breaking substitution ciphers)',
  
  encode: (input: string) => {
    return 'Use decode mode to analyze character frequency';
  },
  
  decode: (input: string) => {
    const freq = new Map<string, number>();
    const total = input.length;
    
    // Count characters
    for (const char of input.toLowerCase()) {
      if (/[a-z]/.test(char)) {
        freq.set(char, (freq.get(char) || 0) + 1);
      }
    }
    
    // Sort by frequency
    const sorted = Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([char, count]) => {
        const percent = ((count / total) * 100).toFixed(2);
        const bar = '█'.repeat(Math.floor(count / 2));
        return `${char}: ${count} (${percent}%) ${bar}`;
      });
    
    const english = 'E T A O I N S H R D L C U M W F G Y P B V K J X Q Z';
    const analysis = `\nCharacter Frequency Analysis:\n${sorted.join('\n')}\n\nEnglish Letter Frequency: ${english}`;
    
    return analysis;
  }
};

// Plain Text Detection / Unicode Info
export const unicodeAnalysisTool: EncodeTool = {
  id: 'unicode-analysis',
  name: 'Unicode Analysis',
  category: 'Analysis',
  description: 'Analyze Unicode characters and code points',
  
  encode: (input: string) => {
    return 'Use decode mode for Unicode analysis';
  },
  
  decode: (input: string) => {
    let analysis = 'Unicode Character Analysis:\n\n';
    
    for (let i = 0; i < Math.min(input.length, 100); i++) {
      const char = input[i];
      const code = char.charCodeAt(0);
      const hex = code.toString(16).toUpperCase().padStart(4, '0');
      const name = /[^\x00-\x7F]/.test(char) ? '(Non-ASCII)' : '';
      
      analysis += `'${char}' → U+${hex} (${code}) ${name}\n`;
    }
    
    if (input.length > 100) {
      analysis += `\n... and ${input.length - 100} more characters`;
    }
    
    return analysis;
  }
};

// XOR Cipher - Single byte XOR with common keys
export const xorTool: EncodeTool = {
  id: 'xor',
  name: 'XOR Cipher',
  category: 'Cipher',
  description: 'XOR cipher encoder/decoder with key brute force',
  
  encode: (input: string) => {
    // Default: XOR with 0xFF
    const key = 0xFF;
    let result = '';
    for (let i = 0; i < input.length; i++) {
      result += String.fromCharCode(input.charCodeAt(i) ^ key);
    }
    return btoa(result); // Base64 encode for safe display
  },
  
  decode: (input: string) => {
    // Try to decode base64 first, then try common XOR keys
    let binary = '';
    try {
      binary = atob(input);
    } catch {
      binary = input;
    }
    
    const commonKeys = [0xFF, 0x00, 0x01, 0xAA, 0x55, 0x42, 0x7F, 0x20];
    const results: string[] = [];
    
    for (const key of commonKeys) {
      let decoded = '';
      let printable = 0;
      
      for (let i = 0; i < binary.length; i++) {
        const byte = binary.charCodeAt(i) ^ key;
        const char = String.fromCharCode(byte);
        decoded += char;
        if ((byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13) {
          printable++;
        }
      }
      
      const ratio = printable / binary.length;
      if (ratio > 0.7) {
        results.push(`[Key: 0x${key.toString(16).toUpperCase().padStart(2, '0')}] ${decoded}`);
      }
    }
    
    if (results.length === 0) {
      results.push('No readable XOR keys found. Try hex input or check key manually.');
    }
    
    return results.join('\n\n');
  }
};

// Substitution Cipher Solver - Uses frequency analysis
export const substitutionSolverTool: EncodeTool = {
  id: 'substitution-solver',
  name: 'Substitution Solver',
  category: 'Cipher',
  description: 'Substitution cipher solver using frequency analysis hints',
  
  encode: (input: string) => {
    return 'Use decode mode to analyze substitution ciphers';
  },
  
  decode: (input: string) => {
    // Frequency analysis for English
    const englishFreq: { [key: string]: number } = {
      'e': 11, 't': 9, 'a': 8, 'o': 7.5, 'i': 7, 'n': 6.7, 's': 6.3, 'h': 6.1,
      'r': 6, 'd': 4.3, 'l': 4, 'c': 2.8, 'u': 2.8, 'm': 2.4, 'w': 2.4, 'f': 2.2,
      'g': 2, 'y': 2, 'p': 1.9, 'b': 1.5, 'v': 0.98, 'k': 0.8, 'j': 0.15, 'x': 0.15,
      'q': 0.1, 'z': 0.07
    };
    
    // Count frequencies in input
    const freq: { [key: string]: number } = {};
    const total = input.toLowerCase().replace(/[^a-z]/g, '').length;
    
    for (const char of input.toLowerCase()) {
      if (/[a-z]/.test(char)) {
        freq[char] = (freq[char] || 0) + 1;
      }
    }
    
    // Convert to percentages
    for (const key in freq) {
      freq[key] = (freq[key] / total) * 100;
    }
    
    // Sort by frequency
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const englishSorted = Object.entries(englishFreq).sort((a, b) => b[1] - a[1]);
    
    let analysis = 'SUBSTITUTION CIPHER ANALYSIS\n\n';
    analysis += 'Cipher Character Frequency:\n';
    for (const [char, pct] of sorted) {
      analysis += `${char}: ${pct.toFixed(2)}%\n`;
    }
    
    analysis += '\n\nSuggested Mapping (Based on English Frequency):\n';
    for (let i = 0; i < Math.min(10, sorted.length); i++) {
      const cipherChar = sorted[i][0];
      const englishChar = englishSorted[i][0];
      analysis += `${cipherChar} → ${englishChar}\n`;
    }
    
    analysis += '\n[TIP] Common words: E, T, A, O, I, N, S, H, R (Most frequent)';
    
    return analysis;
  }
};

// Base91/Base92 Encoding
export const base91Tool: EncodeTool = {
  id: 'base91',
  name: 'Base91',
  category: 'Encoding',
  description: 'Base91 encoding/decoding (efficient binary encoding)',
  
  encode: (input: string) => {
    const base91Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&\'()*+,./:;<=>?@[]^_`{|}~"';
    let output = '';
    let bitstring = '';
    
    for (let i = 0; i < input.length; i++) {
      bitstring += input.charCodeAt(i).toString(2).padStart(8, '0');
    }
    
    for (let i = 0; i < bitstring.length; i += 13) {
      const chunk = bitstring.substr(i, 13).padEnd(13, '0');
      const index = parseInt(chunk, 2) % 91;
      output += base91Alphabet[index];
    }
    
    return output || 'Empty input';
  },
  
  decode: (input: string) => {
    const base91Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&\'()*+,./:;<=>?@[]^_`{|}~"';
    let bitstring = '';
    
    for (const char of input) {
      const index = base91Alphabet.indexOf(char);
      if (index >= 0) {
        bitstring += index.toString(2).padStart(7, '0');
      }
    }
    
    let output = '';
    for (let i = 0; i < bitstring.length; i += 8) {
      const chunk = bitstring.substr(i, 8);
      if (chunk.length === 8) {
        output += String.fromCharCode(parseInt(chunk, 2));
      }
    }
    
    return output || 'Invalid Base91';
  }
};

// Bit Rotation Cipher
export const bitRotationTool: EncodeTool = {
  id: 'bit-rotation',
  name: 'Bit Rotation',
  category: 'Cipher',
  description: 'Rotate bits in each byte left or right',
  
  encode: (input: string) => {
    // ROL 1 (Rotate Left 1 bit)
    let output = '';
    for (let i = 0; i < input.length; i++) {
      let byte = input.charCodeAt(i);
      const rotated = ((byte << 1) | (byte >> 7)) & 0xFF;
      output += String.fromCharCode(rotated);
    }
    return btoa(output);
  },
  
  decode: (input: string) => {
    // Try ROR 1, ROR 2, ROR 3, ROR 4
    let binary = '';
    try {
      binary = atob(input);
    } catch {
      return 'Invalid Base64 input';
    }
    
    const results = [];
    
    for (let rotation = 1; rotation <= 4; rotation++) {
      let decoded = '';
      for (let i = 0; i < binary.length; i++) {
        let byte = binary.charCodeAt(i);
        const rotated = ((byte >> rotation) | (byte << (8 - rotation))) & 0xFF;
        decoded += String.fromCharCode(rotated);
      }
      
      const printable = decoded.split('').filter(c => /[\x20-\x7E\n\r\t]/.test(c)).length;
      if (printable / decoded.length > 0.7) {
        results.push(`[ROR ${rotation}] ${decoded}`);
      }
    }
    
    return results.length > 0 ? results.join('\n\n') : 'No readable rotations found';
  }
};
