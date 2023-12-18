import React, { useEffect, useState } from 'react';
import { Button, TextField, Box, Typography, Container, Paper, Link, Grid } from '@mui/material'
import { authAC } from "../../../redux/features";
import { connect } from "react-redux";
import Snack from "../Layout/SnackBar/Snack";
import ConfirmationModal from './ConfirmationModal.jsx';
import ResetPasswordModal from './ResetPasswordModal.jsx';
import { v4 as uuidv4 } from 'uuid';
import Progress from '../Layout/ProgressBar.jsx'
const Auth = ({ changeClient, clientLogin, login, register, verifyMailId, validateCredentials, sendConfirmationMail, errors, resetPassword, verifyEmail }) => {
  //Error handling modal
  const [open, setOpen] = useState(false);
  // Loading
  const [loading, setLoading] = useState(false);
  //Reset password modal
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [resetGranted, setResetGranted] = useState(null);
  // const [finishReset, setFinishReset] = useState(null);
  // Confirmation Modal
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [mailGranted, setMailGranted] = useState(null);
  //Auth state variables
  const [userid, setUserid] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    rpassword: ""
  });
  //

  const clearInputs = () => {
    setUser({
      username: "",
      password: "",
      email: "",
      rpassword: ""
    });
  };

  //Confirmation modal

  useEffect(() => {
    const exec = async () => {
      if (mailGranted) {
        await register({ userid, user });
        setAlertMessage('Registered successfully !');
        clearInputs();
        changeClient();
      }
      setOpen(true);
      setMailGranted(null);
    }
    if (mailGranted !== null) exec();
  }, [mailGranted])

  //Rest pass modal

  useEffect(() => {
    const exec = async () => {
      if (resetGranted) {
        const userid = uuidv4();
        setLoading(true);
        const res = await sendConfirmationMail({ userid, to: user.email });
        if (res === 1) {
          setUserid(userid);
          setLoading(false);
          setConfirmationModal(true);
        } else setOpen(true);
      }
      setOpen(true);
      setResetGranted(null);
    }
    if (resetGranted !== null) exec();
  }, [resetGranted])

  //Finish

  const onChange = (e) => setUser({ ...user, [e.target.id]: e.target.value });

  const onSubmit = async () => {
    if (!open) {
      if (clientLogin)
        setOpen(!(await login(user)));
      else {
        setLoading(true);
        const result = await validateCredentials(user);
        if (result === 1) {
          const userid = uuidv4();
          const res = await sendConfirmationMail({ userid, to: user.email });
          if (res === 1) {
            setUserid(userid);
            setLoading(false);
            setConfirmationModal(true);
          } else setOpen(true);
        } else setOpen(true);
        setLoading(false);
      }
    }
  };
  const forgotPassword = async () => {
    if (!open) {
      setResetPasswordModal(true);
    }
  }
  return (
    <Container component="main" maxWidth="xs">
      {loading && (
        <Progress />
      )}
      <ResetPasswordModal
        verifyEmail={verifyEmail}
        setResetGranted={setResetGranted}
        resetPasswordModal={resetPasswordModal}
        setResetPasswordModal={setResetPasswordModal}
      />
      <ConfirmationModal
        userid={userid}
        verifiyMailId={verifyMailId}
        setMailGranted={setMailGranted}
        setConfirmationModal={setConfirmationModal}
        confirmationModal={confirmationModal}
      />
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
            <Grid
              container
              spacing={1}
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <Link onClick={changeClient}>{`Go to ${clientLogin ? 'registration' : 'login'}`}</Link>
              </Grid>
              <Grid item>
                <Link onClick={forgotPassword}>Forgot password ?</Link>
              </Grid>
            </Grid>
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
    },
    resetPassword: (data) => {
      return authAC.ResetPassword(dispatch, data);
    },
    verifyEmail: (data) => {
      return authAC.VerifyEmail(dispatch, data);
    }
  };
};
export default connect(stateProps, actionCreators)(Auth);
