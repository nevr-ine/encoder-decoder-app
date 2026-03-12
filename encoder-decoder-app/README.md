# 🔐 Encoder/Decoder Toolkit

A comprehensive desktop application for encoding and decoding various text formats. Perfect for security professionals, developers, and students.

## Features

### Supported Tools (18+)

**Encoding Tools:**
- Base64
- Base32
- URL Encoding
- Hexadecimal
- HTML Entity Encoding
- Binary
- ASCII Values
- Morse Code

**Hash Functions:**
- MD5
- SHA1
- SHA256

**Cipher Tools:**
- ROT13
- Caesar Cipher

**Text Transformations:**
- Reverse Text
- Uppercase
- Lowercase

**Utilities:**
- JSON Formatter
- Character Counter
- And more...

### Key Features

✅ **One-Click Encode/Decode** - Simple interface for quick conversions
✅ **Dark/Light Mode** - Customizable theme for comfortable work
✅ **History Tracking** - Save up to 50 recent conversions
✅ **Clipboard Support** - Copy results with one click
✅ **Organized by Category** - Easy-to-navigate tool selection
✅ **Modern UI/UX** - Clean and intuitive design

## Installation

### Prerequisites
- Node.js 16+ and npm

### Development Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

### Building Executable

```bash
# Windows
npm run build

# The executable will be in the 'dist' or 'out' folder
```

## Usage

1. **Select a Tool** - Choose from the left sidebar
2. **Enter Text** - Paste or type your text
3. **Click Encode/Decode** - Process your text
4. **Copy Result** - Click the copy button

## Technology Stack

- **Framework**: Electron + React
- **Language**: TypeScript
- **Styling**: CSS3
- **Crypto**: CryptoJS

## Project Structure

```
encoder-decoder-app/
├── public/              # Static assets
├── src/
│   ├── App.tsx         # Main application component
│   ├── App.css         # Application styles
│   ├── index.tsx       # React entry point
│   └── tools/
│       └── encoders.ts # All encoding/decoding tools
├── electron/
│   ├── main.ts        # Electron main process
│   └── preload.js     # Electron preload script
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript config
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run react-start` - Start React dev server only
- `npm run electron-dev` - Start Electron app only
- `npm run build` - Build both React and create executable
- `npm run react-build` - Build React production bundle

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

MIT

## Author

Made for security professionals and students.

---

**Happy encoding/decoding! 🎉**
