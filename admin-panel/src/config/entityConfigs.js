// Each config describes one collection managed via the generic
// CollectionManager component: where its API lives, what columns to show
// in the list, and what fields the add/edit form should render.
//
// Field types understood by ItemFormModal:
//   text, textarea, number, date, time, checkbox, checkboxGroup,
//   select, searchableSelect, stars, image, video
// `showIf: { field, equals }` (or `in: [...]`) hides a field until another
// field matches — used for "only show video fields when type = VIDEO", etc.

export const SPECIALIZATION_OPTIONS = [
  "General Physician", "Cardiologist", "Neurologist", "Orthopedic Surgeon",
  "Dermatologist", "Pediatrician", "Gynecologist", "ENT Specialist",
  "Ophthalmologist", "Psychiatrist", "Urologist", "Nephrologist",
  "Gastroenterologist", "Pulmonologist", "Endocrinologist", "Oncologist",
  "Radiologist", "Pathologist", "Anesthesiologist", "General Surgeon",
  "Dentist", "Physiotherapist", "Ayurvedic Physician",
  "Panchakarma Specialist", "Homeopathic Physician",
  "Dietician / Nutritionist", "Diabetologist", "Rheumatologist",
];

export const QUALIFICATION_OPTIONS = [
  "MBBS", "MD", "MS", "BAMS", "MD (Ayurveda)", "BHMS", "MD (Homeopathy)",
  "BDS", "MDS", "DNB", "DM", "MCh", "PGDND", "M.Phil.", "PhD", "PGMTD",
  "CCMP", "Diploma in Panchakarma",
];

export const DEPARTMENT_OPTIONS = [
  "Ayurvedic", "Allopathic", "Homeopathic", "Diagnostic",
  "General Medicine", "Surgery", "Dental", "Physiotherapy",
];

export const DAY_OPTIONS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export const ROOM_TYPE_OPTIONS = [
  "General Ward", "Semi-Private", "Private Room", "Deluxe Room",
  "ICU", "NICU", "Suite",
];

export const ROOM_AMENITY_OPTIONS = [
  "Beds", "Sofa", "Fan", "Air Conditioner", "Television", "Smart TV",
  "Attached Washroom", "WiFi", "Nurse Calling System", "Refrigerator",
  "Mini Refrigerator", "Daily Housekeeping", "Hot Water", "Wardrobe",
  "Reclining Chair for Attendant",
];

export const entityConfigs = {
  monks: {
    title: "Monks / Acharya Groups", endpoint: "/api/monks", listTitleField: "name", listSubtitleField: "groupName",
    fields: [
      { name: "name", label: "Monk / Group Name", type: "text", required: true },
      { name: "groupName", label: "Group Name (optional)", type: "text" },
      { name: "photo", label: "Monk / group photo", type: "image" },
      { name: "travelReason", label: "Travel reason / Vihar details", type: "textarea" },
      { name: "locationLink", label: "Google Maps shared location link", type: "text" },
      { name: "locationLabel", label: "Location name", type: "text" },
      { name: "latitude", label: "Latitude (optional if link contains coordinates)", type: "number" },
      { name: "longitude", label: "Longitude (optional if link contains coordinates)", type: "number" },
      { name: "isActive", label: "Visible on website", type: "checkbox", default: true },
    ],
  },
  events: {
    title: "Events", endpoint: "/api/events", listTitleField: "name", listSubtitleField: "eventDate",
    fields: [
      { name: "name", label: "Event Name", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "eventDate", label: "Date", type: "date" }, { name: "eventTime", label: "Time", type: "time" },
      { name: "place", label: "Place / Location", type: "text" }, { name: "guestSpeakers", label: "Guest Speaker(s)", type: "text" },
      { name: "eventType", label: "Event Type", type: "select", options: ["ONE_TIME", "RECURRING"], default: "ONE_TIME" },
      { name: "recurrenceRule", label: "Recurrence Schedule", type: "text", showIf: { field: "eventType", equals: "RECURRING" } },
      { name: "posterImages", label: "Event poster images", type: "multiImage" },
      { name: "photos", label: "Event photos", type: "multiImage" },
      { name: "videos", label: "Video URLs (JSON array)", type: "textarea" },
      { name: "isNew", label: "Show New Event badge", type: "checkbox", default: true },
      { name: "isActive", label: "Published", type: "checkbox", default: true },
    ],
  },
  gallery: {
    title: "Photo Gallery", endpoint: "/api/gallery", listTitleField: "title", listSubtitleField: "photos",
    fields: [
      { name: "title", label: "Section Title", type: "text", required: true },
      { name: "photos", label: "Gallery photos", type: "multiImage" },
      { name: "displayOrder", label: "Display Order", type: "number", min: 0 },
      { name: "isActive", label: "Visible on website", type: "checkbox", default: true },
    ],
  },
  doctors: {
    title: "Doctors",
    endpoint: "/api/doctors",
    reorderable: true,
    listImageField: "image",
    listTitleField: "name",
    listSubtitleField: "specialization",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      {
        name: "specialization",
        label: "Specialization",
        type: "searchableSelect",
        options: SPECIALIZATION_OPTIONS,
        placeholder: "e.g. Panchakarma Specialist",
      },
      {
        name: "qualification",
        label: "Qualification",
        type: "searchableSelect",
        options: QUALIFICATION_OPTIONS,
        placeholder: "e.g. BAMS",
      },
      {
        name: "department",
        label: "Department (groups doctors on the public page)",
        type: "searchableSelect",
        options: DEPARTMENT_OPTIONS,
        default: "General Medicine",
      },
      { name: "experience", label: "Experience", type: "text", placeholder: "e.g. 10 years" },
      {
        name: "availableDays",
        label: "Available Days",
        type: "checkboxGroup",
        options: DAY_OPTIONS,
      },
      { name: "startTime", label: "Available From", type: "time" },
      { name: "endTime", label: "Available Until", type: "time" },
      {
        name: "availabilityType",
        label: "Availability Type",
        type: "select",
        options: ["DAILY", "ON_CALL"],
        default: "DAILY",
      },
      { name: "image", label: "Photo", type: "image" },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "translations",
        label: "Translations",
        type: "translations",
        translatableFields: [
          { name: "specialization", label: "Specialization", type: "text" },
          { name: "qualification", label: "Qualification", type: "text" },
          { name: "department", label: "Department", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
        ],
      },
      { name: "isActive", label: "Visible on website", type: "checkbox", default: true },
    ],
  },

  testimonials: {
    title: "Testimonials",
    endpoint: "/api/testimonials",
    reorderable: true,
    listImageField: "thumbnail",
    listTitleField: "patientName",
    listSubtitleField: "type",
    fields: [
      { name: "patientName", label: "Patient Name", type: "text" },
      {
        name: "type",
        label: "Type",
        type: "select",
        options: ["TEXT", "IMAGE", "VIDEO"],
        default: "VIDEO",
      },
      { name: "message", label: "Message / Feedback", type: "textarea" },
      { name: "image", label: "Image", type: "image", showIf: { field: "type", equals: "IMAGE" } },
      { name: "videoUrl", label: "Video", type: "video", showIf: { field: "type", equals: "VIDEO" } },
      { name: "thumbnail", label: "Thumbnail", type: "image", showIf: { field: "type", equals: "VIDEO" } },
      { name: "rating", label: "Rating", type: "stars", default: 5 },
      {
        name: "translations",
        label: "Translations",
        type: "translations",
        translatableFields: [{ name: "message", label: "Message", type: "textarea" }],
      },
      { name: "isActive", label: "Visible on website", type: "checkbox", default: true },
    ],
  },

  hero: {
    title: "Hero Slides",
    endpoint: "/api/hero",
    reorderable: true,
    listImageField: "image",
    listTitleField: "type",
    listSubtitleField: "animationType",
    fields: [
      {
        name: "type",
        label: "Type",
        type: "select",
        options: ["IMAGE", "VIDEO"],
        default: "IMAGE",
      },
      { name: "image", label: "Image", type: "image", showIf: { field: "type", equals: "IMAGE" } },
      { name: "videoUrl", label: "Video", type: "video", showIf: { field: "type", equals: "VIDEO" } },
      { name: "thumbnail", label: "Thumbnail (shown while video loads)", type: "image", showIf: { field: "type", equals: "VIDEO" } },
      {
        name: "animationType",
        label: "Slide Animation",
        type: "select",
        options: ["SLIDE", "FADE"],
        default: "SLIDE",
      },
      { name: "isActive", label: "Visible on website", type: "checkbox", default: true },
    ],
  },

  donors: {
    title: "Donors",
    endpoint: "/api/donors",
    reorderable: true,
    listImageField: "image",
    listTitleField: "name",
    listSubtitleField: "donationType",
    fields: [
      { name: "name", label: "Donor Name", type: "text", required: true },
      { name: "donationAmount", label: "Donation Amount", type: "number", min: 0 },
      { name: "donationType", label: "Donation Type / Purpose", type: "text", placeholder: "e.g. Equipment, Building Fund, Ambulance" },
      { name: "donationDate", label: "Donation Date", type: "date" },
      { name: "image", label: "Photo / Logo", type: "image" },
      { name: "message", label: "Message", type: "textarea" },
      { name: "vip", label: "VIP Donor (featured card)", type: "checkbox", default: false },
      {
        name: "translations",
        label: "Translations",
        type: "translations",
        translatableFields: [
          { name: "donationType", label: "Donation Type / Purpose", type: "text" },
          { name: "message", label: "Message", type: "textarea" },
        ],
      },
      { name: "isActive", label: "Visible on website", type: "checkbox", default: true },
    ],
  },

  navItems: {
    title: "Navbar & Footer Tabs",
    endpoint: "/api/nav-items",
    reorderable: true,
    listTitleField: "label",
    listSubtitleField: "path",
    fields: [
      { name: "label", label: "Tab Label", type: "text", required: true, placeholder: "e.g. Donors" },
      { name: "path", label: "Link (path or full URL)", type: "text", required: true, placeholder: "/donors" },
      {
        name: "location",
        label: "Show in",
        type: "select",
        options: ["NAVBAR", "FOOTER", "BOTH"],
        default: "BOTH",
      },
      { name: "openInNewTab", label: "Open in new tab", type: "checkbox", default: false },
      {
        name: "translations",
        label: "Translations",
        type: "translations",
        translatableFields: [{ name: "label", label: "Tab Label", type: "text" }],
      },
      { name: "isActive", label: "Visible on website", type: "checkbox", default: true },
    ],
  },

  departments: {
    title: "Departments",
    endpoint: "/api/departments",
    reorderable: true,
    listImageField: "image",
    listTitleField: "title",
    listSubtitleField: "slug",
    fields: [
      { name: "title", label: "Department Name", type: "text", required: true, placeholder: "e.g. Cardiology" },
      { name: "slug", label: "URL slug", type: "text", required: true, placeholder: "e.g. cardiology (used in the page link)" },
      { name: "image", label: "Image", type: "image" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "services", label: "Services (comma-separated)", type: "text", placeholder: "Heart Failure, Cardiac Surgery, ..." },
      {
        name: "translations",
        label: "Translations",
        type: "translations",
        translatableFields: [
          { name: "title", label: "Department Name", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "services", label: "Services (comma-separated)", type: "text" },
        ],
      },
      { name: "isActive", label: "Visible on website", type: "checkbox", default: true },
    ],
  },

  counters: {
    title: "Homepage Counters",
    endpoint: "/api/counters",
    reorderable: true,
    listTitleField: "label",
    listSubtitleField: "value",
    fields: [
      { name: "label", label: "Label", type: "text", required: true, placeholder: "e.g. Patients Treated" },
      { name: "value", label: "Number", type: "number", required: true, min: 0 },
      { name: "suffix", label: "Suffix (shown after the number)", type: "text", placeholder: "+" },
      {
        name: "translations",
        label: "Translations",
        type: "translations",
        translatableFields: [{ name: "label", label: "Label", type: "text" }],
      },
      { name: "isActive", label: "Visible on website", type: "checkbox", default: true },
    ],
  },

  contacts: {
    title: "Department Contacts",
    endpoint: "/api/contacts",
    reorderable: true,
    listTitleField: "department",
    listSubtitleField: "phone",
    fields: [
      { name: "department", label: "Department", type: "text", required: true, placeholder: "e.g. OPD, Emergency" },
      { name: "phone", label: "Phone Number", type: "text", required: true },
      { name: "availability", label: "Availability", type: "text", placeholder: "e.g. Mon-Sat, 9 AM - 6 PM" },
      {
        name: "translations",
        label: "Translations",
        type: "translations",
        translatableFields: [
          { name: "department", label: "Department", type: "text" },
          { name: "availability", label: "Availability", type: "text" },
        ],
      },
      { name: "isActive", label: "Visible on website", type: "checkbox", default: true },
    ],
  },
};
