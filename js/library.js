/**
 * library.js — Prompt Library Filtering, Dynamic Loading, and API CRUD Integration
 */

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const filterPills = document.querySelectorAll('#libraryFilterPills button');
  const searchInput = document.getElementById('librarySearchInput');
  const gridContainer = document.getElementById('libraryCardsGrid');

  // Load prompts from DB
  async function loadPrompts() {
    try {
      const data = await window.apiRequest('/prompts/');
      
      // If the database is empty, let's show a helpful placeholder
      if (data.length === 0) {
        gridContainer.innerHTML = `
          <div class="col-12 text-center py-5">
            <i class="bi bi-journal-code text-secondary-body fs-1 mb-3 d-block"></i>
            <h4 class="text-white">Your Prompt Library is Empty</h4>
            <p class="text-body-contrast fs-7 mb-4">Launch Prompt Studio to create and commit your first production AI prompt template.</p>
            <a href="studio.html" class="btn btn-glow-primary rounded-pill px-4 py-2 font-mono fs-7 fw-semibold">Launch Prompt Studio</a>
          </div>
        `;
        return;
      }

      gridContainer.innerHTML = data.map(prompt => {
        // Map backend category choices to filter options (coding -> code, marketing -> marketing, etc.)
        const categoryMap = {
          'coding': 'code',
          'marketing': 'marketing',
          'business': 'support',
          'design': 'other',
          'education': 'other',
          'productivity': 'rag',
          'other': 'other'
        };
        const mappedCat = categoryMap[prompt.category] || 'other';

        const formattedDate = new Date(prompt.created_at).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric'
        });

        return `
          <div class="col-md-6 col-lg-4 library-card-item" data-category="${mappedCat}" data-id="${prompt.id}">
            <div class="library-card p-4 rounded-4 border border-subtle glass-card h-100 d-flex flex-column justify-content-between">
              <div>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="badge bg-purple-subtle text-purple font-mono fs-8 fw-bold">${(prompt.category || 'other').toUpperCase()}</span>
                  <span class="font-mono text-secondary-body fs-8 fw-medium">v1.0 • ${formattedDate}</span>
                </div>
                <h3 class="fw-bold fs-6 text-light mb-2 prompt-title-text">${prompt.title}</h3>
                <p class="text-body-contrast fs-7 mb-4 line-clamp-3">${prompt.description || 'No description provided.'}</p>
                <div class="font-mono fs-8 text-secondary-body bg-dark-soft p-2.5 rounded-3 mb-4 text-break prompt-content-text" style="white-space: pre-wrap;">${prompt.content}</div>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-cyan btn-sm flex-grow-1 font-mono fs-8 btn-edit-prompt" data-id="${prompt.id}"><i class="bi bi-pencil me-1"></i> Edit</button>
                <button class="btn btn-outline-danger btn-sm flex-grow-1 font-mono fs-8 btn-delete-prompt" data-id="${prompt.id}"><i class="bi bi-trash me-1"></i> Delete</button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Add event listeners for edit and delete buttons
      gridContainer.querySelectorAll('.btn-edit-prompt').forEach(btn => {
        btn.addEventListener('click', () => handleEditPrompt(btn.getAttribute('data-id')));
      });

      gridContainer.querySelectorAll('.btn-delete-prompt').forEach(btn => {
        btn.addEventListener('click', () => handleDeletePrompt(btn.getAttribute('data-id')));
      });

      // Trigger filtering
      filterCards();

    } catch (error) {
      console.error('Failed to load prompts:', error);
      if (typeof window.showToast === 'function') {
        window.showToast('Failed to retrieve prompt templates.', 'error', 'API Error');
      }
    }
  }

  // Unified Filter & Search Logic
  function filterCards() {
    const activeCategory = document.querySelector('#libraryFilterPills button.active')?.getAttribute('data-category') || 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const cardItems = gridContainer.querySelectorAll('.library-card-item');

    cardItems.forEach(card => {
      const cat = card.getAttribute('data-category');
      const text = card.textContent.toLowerCase();

      const matchesCat = (activeCategory === 'all' || cat === activeCategory);
      const matchesSearch = (!query || text.includes(query));

      if (matchesCat && matchesSearch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Edit prompt dialog using safe prompting
  async function handleEditPrompt(promptId) {
    const titleEl = gridContainer.querySelector(`.library-card-item[data-id="${promptId}"] .prompt-title-text`);
    const contentEl = gridContainer.querySelector(`.library-card-item[data-id="${promptId}"] .prompt-content-text`);

    const currentTitle = titleEl ? titleEl.textContent : "";
    const currentContent = contentEl ? contentEl.textContent : "";

    const newTitle = window.prompt("Enter new prompt title:", currentTitle);
    if (newTitle === null) return;
    
    const newContent = window.prompt("Enter new prompt content:", currentContent);
    if (newContent === null) return;

    try {
      await window.apiRequest(`/prompts/${promptId}/`, {
        method: "PUT",
        body: JSON.stringify({
          title: newTitle || "Untitled Prompt",
          content: newContent,
          category: "other"
        })
      });

      if (typeof window.showToast === 'function') {
        window.showToast('Prompt template updated successfully.', 'success', 'Saved');
      }
      loadPrompts();
    } catch (error) {
      console.error('Edit error:', error);
      if (typeof window.showToast === 'function') {
        window.showToast('Failed to update prompt template.', 'error', 'Error');
      } else {
        alert("Failed to edit prompt: " + error.message);
      }
    }
  }

  // Delete prompt confirmation
  async function handleDeletePrompt(promptId) {
    if (!confirm("Are you sure you want to permanently delete this prompt template from your workspace?")) return;

    try {
      await window.apiRequest(`/prompts/${promptId}/`, {
        method: "DELETE"
      });

      if (typeof window.showToast === 'function') {
        window.showToast('Prompt template deleted.', 'warning', 'Deleted');
      }
      loadPrompts();
    } catch (error) {
      console.error('Delete error:', error);
      if (typeof window.showToast === 'function') {
        window.showToast('Failed to delete prompt template.', 'error', 'Error');
      } else {
        alert("Failed to delete prompt: " + error.message);
      }
    }
  }

  // Filter Pills Event Binding
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }

  // Load prompts initial run
  loadPrompts();
});
