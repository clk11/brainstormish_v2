import express from 'express'
import sendEmail from './mailer.js';
import { v4 as uuidv4 } from 'uuid';
//Caching
import { cache_functions } from '../../caching/caching.js';
const { setters, getters } = cache_functions
const { set_mail_id } = setters;
const { get_mail_id } = getters;
//
const router = express.Router();

const htmlContent = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Brainstormish</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            margin: 0;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333333;
        }

        #uniqueId {
            margin-top: 20px;
            font-size: 24px;
            color: #007bff;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Welcome to Brainstormish</h1>
        <h2>Underneath you'll have the confirmation id that you need to paste in the prompt :)</h2>
        <h1 id="uniqueId"></h1>
    </div>
</body>

</html>
`;

router.post('/send-mail', async (req, res) => {
    try {
        const { to, userid } = req.body;
        const id = uuidv4();
        let modifiedHtmlContent = htmlContent.replace('<h1 id="uniqueId"></h1>', `<h1 id="uniqueId">${id}</h1>`);
        const { success, error } = await sendEmail(to, 'brainstormish identity confirmation', modifiedHtmlContent);
        if (success) {
            await set_mail_id(userid, id);
            res.status(200).json({ message: 'Email sent successfully !' });
        }
    } catch (error) {
        console.log("send-mail\n" + error);

        res.status(400).send({ err: 'Something went wrong !' });
    }
});

router.get('/verify-id', async (req, res) => {
    try {
        const { userid, input } = req.query;
        const id = await get_mail_id(userid);
        if (input === id) {
            res.status(200).json({ message: 'Code verified succesfully !' });
            await set_mail_id(userid, "granted");
        }
        else return res.status(400).send({ err: 'The code is wrong . Trying again will send another code .' });
    } catch (error) {
        console.log("verify-id\n" + error);
        res.status(400).send({ err: 'Something went wrong !' });
    }
});

export default router;