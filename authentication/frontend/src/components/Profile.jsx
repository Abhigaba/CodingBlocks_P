import React, { useEffect, useState } from 'react';
import { getProfile } from '../utils/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');


  return (
    <div>
      <h2>Profile</h2>
      Successfully authenticated
    </div>
  );
};

export default Profile;