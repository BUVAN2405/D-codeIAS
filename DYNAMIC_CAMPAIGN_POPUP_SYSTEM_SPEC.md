# D'code IAS Academy — Comprehensive System & Feature Blueprint

This document serves as the master specification for future development modules agreed upon by the product owner and AI development team.

---

## 📑 TABLE OF CONTENTS
1. [Module 1: Dynamic Campaign & Pop-up Engine](#module-1-dynamic-campaign--pop-up-engine)
2. [Module 2: Enrolled Student Directory & Fee / Installment Ledger](#module-2-enrolled-student-directory--fee--installment-ledger)
3. [Module 3: Lead Analytics, Time-Based Filtering & One-Click CSV Export](#module-3-lead-analytics-time-based-filtering--one-click-csv-export)

---

## MODULE 1: Dynamic Campaign & Pop-up Engine

### 1.1 Objective
Empower academy administrators to self-publish, schedule, reorder, and retire marketing campaigns directly via `/admin` without developer code edits.

### 1.2 Admin Dashboard Capabilities
- **Visual Creator**: Upload promotional illustrations/banners with live preview.
- **Copy & Actions**: Custom title, badge, description, and target destination URL (e.g. `/prelims-orientation-2027`, WhatsApp redirect, or modal triggers).
- **Auto-Expiration Clock**: Start & End Date-Time picker (IST). Campaigns deactivate automatically when expired.
- **Display Formats**:
  - `Center Pop-Up Modal`
  - `Homepage Dynamic Banner Card` (replaces static card seamlessly)
  - `Top Marquee Announcement Ticker`
- **Priority Queue**: Custom numeric ordering (`Priority 1, 2, 3...`).
- **Live Analytics**: Impressions count, clicks count, and Click-Through-Rate (CTR).

### 1.3 Visitor UX & Queueing Rules
- **Multi-Ad Sequencing**: Displays `Ad 1` on page load. When dismissed, waits an exact **3-second timer gap** before showing `Ad 2`, cycling through active queue items.
- **Frequency Capping**: `sessionStorage` avoids repetitive popups on internal navigation; 24-hour `localStorage` cooldown prevents visitor fatigue.

### 1.4 Database Schema (Firestore: `promotional_campaigns`)
```typescript
export interface PromotionalCampaign {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  format: 'popup' | 'banner' | 'ticker';
  ctaText: string;
  destinationUrl: string;
  priority: number;
  status: 'active' | 'paused' | 'archived';
  startDate: string;
  endDate: string;
  analytics: { impressions: number; clicks: number };
  createdAt: string;
}
```

---

## MODULE 2: Enrolled Student Directory & Fee / Installment Ledger

### 2.1 Objective
Centralize all enrolled student academic profiles and financial installment records to eliminate manual registers and track pending dues with zero revenue leakage.

### 2.2 Student Profile & Academic Management
- **Identity & Contact**: Full Name, Student Phone, Parent Phone, Email, Address, Admission Roll ID (`DCODE-YYYY-XXXX`).
- **Course & Batch Allocation**: Enrolled course (e.g., *PCM Foundation 2027*, *Public Administration Optional*), Batch Timing (*Morning / Evening / Weekend*), Admission Date.
- **Status Lifecycle**: `Active`, `Completed`, `Batch Transferred`, `On Hold`.

### 2.3 Financial Fee Ledger & Installment Tracking
- **Fee Breakdown**: Total Fee, Scholarship / Discount Applied, Net Payable Fee.
- **Payment Status Indicators**:
  - 🟢 **Fully Paid** (Balance: ₹0)
  - 🟡 **Partial / Advance Paid** (e.g., ₹10,000 paid advance; ₹35,000 balance pending)
  - 🔴 **Pending / Overdue**
- **Detailed Transaction History per Student**:
  - Transaction date, amount paid, payment mode (*UPI, Cash, Bank NEFT/RTGS, Cheque*), UTR / reference number, receipt number, and staff recorder name.
  - Auto-calculated remaining balance updated on every transaction.

### 2.4 High-Value Enhancements & Suggestions
- **Installment Due Date Reminders**: Set upcoming due date for balance payment; dashboard highlights students with dues approaching within 7 days.
- **1-Click WhatsApp / PDF Receipt Generator**: Instantly downloads or shares an official branded fee receipt with the academy seal.
- **Financial Status Filters**: 1-click filter for *All Students with Pending Balance > 0* for rapid recovery calls.
- **Export to CSV**: Export full student ledger for accounting and Tally integration.

### 2.5 Database Schema (Firestore: `enrolled_students`)
```typescript
export interface EnrolledStudent {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  parentPhone?: string;
  courseName: string;
  batchName: string;
  admissionDate: string;
  feeDetails: {
    totalFee: number;
    discountApplied: number;
    netFee: number;
    totalPaid: number;
    balanceDue: number;
    status: 'fully_paid' | 'partial' | 'pending';
    nextDueDate?: string;
  };
  transactions: Array<{
    transactionId: string;
    date: string;
    amountPaid: number;
    paymentMode: 'UPI' | 'Cash' | 'Bank Transfer' | 'Cheque';
    referenceNumber?: string;
    receiptNumber: string;
    recordedBy: string;
  }>;
  notes?: string;
  status: 'active' | 'completed' | 'dropped';
}
```

---

## MODULE 3: Lead Analytics, Time-Based Filtering & One-Click CSV Export

### 3.1 Objective
Enhance the existing Admin Lead Database (`AdminDashboard.tsx` & `AdminLeadsDrawer.tsx`) with high-resolution time filters, period counters, and instant spreadsheet exports.

### 3.2 Time-Based Period Filters
- **Instant Quick-Preset Buttons**:
  - ⚡ **Today** (leads received between 00:00 and 23:59 today)
  - ⚡ **Yesterday**
  - ⚡ **This Week** (last 7 days)
  - ⚡ **This Month** (1st of current month to today)
  - ⚡ **Previous Month**
  - ⚡ **All Time**
- **Custom Date Range Selector**:
  - `From Date` and `To Date` pickers with time support (Day, Month, Year).
  - Enables audit of specific campaigns (e.g., *Oct 10 to Oct 15 Orientation Drive*).

### 3.3 Dynamic Lead Counters & Summary Bar
- Live metric cards showing lead inflow counts matching the selected filter:
  - Total Filtered Leads
  - Count by Form Type (*Course Enrollment vs General Inquiry vs Prelims Orientation*)
  - Count by Lead Status (*New vs Contacted vs Enrolled*)

### 3.4 One-Click Export to Excel / CSV
- **Instant Download Button**: "Export Filtered Leads (.CSV)"
- Formats exported file with clean tabular headers:
  - `Lead ID`, `Date & Time (IST)`, `Student Name`, `Phone`, `Email`, `Course Selected`, `Form Type`, `Lead Status`, `Assigned Counselor`, `Counselor Follow-up Notes / Remarks`, `Next Follow-up Date`, `Student Message / Query`, `Source URL`.
- Automatically names the file based on the filter (e.g. `Dcode_Leads_2026-10-19_Today.csv`).

### 3.5 High-Value Workflow Features
- **1-Click "Convert Lead to Enrolled Student"**:
  - When a counselor confirms admission from an inquiry lead, clicking **"Enroll Student"** copies all student info directly into **Module 2 (Enrolled Students Ledger)**, eliminating double manual data entry!
- **Quick WhatsApp Action**:
  - 1-click icon next to phone number to open direct WhatsApp conversation with pre-filled greeting.
- **Counselor Notes Field**:
  - Inline input in Admin Dashboard where counselors log call remarks and follow-up status.
