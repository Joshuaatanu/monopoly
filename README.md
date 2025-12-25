# 🏦 Monopoly Loan Tracker

A sophisticated web-based loan tracking system for Monopoly board game players. Track loans with compound interest, manage property mortgages, and keep your game organized with this modern, feature-rich companion app.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)
![React](https://img.shields.io/badge/React-19.2.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Tests](https://img.shields.io/badge/tests-48%20passing-success)

## ✨ Features

### 🎮 Core Game Mechanics
- **Player Management**: Add up to 8 players with classic Monopoly game pieces (car, dog, hat, ship, thimble, boot, wheelbarrow, cat)
- **Turn Tracking**: Visual turn indicator with easy navigation between players
- **Loan System**: Create loans with 3 interest rates (5%, 10%, 15%) that compound when passing GO
- **Property Management**: Complete UK Monopoly property database with mortgage/unmortgage functionality
- **Loan Collateral**: Secure loans with property collateral for added realism
- **Bankruptcy Detection**: Configurable debt thresholds to mark bankrupt players

### 💼 Advanced Features
- **Game Statistics**: Track total debt, interest accrued, active loans, and pass GO count
- **Loan History**: Complete event log for every loan (creation, interest, payments)
- **Partial Payments**: Pay off loans partially or in full
- **Player Notes**: Add custom annotations to track strategy and assets
- **Debt Limits**: Set optional debt limits per player with visual warnings

### 🔄 Sharing & Persistence
- **Auto-Save**: Game state automatically saved to localStorage
- **QR Code Sharing**: Generate QR codes for easy game sharing
- **URL Sharing**: Share game via compressed URL (edit or view-only modes)
- **View-Only Mode**: Share read-only links so players can view but not edit
- **Export/Import**: Download and upload game state as JSON files
- **State Migration**: Backward-compatible with previous game versions

### 🎨 User Interface
- **Dark Theme**: Modern dark UI with gradient backgrounds
- **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop
- **Real-time Updates**: Instant visual feedback for all actions
- **Toast Notifications**: Clear success/error messages
- **Color-Coded Players**: Each player has a unique color for easy identification
- **Visual Indicators**: Bankruptcy warnings, debt limits, current turn highlighting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd monopoly

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start using the app.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 🧪 Testing

Comprehensive test suite with 48 passing tests covering all game logic:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm test:coverage
```

## 📖 How to Use

### Basic Workflow

1. **Add Players**: Click "Add Player" and choose a name and game piece
2. **Create Loans**: Click "+ Loan" on a player card to create a new loan
3. **Pass GO**: When a player passes GO, click "🎲 Pass GO" to apply compound interest
4. **Make Payments**: View loans in the Loans tab and click "Pay" to make payments
5. **Manage Properties**: Add properties in the Properties tab and mortgage/unmortgage as needed
6. **Share Game**: Click the share icon to generate QR codes or shareable links

### Interest Calculation

Interest compounds each time a player passes GO:
- **5% Rate**: Conservative growth (1000 → 1050 after 1 GO)
- **10% Rate**: Standard Monopoly-style (1000 → 1100 after 1 GO)
- **15% Rate**: Aggressive growth (1000 → 1150 after 1 GO)

Example: £1000 loan at 10% interest
- After 1 GO: £1,100
- After 2 GOs: £1,210
- After 3 GOs: £1,331

### Property Mortgaging

Mortgage properties to get cash, with a 10% unmortgage fee:
- **Mortgage**: Receive property value in cash
- **Unmortgage**: Pay property value + 10% fee
- Example: Park Place (£350) costs £385 to unmortgage

### Loan Collateral

Secure loans with unmortgaged properties:
- Prevents property from being mortgaged while used as collateral
- Property is freed when loan is paid off
- Visual indicators show which properties are used as collateral

## 🎯 Use Cases

- **Family Game Nights**: Keep track of complex loan arrangements
- **Teaching Tool**: Help kids learn about interest and debt management
- **Tournament Play**: Maintain accurate records for competitive games
- **Custom House Rules**: Implement banking systems in your Monopoly games
- **Remote Play**: Share game state with players on different devices

## 🏗️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/react)
- **QR Codes**: [qrcode.react](https://www.npmjs.com/package/qrcode.react)
- **Compression**: [LZ-String](https://www.npmjs.com/package/lz-string)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main game page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   ├── add-player-dialog.tsx
│   ├── game-share.tsx      # QR code and sharing
│   ├── game-stats.tsx      # Statistics display
│   ├── loan-form.tsx       # Loan creation form
│   ├── loan-history.tsx    # Loan event timeline
│   ├── loan-table.tsx      # All loans overview
│   ├── pass-go-button.tsx  # Interest application
│   ├── player-card.tsx     # Individual player cards
│   ├── property-manager.tsx # Property management
│   ├── settings-dialog.tsx # Game settings
│   └── turn-tracker.tsx    # Turn navigation
├── data/
│   └── monopoly-properties.ts # UK property database
├── hooks/
│   └── use-game-state.ts   # Main game state logic
├── lib/
│   └── utils.ts            # Utility functions
└── types.ts                # TypeScript definitions
```

## 🎨 Component Overview

### State Management
- **useGameState**: Custom hook managing all game logic
- **localStorage**: Automatic persistence
- **State Migration**: Handles backward compatibility

### Key Components
- **PlayerCard**: Displays player info, debt, and actions
- **LoanTable**: Shows all loans with filtering and history
- **PropertyManager**: Handles property CRUD and mortgaging
- **GameShare**: Generates QR codes and shareable URLs
- **SettingsDialog**: Configure game rules and thresholds

## 🔧 Configuration

### Game Settings

Access via the settings icon in the header:
- **Bankruptcy Threshold**: Set debt limit for bankruptcy detection (default: £5000)
- **Interest Rates**: Fixed at 5%, 10%, 15% (standard)
- **Currency**: GBP (£) based on UK Monopoly

### Customization

Edit `src/types.ts` to modify:
- Player colors
- Game piece options
- Interest rate options

Edit `src/data/monopoly-properties.ts` to:
- Add custom properties
- Modify property values
- Change to different Monopoly editions

## 🐛 Troubleshooting

### Game State Not Saving
- Check browser localStorage permissions
- Try exporting/importing game state manually
- Clear browser cache and reload

### Shared Link Not Working
- Ensure URL is copied completely
- Try using JSON export/import instead
- Check if browser blocks compressed URLs

### Interest Not Calculating
- Verify player has active (not paid off) loans
- Check that loan was created before passing GO
- Review loan history for calculation details

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Based on classic Monopoly board game mechanics
- UK property values from official Monopoly UK edition
- Built with modern React and Next.js best practices
- UI components from shadcn/ui library

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section above

---

**Made with ❤️ for Monopoly enthusiasts**

*Note: This is an unofficial fan-made tool and is not affiliated with Hasbro or the official Monopoly brand.*
