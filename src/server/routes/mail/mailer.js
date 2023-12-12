import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'trasca.robert03@gmail.com',
        pass: 'dwmv qghg vduk blxc',
    },
});

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: 'brainstormish.site',
            to,
            subject,
            html: htmlContent || 'Default message',
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, info };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Internal Server Error' };
    }
};

export default sendEmail;
