import './App.css';
import { Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import Notifications from './components/Notifications';
import Listings from './components/Listings';
import Profile from './components/Profile';
import HousingInfo from './components/HousingInfo';
import MessageBoard from './components/MessageBoard';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} exact />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/housinginfo" element={<HousingInfo />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messageboard" element={<MessageBoard />} />
      </Routes>
    </>
  );
}

export default App;
