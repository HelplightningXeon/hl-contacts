import React from 'react';
import logo from './logo.png';
import ContactsView from './features/contacts/components/ContactsView';
import Login from './features/auth/Login';
import './App.css';
import { currentUser } from './features/auth/auth';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Helplightning Contacts
        </p>
        { currentUser?.token ? <ContactsView /> : <Login /> }
      </header>
    </div>
  );
}

export default App;
