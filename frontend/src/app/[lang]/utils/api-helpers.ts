// ./frontend/src/app/[lang]/utils/api-helpers.ts

export function getStrapiURL(path = '') {
    return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${path}`;
}

export function getStrapiMedia(url: string | null) {
    if (url == null) {
        return null;
    }

    // Return the full URL if the media is hosted on an external provider
    if (url.startsWith('http') || url.startsWith('//')) {
        return url;
    }

    // Otherwise prepend the URL path with the Strapi URL
    return `${getStrapiURL()}${url}`;
}

export function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

export function getImageUrl(attributes: any): string {
    const imageField = attributes.cover || attributes.shareImage || attributes.image;
    if (!imageField?.data?.attributes?.url) {
        return "https://via.placeholder.com/400x300?text=No+Image";
    }
    const url = getStrapiMedia(imageField.data.attributes.url);
    return url || "https://via.placeholder.com/400x300?text=No+Image";
}