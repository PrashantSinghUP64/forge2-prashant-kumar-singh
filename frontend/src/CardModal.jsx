import { useState } from 'react';
import api from './api';
import { X, Trash2, Save } from 'lucide-react';

export default function CardModal({ card, board, allTags, allMembers, onClose, onUpdate }) {
  const [listId, setListId]           = useState(card.listId);
  const [tagId, setTagId]             = useState('');
  const [memberId, setMemberId]       = useState('');
  const [dueDate, setDueDate]         = useState(card.due_date ? card.due_date.split('T')[0] : '');
  const [title, setTitle]             = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [saving, setSaving]           = useState(false);
  const [deleting, setDeleting]       = useState(false);

  const moveCard = async (e) => {
    const newListId = e.target.value;
    setListId(newListId);
    try {
      await api.patch(`/cards/${card.id}/move`, { kanban_list_id: newListId, position: 0 });
      onUpdate();
    } catch (err) { console.error(err); }
  };

  const saveCard = async () => {
    setSaving(true);
    try {
      await api.patch(`/cards/${card.id}`, { title, description, due_date: dueDate || null });
      onUpdate();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const addTag = async () => {
    if (!tagId) return;
    try {
      await api.post(`/cards/${card.id}/tags`, { tag_id: tagId });
      onUpdate();
    } catch (err) { console.error(err); }
  };

  const removeTag = async (tId) => {
    try {
      await api.delete(`/cards/${card.id}/tags/${tId}`);
      onUpdate();
    } catch (err) { console.error(err); }
  };

  const addMember = async () => {
    if (!memberId) return;
    try {
      await api.post(`/cards/${card.id}/members`, { member_id: memberId });
      onUpdate();
    } catch (err) { console.error(err); }
  };

  const removeMember = async (mId) => {
    try {
      await api.delete(`/cards/${card.id}/members/${mId}`);
      onUpdate();
    } catch (err) { console.error(err); }
  };

  const deleteCard = async () => {
    if (!window.confirm('Delete this card?')) return;
    setDeleting(true);
    try {
      await api.delete(`/cards/${card.id}`);
      onUpdate();
      onClose();
    } catch (err) { console.error(err); setDeleting(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="modal-header">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="modal-title-input"
            placeholder="Card title"
          />
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={saveCard}
              className="btn-primary"
              disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <Save size={14} /> {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={deleteCard}
              disabled={deleting}
              style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px', borderRadius: '6px', background: 'rgba(239,68,68,0.1)', transition: 'background 0.2s' }}
              title="Delete card"
            >
              <Trash2 size={16} />
            </button>
            <button onClick={onClose} style={{ padding: '4px' }}><X size={20} /></button>
          </div>
        </div>

        {/* ── Description ── */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add a description…"
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* ── Move to list ── */}
        <div className="form-group">
          <label>In List</label>
          <select value={listId} onChange={moveCard}>
            {board.kanban_lists.map(list => (
              <option key={list.id} value={list.id}>{list.title}</option>
            ))}
          </select>
        </div>

        {/* ── Due Date ── */}
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>

        {/* ── Tags ── */}
        <div className="form-group">
          <label>Tags</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select value={tagId} onChange={e => setTagId(e.target.value)} style={{ flex: 1 }}>
              <option value="">Select a tag…</option>
              {allTags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button onClick={addTag} className="btn-secondary">Add</button>
          </div>
          <div className="card-tags" style={{ marginTop: '0.5rem' }}>
            {card.tags?.map(t => (
              <span key={t.id} className="tag-badge" style={{ backgroundColor: t.color, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {t.name}
                <button
                  onClick={() => removeTag(t.id)}
                  style={{ background: 'none', color: 'white', padding: 0, lineHeight: 1, fontSize: '0.75rem', opacity: 0.7 }}
                  title="Remove tag"
                >×</button>
              </span>
            ))}
          </div>
        </div>

        {/* ── Members ── */}
        <div className="form-group">
          <label>Members</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select value={memberId} onChange={e => setMemberId(e.target.value)} style={{ flex: 1 }}>
              <option value="">Assign member…</option>
              {allMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <button onClick={addMember} className="btn-secondary">Assign</button>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            {card.members?.map(m => (
              <div key={m.id} style={{ position: 'relative', display: 'inline-block' }}>
                <img src={m.avatar} alt={m.name} className="avatar" title={m.name} style={{ width: 32, height: 32 }} />
                <button
                  onClick={() => removeMember(m.id)}
                  style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: 'white', borderRadius: '50%', width: 14, height: 14, fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, lineHeight: 1 }}
                  title={`Remove ${m.name}`}
                >×</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
