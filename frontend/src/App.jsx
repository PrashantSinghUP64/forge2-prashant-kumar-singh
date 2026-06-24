import { useState, useEffect } from 'react';
import api from './api';
import BoardView from './BoardView';
import { Layout } from 'lucide-react';

function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await api.get('/boards');
      setBoards(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    if (!title) return;
    try {
      const res = await api.post('/boards', { title });
      setBoards([...boards, res.data]);
      e.target.reset();
    } catch (e) {
      console.error(e);
    }
  };

  if (selectedBoard) {
    return <BoardView boardId={selectedBoard} onBack={() => setSelectedBoard(null)} />;
  }

  return (
    <>
      <header className="app-header">
        <Layout size={24} color="var(--accent-color)" />
        <h2>Kanban Workspace</h2>
      </header>
      <main className="main-content">
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <h3>Your Boards</h3>
          <form onSubmit={createBoard} style={{ display: 'flex', gap: '0.5rem' }}>
            <input name="title" placeholder="New board title..." />
            <button type="submit" className="btn-primary">Create Board</button>
          </form>
        </div>
        
        {loading ? (
          <p>Loading boards...</p>
        ) : (
          <div className="board-grid">
            {boards.map(board => (
              <div 
                key={board.id} 
                className="glass-panel board-card"
                onClick={() => setSelectedBoard(board.id)}
              >
                <h4>{board.title}</h4>
              </div>
            ))}
            {boards.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No boards found. Create one to get started.</p>}
          </div>
        )}
      </main>
    </>
  );
}

export default App;
