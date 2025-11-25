// script.js - Updated Version to use data.js and LocalStorage for NEW structure and NEW Experience format, Updated Clients Style, NEW Work Experience Grid Layout

// Function to get data prioritizing LocalStorage, then falling back to data.js
function getData() {
  // Check if there's updated data in LocalStorage
  const savedData = localStorage.getItem("siteData");
  if (savedData) {
    console.log("Loading data from LocalStorage"); // Debug log
    return JSON.parse(savedData);
  } else {
    // Fallback to data.js if LocalStorage is empty
    // We need to ensure siteData from data.js is available here
    // If data.js is loaded before script.js, siteData should be global
    if (typeof siteData !== 'undefined') {
      console.log("Loading data from data.js"); // Debug log
      return siteData;
    } else {
      console.error("data.js not loaded or siteData not defined.");
      // Return an empty structure to prevent errors
      return {
        heroSlides: [],
        about: { name: "", role: "", experienceYears: "", profilePhoto: "" },
        experience: [], // Updated structure: [{ startYear, endYear, company, role }, ...]
        projects: [],
        clients: [],
        socialLinks: { instagram: "#", linkedin: "#", behance: "#" }
      };
    }
  }
}


// ================= HERO SLIDER (Updated for NEW structure - Top Slider) =================
let slideIndex = 0;
let slides = []; // Will be populated after loading data

function showSlides() {
  // This function now operates on the 'slides' array populated from data
  if (slides.length === 0) {
      console.log("No slides found in data, hiding slider or showing fallback.");
      // Optionally hide the slider container or show a default image/text
      // document.querySelector('.new-hero').style.background = 'var(--dark)'; // Fallback background
      return; // Do nothing if no slides
  }

  // Hide all slides
  const slideElements = document.querySelectorAll('.new-hero .slide'); // Select slides within .new-hero
  slideElements.forEach((s) => (s.style.display = 'none'));

  // Increment index and loop back if needed
  slideIndex++;
  if (slideIndex > slides.length) slideIndex = 1;

  // Show the current slide
  if (slideElements[slideIndex - 1]) {
    slideElements[slideIndex - 1].style.display = 'block';
  }

  // Set timeout for next slide
  setTimeout(showSlides, 4000);
}

// ================= ABOUT SECTION & NEW WORK EXPERIENCE SECTION =================
// Function to populate the About section
function loadAboutSection() {
  const data = getData();
  const aboutSection = document.getElementById('about');

  if (!aboutSection) return;

  // Populate left side with data
  const nameElement = aboutSection.querySelector('.name');
  const roleElement = aboutSection.querySelector('.role');
  const experienceElement = aboutSection.querySelector('.experience-years');
  const profileImageElement = aboutSection.querySelector('.profile-photo');

  if (nameElement) nameElement.textContent = data.about.name || "Your Name";
  if (roleElement) roleElement.textContent = data.about.role || "Graphic Designer";
  if (experienceElement) experienceElement.textContent = data.about.experienceYears || "X Years Experience";
  if (profileImageElement) profileImageElement.src = data.about.profilePhoto || "assets/images/profile.jpg"; // Ensure a default image path if needed
}

// NEW: Function to populate the NEW Work Experience section
function loadWorkExperienceSection() {
  const data = getData();
  const gridContainer = document.getElementById('workExperienceGrid');

  if (!gridContainer) return;

  // Clear existing items
  gridContainer.innerHTML = '';

  // NEW LOGIC: Sort experience by startYear in descending order (newest first)
  const sortedExperience = [...data.experience]; // Create a copy to avoid mutating original data
  sortedExperience.sort((a, b) => {
    // Handle "Present" as the highest value
    const yearA = a.startYear === "Present" ? Infinity : parseInt(a.startYear, 10);
    const yearB = b.startYear === "Present" ? Infinity : parseInt(b.startYear, 10);
    return yearB - yearA; // Sort descending (newest first)
  });

  // Add experience items to the grid
  sortedExperience.forEach(exp => {
    const expItem = document.createElement('div');
    expItem.className = 'exp-item'; // Assign class for styling

    // Create the content structure for the item
    expItem.innerHTML = `
      <span class="company-name">${exp.company}</span>
      <span class="date-role">${exp.startYear} - ${exp.endYear}, ${exp.role}</span>
    `;
    gridContainer.appendChild(expItem);
  });
}


// NEW: Event listeners for the NEW Work Experience section
document.addEventListener('DOMContentLoaded', () => {
  const openExperienceBtn = document.getElementById('openExperience');
  const closeExperienceBtn = document.getElementById('closeExperience');
  const workExperienceSection = document.getElementById('workExperienceSection');

  if (openExperienceBtn && closeExperienceBtn && workExperienceSection) {
     openExperienceBtn.addEventListener('click', () => {
       workExperienceSection.style.display = 'block'; // Show the section
       loadWorkExperienceSection(); // Load the experience data when opened
     });

     closeExperienceBtn.addEventListener('click', () => {
       workExperienceSection.style.display = 'none'; // Hide the section
     });
  }
});


// ================= PROJECT FILTER (Updated for NEW structure) =================
// Function to populate the Projects section
function loadProjectsSection() {
  const data = getData();
  const projectsContainer = document.getElementById('projects');

  if (!projectsContainer) return;

  // Clear existing project items
  projectsContainer.innerHTML = '';

  // Add project items from data.projects
  data.projects.forEach(proj => {
    const projectItem = document.createElement('div');
    projectItem.className = `project-item ${proj.type}`; // Assign filter class dynamically

    projectItem.innerHTML = `
      <img src="${proj.img}" alt="Project Image">
      <div class="hover-layer">
        <a href="${proj.link}" target="_blank" class="view-btn">View Full Project</a>
      </div>
    `;
    projectsContainer.appendChild(projectItem);
  });

  // Re-initialize filter event listeners after adding new projects
  initProjectFilter();
}

// Initialize project filter logic (moved to a separate function)
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.project-nav button');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      projectItems.forEach((item) => {
        if (item.classList.contains(filter) || filter === 'all') {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}


// ================= CLIENTS SECTION (Updated for NEW structure and NEW Style) =================
// Function to populate the Clients section (Updated for Grid and Larger Images)
function loadClientsSection() {
  const data = getData();
  const clientsContainer = document.querySelector('.client-logos');

  if (!clientsContainer) return;

  // Clear existing logos
  clientsContainer.innerHTML = '';

  // Add logo images from data.clients using the NEW grid structure and larger images
  data.clients.forEach(logoSrc => {
    const img = document.createElement('img');
    img.src = logoSrc;
    img.alt = "Client Logo"; // Consider adding alt text if available in data structure
    // No need to set height/width via JS as CSS handles it now
    clientsContainer.appendChild(img);
  });
}


// ================= FOOTER (Updated for NEW structure) =================
// Function to populate the Social Links in the footer
function loadSocialLinks() {
  const data = getData();
  const socialLinksContainer = document.querySelector('.social-links');

  if (!socialLinksContainer) return;

  // Clear existing links
  socialLinksContainer.innerHTML = '';

  // Add links from data.socialLinks (only if they are not empty strings or "#")
  const socialPlatforms = ['instagram', 'linkedin', 'behance'];
  socialPlatforms.forEach(platform => {
    const linkUrl = data.socialLinks[platform];
    if (linkUrl && linkUrl !== "#" && linkUrl.trim() !== "") {
      const a = document.createElement('a');
      a.href = linkUrl;
      a.target = "_blank"; // Open in new tab
      a.textContent = platform.charAt(0).toUpperCase() + platform.slice(1); // Capitalize first letter
      socialLinksContainer.appendChild(a);
    }
  });
}


// ================= INITIALIZATION (Updated for NEW structure) =================
// Function to initialize the page after loading data
function initPage() {
  loadAboutSection();
  // loadExperienceSection(); // Remove the old function call
  loadProjectsSection();
  loadClientsSection(); // Load the updated client style
  loadSocialLinks();

  // After populating the NEW hero slides dynamically, we need to get the new slides list
  // For the slider to work, we need to select the slides *after* they are added to the DOM
  // Let's create the slides container content based on data for the NEW hero
  const slidesContainer = document.getElementById('heroSlides');
  if (slidesContainer) {
    slidesContainer.innerHTML = ''; // Clear default static slides if any
    const data = getData();
    data.heroSlides.forEach(slideData => {
      const slideDiv = document.createElement('div');
      slideDiv.className = 'slide';

      if (slideData.type === 'image') {
        const img = document.createElement('img');
        img.src = slideData.src;
        img.alt = "Hero Slide";
        slideDiv.appendChild(img);
      } else if (slideData.type === 'video') {
        const video = document.createElement('video');
        video.src = slideData.src;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        slideDiv.appendChild(video);
      }
      slidesContainer.appendChild(slideDiv);
    });

    // Now that slides are added to the NEW hero, re-select them for the NEW slider function
    slides = document.querySelectorAll('.new-hero .slide'); // Select from the NEW hero section
    // Start the NEW slider
    if (slides.length > 0) {
        console.log("Starting NEW slider with", slides.length, "slides."); // Debug log
        showSlides(); // Start the auto-slider for the NEW hero
    } else {
        console.log("No slides found in NEW slider data after populating DOM.");
        // Optionally hide the slider container or show a default image/text
        // document.querySelector('.new-hero').style.background = 'var(--dark)'; // Fallback background
    }
  }

  // Initialize project filters after projects are loaded
  initProjectFilter();
}

// Run initialization when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initPage);
// Also run it on window load as a backup, though DOMContentLoaded is usually sufficient
// window.onload = initPage; // Can remove this if DOMContentLoaded works reliably