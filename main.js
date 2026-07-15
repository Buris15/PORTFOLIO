document.addEventListener('DOMContentLoaded', () => {
  // --- 1. MOBILE MENU LOGIC ---
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
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
    document.getElementById('hero-img').src = info.profilePic;
    document.getElementById('nav-github-btn').href = info.github;

    // Using text instead of actual icons for simplicity, but you can swap these for font-awesome icons <i>
    const socialHtml = `
      <a href="${info.github}" target="_blank" aria-label="GitHub">GH</a>
      <a href="mailto:${info.email}" aria-label="Email">EM</a>
    `;
    document.getElementById('hero-socials').innerHTML = socialHtml;
  }

  function renderSkills(skillsData) {
    const container = document.getElementById('skills-container');
    if (!container) return;

    skillsData.forEach(group => {
      const items = group.items.map(i => `<li>${i}</li>`).join('');
      container.innerHTML += `
        <article class="skill-category">
          <h3>${group.category}</h3>
          <ul>${items}</ul>
        </article>`;
    });
  }

  function renderProjectFilters(projects) {
    const filterContainer = document.getElementById('project-filters');
    if (!filterContainer) return;
    
    const uniqueTags = new Set();
    projects.forEach(p => p.tags.forEach(tag => uniqueTags.add(tag)));
    
    let filterHtml = `<button class="tag active" data-filter="all" style="cursor:pointer; border-color:var(--primary-color);">All</button>`;
    
    uniqueTags.forEach(tag => {
      filterHtml += `<button class="tag" data-filter="${tag}" style="cursor:pointer;">${tag}</button>`;
    });
    
    filterContainer.innerHTML = `<div style="display:flex; gap:0.5rem; margin-bottom: 1.5rem; flex-wrap:wrap;">${filterHtml}</div>`;

    const filterButtons = filterContainer.querySelectorAll('button');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.style.borderColor = 'var(--border-color)');
        e.target.style.borderColor = 'var(--primary-color)';
        
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
          <p style="color: var(--text-muted); font-size: 0.95rem;">${project.description}</p>
          <div class="project-tags">${tags}</div>
          <a href="${project.link}" target="_blank" style="color: var(--primary-color); font-weight: 600;">View Project &rarr;</a>
        </article>
      `;
    });
  }

  function renderEducation(educationData) {
    const container = document.getElementById('education-container');
    if (!educationData || !container) return;
    educationData.forEach(edu => {
      container.innerHTML += `
        <div class="timeline-item">
          <h4>${edu.title}</h4>
          <span>${edu.institution} • ${edu.period}</span>
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
          <span>${cert.issuer} • ${cert.date}</span>
          <p style="color: var(--text-muted); font-size: 0.95rem;">${cert.description}</p>
        </div>
      `;
    });
  }
});
