# Project: VRC Workers (Portfolio Documentation)

## Overview
VRC Workers is a specialized event recruitment platform built for the VRChat community. It streamlines the process of finding "cast" members (staff/performers) for virtual events, offering features like localized scheduling, image processing, and a multi-step verification workflow.

## Technical Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Vercel Postgres (SQL)
- **Styling**: Vanilla CSS (Custom UI Components)
- **Validation**: Zod (Full-stack schema validation)
- **Email**: Resend (Transactional notifications)
- **Images**: Cloudinary (Cloud storage & processing)
- **CI/CD**: GitHub + Vercel

## Key Technical Features

### 1. Robust Application Workflow
The platform implements a unique 3-step application system:
- **Form Submission**: Users provide detailed event information and images.
- **Image Processing**: Client-side image cropping and compression (using `react-easy-crop`) to ensure consistent quality and reduce server load.
- **Identity Verification**: An asynchronous verification step using Twitter (X) DM to prevent impersonation, which triggers admin notification emails.

### 2. Specialized Scheduling System
Events in VR often have complex recurrences. This app handles:
- Recurring schedules (Daily, Weekly, Monthly) with day/date selection.
- Automatic expiration and hiding of past events using server-side SQL filtering.
- Smart sorting by "listing deadline" to highlight urgent needs.

### 3. Clean Architecture & Security
- **Domain-Driven Validation**: Centralized Zod schemas ensure data consistency between the frontend forms and terminal APIs.
- **Privacy-First Design**: Implemented a "Portfolio Mode" that abstracts the administrator's gaming identity into environment variables, allowing the same codebase to serve as a production tool and a professional showcase.
- **Optimized Data Layer**: Uses server-side pagination and targeted SQL queries to maintain performance even with a growing number of events.

## Why I Built This
This project was born from a real need within the VR community for a dedicated "recruiter" tool. Beyond just a listing site, it balances user convenience (no login required for applicants) with strong anti-spam measures (admin approval workflow).
