// admin.js - Updated Version for Admin Dashboard compatible with NEW Profile Image Section

// Load data from LocalStorage or fallback to initial data structure
let siteData = JSON.parse(localStorage.getItem("siteData")) || {
  heroSlides: [],
  about: { name: "", role: "", experienceYears: "", profilePhoto: "assets/images/profile.jpg" }, // Keep the key name as profilePhoto for compatibility with existing script.js logic, even though it's now the section image
  experience: [], // Updated structure: [{ startYear, endYear, company, role }, ...]
  projects: [],
  clients: [],
  socialLinks: { instagram: "#", linkedin: "#", behance: "#" }
};


// Save the entire siteData object to LocalStorage
function saveData() {
  localStorage.setItem("siteData", JSON.stringify(siteData));
  console.log("Data saved to LocalStorage!");
  alert("All data saved successfully!");
}


// ================== NEW HERO SLIDER (Top Section) ==================

// Add slide to the NEW top slider using URL input
document.getElementById("addNewSlideBtn").onclick = () => {
  const url = prompt("Enter the full URL of the Image or Video file (e.g., assets/images/slide.jpg or assets/videos/slide.mp4):", "");
  if (!url) return;

  // Determine type based on file extension (simple check)
  let type = "image"; // default
  if (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm') || url.toLowerCase().endsWith('.ogg')) {
    type = "video";
  } else if (url.toLowerCase().endsWith('.jpg') || url.toLowerCase().endsWith('.jpeg') || url.toLowerCase().endsWith('.png') || url.toLowerCase().endsWith('.gif')) {
    type = "image";
  } else {
    // If extension is not clear, ask user
    type = prompt("Is this an 'image' or 'video'? (Enter 'image' or 'video')", "image").toLowerCase();
    if (type !== 'image' && type !== 'video') {
        alert("Invalid type. Please enter 'image' or 'video'.");
        return;
    }
  }

  // Validate URL format (basic check)
  try {
    new URL(url);
  } catch (e) {
    alert("Please enter a valid URL.");
    return;
  }

  siteData.heroSlides.push({ type: type, src: url });
  saveData(); // Save immediately
  loadNewSlides(); // Refresh the list display
};


// Load and display the list of NEW slides
function loadNewSlides() {
  const list = document.getElementById("newSlideList");
  if (!list) return;
  list.innerHTML = "";

  siteData.heroSlides.forEach((slide, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>[${slide.type.toUpperCase()}] ${slide.src}</span>
      <button onclick="deleteNewSlide(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
};


// Delete a slide from the NEW top slider
function deleteNewSlide(index) {
  if (confirm("Are you sure you want to delete this slide from the top slider?")) {
    siteData.heroSlides.splice(index, 1);
    saveData();
    loadNewSlides();
  }
};


// ================== ABOUT SECTION (NEW Profile Image Only) ==================

// NEW: Add profile section image using File input
document.getElementById("addAboutImageFromFile").onclick = () => {
    const fileInput = document.getElementById("aboutProfileImageFile");
    const file = fileInput.files[0]; // Get the selected file

    if (!file) {
        alert("Please select a file first.");
        return;
    }

    // Validate file type (image)
    if (!file.type.startsWith("image/")) {
        alert("Please select an image file (e.g., JPG, PNG, GIF).");
        return;
    }

    // Create a temporary Blob URL for preview in the admin panel only
    const blobUrl = URL.createObjectURL(file);

    // Update the siteData object with the Blob URL for the profile section image
    // Note: This Blob URL is temporary and only valid in this browser session
    // For persistent storage, you'd typically upload the file to a server and store the server URL
    siteData.about.profilePhoto = blobUrl; // Store the temporary blob URL in the profilePhoto field
    // Optional: Clear the URL input field as it's now overridden by the file input
    document.getElementById("aboutProfilePhoto").value = "";

    // Optional: Show a message or update the UI to reflect the file is selected
    console.log("Profile section image selected and stored as Blob URL:", blobUrl);
};


// Save updated about information (only the image now)
document.getElementById("saveAbout").onclick = () => {
  // Get the value from the URL input field, which might be empty if a file was just selected
  const profilePhotoUrl = document.getElementById("aboutProfilePhoto").value.trim();

  // If the URL field is empty, rely on the Blob URL stored in siteData.about.profilePhoto (if any)
  // If both are empty, use the default
  let finalProfilePhoto = profilePhotoUrl;
  if (!finalProfilePhoto && siteData.about.profilePhoto && siteData.about.profilePhoto.startsWith("blob:")) {
      // If URL field is empty and current siteData.about.profilePhoto is a blob URL (from file upload), keep it
      finalProfilePhoto = siteData.about.profilePhoto;
  } else if (!finalProfilePhoto) {
      // If both are empty, set to default
      finalProfilePhoto = "assets/images/profile.jpg"; // Change this to your default profile *section* image path
  }

  // Validate profile photo URL (basic check) only if it's not a Blob URL
  if (finalProfilePhoto && !finalProfilePhoto.startsWith("blob:") && finalProfilePhoto !== "assets/images/profile.jpg") { // Skip validation if default or blob
      try {
        new URL(finalProfilePhoto);
      } catch (e) {
        alert("Please enter a valid Profile Section Image URL.");
        return;
      }
  }

  // Update ONLY the profilePhoto in siteData.about, keep other fields as they are (or empty)
  // If you want to completely remove name, role, experienceYears from siteData.about, you can set them to empty strings here
  siteData.about = { ...siteData.about, profilePhoto: finalProfilePhoto }; // Update the object, keeping other fields
  // OR: siteData.about = { name: "", role: "", experienceYears: "", profilePhoto: finalProfilePhoto }; // To reset other fields

  saveData(); // Save changes
  alert("Profile section image updated and saved!");
};


// ================== EXPERIENCE SECTION (Updated) ==================

document.getElementById("addExp").onclick = () => {
  const startYear = document.getElementById("expStartYear").value.trim();
  const endYear = document.getElementById("expEndYear").value.trim();
  const company = document.getElementById("expCompany").value.trim();
  const role = document.getElementById("expRole").value.trim();

  if (!startYear || !endYear || !company || !role) {
    alert("Please fill in all fields: Start Year, End Year, Company, and Your Role.");
    return;
  }

  // Validate year format (simple check)
  if (!/^\d{4}$/.test(startYear) && startYear !== "Present") {
      alert("Please enter a valid Start Year (e.g., 2020) or 'Present'.");
      return;
  }
  if (!/^\d{4}$/.test(endYear) && endYear !== "Present") {
      alert("Please enter a valid End Year (e.g., 2022) or 'Present'.");
      return;
  }

  siteData.experience.push({ startYear, endYear, company, role }); // Push the new object structure
  saveData(); // Save immediately
  loadExperience(); // Refresh the list display
  // Clear inputs after adding
  document.getElementById("expStartYear").value = "";
  document.getElementById("expEndYear").value = "";
  document.getElementById("expCompany").value = "";
  document.getElementById("expRole").value = "";
};


function loadExperience() {
  const list = document.getElementById("expList");
  if (!list) return;
  list.innerHTML = "";

  siteData.experience.forEach((exp, index) => {
    const li = document.createElement("li");
    // Display all experience details in the admin list
    li.innerHTML = `
      <span>${exp.startYear} - ${exp.endYear}, ${exp.company}, ${exp.role}</span>
      <button onclick="deleteExperience(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
};


function deleteExperience(index) {
  if (confirm("Are you sure you want to delete this experience entry?")) {
    siteData.experience.splice(index, 1);
    saveData();
    loadExperience();
  }
};


// ================== PROJECTS SECTION ==================

document.getElementById("addProject").onclick = () => {
  const imgSrc = document.getElementById("projectImage").value.trim();
  const link = document.getElementById("projectLink").value.trim();
  const type = document.getElementById("projectType").value;

  if (!imgSrc || !link) {
    alert("Please provide both the Image URL and the Project Link.");
    return;
  }

  // Validate URLs (basic check)
  try {
    new URL(imgSrc);
    new URL(link);
  } catch (e) {
    alert("Please enter valid URLs for both Image and Link.");
    return;
  }

  siteData.projects.push({ img: imgSrc, link, type });
  saveData();
  loadProjects();
};


function loadProjects() {
  const list = document.getElementById("projectList");
  if (!list) return;
  list.innerHTML = "";

  siteData.projects.forEach((project, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>[${project.type.toUpperCase()}] ${project.link}</span>
      <button onclick="deleteProject(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
};


function deleteProject(index) {
  if (confirm("Are you sure you want to delete this project?")) {
    siteData.projects.splice(index, 1);
    saveData();
    loadProjects();
  }
};


// ================== CLIENTS SECTION (Updated WITHOUT File Upload) ==================

// Add client logo using URL input (ONLY URL now)
document.getElementById("addClientFromUrl").onclick = () => {
  const logoSrc = document.getElementById("clientLogoUrl").value.trim(); // Use the URL input field
  if (!logoSrc) {
    alert("Please provide a client logo URL.");
    return;
  }

  // Validate URL (basic check)
  try {
    new URL(logoSrc);
  } catch (e) {
    alert("Please enter a valid logo URL.");
    return;
  }

  siteData.clients.push(logoSrc); // Store the URL
  saveData();
  loadClients();
};


function loadClients() {
  const list = document.getElementById("clientList");
  if (!list) return;
  list.innerHTML = "";

  siteData.clients.forEach((logo, index) => {
    const li = document.createElement("li");
    // Display the logo URL in the admin list
    li.innerHTML = `
      <span>Logo URL: ${logo}</span>
      <button onclick="deleteClient(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
};


function deleteClient(index) {
  if (confirm("Are you sure you want to delete this client logo?")) {
    siteData.clients.splice(index, 1);
    saveData();
    loadClients();
  }
};


// ================== INITIAL LOAD ==================

window.onload = () => {
  loadNewSlides();
  loadExperience(); // Load experience list
  loadProjects();
  loadClients(); // Load client list

  if (siteData.about) {
    // Don't pre-populate name, role, experience fields as they are removed from the UI
    // Only pre-populate the image URL field if it's not a Blob URL
    if (siteData.about.profilePhoto && !siteData.about.profilePhoto.startsWith("blob:")) {
        document.getElementById("aboutProfilePhoto").value = siteData.about.profilePhoto;
    } else {
        // If it's a blob URL, leave the URL field empty or show a message
        document.getElementById("aboutProfilePhoto").value = "";
        console.log("Current profile photo is a Blob URL from a previous file upload.");
    }
  }

  loadExperience(); // Load experience list again after initial data fetch
};