# 🔐 Encoder/Decoder Toolkit - Release 1.0.0

A comprehensive desktop application for encoding, decoding, and analyzing various cipher and encoding formats. Perfect for CTF (Capture The Flag) competitions, cybersecurity professionals, and cryptography enthusiasts.

## 📋 Features

### 30+ Built-in Tools

#### **Encoding Tools**
- Base64, Base32, Base58, Base85 (Ascii85)
- Base91, URL Encoding, Hexadecimal
- UTF-16, UTF-32

#### **Classic Ciphers**
- ROT13, ROT47
- Caesar Cipher, Atbash Cipher
- Vigenère Cipher, Rail Fence Cipher
- Affine Cipher, Playfair Cipher
- Hill Cipher, Polybius Square

#### **Cryptographic Tools**
- MD5, SHA1, SHA256 Hashing
- XOR Cipher with key guessing
- Bit Rotation Cipher

#### **Advanced Features**
- **Auto-Detection**: Automatically detects encoding types with confidence scores
- **Frequency Analysis**: Detailed character frequency analysis for breaking substitution ciphers
- **Substitution Solver**: Intelligent solver for substitution ciphers
- **Steganography**: Hide and extract text data
- **JWT Decoder**: Parse JSON Web Tokens
- **Vigenère Brute Force**: Crack Vigenère ciphers with common keys

#### **Specialized Encodings**
- Morse Code, Baconian Cipher
- Brainfuck & Ook! (Esoteric languages)
- Quoted-Printable (Email encoding)
- Uuencode (Unix-to-Unix encoding)
- Punnycode (IDN domains)

#### **Utility Tools**
- JSON Formatter
- HTML Entity Encoder/Decoder
- Character Counter & Analysis
- Binary/Text Conversion
- Text Transformation (Uppercase, Lowercase, Reverse)

### 🎯 Smart Features

1. **Real-time Tool Search** - Instantly find tools by name, category, or description
2. **Auto-Suggestions** - When decoding, the app suggests the most likely encoding with confidence scores
3. **Processing Time Display** - See how fast each operation is processed
4. **History Panel** - Access your last 50 operations with one click
5. **Dark/Light Theme Toggle** - Comfortable for extended usage

## 🚀 Getting Started

### Installation

1. Download `EncoderDecoder-Setup-1.0.0.exe` from Releases
2. Run the installer and follow the prompts
3. Launch the application from your Start Menu or Desktop

### Usage

1. **Select a tool** from the left sidebar (or use the search box to find it)
2. **Choose operation**: Encode or Decode
3. **Paste/Type** your input text
4. **Click "Process"** or press Enter
5. **View results** and copy output using the copy button

### Auto-Detection

When in **Decode mode** with input longer than 10 characters:
- The app automatically detects potential encoding formats
- Click any suggestion to auto-apply the decoder
- Each suggestion shows a confidence percentage and reason

## 🔐 Security & Privacy

- ✅ **No external connections** - Everything runs locally
- ✅ **No data logging** - Your inputs are never stored on servers
- ✅ **Open source** - Verify the code yourself
- ✅ **Local history only** - History stored in browser LocalStorage (can be cleared anytime)

## 🔧 System Requirements

- **OS**: Windows 7 or later
- **RAM**: 256 MB minimum
- **Disk Space**: 500 MB for installation
- **No internet required** - All features work offline

## 📱 User Interface

- **Sidebar Navigation**: Browse tools by category or search
- **Main Editor**: Dual-tab interface for Encode/Decode operations
- **Real-time Detection Panel**: Smart suggestions while typing
- **History Viewer**: Quick access to previous operations
- **Theme Toggle**: Dark and Light modes

## 💡 Use Cases

- **CTF Competitions**: Identify and crack various encodings
- **Cybersecurity**: Analyze and test cryptographic concepts
- **Data Processing**: Convert between different formats
- **Learning**: Understand how different ciphers and encodings work
- **Development**: Quick encoding/decoding during development

## ⌨️ Keyboard Shortcuts

- **Enter**: Process input (same as clicking Process button)
- **Ctrl+C**: Copy output to clipboard
- **Ctrl+L**: Toggle dark mode
- **Ctrl+H**: Open history

## 📊 Cipher Analysis Tools

### Frequency Analysis
Analyze character distribution in text to break substitution ciphers:
- Shows character frequencies
- Compares with English language statistics
- Identifies patterns

### Substitution Solver
Automatically attempts to solve simple substitution ciphers using:
- Dictionary-based approach
- Frequency analysis
- Pattern matching

### Vigenère Brute Force
Tests common Vigenère cipher keys:
- 1000+ common English words as keys
- Returns all potential solutions
- Confidence scoring

## 📝 Supported Formats

### Input Formats
- Plain text
- Hexadecimal (with or without 0x prefix)
- Base64, Base32, Base58, Base85
- Binary (space-separated)
- URL-encoded text
- Morse code
- And many more...

### Output Formats
- Raw text
- Hexadecimal
- Base64
- JSON (formatted)
- Morse code
- Binary

## 🐛 Known Limitations

1. **Very long inputs**: Processing extremely large texts (>1MB) may cause slowdown
2. **Malformed data**: Some decoders may produce unreadable output with corrupted input
3. **Rare ciphers**: Esoteric encodings (Brainfuck, Ook!) have limited practical use

## 📖 Examples

### Basic Base64 Decode
```
Input:  SGVsbG8gV29ybGQh
Output: Hello World!
```

### ROT13 Caesar Cipher
```
Input:  Uryyb Jbeyq!
Output: Hello World!
```

### Hex to Text
```
Input:  48656C6C6F20576F726C6421
Output: Hello World!
```

## 🔄 Version History

### 1.0.0 (Current)
- Initial release
- 30+ encoding/decoding tools
- Auto-detection system
- Tool search functionality
- Dark/Light theme
- History tracking
- Processing time display

## 🤝 Contributing

Found a bug or want to suggest a feature? 
- GitHub: https://github.com/nevr-ine/encoder-decoder-app
- Open an issue with details

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Credits

Built with:
- React & TypeScript
- Electron (Desktop framework)
- CryptoJS (Cryptographic functions)
- Pako (Compression)

## 📞 Support

For issues or questions:
1. Check the GitHub repository
2. Review the FAQ section below
3. Open a GitHub issue with detailed information

## ❓ FAQ

**Q: Is my data safe?**
A: Yes, all processing happens locally. No data is sent to external servers.

**Q: Can I use this offline?**
A: Yes, the application works completely offline.

**Q: How do I clear my history?**
A: Click the history button (📜) and then "Clear" in the history panel.

**Q: What if I find a decoding inaccuracy?**
A: Please report it on GitHub with the input data and expected output.

**Q: Can I decode any format?**
A: The app supports 30+ formats. If your format isn't listed, try the generic tools like Hex or Base64.

**Q: How does auto-detection work?**
A: It analyzes the input format and matches against known patterns for each decoder.

---

**Made with ❤️ for the cybersecurity community**

Version 1.0.0 | © 2026 | MIT License
