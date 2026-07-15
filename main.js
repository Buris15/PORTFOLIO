document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. MOBILE MENU TOGGLE SYSTEM ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Close nav drawer upon selection of specific links inside mobile viewport
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });


  // --- 2. ASYNCHRONOUS RESOURCE EXTRACTION ---
  fetch('./data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failure updating resource path: status error response');
      }
      return response.json();
    })
    .then(data => {
      // Execute operational rendering arrays sequentially
      renderPersonalInfo(data.personalInfo);
      renderSkills(data.skills);
      renderProjects(data.projects);
      renderEducation(data.education);
    })
    .catch(error => {
      console.error('Data pipeline error:', error);
    });


  // --- 3. DYNAMIC RENDERING ENGINES ---

  function renderPersonalInfo(info) {
    // Overwrite static layout items using parsed JSON properties
    document.getElementById('hero-name').textContent = info.name;
    document.getElementById('hero-role').textContent = info.role;
    document.getElementById('hero-tagline').textContent = info.tagline;
    document.querySelector('.logo').textContent = info.name;

    // Dynamically inject the runtime year alongside the data source string
    const targetYear = new Date().getFullYear();
    document.querySelector('footer p').innerHTML = `&copy; ${targetYear} ${info.name}. Built for Web Development 1.`;
  }

  function renderSkills(skillsData) {
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = ''; // Sanitize container element
    
    skillsData.forEach(skillGroup => {
      const itemsHtml = skillGroup.items.map(item => `<li>${item}</li>`).join('');
      
      const skillCard = `
        <article class="skill-category">
          <h3>${skillGroup.category}</h3>
          <ul>${itemsHtml}</ul>
        </article>
      `;
      skillsContainer.innerHTML += skillCard;
    });
  }

  function renderProjects(projectsData) {
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = ''; // Sanitize container element
    
    projectsData.forEach(project => {
      const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
      
      const projectCard = `
        <article class="project-card">
          <img src="${project.image}" alt="${project.title} screenshot preview">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tags">${tagsHtml}</div>
          <a href="${project.link}" target="_blank" rel="noopener noreferrer">View Source Code</a>
        </article>
      `;
      projectsContainer.innerHTML += projectCard;
    });
  }

  function renderEducation(educationData) {
    const educationContainer = document.getElementById('education-container');
    educationContainer.innerHTML = ''; // Sanitize container element
    
    educationData.forEach(edu => {
      const eduCard = `
        <article class="timeline-item">
          <h3>${edu.title}</h3>
          <strong>${edu.institution}</strong> | <span>${edu.period}</span>
          <p>${edu.description}</p>
        </article>
      `;
      educationContainer.innerHTML += eduCard;
    });
  }

});