document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('active'));
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('active'));
    });
  }

  let allProjects = [];

  fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      renderPersonalInfo(data.personalInfo);
      renderSkills(data.skills);
      
      allProjects = data.projects;
      renderProjectFilters(allProjects);
      renderProjects(allProjects);
      
      // Render the new creative works
      renderGallery(data.graphics, 'graphics-container');
      renderGallery(data.edits, 'edits-container');
      renderGallery(data.pictures, 'pictures-container');
      
      renderEducation(data.education);
      renderCertifications(data.certifications);
    })
    .catch(error => console.error('Data pipeline error:', error));

  function renderPersonalInfo(info) {
    document.getElementById('hero-name').textContent = info.name;
    document.getElementById('hero-img').src = info.profilePic;
    document.getElementById('nav-github-btn').href = info.github;
    document.getElementById('about-text').textContent = info.tagline;

    const highlightedRole = info.role.replace('IT', '<span style="color: var(--primary-btn);">IT</span>');
    document.getElementById('hero-role').innerHTML = highlightedRole;

    const socialHtml = `
      <a href="${info.github}" target="_blank" aria-label="GitHub" class="social-link">
        <i class="fa-brands fa-github"></i> GitHub
      </a>
      <a href="mailto:${info.email}" aria-label="Email" class="social-link">
        <i class="fa-solid fa-envelope"></i> Email
      </a>
    `;
    document.getElementById('hero-socials').innerHTML = socialHtml;
  }

  function renderSkills(skillsData) {
    const container = document.getElementById('skills-container');
    if (!container) return;
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
    
    let filterHtml = `<button class="tag active" data-filter="all" style="cursor:pointer; background: var(--primary-btn); color: white; border-color: var(--primary-btn);">All</button>`;
    uniqueTags.forEach(tag => {
      filterHtml += `<button class="tag" data-filter="${tag}" style="cursor:pointer;">${tag}</button>`;
    });
    
    filterContainer.innerHTML = `<div style="display:flex; gap:0.5rem; margin-bottom: 1.5rem; flex-wrap:wrap;">${filterHtml}</div>`;

    const filterButtons = filterContainer.querySelectorAll('button');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => {
          b.style.background = 'var(--bg-color)';
          b.style.color = 'var(--text-muted)';
          b.style.borderColor = 'var(--border-color)';
        });
        e.target.style.background = 'var(--primary-btn)';
        e.target.style.color = 'white';
        e.target.style.borderColor = 'var(--primary-btn)';
        
        const filterValue = e.target.getAttribute('data-filter');
        const filtered = filterValue === 'all' ? allProjects : allProjects.filter(p => p.tags.includes(filterValue));
        renderProjects(filtered);
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
          <p style="color: var(--text-muted); font-size: 0.95rem;">${project.description}</p>
          <div class="project-tags">${tags}</div>
          <a href="${project.link}" target="_blank" style="color: var(--primary-btn); font-weight: 600; font-size: 0.9rem;">View Project &rarr;</a>
        </article>
      `;
    });
  }

  // NEW FUNCTION: Renders images for Graphics, Edits, and Pictures
  // NEW FUNCTION: Renders images for Graphics, Edits, and Pictures (No Titles)
  function renderGallery(items, containerId) {
    const container = document.getElementById(containerId);
    if (!items || !container) return;
    
    let html = '';
    items.forEach((item, index) => {
      html += `
        <div class="gallery-item">
          <img src="${item.image}" alt="Creative Work ${index + 1}" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
        </div>
      `;
    });
    container.innerHTML = html;
  }

  function renderEducation(educationData) {
    const container = document.getElementById('education-container');
    if (!educationData || !container) return;
    educationData.forEach(edu => {
      container.innerHTML += `
        <div class="timeline-item">
          <h4>${edu.title}</h4>
          <span>${edu.institution} | ${edu.period}</span>
          <p style="color: var(--text-muted); font-size: 0.95rem;">${edu.description}</p>
        </div>
      `;
    });
  }

  function renderCertifications(certsData) {
    const container = document.getElementById('certifications-container');
    if (!certsData || !container) return;
    certsData.forEach(cert => {
      container.innerHTML += `
        <div class="timeline-item">
          <h4>${cert.title}</h4>
          <span>${cert.issuer} | ${cert.date}</span>
          <p style="color: var(--text-muted); font-size: 0.95rem;">${cert.description}</p>
        </div>
      `;
    });
  }
});
