import {useEffect, useState} from 'react';
import {NotesAPI} from "../api/notes";

export default function Notes(){
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    NotesAPI.list()
      .then(setNotes)
      .catch(() => alert("failed to load notes"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Notes</h2>

        {notes.map(note => (
          <div key = {note.id} style = {{ border: "1px solid #add", margin: 8}}>
            <h4>{note.title}</h4>
            <p>{note.content}</p>

            <button onClick={() => handledDelete(note.id)}>
              Delete
            </button>
          </div>
        ))}
    </div>
  );

  async function handledDelete(id) {
    await NotesAPI.remove(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }
}