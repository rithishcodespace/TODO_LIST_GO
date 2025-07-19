import { useState } from 'react';
import LoginForm from './components/LoginForm';
import TodoList from './components/TodoList';

function App() {
  const [userId, setUserId] = useState(null);

  return (
    <div className="App">
      {!userId ? <LoginForm onLogin={setUserId} /> : <TodoList userId={userId} />}
    </div>
  );
}

export default App;
