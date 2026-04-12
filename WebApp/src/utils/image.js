import request from './request';

const IMAGE_DATA_PREFIX = 'data:image/jpeg;base64,';

function getApiBaseUrl() {
    return (request.defaults.baseURL || '').replace(/\/$/, '');
}

function joinApiUrl(path) {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) {
        return path;
    }
    return `${baseUrl}/${String(path).replace(/^\/+/, '')}`;
}

function looksLikeBase64Image(value) {
    const normalizedValue = String(value).replace(/\s+/g, '');
    return normalizedValue.length > 50 && /^[A-Za-z0-9+/=]+$/.test(normalizedValue);
}

export function normalizeImageSrc(value) {
    if (!value) {
        return '';
    }

    const src = String(value).trim();
    if (!src) {
        return '';
    }

    if (/^data:image\//i.test(src) || /^https?:\/\//i.test(src) || /^blob:/i.test(src)) {
        return src;
    }

    if (src.startsWith('//')) {
        return `${window.location.protocol}${src}`;
    }

    if (looksLikeBase64Image(src)) {
        return `${IMAGE_DATA_PREFIX}${src}`;
    }

    if (src.startsWith('/')) {
        const baseUrl = getApiBaseUrl();
        return baseUrl ? `${baseUrl}${src}` : src;
    }

    if (src.includes('?') || src.includes('/') || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(src)) {
        return joinApiUrl(src);
    }

    return src;
}

export function parseImageList(value) {
    if (!value) {
        return [];
    }

    if (Array.isArray(value)) {
        return value;
    }

    try {
        const parsedValue = JSON.parse(value);
        if (Array.isArray(parsedValue)) {
            return parsedValue;
        }
        return parsedValue ? [parsedValue] : [];
    } catch (error) {
        return [value];
    }
}

export function normalizeImageList(value) {
    return parseImageList(value).map(normalizeImageSrc).filter(Boolean);
}

export function getFirstImageSrc(value) {
    const imageList = normalizeImageList(value);
    return imageList.length > 0 ? imageList[0] : '';
}
