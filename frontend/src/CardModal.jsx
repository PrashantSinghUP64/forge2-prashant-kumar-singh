import { useState } from 'react';
import api from './api';
import { X } from 'lucide-react';

export default function CardModal({ card, board, allTags, allMembers, onClose, onUpdate }) {
  const [listId, setListId] = useState(card.listId);
  const [tagId, setTagId] = useState('');
  const [memberId, setMemberId] = useState('');

  const moveCard = async (e) => {
    const newListId = e.target.value;
    setListId(newListId);
    try {
      await api.patch(`/cards/${card.id}/move`, { kanban_list_id: newListId, position: 0 });
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const addTag = async () => {
    if (!tagId) return;
    try {
      await api.post(`/cards/${card.id}/tags`, { tag_id: tagId });
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const addMember = async () => {
    if (!memberId) return;
    try {
      await api.post(`/cards/${card.id}/members`, { member_id: memberId });
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{card.title}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="form-group">
          <label>In List</label>
          <select value={listId} onChange={moveCard}>
            {board.kanban_lists.map(list => (
              <option key={list.id} value={list.id}>{list.title}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select value={tagId} onChange={e => setTagId(e.target.value)} style={{ flex: 1 }}>
              <option value="">Select a tag...</option>
              {allTags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button onClick={addTag} className="btn-secondary">Add</button>
          </div>
          <div className="card-tags" style={{ marginTop: '0.5rem' }}>
            {card.tags?.map(t => (
              <span key={t.id} className="tag-badge" style={{ backgroundColor: t.color }}>{t.name}</span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Members</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select value={memberId} onChange={e => setMemberId(e.target.value)} style={{ flex: 1 }}>
              <option value="">Assign member...</option>
              {allMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <button onClick={addMember} className="btn-secondary">Assign</button>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
            {card.members?.map(m => (
              <img key={m.id} src={m.avatar} alt={m.name} className="avatar" title={m.name} />
            ))}
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Due Date: {card.due_date ? new Date(card.due_date).toLocaleDateString() : 'None'}
          </p>
        </div>
      </div>
    </div>
  );
}
