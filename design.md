# VoiceLedger Solana - Mobile App Design

## Design Philosophy

**Target**: Small business enterprises with manual record-keeping. The app prioritizes **simplicity, speed, and one-handed usage** on mobile devices (portrait orientation, 9:16 aspect ratio). Every interaction should feel natural and require minimal cognitive load.

---

## Screen List

### 1. **Onboarding / Welcome Screen**
- App introduction and value proposition
- "Get Started" button leading to wallet connection
- Skip option for returning users

### 2. **Wallet Connection Screen**
- Display wallet connection options (Phantom, Solflare, etc.)
- Show connected wallet address
- Option to disconnect and switch wallets

### 3. **Dashboard / Home Screen** (Primary Hub)
- **Header**: Today's date, quick balance/summary
- **Quick Stats Cards**:
  - Total transactions today (count)
  - Total amount recorded today (KES)
  - Equivalent crypto value (SOL/USDC)
- **Primary Action Button**: Large, prominent "Record Transaction" voice button (bottom-center, accessible with thumb)
- **Recent Transactions List**: Last 5-10 transactions with amount, description, time
- **Bottom Navigation**:
  - Home (active)
  - Transactions
  - Statements
  - Settings

### 4. **Record Transaction Screen**
- **Voice Recording Interface**:
  - Large circular record button (center, prominent)
  - Visual waveform animation during recording
  - Transcript display (real-time as user speaks)
  - Confidence indicator (partial vs. committed transcript)
- **Manual Entry Fallback**:
  - Amount input field (numeric keypad)
  - Description text field
  - Category selector (dropdown or chips)
- **Action Buttons**:
  - "Save Transaction" (primary)
  - "Discard" (secondary)
- **Transaction Details Preview**:
  - Parsed amount
  - Parsed description
  - Timestamp
  - Edit option for each field

### 5. **Transactions List Screen**
- **Search & Filter**:
  - Search by description or amount
  - Date range picker
  - Category filter
- **Transaction Items** (scrollable list):
  - Amount (large, bold)
  - Description
  - Category badge
  - Timestamp
  - Tap to view details
- **Swipe Actions** (optional):
  - Edit
  - Delete

### 6. **Transaction Detail Screen**
- Full transaction information
- Edit button (inline editing)
- Delete button
- Blockchain status (pending/confirmed)
- Solana transaction hash (copyable)
- Back button to list

### 7. **Online Transactions Sync Screen**
- **Sync Options**:
  - Manual sync button
  - Auto-sync toggle
- **Connected Accounts** (if applicable):
  - List of integrated payment platforms
  - Last sync time
  - Sync status indicator
- **Synced Transactions**:
  - Display transactions from online sources
  - Merge with voice-recorded transactions
- **Conflict Resolution** (if duplicate detected):
  - Show potential duplicates
  - Merge or dismiss options

### 8. **Statement Generator Screen**
- **Date Range Selector**:
  - Start date picker
  - End date picker
  - Quick presets (This Month, Last Month, Last Quarter, Custom)
- **Preview Section**:
  - Total transactions (count)
  - Total amount (KES)
  - Equivalent crypto (SOL, USDC, etc.)
  - Exchange rate used (with timestamp)
- **Crypto Selection**:
  - Dropdown to select target crypto
  - Real-time rate display
- **Generate & Export**:
  - "Generate Statement" button (primary)
  - Export format options (PDF, CSV, JSON)
  - Share button (for loan applications)
- **Statement Preview**:
  - Downloadable/shareable document
  - Shows all transactions in date range
  - Includes KES and crypto amounts
  - Includes exchange rate and generation timestamp

### 9. **Settings Screen**
- **Account**:
  - Connected wallet address
  - Disconnect wallet button
- **API Configuration**:
  - ElevenLabs API key input (masked)
  - Test connection button
- **Preferences**:
  - Default currency (KES)
  - Preferred crypto for statements
  - Language selection
- **Data**:
  - Export all transactions
  - Clear local cache
  - Backup to blockchain
- **About**:
  - App version
  - Help & support link
  - Privacy policy
  - Terms of service

---

## Primary Content and Functionality

### Dashboard (Home)
- **Content**: Summary cards, recent transaction list, quick action button
- **Functionality**: 
  - Tap "Record Transaction" → Navigate to Record screen
  - Tap recent transaction → View details
  - Swipe to access Transactions tab

### Record Transaction
- **Content**: Voice waveform, transcript, manual input fields
- **Functionality**:
  - Tap record button → Start voice capture
  - Real-time transcript display
  - Tap "Save" → Store transaction locally + on Solana
  - Fallback to manual entry if voice fails

### Transactions List
- **Content**: Scrollable list of all transactions
- **Functionality**:
  - Search/filter transactions
  - Tap transaction → View details
  - Swipe to edit/delete
  - Pull-to-refresh to sync online transactions

### Statement Generator
- **Content**: Date range selector, crypto conversion preview
- **Functionality**:
  - Select date range
  - Choose target crypto
  - Generate statement
  - Export/share statement

---

## Key User Flows

### Flow 1: Record a Transaction via Voice
1. User taps "Record Transaction" button on Dashboard
2. App navigates to Record Transaction screen
3. User taps large record button
4. App starts recording audio and displays waveform
5. ElevenLabs transcribes in real-time
6. Transcript appears on screen (partial updates)
7. User stops recording (auto-stop after silence or manual tap)
8. App parses transcript to extract amount and description
9. User reviews parsed data and edits if needed
10. User taps "Save Transaction"
11. App stores transaction locally + sends to Solana blockchain
12. Success confirmation shown
13. User returns to Dashboard

### Flow 2: Generate and Export Statement
1. User navigates to Statements tab
2. User selects date range (e.g., "Last Month")
3. User selects target crypto (e.g., SOL)
4. App fetches current exchange rate (KES to SOL)
5. App calculates total KES amount for period
6. App converts to crypto amount
7. User taps "Generate Statement"
8. App creates PDF/CSV with all transactions
9. User taps "Share" or "Download"
10. Statement exported for loan application

### Flow 3: Sync Online Transactions
1. User navigates to Transactions tab
2. User taps "Sync Online" button
3. App prompts for online account credentials (if needed)
4. App fetches transactions from online source
5. App merges with voice-recorded transactions
6. Duplicates detected and flagged
7. User reviews and confirms merge
8. Updated transaction list displayed

---

## Color Choices

### Brand Colors (for VoiceLedger Solana)
- **Primary**: `#14F195` (Solana Green) - Used for primary buttons, accents, highlights
- **Secondary**: `#9945FF` (Solana Purple) - Used for secondary actions, badges
- **Background**: `#FFFFFF` (Light) / `#0B0E11` (Dark) - Screen background
- **Surface**: `#F5F5F5` (Light) / `#1A1D20` (Dark) - Cards, input fields
- **Text Primary**: `#11181C` (Light) / `#ECEDEE` (Dark) - Main text
- **Text Secondary**: `#687076` (Light) / `#9BA1A6` (Dark) - Secondary text
- **Success**: `#22C55E` (Green) - Transaction confirmed
- **Warning**: `#F59E0B` (Amber) - Pending transactions
- **Error**: `#EF4444` (Red) - Failed transactions, delete actions
- **Border**: `#E5E7EB` (Light) / `#334155` (Dark) - Dividers, borders

### Usage
- **Primary Button**: Solana Green (#14F195) background with dark text
- **Record Button**: Large, circular, Solana Green with pulsing animation
- **Transaction Cards**: Surface color with subtle border
- **Success State**: Green checkmark with success color
- **Error State**: Red icon/text with error color

---

## Interaction Patterns

### Voice Recording Button
- **Idle**: Circular, Solana Green, 80pt diameter
- **Pressed**: Scale to 0.95, haptic feedback
- **Recording**: Pulsing animation, waveform visualization
- **Completed**: Checkmark animation, brief success feedback

### Transaction Cards
- **Idle**: Subtle shadow, light border
- **Pressed**: Opacity 0.7, slight scale
- **Swipe**: Reveal edit/delete actions

### Bottom Navigation
- **Active Tab**: Solana Green text/icon
- **Inactive Tab**: Muted text/icon
- **Tap Feedback**: Haptic feedback + scale animation

---

## Accessibility Considerations

- **Large Touch Targets**: All buttons ≥44x44pt
- **Color Contrast**: WCAG AA compliant
- **Text Sizing**: Scalable, respects system font size
- **Voice Feedback**: Haptic feedback for confirmations
- **Screen Reader Support**: Proper labels for all interactive elements
- **One-Handed Usage**: Primary actions accessible from bottom half of screen

---

## Mobile-Specific Optimizations

- **Orientation**: Portrait only (9:16)
- **Safe Area**: Respects notch and home indicator
- **Tab Bar**: Persistent at bottom, 56pt height + safe area
- **Scrolling**: Smooth, FlatList for transaction lists
- **Loading States**: Skeleton screens for data fetching
- **Offline Support**: Local storage with sync queue
- **Battery**: Minimize background processes, efficient audio handling

