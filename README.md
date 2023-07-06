<span style="font-size: 18px;"><b>Attendance System</b></span>

This is a Node.js-based attendance system that allows users to log in and log out to track their attendance. The system stores the user's login time, IP address, location, and calculates their total hours for the day. It also determines the attendance status (absent, present, or half-day) based on the total hours.

**Features**

**User authentication**: Users can log in using their email and password.

**Attendance tracking**: The system records the user's login time, IP address, and location.

**Total hours calculation**: The system calculates the user's total hours for the day.

**Attendance status determination**: The system determines the user's attendance status based on the total hours.

**MongoDB integration**: The system uses MongoDB as the database to store attendance records.

**JWT token-based authentication**: JWT tokens are used for session management and authentication.

**Attendance status fetched from external API**

A new feature has been added to the system. The route `attendance/mark` includes a controller and model for marking attendance based on data fetched from an external API. The implementation of this feature sorts the data, accumulates hours, adjusts the hours and minutes, determines the attendance status, creates markAttendance instances, and saves them to the database.

**Requirements**

Node.js (18.16.0)

**Installation**

Clone the repository:

mkdir attendance-system
cd attendance-system
git clone https://github.com/mhamza415/authSystem.git

**Install the dependencies:**

npm install

Configure the environment variables:

Create a .env file in the project root directory.

Add the following environment variables to the .env file:

PORT=8000
NODE_ENV=development
MONGO_URI=mongodb+srv://hamza:1234@jwt-project.lhllnem.mongodb.net/hamza?retryWrites=true&w=majority (you may also add your own db link)

JWT_SECRET=1234abc

SESSION_SECRET=proshop

Start the application:

npm start

The application will be running at http://localhost:8000.

**Usage**

Register a user account by accessing the registration page (/user/register) and providing the required information.

Log in to the system using your registered email and password. You may also use the following admin credentials:

email: admin@proshop.com
password: 1234

After successful login, the system will record your login time, IP address, and location.

To log out, click on the "Log Out" button or navigate to the logout endpoint (/user/logout).

The system will calculate your total hours for the day and determine your attendance status (absent, present, or half-day).

You can view your attendance records and details by accessing the attendance page (/attendance).

**Contributing**

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

**License**

This project is licensed under the MIT License.

**Docker Image Link**

docker pull mhamza415/jwt-project-app:latest

This will pull the Docker image.

**Contact**

For any questions or inquiries, please contact me.

Email: mahamza415@gmail.com
