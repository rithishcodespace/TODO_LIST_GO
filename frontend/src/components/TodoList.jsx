import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, CheckCircle2, Circle } from 'lucide-react';
import api from '../api';

function TodoList({ userId, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    api.get('/todos', { params: { userId } }).then(res => setTodos(res.data));
  }, [userId]);

  const addTodo = async () => {
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      const res = await api.post('/todos', { title: title.trim(), user_id: userId });
      setTodos([...todos, res.data]);
      setTitle('');
    } catch (err) {
      console.error('Error adding todo:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  const updateTodo = async (todo) => {
    const updatedTitle = prompt("Edit todo:", todo.title);
    if (updatedTitle) {
      const res = await api.put(`/todos/${todo.id}`, { ...todo, title: updatedTitle });
      setTodos(todos.map(t => t.id === todo.id ? res.data : t));
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const saveEdit = async (todo) => {
    if (!editTitle.trim()) return;
    
    try {
      const res = await api.put(`/todos/${todo.id}`, { ...todo, title: editTitle.trim() });
      setTodos(todos.map(t => t.id === todo.id ? res.data : t));
      setEditingId(null);
      setEditTitle('');
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const toggleComplete = async (todo) => {
    try {
      const updated = { ...todo, completed: !todo.completed };
      const res = await api.put(`/todos/${todo.id}`, updated);
      setTodos(todos.map(t => t.id === todo.id ? res.data : t));
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
              <p className="text-sm text-gray-600">
                {todos.length} total, {completedCount} completed
              </p>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Add Todo Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-8">
          <div className="flex gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addTodo)}
              placeholder="What needs to be done?"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
            />
            <button
              onClick={addTodo}
              disabled={loading || !title.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Plus className="w-5 h-5" />
              )}
              Add Task
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="text-center py-16">
              <Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks yet</h3>
              <p className="text-gray-500">Add your first task to get started!</p>
            </div>
          ) : (
            todos.map((todo, index) => (
              <div
                key={todo.id}
                className="bg-white rounded-xl shadow-md border border-gray-200/50 p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleComplete(todo)}
                    className="flex-shrink-0 transition-all duration-200"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-purple-500" />
                    )}
                  </button>

                  {editingId === todo.id ? (
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, () => saveEdit(todo))}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`flex-1 ${
                        todo.completed
                          ? 'text-gray-500 line-through'
                          : 'text-gray-800'
                      } transition-all duration-200`}
                    >
                      {todo.title}
                    </span>
                  )}

                  <div className="flex gap-2">
                    {editingId === todo.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(todo)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(todo)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoList;
