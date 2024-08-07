## Installation:
After cloning the project simply from within the project directory run below command
```
npm install
```
## Starting the server
```
npm run dev
```

Then You're Good to Go

## Usage:
- You need to have postman installed to make some API calls first
- Using Postman:
  - Login to sever using shared credentials : https://ai-personal-trainer.onrender.com/api/auth/login/
  - Or register with your own new user : https://ai-personal-trainer.onrender.com/api/auth/register/
  __ From this step your goal is to get the access token and then pass it as Autherisation header for the following endpoint__
  - Getting session ID:https://ai-personal-trainer.onrender.com/stream/sessions/start/
  __ After getting a session ID you can use it from the front-end app by entering it in the acquired field __
