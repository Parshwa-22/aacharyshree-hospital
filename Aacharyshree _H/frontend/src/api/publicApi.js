import apiClient from "./client";

// Every function here fetches *active* content only, sorted by displayOrder
// (the backend already sorts). Every function swallows errors and returns
// an empty array instead of throwing — callers decide their own fallback,
// so the public site keeps working even if the backend/admin panel isn't
// running yet.

async function safeGet(url, params) {
  try {
    const { data } = await apiClient.get(url, { params });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn(`[api] ${url} unavailable, using fallback content.`, err.message);
    return [];
  }
}

export const fetchDoctors = () => safeGet("/api/doctors", { active: true });
export const fetchTestimonials = () => safeGet("/api/testimonials", { active: true });
export const fetchHeroSlides = () => safeGet("/api/hero", { active: true });
export const fetchDonors = () => safeGet("/api/donors", { active: true });
export const fetchNavItems = (location) => safeGet("/api/nav-items", { location, active: true });
export const fetchDepartments = () => safeGet("/api/departments", { active: true });
export const fetchEvents = () => safeGet("/api/events", { active: true });
export const fetchGallery = () => safeGet("/api/gallery", { active: true });

export async function fetchSiteSettings() {
  try {
    const { data } = await apiClient.get("/api/site-settings");
    return data;
  } catch (err) {
    console.warn("[api] /api/site-settings unavailable.", err.message);
    return null;
  }
}

export async function fetchContactSettings() {
  try {
    const { data } = await apiClient.get("/api/contact-settings");
    return data;
  } catch (err) {
    console.warn("[api] /api/contact-settings unavailable.", err.message);
    return null;
  }
}
