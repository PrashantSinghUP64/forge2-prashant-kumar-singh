import { useState, useEffect } from 'react';
import api from './api';
import { ArrowLeft, Plus } from 'lucide-react';
import CardModal from './CardModal';

export default function BoardView({ boardId, onBack }) {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [members, setMembers] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [newListTitle, setNewListTitle] = useState('');

  useEffect(() => {
    fetchData();
  }, [boardId]);

  const fetchData = async () => {
    try {
      const [boardRes, tagsRes, membersRes] = await Promise.all([
        api.get(`/boards/${boardId}`),
        api.get('/tags'),
        api.get('/members')
      ]);
      setBoard(boardRes.data);
      setTags(tagsRes.data);
      setMembers(membersRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createList = async (e) => {
    e.preventDefault();
    if (!newListTitle) return;
    try {
      await api.post(`/boards/${boardId}/lists`, { title: newListTitle, position: board.kanban_lists.length });
      setNewListTitle('');
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const createCard = async (listId, title) => {
    if (!title) return;
    try {
      await api.post(`/lists/${listId}/cards`, { title, position: 0 });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCardUpdate = () => {
    setEditingCard(null);
    fetchData();
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading board...</div>;
  if (!board) return <div style={{ padding: '2rem' }}>Board not found.</div>;

  return (
    <>
      <header className="app-header">
        <button onClick={onBack} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h2>{board.title}</h2>
      </header>

      <main className="main-content">
        <div className="kanban-board">
          {board.kanban_lists.map(list => (
            <div key={list.id} className="glass-panel kanban-list">
              <div className="list-header">{list.title}</div>
              
              <div className="list-cards">
                {list.cards.map(card => (
                  <div 
                    key={card.id} 
                    className={`card-item ${isOverdue(card.due_date) ? 'overdue' : ''}`}
                    onClick={() => setEditingCard({ ...card, listId: list.id })}
                  >
                    <div className="card-tags">
                      {card.tags?.map(t => (
                        <span key={t.id} className="tag-badge" style={{ backgroundColor: t.color }}>{t.name}</span>
                      ))}
                    </div>
                    <div style={{ fontWeight: 500, marginBottom: '8px' }}>{card.title}</div>
                    
                    <div className="card-meta">
                      {card.due_date && <span>{new Date(card.due_date).toLocaleDateString()}</span>}
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {card.members?.map(m => (
                          <img key={m.id} src={m.avatar} alt={m.name} className="avatar" title={m.name} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <form onSubmit={(e) => {
                  e.preventDefault();
                  createCard(list.id, e.target.title.value);
                  e.target.reset();
                }} style={{ marginTop: '1rem' }}>
                  <input name="title" placeholder="+ Add a card..." style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: 'none' }} />
                </form>
              </div>
            </div>
          ))}

          <div className="glass-panel kanban-list" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <form onSubmit={createList} style={{ padding: '1rem' }}>
              <input 
                value={newListTitle} 
                onChange={e => setNewListTitle(e.target.value)} 
                placeholder="+ Add another list" 
                style={{ width: '100%' }} 
              />
            </form>
          </div>
        </div>
      </main>

      {editingCard && (
        <CardModal 
          card={editingCard} 
          board={board}
          allTags={tags}
          allMembers={members}
          onClose={() => setEditingCard(null)} 
          onUpdate={handleCardUpdate} 
        />
      )}
    </>
  );
}
