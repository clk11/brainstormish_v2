import React, { useState } from 'react';
import { Button, Modal, TextField } from '@mui/material'
const InputModal = ({ setConfirmation, verifyMailId, userid, confirmationModalOpen, setConfirmationModalOpen }) => {
    const [input, setInput] = useState('');
    const handleClose = () => {
        setConfirmationModalOpen(false);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleInputSubmit = async () => {
        const result = await verifyMailId({ userid, input });
        if (result === 1)
            setConfirmation(true);
        else
            setConfirmation(false);
        setInput('');
        document.getElementById('input').value = '';
        handleClose();
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
                    <Button variant="contained" color="primary" onClick={handleInputSubmit} style={{ marginTop: 10 }}>
                        Submit
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default InputModal;
