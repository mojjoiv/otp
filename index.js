const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const {
    TWILIO_ACCOUNT_SID = "",
    TWILIO_AUTH_TOKEN = "",
    TWILIO_SERVICE_ID = "",
} = process.env;


const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_ID);

// Controller functions (as defined in your code)
const sendOTP = async (req, res, next) => {
    const { countryCode, phoneNumber} =req.body;
    try{

        const otpResponse = await client.verify
        .services(TWILIO_SERVICE_ID) 
        .verifications.create({
            to: `+${countryCode}${phoneNumber}`,
            channel: "sms"
        });
        res.status(200).send(`OTP sent successfully!: ${JSON.stringify(otpResponse)}`);
    }catch(error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong');
    }
};

const verifyOTP = async (req, res, next) => {
    const { countryCode, phoneNumber, otp } = req.body; // Add otp to the destructured variables
    try{
        const verifiedResponse = await client.verify
        .services(TWILIO_SERVICE_ID) 
        .verificationChecks.create({
            to: `+${countryCode}${phoneNumber}`,
            code: otp // Use the provided OTP from the request body
        });
        res.status(200).send(`OTP verified successfully!: ${JSON.stringify(verifiedResponse)}`); // Corrected variable name
    }catch(error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong');
    }
};

// Define the routes that use the controller functions
app.post('/send-otp', sendOTP); // This route will trigger the sendOTP function
app.post('/verify-otp', verifyOTP); // This route will trigger the verifyOTP function

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
