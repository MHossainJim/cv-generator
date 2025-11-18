// CV template page JavaScript
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    
    if (!sessionId) {
        window.location.href = '/';
        return;
    }

    // Load portfolio data
    try {
        const response = await fetch(`${config.API_URL}/api/get-portfolio?session=${sessionId}`);
        const result = await response.json();
        
        if (result.data) {
            populateCV(result.data);
        } else {
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Load error:', error);
        window.location.href = '/';
    }

    // Download PDF button
    document.getElementById('download-pdf-btn').addEventListener('click', () => {
        window.print();
    });

    // Back button
    document.getElementById('back-btn').addEventListener('click', () => {
        window.location.href = `/form.html?session=${sessionId}`;
    });
});

function populateCV(data) {
    // Personal Information
    document.getElementById('cv-name').textContent = data.fullName || '';
    document.getElementById('cv-email').textContent = data.email || '';
    document.getElementById('cv-phone').textContent = data.phone || '';
    document.getElementById('cv-address').textContent = data.address || '';
    
    // Links
    const linkedin = document.getElementById('cv-linkedin');
    if (data.linkedin) {
        linkedin.innerHTML = `<a href="${data.linkedin}" target="_blank">LinkedIn</a>`;
    }
    
    const github = document.getElementById('cv-github');
    if (data.github) {
        github.innerHTML = `<a href="${data.github}" target="_blank">GitHub</a>`;
    }
    
    const website = document.getElementById('cv-website');
    if (data.website) {
        website.innerHTML = `<a href="${data.website}" target="_blank">Website</a>`;
    }

    // Professional Summary
    document.getElementById('cv-summary').textContent = data.summary || '';

    // Skills
    const skillsContainer = document.getElementById('cv-skills');
    if (data.skills) {
        const skills = data.skills.split(',').map(s => s.trim()).filter(s => s);
        skillsContainer.innerHTML = skills.map(skill => 
            `<span class="skill-tag">${skill}</span>`
        ).join('');
    }

    // Work Experience
    const experienceContainer = document.getElementById('cv-experience');
    if (data.experience && data.experience.length > 0) {
        experienceContainer.innerHTML = data.experience.map(exp => `
            <div class="experience-item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${exp.title}</div>
                        <div class="item-subtitle">${exp.company}</div>
                    </div>
                    <div class="item-date">${exp.startDate} - ${exp.endDate || 'Present'}</div>
                </div>
                ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
            </div>
        `).join('');
    } else {
        document.getElementById('experience-section').style.display = 'none';
    }

    // Education
    const educationContainer = document.getElementById('cv-education');
    if (data.education && data.education.length > 0) {
        educationContainer.innerHTML = data.education.map(edu => `
            <div class="education-item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${edu.degree}</div>
                        <div class="item-subtitle">${edu.institution}</div>
                    </div>
                    <div class="item-date">${edu.startYear} - ${edu.endYear || 'Present'}</div>
                </div>
                ${edu.description ? `<div class="item-description">${edu.description}</div>` : ''}
            </div>
        `).join('');
    } else {
        document.getElementById('education-section').style.display = 'none';
    }

    // Projects
    const projectsContainer = document.getElementById('cv-projects');
    if (data.projects && data.projects.length > 0) {
        projectsContainer.innerHTML = data.projects.map(proj => `
            <div class="project-item">
                <div class="item-title">${proj.name}</div>
                ${proj.technologies ? `<div class="item-subtitle">Technologies: ${proj.technologies}</div>` : ''}
                ${proj.description ? `<div class="item-description">${proj.description}</div>` : ''}
                ${proj.url ? `<div class="item-description"><a href="${proj.url}" target="_blank">${proj.url}</a></div>` : ''}
            </div>
        `).join('');
    } else {
        document.getElementById('projects-section').style.display = 'none';
    }

    // Certifications
    const certificationsContainer = document.getElementById('cv-certifications');
    if (data.certifications && data.certifications.length > 0) {
        certificationsContainer.innerHTML = data.certifications.map(cert => `
            <div class="certification-item">
                <div class="item-title">${cert.name}</div>
                <div class="item-subtitle">${cert.issuer}</div>
                ${cert.year ? `<div class="item-date">${cert.year}</div>` : ''}
            </div>
        `).join('');
    } else {
        document.getElementById('certifications-section').style.display = 'none';
    }
}
