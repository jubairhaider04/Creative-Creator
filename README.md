# Bongio Digital — Full-Spectrum Agency Web Platform

Bongio Digital is a premier full-spectrum digital studio delivering 60FPS Web Development, AI Automation, High-Conversion Content Systems, 4K Cinema Video Editing, and Bespoke Graphic Design.

This application is built with React 19, TypeScript, Tailwind CSS, Vite, Express, and official Firebase Web SDK (Authentication, Cloud Firestore, and Firebase Storage), with built-in role-based access control (RBAC), a client portal, an administrative command center, and an n8n-ready webhook architecture.

---

## 1. Firebase Architecture & Configuration

The application is architected to seamlessly work with:
- **Default AI Studio configuration**: Automatically reads from `firebase-applet-config.json` targeting database `ai-studio-creativecreator-927832a4-07b2-49a6-87b2-ac76e1512e21`.
- **Custom Project Overrides**: If you want to connect your custom Firebase project (**Bongio Digital**, Project ID: `bongio-digital`, Project Number: `296221145484`), define the standard Vite environment variables in `.env` or your hosting environment.

### Environment Variables (`.env`)
```bash
# Firebase Web App Configuration (Optional overrides)
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="bongio-digital.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="bongio-digital"
VITE_FIREBASE_STORAGE_BUCKET="bongio-digital.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="296221145484"
VITE_FIREBASE_APP_ID="1:296221145484:web:..."
VITE_FIREBASE_DATABASE_ID="ai-studio-creativecreator-927832a4-07b2-49a6-87b2-ac76e1512e21"

# n8n Webhook Forwarding (Optional)
N8N_WEBHOOK_URL="https://n8n.yourdomain.com/webhook/bongio-digital"
```

---

## 2. Firestore Collections Schema

| Collection | Path | Description & Access Control |
| :--- | :--- | :--- |
| **Users** | `users/{uid}` | User profiles with `role` (`client` \| `admin`) and `status` (`active` \| `suspended`). Normal clients cannot modify their own role. |
| **Service Requests** | `serviceRequests/{requestId}` | Digital service briefs submitted by clients with budget, deadline, priority, attachments, and workflow status. |
| **Projects** | `projects/{projectId}` | Active production sprints with progress percentage (0-100), start date, deadline, deliverables, and assigned leads. |
| **Messages** | `messages/{messageId}` | Direct bidirectional chat between clients and Bongio Digital studio leads. |
| **Contact Messages** | `contactMessages/{messageId}` | Inbound messages submitted through the public website contact form. |
| **Testimonials** | `testimonials/{testimonialId}` | Client reviews, star ratings, and published showcase states. |
| **Notifications** | `notifications/{notificationId}` | User-targeted notifications for sprint milestones, updates, and messages. |
| **Leads** | `leads/{leadId}` | CRM prospects with pipeline statuses (`new`, `contacted`, `qualified`, `proposal`, `converted`, `lost`). |
| **Activity Logs** | `activityLogs/{logId}` | Immutable audit trail for system and administrative actions. |
| **Services Catalog** | `services/{serviceId}` | Real-time service discipline catalog and investment tiers. |
| **Portfolio Showcase** | `portfolio/{projectId}` | Published case studies and client projects. |

---

## 3. Firebase Console Setup Guide

Follow these steps in your [Firebase Console](https://console.firebase.google.com/):

### Step 1: Authentication
1. Go to **Build > Authentication > Sign-in method**.
2. Enable **Email/Password**.
3. (Optional) Enable **Google**.
4. Go to **Authentication > Settings > Authorized domains** and add your preview domain (`*.run.app`) and custom production domain (`bongiodigital.com`).

### Step 2: Cloud Firestore
1. Go to **Build > Firestore Database**.
2. Ensure database is created in production mode.
3. Deploy the rules from `firestore.rules`.
4. Deploy the composite indexes defined in `firestore.indexes.json`.

### Step 3: Firebase Storage
1. Go to **Build > Storage**.
2. Click **Get Started** and select your cloud region.
3. Deploy the rules from `storage.rules`.

### Step 4: First Admin Account Setup
The application safely bootstraps `role: "admin"` for the owner account:
- **`jubair04sale@gmail.com`**
When this email registers or logs in via Google/Email, their Firestore document (`users/{uid}`) is created with `role: "admin"`.
Any other user signing up publicly is strictly assigned `role: "client"`. Admins can promote or demote any user directly from the **Admin Command Hub (`/admin/dashboard > Clients`)**.

---

## 4. Protected Routes & URLs

- **Public Website**: `/` (Home, Services, Pricing, Showcase, Calculator, Testimonials, Insights, Contact)
- **Authentication**: `/login`, `/register`, `/signup`, `/forgot-password`
- **Client Workspace**: `/dashboard` and `/client/dashboard`
  - `/dashboard/projects`: Active production deliverables & progress.
  - `/dashboard/requests`: Service requests tracking.
  - `/dashboard/requests/new`: Request a Service form with Firebase Storage file uploads.
  - `/dashboard/messages`: Live chat with studio team.
  - `/dashboard/notifications`: In-app notification center.
  - `/dashboard/profile`: Account and business settings.
- **Admin Command Center**: `/admin/dashboard`
  - Overview statistics (real Firestore counts).
  - Clients Directory (role toggle, suspend/unsuspend, create project).
  - Service Requests management & Convert-to-Project button.
  - Client Projects sprint tracking & progress slider.
  - CRM Leads pipeline.
  - Inbound Contact Messages.
  - Client Chat.
  - Activity Audit logs.
  - Services CMS.
  - Portfolio CMS.
  - Database Sync.

---

## 5. n8n Automation & Webhooks Preparation

The Express backend includes dedicated proxy and forwarding endpoints:
- `POST /api/webhooks/n8n/contact`: Triggered when a visitor submits the contact form.
- `POST /api/webhooks/n8n/service-request`: Triggered when a client submits a new service request.
- `GET /api/webhooks/n8n/status`: Health check for n8n webhook connectivity.

When `N8N_WEBHOOK_URL` is configured in environment variables, these events are forwarded securely server-side without exposing webhooks in the browser.

---

## 6. Firebase Console Checklist

- [x] Firebase Authentication enabled
- [x] Email/Password provider enabled
- [x] Firestore database configured
- [x] Storage bucket configured
- [x] Environment variables documented in `.env.example`
- [x] Production Firestore rules deployed (`firestore.rules`)
- [x] Storage rules created (`storage.rules`)
- [x] Composite indexes documented (`firestore.indexes.json`)
- [x] Owner admin account securely bootstrapped (`jubair04sale@gmail.com`)
- [x] Client signup tested (strictly sets `role: "client"`)
- [x] Client login and dashboard tested
- [x] Admin dashboard tested (protected from non-admin clients)
- [x] Service request submission with file uploads tested
- [x] n8n webhook endpoints configured
