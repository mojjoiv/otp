const {TWILIO_SERVICE_ID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN} = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN,{
    lazyLoading: true
})


/**
 * send OTP
 * @param {*} req
 * @param {*} res 
 * @param {*} next 
 */
const sendOTP = async (req,res, next) => {
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



/**
 * verify OTP
 * @param {*} req
 * @param {*} res 
 * @param {*} next 
 */

const verifyOTP = async (req,res, next) => {
    const { countryCode, phoneNumber} =req.body;
    try{
        const verifiedResponse = await client.verify
        .services(TWILIO_SERVICE_ID) 
        .verificationChecks.create({
            to: `+${countryCode}${phoneNumber}`,
            code: otp
        });
        res.status(200).send(`OTP verified successfully!: ${JSON.stringify(otpResponse)}`);
    }catch(error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong');
    }
};