// Form page JavaScript
let educationCount = 1;
let experienceCount = 1;
let projectCount = 1;
let certificationCount = 1;

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    
    if (!sessionId) {
        window.location.href = '/';
        return;
    }

    // Load user info
    try {
        const response = await fetch(`${config.API_URL}/api/session?session=${sessionId}`);
        const data = await response.json();
        
        if (data.user) {
            document.getElementById('user-name').textContent = data.user.name;
            document.getElementById('user-avatar').src = data.user.picture;
            
            // Pre-fill email
            document.getElementById('email').value = data.user.email;
            document.getElementById('fullName').value = data.user.name;
        } else {
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Session error:', error);
        window.location.href = '/';
    }

    // Handle form submission
    const form = document.getElementById('portfolio-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = collectFormData();
        
        try {
            // Save portfolio data
            await fetch(`${config.API_URL}/api/save-portfolio?session=${sessionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            // Redirect to CV template
            window.location.href = `/cv-template.html?session=${sessionId}`;
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save portfolio data. Please try again.');
        }
    });
});

function collectFormData() {
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        linkedin: document.getElementById('linkedin').value,
        github: document.getElementById('github').value,
        website: document.getElementById('website').value,
        summary: document.getElementById('summary').value,
        skills: document.getElementById('skills').value,
        education: [],
        experience: [],
        projects: [],
        certifications: []
    };

    // Collect education entries
    document.querySelectorAll('.education-entry').forEach((entry, index) => {
        const education = {
            degree: entry.querySelector(`[name="education[${index}][degree]"]`).value,
            institution: entry.querySelector(`[name="education[${index}][institution]"]`).value,
            startYear: entry.querySelector(`[name="education[${index}][startYear]"]`).value,
            endYear: entry.querySelector(`[name="education[${index}][endYear]"]`).value,
            description: entry.querySelector(`[name="education[${index}][description]"]`).value
        };
        if (education.degree || education.institution) {
            formData.education.push(education);
        }
    });

    // Collect experience entries
    document.querySelectorAll('.experience-entry').forEach((entry, index) => {
        const experience = {
            title: entry.querySelector(`[name="experience[${index}][title]"]`).value,
            company: entry.querySelector(`[name="experience[${index}][company]"]`).value,
            startDate: entry.querySelector(`[name="experience[${index}][startDate]"]`).value,
            endDate: entry.querySelector(`[name="experience[${index}][endDate]"]`).value,
            description: entry.querySelector(`[name="experience[${index}][description]"]`).value
        };
        if (experience.title || experience.company) {
            formData.experience.push(experience);
        }
    });

    // Collect project entries
    document.querySelectorAll('.project-entry').forEach((entry, index) => {
        const project = {
            name: entry.querySelector(`[name="projects[${index}][name]"]`).value,
            description: entry.querySelector(`[name="projects[${index}][description]"]`).value,
            technologies: entry.querySelector(`[name="projects[${index}][technologies]"]`).value,
            url: entry.querySelector(`[name="projects[${index}][url]"]`).value
        };
        if (project.name) {
            formData.projects.push(project);
        }
    });

    // Collect certification entries
    document.querySelectorAll('.certification-entry').forEach((entry, index) => {
        const certification = {
            name: entry.querySelector(`[name="certifications[${index}][name]"]`).value,
            issuer: entry.querySelector(`[name="certifications[${index}][issuer]"]`).value,
            year: entry.querySelector(`[name="certifications[${index}][year]"]`).value
        };
        if (certification.name) {
            formData.certifications.push(certification);
        }
    });

    return formData;
}

function addEducation() {
    const container = document.getElementById('education-container');
    const entry = document.createElement('div');
    entry.className = 'education-entry';
    entry.innerHTML = `
        <div class="form-group">
            <label>Degree *</label>
            <input type="text" name="education[${educationCount}][degree]" required>
        </div>
        <div class="form-group">
            <label>Institution *</label>
            <input type="text" name="education[${educationCount}][institution]" required>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Start Year</label>
                <input type="text" name="education[${educationCount}][startYear]">
            </div>
            <div class="form-group">
                <label>End Year</label>
                <input type="text" name="education[${educationCount}][endYear]">
            </div>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="education[${educationCount}][description]" rows="3"></textarea>
        </div>
    `;
    container.appendChild(entry);
    educationCount++;
}

function addExperience() {
    const container = document.getElementById('experience-container');
    const entry = document.createElement('div');
    entry.className = 'experience-entry';
    entry.innerHTML = `
        <div class="form-group">
            <label>Job Title *</label>
            <input type="text" name="experience[${experienceCount}][title]" required>
        </div>
        <div class="form-group">
            <label>Company *</label>
            <input type="text" name="experience[${experienceCount}][company]" required>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Start Date</label>
                <input type="text" name="experience[${experienceCount}][startDate]">
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="text" name="experience[${experienceCount}][endDate]" placeholder="Present">
            </div>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="experience[${experienceCount}][description]" rows="4" placeholder="Key responsibilities and achievements"></textarea>
        </div>
    `;
    container.appendChild(entry);
    experienceCount++;
}

function addProject() {
    const container = document.getElementById('projects-container');
    const entry = document.createElement('div');
    entry.className = 'project-entry';
    entry.innerHTML = `
        <div class="form-group">
            <label>Project Name</label>
            <input type="text" name="projects[${projectCount}][name]">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea name="projects[${projectCount}][description]" rows="3"></textarea>
        </div>
        <div class="form-group">
            <label>Technologies Used</label>
            <input type="text" name="projects[${projectCount}][technologies]" placeholder="React, Node.js, MongoDB">
        </div>
        <div class="form-group">
            <label>Project URL</label>
            <input type="url" name="projects[${projectCount}][url]">
        </div>
    `;
    container.appendChild(entry);
    projectCount++;
}

function addCertification() {
    const container = document.getElementById('certifications-container');
    const entry = document.createElement('div');
    entry.className = 'certification-entry';
    entry.innerHTML = `
        <div class="form-group">
            <label>Certification Name</label>
            <input type="text" name="certifications[${certificationCount}][name]">
        </div>
        <div class="form-group">
            <label>Issuing Organization</label>
            <input type="text" name="certifications[${certificationCount}][issuer]">
        </div>
        <div class="form-group">
            <label>Year Obtained</label>
            <input type="text" name="certifications[${certificationCount}][year]">
        </div>
    `;
    container.appendChild(entry);
    certificationCount++;
}
