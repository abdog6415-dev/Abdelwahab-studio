// admin.js - Updated Version for Admin Dashboard compatible with main index.js, NEW Experience structure, NEW Client Style, NEW About Image Upload, ALL Uploads via Buttons

// Load data from LocalStorage or fallback to initial data structure
let siteData = JSON.parse(localStorage.getItem("siteData")) || {
  heroSlides: [],
  about: { name: "", role: "", experienceYears: "", profilePhoto: "assets/images/your-default-profile-section-image.jpg" }, // Keep the key name as profilePhoto for compatibility with existing script.js logic, even though it's now the section image
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


// ================== NEW HERO SLIDER (Top Section) - Upload ==================

// NEW: Add slide to the NEW top slider using File input
document.getElementById("addNewSlideFromFile").onclick = () => {
    const fileInput = document.getElementById("newHeroUpload");
    const file = fileInput.files[0]; // Get the selected file

    if (!file) {
        alert("Please select a file first.");
        return;
    }

    // Validate file type (image or video)
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        alert("Please select an image or video file (e.g., JPG, PNG, MP4, WEBM).");
        return;
    }

    // Create a temporary Blob URL for preview in the admin panel only
    const blobUrl = URL.createObjectURL(file);

    // Determine type based on file type
    const type = file.type.startsWith("image/") ? "image" : "video";

    // Update the siteData object with the Blob URL for the slider
    siteData.heroSlides.push({ type: type, src: blobUrl }); // Store the temporary blob URL
    saveData(); // Save immediately
    loadNewSlides(); // Refresh the list display
    // Optional: Clear the file input
    fileInput.value = "";
};


// Load and display the list of NEW slides (with delete option)
function loadNewSlides() {
  const list = document.getElementById("newSlideList");
  if (!list) return;
  list.innerHTML = "";

  siteData.heroSlides.forEach((slide, index) => {
    // Display type and a shortened version of the blob URL or a generic name
    const displaySrc = slide.src.startsWith("blob:") ? `Blob URL (${slide.type.toUpperCase()})` : slide.src;
    const li = document.createElement("li");
    li.innerHTML = `
      <span>[${slide.type.toUpperCase()}] ${displaySrc}</span>
      <button onclick="deleteNewSlide(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
};


// Delete a slide from the NEW top slider
function deleteNewSlide(index) {
  if (confirm("Are you sure you want to delete this slide from the top slider?")) {
    // If it was a Blob URL, revoke it to free memory
    if (siteData.heroSlides[index].src.startsWith("blob:")) {
        URL.revokeObjectURL(siteData.heroSlides[index].src);
    }
    siteData.heroSlides.splice(index, 1);
    saveData();
    loadNewSlides();
  }
};


// ================== ABOUT SECTION (NEW Profile Image Only) - Upload ==================

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
    siteData.about.profilePhoto = blobUrl; // Store the temporary blob URL in the profilePhoto field
    saveData(); // Save immediately
    loadAboutImage(); // Refresh the display list
    // Optional: Clear the file input
    fileInput.value = "";
};


// NEW: Load and display the profile image (with delete option)
function loadAboutImage() {
  const list = document.getElementById("aboutImageList");
  if (!list) return;
  list.innerHTML = "";

  // Display the current image (if it's a blob URL)
  if (siteData.about.profilePhoto && siteData.about.profilePhoto.startsWith("blob:")) {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>Profile Section Image: Blob URL</span>
      <button onclick="deleteAboutImage()">Delete</button>
    `;
    list.appendChild(li);
  }
};


// NEW: Delete the profile image (revert to default)
function deleteAboutImage() {
  if (confirm("Are you sure you want to delete the profile section image? It will revert to the default.")) {
    // Revoke the old blob URL if it exists
    if (siteData.about.profilePhoto && siteData.about.profilePhoto.startsWith("blob:")) {
        URL.revokeObjectURL(siteData.about.profilePhoto);
    }
    // Set to default
    siteData.about.profilePhoto = "assets/images/your-default-profile-section-image.jpg";
    saveData();
    loadAboutImage(); // Refresh the display list
  }
};


// Save updated about information (only the image now)
document.getElementById("saveAbout").onclick = () => {
  // Since the image is already stored in siteData.about.profilePhoto via the upload button,
  // this button just ensures it's saved in LocalStorage if needed (it's already saved by the upload button)
  // We can just show an alert or call saveData again if necessary
  saveData(); // Save changes (redundant if saved by upload, but safe)
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


// ================== PROJECTS SECTION - Upload ==================

// NEW: Add project using File input
document.getElementById("addProjectFromFile").onclick = () => {
    const fileInput = document.getElementById("projectImageFile");
    const file = fileInput.files[0]; // Get the selected file
    const link = document.getElementById("projectLink").value.trim();
    const type = document.getElementById("projectType").value;

    if (!file || !link) {
        alert("Please select an image file and provide a project link.");
        return;
    }

    // Validate file type (image)
    if (!file.type.startsWith("image/")) {
        alert("Please select an image file (e.g., JPG, PNG, GIF).");
        return;
    }

    // Validate link URL (basic check)
    try {
        new URL(link);
    } catch (e) {
        alert("Please enter a valid project link URL.");
        return;
    }

    // Create a temporary Blob URL for the image
    const blobUrl = URL.createObjectURL(file);

    // Add to data array
    siteData.projects.push({ img: blobUrl, link, type }); // Store the temporary blob URL for the image
    saveData(); // Save immediately
    loadProjects(); // Refresh the list display
    // Clear inputs after adding
    fileInput.value = "";
    document.getElementById("projectLink").value = "";
};


function loadProjects() {
  const list = document.getElementById("projectList");
  if (!list) return;
  list.innerHTML = "";

  siteData.projects.forEach((project, index) => {
    // Display type and a shortened version of the blob URL or a generic name
    const displayImg = project.img.startsWith("blob:") ? `Blob URL (${project.type.toUpperCase()})` : project.img;
    const li = document.createElement("li");
    li.innerHTML = `
      <span>[${project.type.toUpperCase()}] ${project.link} - Image: ${displayImg}</span>
      <button onclick="deleteProject(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
};


function deleteProject(index) {
  if (confirm("Are you sure you want to delete this project?")) {
    // If the image was a Blob URL, revoke it to free memory
    if (siteData.projects[index].img.startsWith("blob:")) {
        URL.revokeObjectURL(siteData.projects[index].img);
    }
    siteData.projects.splice(index, 1);
    saveData();
    loadProjects();
  }
};


// ================== CLIENTS SECTION - Upload ==================

// NEW: Add client logo using File input
document.getElementById("addClientFromFile").onclick = () => {
    const fileInput = document.getElementById("clientLogoFile");
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

    // Create a temporary Blob URL for the logo
    const blobUrl = URL.createObjectURL(file);

    // Add to data array
    siteData.clients.push(blobUrl); // Store the temporary blob URL
    saveData(); // Save immediately
    loadClients(); // Refresh the list display
    // Clear input after adding
    fileInput.value = "";
};


function loadClients() {
  const list = document.getElementById("clientList");
  if (!list) return;
  list.innerHTML = "";

  siteData.clients.forEach((logo, index) => {
    // Display a shortened version of the blob URL or a generic name
    const displayLogo = logo.startsWith("blob:") ? `Blob URL` : logo;
    const li = document.createElement("li");
    li.innerHTML = `
      <span>Logo: ${displayLogo}</span>
      <button onclick="deleteClient(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
};


function deleteClient(index) {
  if (confirm("Are you sure you want to delete this client logo?")) {
    // If the logo was a Blob URL, revoke it to free memory
    if (siteData.clients[index].startsWith("blob:")) {
        URL.revokeObjectURL(siteData.clients[index]);
    }
    siteData.clients.splice(index, 1);
    saveData();
    loadClients();
  }
};


// ================== SAVE ALL DATA BUTTON ==================

document.getElementById("saveAllData").onclick = () => {
  saveData(); // This function already shows an alert
};


// ================== INITIAL LOAD ==================

window.onload = () => {
  loadNewSlides();
  loadAboutImage(); // Load profile image display
  loadExperience(); // Load experience list
  loadProjects(); // Load project list
  loadClients(); // Load client list

  // Pre-populate fields if needed (but for file uploads, we mainly rely on the lists and blob revocation)
  // For about section, we don't pre-populate name/role/exp as they are removed from UI, just image
  // The image is handled by loadAboutImage()

  loadExperience(); // Load experience list again after initial data fetch
};
