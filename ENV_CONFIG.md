# Environment Configuration for MiniFin

This document explains how to set up environment variables for the Airtable integration.

## Setting up Airtable Integration

1. Create a `.env.local` file in the root of your project with the following contents:

```
# Airtable Integration
NEXT_PUBLIC_AIRTABLE_API_KEY=your_airtable_api_key_here
NEXT_PUBLIC_AIRTABLE_BASE_ID=your_airtable_base_id_here
```

2. Replace the placeholder values with your actual Airtable API key and Base ID:

- Get your API key from your Airtable account settings
- Find your Base ID in the URL of your Airtable base (it's the part after `airtable.com/`)

## Deployment on Vercel

When deploying to Vercel, add these environment variables in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable with its corresponding value
4. Deploy your application

## Airtable Base Setup

For this application to work with Airtable, you need a base with a table named "transactions" that has the following fields:

- id (Single line text)
- amount (Number)
- description (Single line text)
- date (Date)
- type (Single select with options: "income", "expense")
- category (Single select with options matching the categories in the app)

You can create this table structure manually or the app will attempt to create it when you first sync your data. 