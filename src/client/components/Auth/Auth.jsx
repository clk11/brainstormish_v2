import React, { useEffect, useState } from 'react';
import { Button, TextField, Box, Typography, Container, Paper, Link, Grid } from '@mui/material'
import { authAC } from "../../../redux/features";
import { connect } from "react-redux";
import Snack from "../Layout/SnackBar/Snack";
import ConfirmationModal from './ConfirmationModal.jsx';
import { v4 as uuidv4 } from 'uuid';

const Auth = ({ changeClient, clientLogin, login, register, verifyMailId, validateCredentials, sendConfirmationMail, errors }) => {
  const [confirmation, setConfirmation] = useState(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [userid, setUserid] = useState('');
  //
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    rpassword: ""
  });
  const onChange = (e) => setUser({ ...user, [e.target.id]: e.target.value });
  const clearInputs = () => {
    setUser({
      username: "",
      password: "",
      email: "",
      rpassword: ""
    });
  };

  const onSubmit = async () => {
    if (!open) {
      if (clientLogin)
        setOpen(!(await login(user)));
      else {
        const userid = uuidv4();
        const result = await validateCredentials(user);
        if (result === 1) {
          const res = await sendConfirmationMail({ userid, to: user.email });
          if (res === 1) {
            setUserid(userid);
            setConfirmationModalOpen(true);
          } else setOpen(true);
        } else setOpen(true);
      }
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <ConfirmationModal
        user={user}
        setAlertMessage={setAlertMessage}
        setOpen={setOpen}
        clearInputs={clearInputs}
        changeClient={changeClient}
        register={register}
        userid={userid}
        verifyMailId={verifyMailId}
        confirmationModalOpen={confirmationModalOpen}
        setConfirmationModalOpen={setConfirmationModalOpen} />
      <Snack alertMessage={alertMessage} open={open} setOpen={setOpen} errors={errors} />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={5}>
          <Box padding={3} component="form" noValidate sx={{ mt: 1, textAlign: 'center' }}>
            <Typography component="h1" variant="h5">
              {clientLogin ? 'Login' : 'Register'}
            </Typography>
            <TextField
              margin="normal"
              required
              onChange={onChange}
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={user.username}
              autoFocus
            />
            {!clientLogin && (
              <TextField
                margin="normal"
                required
                fullWidth
                onChange={onChange}
                id="email"
                label="Email"
                name="email"
                value={user.email}
                autoFocus
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={onChange}
              id="password"
              label="Password"
              name="password"
              value={user.password}
              type='password'
              autoFocus
            />
            {!clientLogin && (
              <TextField
                margin="normal"
                required
                fullWidth
                onChange={onChange}
                id="rpassword"
                label="Retype your password"
                name="rpassword"
                value={user.rpassword}
                type='password'
                autoFocus
              />
            )}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  onClick={onSubmit}
                  fullWidth
                  variant="contained"
                >
                  {clientLogin ? 'Login' : 'Register'}
                </Button>
              </Grid>
            </Grid>
            <br />
            <Link onClick={changeClient}>{`Go to ${clientLogin ? 'registration' : 'login'}`}</Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
const stateProps = (state) => {
  return {
    clientLogin: state.auth.clientLogin,
    errors: state.auth.errors,
  };
};

const actionCreators = (dispatch) => {
  return {
    changeClient: authAC.ChangeClient(dispatch),
    login: (user) => {
      return authAC.Login(dispatch, user);
    },
    register: (user) => {
      return authAC.Register(dispatch, user);
    },
    validateCredentials: (user) => {
      return authAC.ValidateCredentials(dispatch, user);
    },
    sendConfirmationMail: (data) => {
      return authAC.SendConfirmationMail(dispatch, data);
    },
    verifyMailId: (data) => {
      return authAC.VerifyMailId(dispatch, data);
    }
  };
};
export default connect(stateProps, actionCreators)(Auth);
