# Node.js Email Template Service

A clean and simple Express.js application for sending beautiful HTML emails using Nodemailer and Handlebars templates.

## Features

- **Express.js REST API** - Simple HTTP endpoints for sending emails
- **Handlebars Templates** - Beautiful, responsive HTML email templates
- **Environment Configuration** - Secure configuration using environment variables
- **Clean Architecture** - Well-structured, maintainable code
- **Error Handling** - Comprehensive error handling and validation
- **Responsive Design** - Mobile-friendly email templates

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn package manager
- SMTP email service (Gmail, SendGrid, etc.)

## Quick Start

### 1. Clone and Install

```bash
# Navigate to project directory
cd nodejs-nodemailer-template

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Email Service Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourcompany.com
EMAIL_REPLY_TO=support@yourcompany.com

# Application Configuration
PORT=3000
COMPANY_NAME=Your Company Name
```

### 3. Start the Application

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Email service is running",
  "timestamp": "2025-08-07T10:30:00.000Z"
}
```

### Send Welcome Email
```http
POST /send-welcome-email
Content-Type: application/json

{
  "to": "user@example.com",
  "username": "John Doe",
  "verificationLink": "https://yourapp.com/verify?token=abc123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Welcome email sent successfully",
  "messageId": "<message-id>",
  "recipient": "user@example.com"
}
```

### Send Custom Email
```http
POST /send-email
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Custom Email Subject",
  "template": "welcome",
  "context": {
    "username": "John Doe",
    "verification_link": "https://example.com/verify"
  }
}
```

## Project Structure

```
src/
├── index.js                    # Main Express application
└── templates/
    ├── layouts/
    │   └── main.handlebars     # Main email layout template
    └── welcome.hbs             # Welcome email template
```

## Email Templates

The application uses Handlebars for templating with a responsive design system:

- **Main Layout** (`layouts/main.handlebars`) - Contains the overall email structure
- **Welcome Template** (`welcome.hbs`) - Specific content for welcome emails
- **Responsive Design** - Mobile-friendly with modern styling
- **Brand Colors** - Gradient design with professional appearance

### Template Variables

All templates have access to these variables:

- `company_name` - Your company name (from environment)
- `current_year` - Current year (automatically generated)
- Custom variables passed via the `context` parameter

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EMAIL_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP server port | `587` |
| `EMAIL_SECURE` | Use TLS/SSL | `false` |
| `EMAIL_USER` | SMTP username | - |
| `EMAIL_PASSWORD` | SMTP password/app password | - |
| `EMAIL_FROM` | Default sender address | `noreply@yourcompany.com` |
| `EMAIL_REPLY_TO` | Reply-to address | - |
| `PORT` | Server port | `3000` |
| `COMPANY_NAME` | Your company name | `Your Company` |

### Gmail Setup

1. Enable 2-factor authentication in your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use the app password in `EMAIL_PASSWORD`

## Development

### Available Scripts

```bash
# Start development server with auto-restart
npm run dev

# Start production server
npm start
```

### Adding New Templates

1. Create a new `.hbs` file in `src/templates/`
2. Use the existing template structure
3. Reference it in your API calls using the filename (without extension)

Example template (`src/templates/reset-password.hbs`):
```handlebars
<h2>Password Reset Request</h2>
<p>Hello {{username}},</p>
<p>Click the link below to reset your password:</p>
<a href="{{reset_link}}" class="btn">Reset Password</a>
```

## Security Best Practices

- Use environment variables for sensitive configuration
- Enable app passwords for Gmail instead of regular passwords
- Validate all input parameters
- Use HTTPS in production
- Implement rate limiting for production use

## Error Handling

The application includes comprehensive error handling:

- **400 Bad Request** - Missing required fields
- **404 Not Found** - Invalid routes
- **500 Internal Server Error** - Email sending failures

All errors return a consistent JSON format:
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Production Deployment

1. Set up environment variables on your hosting platform
2. Use a process manager like PM2
3. Configure reverse proxy (nginx/Apache)
4. Enable HTTPS/SSL
5. Set up monitoring and logging

## License

ISC License - Feel free to use this project for your applications.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Made with for developers who need clean email solutions**
