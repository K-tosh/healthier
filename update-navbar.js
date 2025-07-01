import fetch from 'node-fetch';
import { Source_Sans_Pro } from 'next/font/google';

const STRAPI_URL = 'http://localhost:1337'; // Change if your Strapi runs elsewhere
const API_TOKEN = 'd9d203a7ca1f318efd66d6e4e7a15893c1f2e926e0e556254f95d2258c8455003254bbb8cb4a06f1d3dda6bc7623f45a9cf0462c5d6b8be644dc82f72fd35253af9741174399b89003cd37cf4b8c219d321b82b1a35c123b6e38f0a843176072c6fbc13968319220aefa1f470f8cb5d6aa128bffb701b63f6358d5dd6856035b'

const newLinks = [
  { text: "Diseases & Conditions", url: "/diseases-conditions", newTab: false },
  { text: "Drugs & Medications", url: "/drugs-medications", newTab: false },
  { text: "Symptoms & Diagnosis", url: "/symptoms-diagnosis", newTab: false },
  { text: "Wellness & Lifestyle", url: "/wellness-lifestyle", newTab: false },
  { text: "Health News", url: "/health-news", newTab: false },
  { text: "Contact", url: "/contact", newTab: false }
];

async function updateNavbar() {
  // Get the current global entry
  const res = await fetch(`${STRAPI_URL}/api/global?populate=navbar.links`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` }
  });
  const data = await res.json();
  if (!data.data) {
    console.error('Could not fetch global entry. Check your API token and Strapi server.');
    return;
  }
  const globalId = data.data.id;

  // Update the navbar links
  const updateRes = await fetch(`${STRAPI_URL}/api/global`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_TOKEN}`
    },
    body: JSON.stringify({
      data: {
        navbar: {
          links: newLinks
        }
      }
    })
  });

  if (updateRes.ok) {
    console.log('Navbar updated successfully!');
  } else {
    const err = await updateRes.text();
    console.error('Failed to update navbar:', err);
  }
}

const navbarLogoUrl = getStrapiMedia(
  navbar?.navbarLogo?.logoImg?.data?.attributes?.url || null
);

const footerLogoUrl = getStrapiMedia(
  footer?.footerLogo?.logoImg?.data?.attributes?.url || null
);

const sourceSansPro = Source_Sans_Pro({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const getImageUrl = (attributes: any): string => {
  // Try cover, then shareImage, then image
  const imageField = attributes.cover || attributes.shareImage || attributes.image;
  if (!imageField?.data?.attributes?.url) {
    return "/placeholder-image.jpg";
  }
  const url = getStrapiMedia(imageField.data.attributes.url);
  return url || "/placeholder-image.jpg";
};

updateNavbar(); 