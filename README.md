# PAF_Project_SmartCampus
This project is a Smart Campus Operations Hub developed using a Spring Boot REST API and a React web application to manage facilities, bookings, and maintenance incident handling. It allows users to report issues, upload attachments, and track technician updates through a structured workflow with role-based access control.

## Google Sign-In setup (required)

If **Continue with Google** fails, configure these before starting backend:

1. Create OAuth 2.0 client in Google Cloud Console.
2. Add authorized redirect URI:
	- `http://localhost:8080/login/oauth2/code/google`
3. Export environment variables in your terminal:
	- `GOOGLE_CLIENT_ID`
	- `GOOGLE_CLIENT_SECRET`

Example (macOS zsh):

- `export GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"`
- `export GOOGLE_CLIENT_SECRET="your-client-secret"`

Then restart backend and frontend.
