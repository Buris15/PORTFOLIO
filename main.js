document.addEventListener('DOMContentLoaded', () => {
  // --- 1. MOBILE MENU ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  let allProjects = [];

  // --- 2. FETCH DATA ---
  fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      renderPersonalInfo(data.personalInfo);
      renderSkills(data.skills);
      
      allProjects = data.projects;
      renderProjectFilters(allProjects);
      renderProjects(allProjects);
      
      renderCertifications(data.certifications);
      renderEducation(data.education);
    })
    .catch(error => console.error('Data pipeline error:', error));

  // --- 3. RENDER FUNCTIONS ---
  function renderPersonalInfo(info) {
    document.getElementById('hero-name').textContent = info.name;
    document.getElementById('hero-role').textContent = info.role;
    document.getElementById('hero-tagline').textContent = info.tagline;
    document.getElementById('hero-img').src = info.profilePic;

    const socialHtml = `
      <a href="${info.github}" target="_blank" class="social-btn">GitHub ↗</a>
      <a href="mailto:${info.email}" class="social-btn">Email ✉</a>
    `;
    document.getElementById('hero-socials').innerHTML = socialHtml;
    
    const footerSocials = document.getElementById('footer-socials');
    if (footerSocials) footerSocials.innerHTML = socialHtml;

    const footerText = document.getElementById('footer-text');
    if (footerText) footerText.innerHTML = `&copy; ${new Date().getFullYear()} ${info.name}. Built for Web Development 1.`;
  }

  function renderSkills(skillsData) {
    const container = document.getElementById('skills-container');
    skillsData.forEach(group => {
      const items = group.items.map(i => `<li>${i}</li>`).join('');
      container.innerHTML += `<article class="skill-category"><h3>${group.category}</h3><ul>${items}</ul></article>`;
    });
  }

  function renderProjectFilters(projects) {
    const filterContainer = document.getElementById('project-filters');
    if (!filterContainer) return;
    
    const uniqueTags = new Set();
    projects.forEach(p => p.tags.forEach(tag => uniqueTags.add(tag)));
    
    let filterHtml = `<button class="filter-btn active" data-filter="all">All</button>`;
    
    uniqueTags.forEach(tag => {
      filterHtml += `<button class="filter-btn" data-filter="${tag}">${tag}</button>`;
    });
    
    filterContainer.innerHTML = filterHtml;

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
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
    if (!container) return;
    container.innerHTML = ''; 
    
    projectsData.forEach(project => {
      const tags = project.tags.map(t => `<span class="tag">${t}</span>`).join('');
      container.innerHTML += `
        <article class="project-card">
          <img src="${project.image}" alt="${project.title}">
          <h3>${project.title}</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1rem;">${project.description}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">${tags}</div>
          <a href="${project.link}" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 600;">View Code &rarr;</a>
        </article>
      `;
    });
  }

  function renderCertifications(certsData) {
    const container = document.getElementById('certifications-container');
    if (!certsData || !container) return;
    
    certsData.forEach(cert => {
      container.innerHTML += `
        <div class="timeline-item">
          <strong>${cert.title}</strong>
          <span>${cert.issuer} | ${cert.date}</span>
          <p style="margin-top: 0.5rem; font-size: 0.95rem;">${cert.description}</p>
        </div>
      `;
    });
  }

  function renderEducation(educationData) {
    const container = document.getElementById('education-container');
    if (!educationData || !container) return;
    educationData.forEach(edu => {
      container.innerHTML += `
        <div class="timeline-item">
          <strong>${edu.title}</strong>
          <span>${edu.institution} | ${edu.period}</span>
          <p style="margin-top: 0.5rem; font-size: 0.95rem;">${edu.description}</p>
        </div>
      `;
    });
  }
});
