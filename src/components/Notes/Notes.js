import React, { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import "./Notes.css";

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key “" + key + "”: ", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error("Error setting localStorage key “" + key + "”: ", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

function Notes() {
  const { user, loading } = useOutletContext();
  const [notes, setNotes] = useLocalStorage("notes", []);
  const [activeNoteId, setActiveNoteId] = useLocalStorage("activeNoteId", null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [previewNote, setPreviewNote] = useState(null);
  const textareaRef = useRef(null);

  const addNote = () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content cannot be empty.");
      return;
    }
    const newNote = { id: Date.now().toString(), title, content };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setActiveNoteId(newNote.id);
    setTitle("");
    setContent("");
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    if (activeNoteId === id) setActiveNoteId(null);
  };

  const exportNote = (note) => {
    const safeTitle = note.title.replace(/[^a-zA-Z0-9]/g, "_");
    const element = document.createElement("a");
    const file = new Blob([`Title: ${note.title}\n\n${note.content}`], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${safeTitle || "note"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleNotePreview = (note) => {
    setPreviewNote(note);
  };

  const closePreview = () => {
    setPreviewNote(null);
  };

  const activeNote = notes.find((note) => note.id === activeNoteId);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="notes-page">
      <h2>Notes</h2>
      {user ? (
        <>
          <div className="notes-controls">
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={40}
            />
            <textarea
              ref={textareaRef}
              placeholder="Write your note here..."
              value={content}
              onChange={handleContentChange}
              maxLength={4000}
            />
            <button onClick={addNote} aria-label="Add Note">
              Add Note
            </button>
          </div>
          <div className="notes-list">
            <h3>Your Notes</h3>
            {notes.map((note) => (
              <div
                key={note.id}
                className={`note-item ${activeNoteId === note.id ? "active" : ""}`}
                onClick={() => setActiveNoteId(note.id)}
              >
                <span className="note-title">{note.title || "Untitled"}</span>
                <div className="note-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      exportNote(note);
                    }}
                    aria-label="Export Note"
                  >
                    Export
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    aria-label="Delete Note"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {activeNote && (
            <div className="active-note">
              <div className="active-note-header">
                <h3>{activeNote.title}</h3>
                <button
                  onClick={() => handleNotePreview(activeNote)}
                  aria-label="Preview Note"
                  className="action-button"
                >
                  Preview
                </button>
              </div>
              <div className="active-content">
                {activeNote.content.substring(0, 10)}
              </div>
            </div>
          )}
          {previewNote && (
            <>
              <div className="preview-overlay" onClick={closePreview} />
              <div className="preview-window" onClick={(e) => e.stopPropagation()}>
                <button className="close" onClick={closePreview}>
                  ×
                </button>
                <h3>{previewNote.title}</h3>
                <p>{previewNote.content}</p>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="feature-locked">
          <h2>Sign in to access your Notes</h2>
          <p>Please sign in to create, save, and view your notes across devices.</p>
        </div>
      )}
    </div>
  );
}

export default Notes;