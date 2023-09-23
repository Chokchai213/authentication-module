//import logo from './logo.svg';
import './App.css';
import Navigate from './components/Navbar';
import IndividualIntervalsExample from './components/Carousel';
import { useState, useEffect } from 'react';
import login from './components/login';
// import Home from './components/home';
import firebase from './services/firebase';
import FormTextExample from './components/form_text';

function App() {

const [user, setUser] = useState(null);

useEffect(() => {
  firebase.auth().onAuthStateChanged(user => {
    setUser(user)
  })
}, []);

console.log(user);

  return (
    <div>
      <div className='header'>
        <Navigate />
      </div>
      <div>
        <FormTextExample />
      </div>
      <div>
        <IndividualIntervalsExample/>
      </div>
    </div>
  );
}

export default App;
