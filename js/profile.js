/**
 * profile.js — User Profile Script with REST API Integration
 */
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const updateBtn = document.querySelector('.app-topbar .btn-accent-gradient');
  const profileForm = document.getElementById('userProfileForm');
  const uploadBtn = document.querySelector('.btn-outline-cyan');

  const profileAvatar = document.getElementById('profileAvatar');
  const profileFullName = document.getElementById('profileFullName');
  const profileFirstName = document.getElementById('profileFirstName');
  const profileLastName = document.getElementById('profileLastName');
  const profileEmail = document.getElementById('profileEmail');

  // Load profile data on page load
  async function loadProfile() {
    try {
      const data = await window.apiRequest('/accounts/me/');
      
      const username = data.username || data.email;
      const fullName = data.full_name || username;
      const email = data.email || "";

      // Derive first and last name
      const parts = fullName.trim().split(/\s+/);
      const first = parts[0] || "";
      const last = parts.slice(1).join(" ") || "";

      // Populate DOM elements
      if (profileFullName) profileFullName.textContent = fullName;
      if (profileFirstName) profileFirstName.value = first;
      if (profileLastName) profileLastName.value = last;
      if (profileEmail) profileEmail.value = email;
      
      if (profileAvatar) {
        profileAvatar.textContent = fullName.substring(0, 2).toUpperCase();
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      if (typeof window.showToast === 'function') {
        window.showToast('Failed to load user profile.', 'error', 'API Error');
      }
    }
  }

  // Bind topbar Update Profile button to form submission
  if (updateBtn && profileForm) {
    updateBtn.addEventListener('click', () => {
      profileForm.requestSubmit();
    });
  }

  // Handle Form Submission (Save Profile Changes)
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const first = profileFirstName ? profileFirstName.value.trim() : "";
      const last = profileLastName ? profileLastName.value.trim() : "";
      const email = profileEmail ? profileEmail.value.trim() : "";

      const fullName = (first + " " + last).trim();

      try {
        if (updateBtn) {
          updateBtn.disabled = true;
          updateBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Saving...`;
        }

        await window.apiRequest('/accounts/me/', {
          method: 'PUT',
          body: JSON.stringify({
            email: email,
            full_name: fullName
          })
        });

        if (typeof window.showToast === 'function') {
          window.showToast('Profile updated successfully!', 'success', 'Saved');
        }

        // Reload profile page details
        await loadProfile();

        // Trigger global sidebar updater if it exists
        if (typeof window.updateSidebarUser === 'function') {
          await window.updateSidebarUser();
        }

      } catch (error) {
        console.error('Failed to save profile:', error);
        if (typeof window.showToast === 'function') {
          window.showToast(error.message || 'Failed to update profile.', 'error', 'Error');
        } else {
          alert('Failed to update profile: ' + error.message);
        }
      } finally {
        if (updateBtn) {
          updateBtn.disabled = false;
          updateBtn.innerHTML = 'Update Profile';
        }
      }
    });
  }

  // Upload Avatar trigger
  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      if (typeof window.showToast === 'function') {
        window.showToast('Select an image file to upload your new profile avatar.', 'info', 'Avatar Upload');
      }
    });
  }

  // Run initial load
  loadProfile();
});
