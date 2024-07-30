import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInviteUserMutation } from '../services/userAuthApi';

const InviteUserFeature = () => {
  const [email, setEmail] = useState('');
  const [inviteUser, { isLoading, isSuccess, isError, error }] = useInviteUserMutation();
  const accessToken = useSelector((state) => state.authSlice.access_token);  // Retrieve token from Redux state

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await inviteUser({ email }).unwrap(); // No need to pass headers here
      // Handle success
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div>
      <h2>Invite User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Inviting...' : 'Invite User'}
        </button>
        {isSuccess && <p>User invited successfully!</p>}
        {isError && <p>Error: {error.message}</p>}
      </form>
    </div>
  );
};

export default InviteUserFeature;
