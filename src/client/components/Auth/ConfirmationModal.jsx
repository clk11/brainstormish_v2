import React, { useState } from 'react';
import { Button, Modal, TextField, Grid } from '@mui/material'
const InputModal = ({ user, register, setAlertMessage, setOpen, clearInputs, changeClient, verifyMailId, userid, confirmationModalOpen, setConfirmationModalOpen }) => {
    const [input, setInput] = useState('');
    const handleClose = () => {
        setConfirmationModalOpen(false);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleInputSubmit = async () => {
        if (input.trim().length > 0) {
            const result = await verifyMailId({ userid, input });
            if (result === 1) {
                await register({ userid, user });
                setAlertMessage('Registered successfully !');
                clearInputs();
                changeClient();
            }
            setOpen(true);
            setInput('');
            document.getElementById('input').value = '';
            handleClose();
        } else alert('You need to enter something !');
    };

    return (
        <div>
            <Modal open={confirmationModalOpen}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, backgroundColor: localStorage.getItem('mode') === 'dark' ? 'black' : 'white', padding: 20 }}>
                    <h4 style={{ textAlign: 'center' }}>Enter the confirmation code you received on the email you provided</h4>
                    <TextField
                        id='input'
                        label="Enter the code"
                        fullWidth
                        value={input}
                        onChange={handleInputChange}
                    />
                    <Grid container spacing={1}>
                        <Grid item xs={8}>
                            <Button fullWidth variant="contained" color="primary" onClick={handleInputSubmit} style={{ marginTop: 10 }}>
                                Submit
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button fullWidth variant="contained" color="error" onClick={handleClose} style={{ marginTop: 10 }}>
                                Close
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </Modal>
        </div>
    );
};

export default InputModal;
