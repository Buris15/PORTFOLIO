document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. DARK/LIGHT MODE THEME TOGGLE ---
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.documentElement;
  
  // Check local storage for saved theme
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light') {
    body.setAttribute('data-theme', 'light');
    themeToggle.textContent = '🌙';
  }

  themeToggle.addEventListener('click', () => {
    if (body.hasAttribute('data-theme')) {
      body.removeAttribute('data-theme');
      themeToggle.textContent = '☀️';
      localStorage.setItem('portfolio-theme', 'dark');
    } else {
      body.setAttribute('data-theme', 'light');
      themeToggle.textContent = '🌙';
      localStorage.setItem('portfolio-theme', 'light');
    }
  });

  // --- 2. MOBILE MENU ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  // Global variable to store projects for filtering
  let allProjects = [];

  // --- 3. FETCH DATA ---
  fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      renderPersonalInfo(data.personalInfo);
      renderSkills(data.skills);
      
      // Store projects globally and render filters/grid
      allProjects = data.projects;
      renderProjectFilters(allProjects);
      renderProjects(allProjects);
      
      renderCertifications(data.certifications);
      renderEducation(data.education);
    })
    .catch(error => console.error('Data pipeline error:', error));


  // --- 4. RENDER FUNCTIONS ---

  function renderPersonalInfo(info) {
    document.getElementById('hero-name').textContent = info.name;
    document.getElementById('hero-role').textContent = info.role;
    document.getElementById('hero-tagline').textContent = info.tagline;
    document.querySelector('.logo').textContent = info.name;

    // Generate Social Links
    const socialHtml = `
      <a href="${info.github}" target="_blank" class="social-btn">GitHub ↗</a>
      <a href="mailto:${info.email}" class="social-btn">Email ✉</a>
    `;
    document.getElementById('hero-socials').innerHTML = socialHtml;
    document.getElementById('footer-socials').innerHTML = socialHtml;

    document.querySelector('footer p').innerHTML = `&copy; ${new Date().getFullYear()} ${info.name}. Built for Web Development 1.`;
  }

  function renderSkills(skillsData) {
    const container = document.getElementById('skills-container');
    skillsData.forEach(group => {
      const items = group.items.map(i => `<li>${i}</li>`).join('');
      container.innerHTML += `<article class="skill-category"><h3>${group.category}</h3><ul>${items}</ul></article>`;
    });
  }

  // Generate Filter Buttons dynamically based on tags
  function renderProjectFilters(projects) {
    const filterContainer = document.getElementById('project-filters');
    
    // Extract unique tags using Set
    const uniqueTags = new Set();
    projects.forEach(p => p.tags.forEach(tag => uniqueTags.add(tag)));
    
    // Create 'All' button
    let filterHtml = `<button class="filter-btn active" data-filter="all">All</button>`;
    
    // Create tag buttons
    uniqueTags.forEach(tag => {
      filterHtml += `<button class="filter-btn" data-filter="${tag}">${tag}</button>`;
    });
    
    filterContainer.innerHTML = filterHtml;

    // Add click listeners to filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Remove active class from all, add to clicked
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter logic
        const filterValue = e.target.getAttribute('data-filter');
        if (filterValue === 'all') {
          renderProjects(allProjects);
        } else {
          const filtered = allProjects.filter(p => p.tags.includes(filterValue));
          renderProjects(filtered);
        }
      });
    });
  }

  function renderProjects(projectsData) {
    const container = document.getElementById('projects-container');
    container.innerHTML = ''; // Clear current projects
    
    projectsData.forEach(project => {
      const tags = project.tags.map(t => `<span class="tag">${t}</span>`).join('');
      container.innerHTML += `
        <article class="project-card">
          <img src="${project.image}" alt="${project.title}">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tags">${tags}</div>
          <a href="${project.link}" target="_blank">View Code</a>
        </article>
      `;
    });
  }

  function renderCertifications(certsData) {
    const container = document.getElementById('certifications-container');
    if (!certsData) return; // Failsafe if missing
    
    certsData.forEach(cert => {
      container.innerHTML += `
        <article class="timeline-item">
          <h3>${cert.title}</h3>
          <strong>${cert.issuer}</strong> | <span>${cert.date}</span>
          <p>${cert.description}</p>
        </article>
      `;
    });
  }

  function renderEducation(educationData) {
    const container = document.getElementById('education-container');
    educationData.forEach(edu => {
      container.innerHTML += `
        <article class="timeline-item">
          <h3>${edu.title}</h3>
          <strong>${edu.institution}</strong> | <span>${edu.period}</span>
          <p>${edu.description}</p>
        </article>
      `;
    });
  }
});