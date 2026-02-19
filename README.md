# Settlement Monitoring Dashboard

A real-time transaction settlement monitoring dashboard built with Next.js and React. Features live transaction feeds, batch processing, compliance controls, and a professional banking-grade UI.

## ✨ Features

- **Real-Time Feed**: New transactions appear every 2 seconds
- **Transaction Settlement**: Individual and batch processing with 1.5s simulation
- **Compliance Controls**: High-value transaction flagging (>$10,000) with Super Admin override
- **Batch Processing**: Concurrent processing with 10% failure rate simulation
- **Stable UI**: Prevents accidental clicks during live updates
- **Professional Design**: Banking-grade interface inspired by Stripe/Plaid

## 🛠 Tech Stack

- Next.js 16.1.6 (React 19.2.3)
- TypeScript 5
- Tailwind CSS 4

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation
ash
# Install dependencies
npm install

# Start development server
npm run devVisit http://localhost:3000

### Build for Production

npm run build
npm start## 🧪 Testing

### Basic Functionality
1. **Initial Load**: Verify 50 transactions display with correct statistics
2. **Clear Funds**: Click "Clear Funds" on a pending transaction → status changes to "Cleared" after 1.5s
3. **High-Value Transactions**: Transactions >$10,000 are highlighted in red and locked (unless Super Admin is enabled)

### Live Feed
1. **Real-Time Updates**: New transactions appear at the top every 2 seconds
2. **Stable UI**: Existing rows don't shift when new transactions arrive

### Batch Processing
1. **Selection**: Check multiple pending transactions
2. **Batch Clear**: Click "Clear Selected" → transactions process concurrently
3. **Partial Failure**: Some transactions may fail (10% rate) while others succeed independently

### Super Admin Mode
1. Toggle "Super Admin Mode" ON
2. High-value transactions can now be cleared
3. Toggle OFF to lock them again

## 📁 Project Structure
