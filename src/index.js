import React from 'react';
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.scss';
import Contacts from './features/contacts/components/ContactsView';

if (process.env.NODE_ENV === 'development') {
  const container = document.getElementById('root');

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    container
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}

export default Contacts;