// Element Selectors
const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const notesList = document.querySelector('#notes-list');
const searchInput = document.querySelector('#search-input');
const noteCount = document.querySelector('#note-count');
const errorMessage = document.querySelector('#error-message');
const clearAllBtn = document.querySelector('#clear-all-btn');

// State: Array of notes loaded from localStorage
let notes = JSON.parse(localStorage.getItem('quicknotes_data')) || [];

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem('quicknotes_data', JSON.stringify(notes));
}

// Update note count message
function updateCount(count) {
  if (count === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (count === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${count} notes.`;
  }
}

// Render notes to DOM
function render() {
  notesList.textContent = ''; // Clear list safe from innerHTML risks
  const searchTerm = searchInput.value.toLowerCase().trim();

  // Filter notes based on search input
  const filteredNotes = notes.filter(note => 
    note.text.toLowerCase().includes(searchTerm)
  );

  updateCount(notes.length);

  if (filteredNotes.length === 0 && searchTerm !== '') {
    const emptyLi = document.createElement('li');
    emptyLi.className = 'empty-search';
    emptyLi.textContent = 'No notes match your search.';
    notesList.appendChild(emptyLi);
    return;
  }

  filteredNotes.forEach(note => {
    // Note Card container
    const li = document.createElement('li');
    li.className = `note-card category-${note.category.toLowerCase()}`;

    // Note content section
    const contentDiv = document.createElement('div');
    contentDiv.className = 'note-content';

    const textP = document.createElement('p');
    textP.className = 'note-text';
    textP.textContent = note.text; // Explicitly using textContent for security

    const metaDiv = document.createElement('div');
    metaDiv.className = 'note-meta';

    const badgeSpan = document.createElement('span');
    badgeSpan.className = `badge badge-${note.category.toLowerCase()}`;
    badgeSpan.textContent = note.category;

    const dateSpan = document.createElement('span');
    dateSpan.textContent = note.createdAt;

    metaDiv.appendChild(badgeSpan);
    metaDiv.appendChild(dateSpan);
    contentDiv.appendChild(textP);
    contentDiv.appendChild(metaDiv);

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteNote(note.id));

    // Append all elements
    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);
    notesList.appendChild(li);
  });
}

// Add Note Handler
noteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = noteInput.value.trim();

  // Validation
  if (text === '') {
    errorMessage.textContent = 'Please type a note first.';
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = 'Notes must be 200 characters or fewer.';
    return;
  }

  // Clear validation error if valid
  errorMessage.textContent = '';

  const newNote = {
    id: Date.now().toString(),
    text: text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
  };

  notes.unshift(newNote); // Add new notes to the top
  saveNotes();
  render();

  noteInput.value = ''; // Clear input
});

// Delete Single Note
function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  saveNotes();
  render();
}

// Clear All Notes (Bonus Feature)
if (clearAllBtn) {
  clearAllBtn.addEventListener('click', () => {
    if (notes.length === 0) return;
    
    if (confirm('Delete all notes?')) {
      notes = [];
      saveNotes();
      render();
    }
  });
}

// Search Event Listener
searchInput.addEventListener('input', render);

// Initial Render on Page Load
render();