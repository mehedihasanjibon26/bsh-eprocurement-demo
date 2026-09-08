# BSH E-Procurement Demo - Execution Summary

## Source of Truth

Primary source:
`docs/BSH-EProcurement-Demo-PRD.docx`

This summary is a concise development reference only.
If anything conflicts with the PRD, follow the PRD.

## Product Goal

Build a polished, clickable and believable E-Procurement client demo for Bangladesh Specialized Hospital PLC.

The goal is broad visible requirement coverage and reliable demo flow, not production-depth engineering.

Primary showcase areas:

- Admin Dashboard
- Vendor Dashboard

## Architecture

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- Axios
- React Hook Form
- Zod
- Recharts

### Backend

- Laravel REST API
- PostgreSQL
- Lightweight modular monolith
- Laravel Sanctum for demo authentication when Phase 1 begins

### General Flow

React UI
-> Service/API Layer
-> Laravel REST API
-> PostgreSQL

## Implementation Depth

### LIGHT BACKEND

Use Laravel/PostgreSQL where persistence or connected demo behavior matters.

Examples:

- login/session
- users/roles
- requisitions
- vendors
- tenders
- bids
- awards
- PO/contracts
- invoices
- status transitions
- audit events

### FRONTEND LOGIC

Use frontend logic for visible interactions that do not require backend complexity.

Examples:

- charts
- calculations
- bid totals
- scoring/ranking presentation
- filtering

### SIMULATED

Show the capability in UI without real enterprise integration.

Examples:

- email/SMS delivery
- tax/bank verification
- backup status
- payment movement
- external document verification
- digital signature

### FUTURE / PRODUCTION

Do not implement in this demo.

Examples:

- ERP/accounting/inventory integration
- banking/payment gateway
- enterprise SSO
- 2FA/3FA/OTP
- HSM/cryptographic bid sealing
- microservices
- Kubernetes
- production HA/DR
- native mobile apps
- AI/OCR
- multi-tenant SaaS

## Development Phases

### Phase 0 - Foundation

- React frontend
- Laravel backend
- PostgreSQL
- API connectivity
- shared UI foundation
- service/API layer
- shared types
- reproducible demo data foundation

### Phase 1 - Login, Roles & Shell

- Login
- Admin/Hospital shell
- Vendor shell
- role-based access
- unauthorized screen

### Phase 2 - Admin Dashboard

- KPI cards
- charts
- recent activity
- approvals
- expiry/payment/contract alerts

### Phase 3 - Requisitions, Vendors & Tenders

- requisition workflow
- vendor management
- tender creation/publishing
- BOQ
- eligibility
- governance actions

### Phase 4 - Vendor Portal

- vendor dashboard
- browse tenders
- tender details
- vendor profile/documents

### Phase 5 - Online Bidding

- technical bid
- financial bid
- supporting documents
- totals
- submit/withdraw
- locked state

### Phase 6 - Evaluation, Award, PO & Contract

- technical evaluation
- financial comparison
- ranking
- recommendation
- award approval
- PO
- vendor acceptance
- contract

### Phase 7 - Delivery, Invoice & Payment

- delivery
- receipt
- invoice
- 3-way match
- payment status

### Phase 8 - Reports, Notifications, Admin & Audit

- reports
- filters/export
- notifications
- users/roles
- workflow representation
- audit log
- backup/security status

### Phase 9 - Integration & Polish

- connect all P0/P1 screens
- remove broken actions/placeholders
- stabilize demo data
- demo reset
- rehearse Golden Demo

## P0 Screens

Highest design and reliability priority:

- Login
- Admin Dashboard
- Vendor Dashboard
- Requisition Details
- Tender Details
- Bid Submission
- Evaluation / Comparative Statement
- Vendor Profile
- 3-Way Match
- Audit Log

## Golden Demo Flow

Admin Dashboard
-> ICU Equipment Requisition
-> Approve Requisition
-> Convert to Tender
-> Publish Tender
-> Vendor Dashboard
-> Open Tender
-> Technical Bid
-> Financial Bid
-> Submit Bid
-> Evaluation
-> Vendor Ranking
-> Recommend MediSupply Ltd.
-> Approve Award
-> Issue PO
-> Vendor Accepts PO
-> Contract
-> Delivery
-> Receipt
-> Invoice
-> 3-Way Match
-> Payment Paid
-> Dashboard / Reports
-> Audit Log

## Core Demo Data

### Seed Vendors

- MediSupply Ltd.
- HealthTech Traders
- CarePoint Distributors
- Bangla Diagnostic Solutions
- MedEquip Bangladesh

### Key Golden Demo Tender

`ICU Equipment Supply 2026`

### Evaluation Ranking

1. MediSupply Ltd. - 92
2. HealthTech Traders - 85
3. CarePoint Distributors - 76

Use consistent vendors, tenders, amounts and statuses across all modules.

## Branding & Content Rules

- Use Bangladesh Specialized Hospital PLC context.
- Use BDT currency.
- Use realistic hospital procurement terminology.
- Do not use lorem ipsum.
- Do not invent formal BSH brand rules if official assets are unavailable.
- No broken navigation on client-visible screens.

## Engineering Rules

- Build phase-by-phase.
- Within each phase, build component-by-component.
- Complete and verify one component before moving to the next.
- Keep backend lightweight.
- Avoid premature abstraction.
- Do not add unnecessary libraries.
- Do not create unused code/folders.
- Keep feature business logic inside its feature boundary.
- Keep shared generic UI reusable.
- Keep API access behind service boundaries.
- Do not scatter hard-coded business data across components.
- Do not implement expensive invisible production infrastructure.
- Prioritize reliable client-visible interaction.

## Demo Complete When

The connected demo can reliably show:

Requisition
-> Approval
-> Tender
-> Bid
-> Evaluation
-> Award
-> PO
-> Contract
-> Delivery
-> Receipt
-> Invoice
-> 3-Way Match
-> Payment
-> Reports
-> Audit

The demo must communicate breadth and credibility, not production depth.
