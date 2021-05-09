require("dotenv").config();
const axios = require('axios');
const datetime = require('node-datetime');
const passKey = process.env.PASSKEY ;
const shortcode = process.env.SHORTCODE ;
const consumerKey = process.env.CONSUMERKEY ;
const consumerSecret = process.env.CONSUMERSECRET ;

const newPassword = ()=>{
    const dt = datetime.create();
    const formatted  = dt.format('YmdHMS');

    const passString = shortcode + passKey + formatted ;
    const base64EncodedPassword = Buffer.from(passString).toString('base64') ;
    
    // return asciipw ;
    return base64EncodedPassword ;
}
//token generator(stkpush)
exports.token = (req, res, next) =>{
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    const auth = "Basic " + Buffer.from(consumerKey + ":" + consumerSecret).toString("base64");
    const headers = {
        Authorization : auth,
    };

    axios.get(url, {
        headers : headers
    })
    .then((response) => {
        let data = response.data ;
        let access_token = data.access_token ;
        req.token = access_token ;
        
    })
    .catch(error => console.log(error)) ;
};

// passowrd generator
exports.mpesaPassword = (req,res) =>{
    res.send(newPassword());
};

exports.stkPush = (req, res) => {
    const token = req.token  ;
    const headers = {
        Authorization : 'Bearer' + token 
    }
    
    const stkURL = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    let data = {
        BusinessShortCode : '174379',
        Password : newPassword(),
        Timestamp : formatted,
        TransactionType : 'CustomerPayBillOnline',
        Amount : '30',
        PartyA: '',
        PartyB: '174379',
        PhoneNumber:'',
        CallBackUrl: 'http://6f698e4cd256.ngrok.io/api/stk/push/callback/url',
        AccountReference:"Talli" ,
        TransactionDesc: 'Lipa Na M-PESA'
    };
    
    try {
        axios.post(stkURL, data,  {headers:headers})
        .then((response) => res.send(response.data))
    } catch (error) {
        console.log(error);
    };

};