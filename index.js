// const express = require('express');
// const nodemailer = require('nodemailer');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors');
// const axios = require('axios');
// const http = require('http'); // Import the http module
// const crypto = require('crypto');
// const { v4: uuidv4 } = require('uuid');
// require('dotenv').config();
// const WebSocket = require('ws');

// const app = express();
// const port = 5001;

// // Create an HTTP server
// const server = http.createServer(app);
// const wss = new WebSocket.Server({port: 5000});
// const clients = new Map();

// // Sample
// // Configure CORS
// app.use(cors());
// app.use(express.json());

// // Configure Multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// let pendingRequests = {};

// server.on('upgrade', (request, socket, head) => {
//   wss.handleUpgrade(request, socket, head, (ws) => {
//     wss.emit('connection', ws, request);
//   });
// });

// wss.on('connection', (ws) => {
//   const userId = uuidv4(); // Unique ID for each client
//   clients.set(userId, ws);

//   ws.on('close', () => {
//     clients.delete(userId);
//   });
// });
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // API endpoint to handle form submissions
// app.post('/send-email/front', (req, res) => {
//   const { name, mobile, email,formType } = req.body;
//   console.log("name",name,"email",email,"formtype",formType);
  

//   // Email options
//   const mailOptions = {
//     from: email,
//     to: 'blackgrapes.arpinjain@gmail.com', // Replace with your recipient email
//     subject: 'New Meeting Registration',
//     text: `Form Type: ${formType}\nName: ${name}\nMobile: ${mobile}\nEmail: ${email}`
//   };

//   // Send email
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).send('Error sending email');
//     } else {
//       res.status(200).send('Email sent successfully');
//     }
//   });
// });
// // Email Sending Route
// app.post('/send-email', upload.fields([
//   { name: 'aadharCard', maxCount: 1 },
//   { name: 'panCard', maxCount: 1 },
//   { name: 'graduationMarksheet', maxCount: 1 },
//   { name: 'passportSizePhoto', maxCount: 1 },
//   { name: 'updatedResume', maxCount: 1 },
// ]), (req, res) => {
//   const { fullName, fatherName, gender, batch, stream, collegeName, address, whatsappNumber, email, paymentMode,amount } = req.body;

//   const requestId = uuidv4(); // Generate a unique ID
//   pendingRequests[requestId] = { fullName, email }; // Store request data
//   // Set up Nodemailer
  
//   const attachments = [
//     req.files?.aadharCard?.[0]
//       ? { filename: req.files.aadharCard[0].originalname, content: req.files.aadharCard[0].buffer }
//       : null,
//     req.files?.panCard?.[0]
//       ? { filename: req.files.panCard[0].originalname, content: req.files.panCard[0].buffer }
//       : null,
//     req.files?.graduationMarksheet?.[0]
//       ? { filename: req.files.graduationMarksheet[0].originalname, content: req.files.graduationMarksheet[0].buffer }
//       : null,
//     req.files?.passportSizePhoto?.[0]
//       ? { filename: req.files.passportSizePhoto[0].originalname, content: req.files.passportSizePhoto[0].buffer }
//       : null,
//     req.files?.updatedResume?.[0]
//       ? { filename: req.files.updatedResume[0].originalname, content: req.files.updatedResume[0].buffer }
//       : null,
//   ].filter(Boolean);
  
//   const yesLink = `http://localhost:${port}/response/${requestId}?action=yes`;
//   const noLink = `http://localhost:${port}/response/${requestId}?action=no`;
  

//   const mailOptions = {
//     from: email,
//     to: 'blackgrapes.arpinjain@gmail.com', // Replace with your recipient email
//     subject: 'Registration Form Submission',
//     html: `
//     <p>
//       Full Name: ${fullName}<br>
//       Father's Name: ${fatherName}<br>
//       Gender: ${gender}<br>
//       Batch: ${batch}<br>
//       Stream: ${stream}<br>
//       College Name: ${collegeName}<br>
//       Address: ${address}<br>
//       WhatsApp Number: ${whatsappNumber}<br>
//       Email: ${email}<br>
//       Payment Mode: ${paymentMode}<br>
//       Amount: ${amount}
//     </p>
//     <p>
//       <strong>give confirmation of demat acocunt:</strong><br>
//       <a href="${yesLink}">Yes</a> | <a href="${noLink}">No</a>
//     </p>
//   `,
//   attachments,
  
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error('Error sending email:', error); // Log the error for debugging
//       return res.status(500).send('Error sending email');
//     }
//     res.status(200).json({ message: 'Email sent successfully', amount, requestId });
//   });
// });

// app.get('/response/:requestId', (req, res) => {
//   const { requestId } = req.params;
//   const { action } = req.query;
//   console.log(`Request ID: ${requestId}, Action: ${action}`);

//   if (!pendingRequests[requestId]) {
//     return res.status(400).send('Invalid or expired request');
//   }

//   const { fullName, email, amount } = pendingRequests[requestId];
//   delete pendingRequests[requestId]; // Remove request from storage

//   // Notify the user via WebSocket
//   clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       const message = action === 'yes'
//         ? { user: fullName, action: 'approved', amount: amount }
//         : { user: fullName, action: 'rejected' };

//       client.send(JSON.stringify(message));
//     }
//   });

//    // Send follow-up email to the user if approved
//    if (action === 'yes') {
//     // Send an email to the user confirming the approval
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER, // Your email here
//         pass: process.env.EMAIL_PASS, // Your email password or app password
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER, // Your email address
//       to: email, // User's email address
//       subject: 'Your Demat Account is Approved',
//       html: `
//     <p>Dear ${fullName},</p>
//     <p>Your Demat account has been approved. You can now proceed with the payment by clicking the link below:</p>
//     <p><a href="http://localhost:3000/checkout" target="_blank" style="color: #007bff; text-decoration: none;">Click here to proceed to payment</a></p>
//     <p>If you have any questions, feel free to contact us.</p>
//     <p>Thank you for choosing us!</p>
        
//       `,
//     };

//     // Send the email to the user
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending email:', error); // Log the error
//         return res.status(500).send('Error sending email to user');
//       }

//       // Respond with success status and notify the admin
//       res.json({ success: true, action: 'approved', message: 'Email sent to user' });
//     });
//   } else if (action === 'no') {
//     // If the action is 'no', send rejection to the admin or handle accordingly
//     res.json({ success: false, action: 'rejected' });
//   } else {
//     return res.status(400).send('Invalid action');
//   }
  
// });



// // Payment Gateway Configuration
// const MERCHANT_KEY = "48b460bd-1463-497b-a621-8f9f73e193cd";
// const MERCHANT_ID = "M22MU4WHSIF5F";

// const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
// const prod_status_URL = "https://api.phonepe.com/apis/hermes/pg/v1/status";

// const redirectUrl = "http://localhost:8000/status";
// const successUrl = "http://localhost:5173/payment-success";
// const failureUrl = "http://localhost:5173/payment-failure";

// // Create Order Route
// app.post('/create-order', async (req, res) => {
//   const { name, mobileNumber, amount } = req.body;
//   const orderId = uuidv4();

//   // Payment Payload
//   const paymentPayload = {
//     merchantId: MERCHANT_ID,
//     merchantUserId: name,
//     mobileNumber: mobileNumber,
//     amount: amount * 100,
//     merchantTransactionId: orderId,
//     redirectUrl: `${redirectUrl}/?id=${orderId}`,
//     redirectMode: 'POST',
//     paymentInstrument: {
//       type: 'PAY_PAGE'
//     }
//   };

//   const payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
//   const keyIndex = 1;
//   const string = payload + '/pg/v1/pay' + MERCHANT_KEY;
//   const sha256 = crypto.createHash('sha256').update(string).digest('hex');
//   const checksum = sha256 + '###' + keyIndex;

//   const option = {
//     method: 'POST',
//     url: prod_URL,
//     headers: {
//       accept: 'application/json',
//       'Content-Type': 'application/json',
//       'X-VERIFY': checksum
//     },
//     data: {
//       request: payload
//     }
//   };

//   try {
//     const response = await axios.request(option);
//     console.log(response.data.data.instrumentResponse.redirectInfo.url);
//     res.status(200).json({ msg: "OK", url: response.data.data.instrumentResponse.redirectInfo.url });
//   } catch (error) {
//     console.log("Error in payment", error);
//     res.status(500).json({ error: 'Failed to initiate payment' });
//   }
// });

// // Payment Status Route
// app.post('/status', async (req, res) => {
//   const merchantTransactionId = req.query.id;

//   const keyIndex = 1;
//   const string = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY;
//   const sha256 = crypto.createHash('sha256').update(string).digest('hex');
//   const checksum = sha256 + '###' + keyIndex;

//   const option = {
//     method: 'GET',
//     url: `${prod_status_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
//     headers: {
//       accept: 'application/json',
//       'Content-Type': 'application/json',
//       'X-VERIFY': checksum,
//       'X-MERCHANT-ID': MERCHANT_ID
//     },
//   };

//   axios.request(option).then((response) => {
//     if (response.data.success === true) {
//       return res.redirect(successUrl);

//     } else {
//       return res.redirect(failureUrl);
//     }
//   });
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });



// suraj 


const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const port = 8000;

// Configure CORS
app.use(cors());
app.use(express.json());

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

let pendingRequests = {};

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Frontend email endpoint
app.post('/send-email/front', (req, res) => {
  const { name, mobile, email, formType } = req.body;

  const mailOptions = {
    from: email,
    to: 'blackgrapes.arpinjain@gmail.com', // Replace with your email
    subject: 'New Meeting Registration',
    text: `Form Type: ${formType}\nName: ${name}\nMobile: ${mobile}\nEmail: ${email}`,
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return res.status(500).send('Error sending email');
    } else {
      res.status(200).send('Email sent successfully');
    }
  });
});

// Form submission with attachments
app.post('/send-email', upload.fields([
  { name: 'aadharCard', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
  { name: 'graduationMarksheet', maxCount: 1 },
  { name: 'passportSizePhoto', maxCount: 1 },
  { name: 'updatedResume', maxCount: 1 },
]), (req, res) => {
  const { fullName, fatherName, gender, batch, stream, collegeName, address, whatsappNumber, email, paymentMode, amount } = req.body;

  const mailOptions = {
    from: email,
    to: 'blackgrapes.arpinjain@gmail.com', // Replace with your email
    subject: 'Registration Form Submission',
    html: `
      <p>Full Name: ${fullName}<br>Father's Name: ${fatherName}<br>Gender: ${gender}<br>Batch: ${batch}<br>Stream: ${stream}<br>
      College Name: ${collegeName}<br>Address: ${address}<br>WhatsApp Number: ${whatsappNumber}<br>Email: ${email}<br>
      Payment Mode: ${paymentMode}<br>Amount: ${amount}</p>`,
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Error sending email');
    }
    res.status(200).send('Email sent successfully');
  });
});

// Payment Gateway Setup
const MERCHANT_KEY = process.env.MERCHANT_KEY;
const MERCHANT_ID = process.env.MERCHANT_ID;
const PAYMENT_URL = process.env.PAYMENT_URL;
const PAYMENT_STATUS_URL = process.env.PAYMENT_STATUS_URL;
const SUCCESS_URL = process.env.SUCCESS_URL;
const FAILURE_URL = process.env.FAILURE_URL;

// Create Order Route
app.post('/create-order', async (req, res) => {
  const { name, mobileNumber, amount } = req.body;
  const orderId = uuidv4();

  const paymentPayload = {
    merchantId: MERCHANT_ID,
    merchantUserId: name,
    mobileNumber: mobileNumber,
    amount: amount * 100,
    merchantTransactionId: orderId,
    redirectUrl: `http://localhost:8000/status?id=${orderId}`,
    redirectMode: 'POST',
    paymentInstrument: { type: 'PAY_PAGE' },
  };

  const payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
  const keyIndex = 1;
  const string = payload + '/pg/v1/pay' + MERCHANT_KEY;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256 + '###' + keyIndex;

  try {
    const response = await axios.post(PAYMENT_URL, { request: payload }, {
      headers: { 'Content-Type': 'application/json', 'X-VERIFY': checksum },
    });
    res.status(200).json({ url: response.data.data.instrumentResponse.redirectInfo.url });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send('Error creating order');
  }
});

// Payment Status Route
app.post('/status', async (req, res) => {
  const merchantTransactionId = req.query.id;
  const keyIndex = 1;
  const string = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256 + '###' + keyIndex;

  try {
    const response = await axios.get(`${PAYMENT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`, {
      headers: { 'X-VERIFY': checksum, 'X-MERCHANT-ID': MERCHANT_ID },
    });
    res.redirect(response.data.success ? SUCCESS_URL : FAILURE_URL);
  } catch (error) {
    console.error('Error checking payment status:', error);
    res.redirect(FAILURE_URL);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

