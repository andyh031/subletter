import '../css/Profile.css';
import Cookies from 'universal-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditProfile from './ProfileEdit';
import profile_Image from '../assets/temp-avatar.jpg';
import axios from 'axios';

const Profile = () => {
  const [description, setDescription] = useState('');
  const history = useNavigate();
  const cookies = new Cookies();
  const username = cookies.get('USERNAME');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get(`http://localhost:1234/users/?username=${username}`)
          .then((res) => {
            setDescription(res.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  const logout = () => {
    cookies.remove('TOKEN', { path: '/' });
    cookies.remove('USERNAME', { path: '/' });
    history('/home', {});
  };

  const Edit = () => {
    document.getElementById('edit-details-modal').showModal();
  };

  return (
    <div>
      <div className="Profile">
        <div className="Profile-Upper-Section">
          <div className="Profile-left">
            <div className="Profile-image">
              <img src={profile_Image} alt="Profile" />
            </div>
            <div className="Profile-detail">
              <div className="Profile-university">
                University of British Columbia
              </div>
              <div className="Profile-major">Anthropology</div>
              <div className="Profile-year">3rd Year</div>
            </div>
          </div>
          <div className="Profile-right">
            <h1 className="Profile-name">{username}</h1>
            <div className="Profile-description">
              <p>
                Hey there! I'm Alex, a spirited university student with an
                insatiable wanderlust and an unyielding love for music. Majoring
                in Anthropology, I'm constantly fascinated by the diverse
                cultures that shape our world. When I'm not buried in books,
                you'll find me exploring the great outdoors, camera in hand,
                capturing the breathtaking landscapes and candid moments that
                inspire my soul. As a budding musician, I spend my free time
                strumming melodies on my acoustic guitar or losing myself in the
                lyrics of classic rock bands. I'm always up for spontaneous
                adventures, whether it's hiking to a hidden waterfall or jamming
                with fellow music enthusiasts.
              </p>
            </div>
          </div>
        </div>
        <div className="buttons-container">
          <button onClick={Edit}>Edit Details</button>
          <button className="red" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <dialog data-modal id="edit-details-modal">
        <EditProfile
          props={{
            username,
          }}
        />
      </dialog>
    </div>
  );
};

export default Profile;
