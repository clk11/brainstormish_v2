import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { authAC, benchAC } from '../../../redux/features/';
import ProgressBar from '../Layout/ProgressBar';
import ChatComponent from './ChatComponent';
import { connect } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';

const Chat = ({ user, getUser, membership, getMembership, setFullBar }) => {
  const location = useLocation();
  const { title, description } = location.state;
  const { postid } = useParams();
  const [info, _] = useState({ title, description });
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      await getMembership({ room: postid });
    }
    fetch();
  }, [])

  useEffect(() => {
    setFullBar(false);
    const socketInstance = io(import.meta.env.VITE_API_URL);
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
      setFullBar(true);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getUser();
      if (result === 1) setLoading(false);
    };

    if (socket && membership) {
      fetchUser();
    } else setLoading(false);
  }, [socket, getUser, membership]);

  return (
    <div>
      {membership && (
        loading || !user ? (
          <ProgressBar />
        ) : (
          <ChatComponent socket={socket} user={{ room: postid, username: user.username }} info={info} />
        )
      )}
      {membership === false && (
        <div style={{ textAlign: 'center' }}>
          <h1>You haven't joined a room with this id !</h1>
          <h1 style={{ transform: 'rotate(90deg)' }}>{":'("}</h1>
        </div>
      )}
    </div>

  );
};

const stateProps = (state) => {
  return {
    user: state.auth.user,
    membership: state.bench.membership
  };
};

const actionCreators = (dispatch) => {
  return {
    getUser: () => {
      return authAC.GetUser(dispatch);
    },
    getMembership: (data) => {
      return benchAC.GetMembership(dispatch, data)
    }
  };
};

export default connect(stateProps, actionCreators)(Chat);
