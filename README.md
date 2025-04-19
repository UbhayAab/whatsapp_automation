# WhatsApp Lead Manager

A powerful, customizable dashboard for managing leads, automating WhatsApp messaging, and tracking engagement—all in one place.

## Overview
WhatsApp Lead Manager streamlines your outreach by letting you import leads, send personalized WhatsApp messages in bulk, track delivery and response analytics, and manage all your campaigns from an intuitive web interface.

## Key Features
- **Lead Management:** Import leads via CSV, view and edit lead details, delete leads, and track status.
- **WhatsApp Messaging:** Send messages to individual or multiple leads using Twilio's WhatsApp API. Supports custom message templates and campaign automation.
- **Delivery Logs:** Every message's delivery status (success/fail) is logged. Download logs as a CSV for auditing or offline review.
- **Analytics:** Visualize engagement, responses, and campaign effectiveness with built-in analytics dashboards.
- **CSV Import/Export:** Easy import of leads and export of delivery logs. Helper dialog guides you on the recommended CSV format.
- **Template Management:** Create, edit, and manage message templates for campaigns and follow-ups.
- **Responsive UI:** Built with Material UI for a modern, clean experience across devices.

## Tech Stack
- **Frontend:** React, Material UI
- **Backend/Database:** Supabase
- **Messaging:** Twilio WhatsApp API

## Getting Started

### Prerequisites
- Node.js & npm
- Twilio account with WhatsApp API access
- Supabase project (for authentication and data storage)

### Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/UbhayAab/whatsapp_automation.git
   cd whatsapp-lead-manager
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Set your Supabase URL and Anon Key in `src/context/SupabaseContext.js`.
   - Add your Twilio Account SID and Auth Token in the same file. **Never commit real credentials to public repos.**

### Running the App
```sh
npm start
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide
- **Dashboard:** View campaign summaries and analytics at a glance.
- **Lead Management:** Import leads (CSV), send WhatsApp messages, download delivery logs, and manage lead details.
- **Settings:** Configure Twilio and Supabase credentials, manage templates, and adjust preferences.
- **Analytics:** Access detailed charts for engagement, delivery, and response rates.

### CSV Lead Template
Recommended columns: `name`, `phone_number`, `interest_area`, `custom_message` (optional), `email` (optional), `status` (auto), `response_received` (auto), `last_contacted` (auto).

### Delivery Log Export
Download a CSV of all delivery statuses directly from the Lead Management page. Phone numbers are formatted to prevent Excel from converting them to scientific notation.

## Customization
- **Message Templates:** Edit or add new templates in the Template Manager.
- **Analytics:** Extend analytics by editing components in `src/components/analytics/`.
- **UI:** Modify layout and styles using Material UI in `src/components/Layout.js` and related files.

## Security Note
**Do not commit or share your Twilio or Supabase credentials publicly.** Consider using environment variables or a `.env` file for sensitive data.

## Contributing & Support
For feature requests, bug reports, or help, open an issue or contact the maintainer at [ubhayvatsaanand@gmail.com](mailto:ubhayvatsaanand@gmail.com).

---

Built with ❤️ by Ubhay and contributors.
