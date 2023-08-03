import { Route } from 'react-router-dom';
import './App.css';
import { Button } from '@chakra-ui/react';
import Home from './home';
import Chat from './chat';
function App() {
  return (
    <div className="App">
      <Route path='/' exact><Home></Home></Route>
      <Route path='/chats'><Chat></Chat></Route>
    </div>
  );
}

export default App;
