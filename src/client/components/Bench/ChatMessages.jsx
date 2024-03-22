import React, { useEffect, useRef, useState } from "react";
import { List, ListItem, Typography, Grid } from '@mui/material'
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { v4 as uuidv4 } from 'uuid';
const ChatMessages = ({ setLoadMoreVisibility, messages, navigate, empty, sendClicked, setSendClicked, onSend }) => {
  const listRef = useRef(null);
  const [observerState, setObserverState] = useState(true);
  const [blockRepetition, setBlockRepetition] = useState(false);
  const handleScroll = () => {
    const scrollTop = listRef.current.scrollTop;
    if (!empty) {
      if (scrollTop == 0) {
        setLoadMoreVisibility(true);
        setBlockRepetition(false);
      } else {
        if (!blockRepetition) {
          setLoadMoreVisibility(false);
          setBlockRepetition(true);
        }
      }
    }
  };
  useEffect(() => {
    if (messages) {
      if (observerState) {
        const onMutation = () => {
          listRef.current.scrollTop = listRef.current.scrollHeight;
          observer.disconnect();
          setObserverState(false);
        };
        const observer = new MutationObserver(onMutation);
        observer.observe(listRef.current, { childList: true });
        return () => {
          if (observer) {
            observer.disconnect();
          }
        };
      } else {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }
  }, []);
  useEffect(() => {
    if (sendClicked == true && messages) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
      setSendClicked(false);
    }
  }, [sendClicked, messages])
  return (
    <div>
      <List ref={listRef} onScroll={handleScroll} sx={{ height: '60vh', overflowY: 'auto' }}>
        {messages.map(({ message, username }) => (
          <ListItem key={uuidv4()} divider>
            <Grid container spacing={2}>
              <Grid item>
                <Chip onClick={() => navigate(`/wall/profile/${username}`)} avatar={<Avatar />} label={username} />
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ wordWrap: 'break-word', maxWidth: 'auto' }}>
                  {message}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default ChatMessages;
