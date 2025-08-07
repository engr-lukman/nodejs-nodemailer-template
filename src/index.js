/**
 * Node.js Express Email Template Service
 * 
 * A simple Express.js application that provides email sending functionality
 * using Nodemailer with Handlebars templates for beautiful HTML emails.
 * 
 * Features:
 * - Express.js REST API
 * - Email sending with Handlebars templates
 * - Environment-based configuration
 * - Clean and maintainable code structure
 */

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON requests
app.use(express.json());

/**
 * Configure Nodemailer transporter
 * Uses environment variables for email service configuration
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.googlemail.com',
  port: parseInt(process.env.EMAIL_PORT, 10) || 465,
  secure: process.env.EMAIL_SECURE === 'true' || false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Configure Handlebars template engine for emails
 * Sets up paths for templates, layouts, and partials
 */
const handlebarOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: path.resolve('./src/templates/partials'),
    layoutsDir: path.resolve('./src/templates/layouts'),
    defaultLayout: 'main',
  },
  viewPath: path.resolve('./src/templates/'),
  extName: '.hbs',
};

// Register the Handlebars template engine with Nodemailer
transporter.use('compile', hbs(handlebarOptions));

/**
 * Health check endpoint
 * GET /health
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Email service is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Send welcome email endpoint
 * POST /send-welcome-email
 * 
 * Body parameters:
 * - to: recipient email address (required)
 * - username: recipient name (required)
 * - verificationLink: email verification URL (optional)
 */
app.post('/send-welcome-email', async (req, res) => {
  try {
    const { to, username, verificationLink } = req.body;

    // Validate required fields
    if (!to || !username) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Both "to" and "username" are required fields'
      });
    }

    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      replyTo: process.env.EMAIL_REPLY_TO,
      subject: 'Welcome to Our Platform!',
      template: 'welcome',
      context: {
        username: username,
        verification_link: verificationLink || '#',
        company_name: process.env.COMPANY_NAME,
        current_year: new Date().getFullYear()
      },
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Welcome email sent successfully',
      messageId: info.messageId,
      recipient: to
    });

  } catch (error) {
    console.error('Email sending failed:', error);
    
    res.status(500).json({
      error: 'Email sending failed',
      message: error.message
    });
  }
});

/**
 * Send custom email endpoint
 * POST /send-email
 * 
 * Body parameters:
 * - to: recipient email address (required)
 * - subject: email subject (required)
 * - template: template name (required)
 * - context: template variables (object)
 */
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, template, context } = req.body;

    // Validate required fields
    if (!to || !subject || !template) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: '"to", "subject", and "template" are required fields'
      });
    }

    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      replyTo: process.env.EMAIL_REPLY_TO,
      subject: subject,
      template: template,
      context: {
        ...context,
        company_name: process.env.COMPANY_NAME,
        current_year: new Date().getFullYear()
      },
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
      recipient: to
    });

  } catch (error) {
    console.error('Email sending failed:', error);
    
    res.status(500).json({
      error: 'Email sending failed',
      message: error.message
    });
  }
});

/**
 * Error handling middleware
 * Handles any unhandled errors in the application
 */
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);

  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end'
  });
});

/**
 * 404 handler for undefined routes
 */
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

/**
 * Start the Express server
 */
app.listen(PORT, () => {
  console.log(`Email service is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
