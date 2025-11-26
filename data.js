// data.js — Stores all dynamic website data (Updated Structure with NEW Profile Image Section)

const siteData = {
  heroSlides: [ // This is now the NEW top slider
    { type: "image", src: "assets/images/slide1.jpg" },
    { type: "image", src: "assets/images/slide2.jpg" },
    { type: "video", src: "assets/videos/slide1.mp4" }
  ],

  about: { // Updated structure - Only profilePhoto is used now for the NEW image section
    name: "", // Can be empty or removed if not needed elsewhere
    role: "", // Can be empty or removed if not needed elsewhere
    experienceYears: "", // Can be empty or removed if not needed elsewhere
    profilePhoto: "assets/images/your-default-profile-section-image.jpg" // Change this to your default image path
  },

  experience: [ // NEW structure: [{ startYear, endYear, company, role }, ...]
    { startYear: "2020", endYear: "2021", company: "Company A", role: "Junior Designer" },
    { startYear: "2021", endYear: "2022", company: "Company B", role: "Designer" },
    { startYear: "2022", endYear: "Present", company: "Company C", role: "Senior Designer" }
  ],

  projects: [
    {
      type: "social",
      img: "assets/images/project1.jpg",
      link: "https://behance.net/project1" // Example link
    },
    {
      type: "branding",
      img: "assets/images/project2.jpg",
      link: "https://behance.net/project2" // Example link
    },
    {
      type: "presentation",
      img: "assets/images/project3.jpg",
      link: "https://behance.net/project3" // Example link
    }
  ],

  clients: [
    "assets/images/logo1.png",
    "assets/images/logo2.png",
    "assets/images/logo3.png"
  ],

  socialLinks: {
    instagram: "https://instagram.com/yourhandle", // Example link
    linkedin: "https://linkedin.com/in/yourprofile", // Example link
    behance: "https://behance.net/yourprofile" // Example link
  }
};
