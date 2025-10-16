import React, {useEffect, useState} from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export default function App(){
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(()=> { fetchNotes() }, []);

  async function fetchNotes(){
    const res = await fetch(API_BASE + '/api/notes');
    const data = await res.json();
    setNotes(data);
  }

  async function createNote(e){
    e.preventDefault();
    if(!title) return alert('Title required');
    await fetch(API_BASE + '/api/notes', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({title, content})
    });
    setTitle(''); setContent(''); fetchNotes();
  }

  async function deleteNote(id){
    if(!confirm('Delete note?')) return;
    await fetch(API_BASE + '/api/notes/' + id, {method:'DELETE'});
    fetchNotes();
  }

  function startEdit(note){
    setEditing(note);
    setTitle(note.title);
    setContent(note.content);
  }

  async function saveEdit(e){
    e.preventDefault();
    await fetch(API_BASE + '/api/notes/' + editing.id, {
      method:'PATCH', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({title, content})
    });
    setEditing(null); setTitle(''); setContent(''); fetchNotes();
  }

  return (
    <div style={{maxWidth:800, margin:'2rem auto', fontFamily:'system-ui, sans-serif'}}>
      <h1>DevHub Notes</h1>
      <form onSubmit={editing ? saveEdit : createNote} style={{marginBottom:20}}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%', padding:8, marginBottom:8}} />
        <textarea placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} style={{width:'100%', padding:8, minHeight:80}} />
        <button>{editing ? 'Save' : 'Create'}</button>
        {editing && <button type="button" onClick={()=>{setEditing(null); setTitle(''); setContent('')}} style={{marginLeft:8}}>Cancel</button>}
      </form>

      <section>
        {notes.length === 0 && <p>No notes yet.</p>}
        {notes.map(n => (
          <article key={n.id} style={{border:'1px solid #eee', padding:12, marginBottom:8, borderRadius:8}}>
            <h3 style={{margin:'0 0 8px'}}>{n.title}</h3>
            <div style={{marginBottom:8, color:'#444'}}>{n.content}</div>
            <div style={{display:'flex', gap:8}}>
              <button onClick={()=>startEdit(n)}>Edit</button>
              <button onClick={()=>deleteNote(n.id)}>Delete</button>
            </div>
            <small style={{color:'#888'}}>{new Date(n.created_at).toLocaleString()}</small>
          </article>
        ))}
      </section>
    </div>
  )
}
