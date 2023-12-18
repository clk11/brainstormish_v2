import React, { useState } from 'react';
import { Button, Modal, TextField, Grid } from '@mui/material'
import { v4 as uuidv4 } from 'uuid';
const ResetPasswordModal = ({ setAction, setConfirmationModalOpen, changeUI, setChangeUI, setUserid, requireConfirmation, sendConfirmationMail, verifyEmail, setOpen, resetPasswordModalOpen, setResetPasswordModalOpen }) => {
    const [input, setInput] = useState('');

    const handleSubmit = async () => {
       
    };

    const handleClose = () => {
        requireConfirmation(false);
        clearInput();
        setInput('');
        document.getElementById('input').value = '';
        setResetPasswordModalOpen(false);
    }

    return (
        <div>
            <Modal open={resetPasswordModalOpen}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, backgroundColor: localStorage.getItem('mode') === 'dark' ? 'black' : 'white', padding: 20 }}>
                    <h4 style={{ textAlign: 'center' }}>{!changeUI ? 'Enter the email address associated with the account whose password you want to reset' : 'Enter your new password'}</h4>
                    <TextField
                        id='input'
                        label={!changeUI ? 'Email' : 'New password'}
                        fullWidth
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Grid container spacing={1}>
                        <Grid item xs={8}>
                            <Button fullWidth variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: 10 }}>
                                {!changeUI ? 'SEND CODE' : 'CONFIRM'}
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button fullWidth variant="contained" color="error" onClick={handleClose} style={{ marginTop: 10 }}>
                                Close
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Modal >
        </div >
    );
};

export default ResetPasswordModal;
