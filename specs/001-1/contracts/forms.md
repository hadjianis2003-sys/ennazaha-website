# API Contracts: Form Submissions

**Context**: ENNAZAHA Core Website (`001-1`)

Because the website primarily consumes data from a Headless CMS (Strapi/Sanity) and submits to a CRM (HubSpot), the contracts below define the expected JSON payloads the Next.js Server Actions will send to the CRM layer.

## 1. Contact Form / Project Inquiry Payload

`POST /api/leads/contact` (Internal Next.js Route to HubSpot integration)

**Request Body**:
```json
{
  "fullName": "Karim Benzema",
  "email": "karim@example.com",
  "phone": "+213 555 12 34 56",
  "projectContext": "residence-les-jasmins",
  "message": "Je suis intéressé par un F3 dans cette résidence. Quel est le délai de livraison ?"
}
```

**Response** (Success):
```json
{
  "success": true,
  "message": "Your message has been sent successfully."
}
```

**Response** (Error):
```json
{
  "success": false,
  "errors": [
    { "field": "email", "message": "A valid email is required." }
  ]
}
```

## 2. Waitlist Form Payload

`POST /api/leads/waitlist`

**Request Body**:
```json
{
  "fullName": "Amina R.",
  "email": "amina@example.com",
  "phone": "+213 666 98 76 54",
  "preferredCity": "Hydra"
}
```

**Response** (Success):
```json
{
  "success": true,
  "message": "You have been added to the waitlist for Hydra."
}
```

*Note: The Mortgage Calculator operates entirely client-side and does not require an API contract.*
