# Contact Page Setup Guide

## Overview

The Contact component has been created and integrated into the HealthierKE platform. This component can display contact information from Strapi and includes an integrated contact form using the FormSubmit component.

## Component Features

### 📞 Contact Information Display
- Phone number with clickable tel: link
- Email address with clickable mailto: link
- Physical address
- Office hours
- Emergency contact number (highlighted in red)

### 📧 Contact Form
- Email capture using the existing FormSubmit component
- Customizable placeholder text and button text
- Success/error message handling
- Automatic submission to Strapi's lead-form-submissions collection

### 🗺️ Map Integration
- Google Maps embed support
- Responsive iframe container

## Strapi Setup Required

### 1. Create Contact Info Component (Reusable Component)

First, create a **reusable component** called `contact-info`:

**Path:** Components > Create Component > `contact-info`

#### Fields:
- **title** (Text) - e.g., "Get in Touch"
- **subtitle** (Long Text) - e.g., "We're here to help with your health questions"
- **phone** (Text) - e.g., "+254 700 123 456"
- **email** (Email) - e.g., "contact@healthierke.com"
- **address** (Long Text) - Physical address
- **officeHours** (Long Text) - e.g., "Monday - Friday: 8:00 AM - 6:00 PM"
- **emergencyPhone** (Text) - Emergency contact number
- **mapEmbedUrl** (Text) - Google Maps embed URL

### 2. Create Contact Section Component (Dynamic Zone Component)

Create a new **dynamic zone component** called `sections.contact`:

**Path:** Components > Create Component > `sections` > `contact`

#### Fields Structure:
- **contactInfo** (Component - Single) - Select the `contact-info` component created above
- **formTitle** (Text) - Title for the contact form section
- **formSubtitle** (Long Text) - Subtitle for the contact form
- **formPlaceholder** (Text) - Placeholder text for email input
- **formButtonText** (Text) - Text for the submit button

### 3. Deep Population Configuration

The frontend already uses **deep population** (`populate: "deep"`) which will automatically fetch all nested component data including:
- The `contactInfo` component within the `sections.contact` component
- All fields within the `contact-info` component

**No additional API configuration needed** - the existing `get-page-by-slug.ts` handles this automatically.

### 3. Create Contact Page in Strapi

1. Go to **Content Manager > Pages**
2. Create a new page with slug: `contact` or `contact-us`
3. Add the contact component to the contentSections
4. Fill in all the contact information
5. Publish the page

## Sample Contact Data Structure (from Strapi API)

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "slug": "contact",
        "title": "Contact Us",
        "contentSections": [
          {
            "id": 1,
            "__component": "sections.contact",
            "formTitle": "Send us a Message",
            "formSubtitle": "Have a health question or want to stay updated?",
            "formPlaceholder": "Enter your email address",
            "formButtonText": "Contact Us",
            "contactInfo": {
              "id": 1,
              "title": "Get in Touch",
              "subtitle": "We're here to help with your health questions and concerns.",
              "phone": "+254 700 123 456",
              "email": "contact@healthierke.com",
              "address": "123 Health Street, Medical Center\nNairobi, Kenya",
              "officeHours": "Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 2:00 PM\nSunday: Closed",
              "emergencyPhone": "999",
              "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d..."
            }
          }
        ]
      }
    }
  ]
}
```

**Note:** With deep population enabled, the `contactInfo` component is automatically populated with all its fields. No additional API calls or population configuration needed.

## Google Maps Setup

To add a map to your contact page:

1. Go to [Google Maps](https://maps.google.com)
2. Search for your location
3. Click **Share** > **Embed a map**
4. Copy the embed URL
5. Add it to the `mapEmbedUrl` field in Strapi

## Environment Variables Required

Make sure these environment variables are set:

```
NEXT_PUBLIC_STRAPI_API_TOKEN=your_strapi_token
NEXT_PUBLIC_STRAPI_FORM_SUBMISSION_TOKEN=your_form_token
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
```

## Component Mapping

The Contact component is mapped to these Strapi component types:
- `sections.contact`
- `sections.contact-us`

## URL Structure

Once set up in Strapi, the contact page will be available at:
- `https://yoursite.com/contact` (if slug is "contact")
- `https://yoursite.com/contact-us` (if slug is "contact-us")

## Styling

The Contact component uses the existing HealthierKE styling system:
- `healthier-section` for main section wrapper
- `content-container` for responsive container
- `medical-card` for card styling
- `healthier-section-title` for headings
- `healthier-section-divider-line` for decorative lines

## Form Integration

The contact form automatically:
- Validates email format
- Submits to `/api/lead-form-submissions` in Strapi
- Shows success/error messages
- Clears form on successful submission

## Responsive Design

The contact page is fully responsive:
- Mobile: Single column layout
- Desktop: Two column layout (contact info + form)
- Map: Full width with proper aspect ratio

---

*The Contact component is now ready to use with your Strapi backend!*
