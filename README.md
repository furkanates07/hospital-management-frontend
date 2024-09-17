# # Hospital Managament Systems Frontend

This is the frontend project for the Hospital Management System, which has been developed using **Vue.js**, **Pinia**, **Tailwind CSS**, and **TypeScript**. The backend of this project was built using **NestJS**.

## Features

### Patient Features

- **Manage Personal Information**: Patients can view and update their personal details such as name, phone number, password and emergency contacts.
- **View Medical History**: Patients can access and review their medical history and past conditions.
- **Appointment Management**:
  - View the status of appointments (pending, approved, canceled, rejected, completed).
  - Schedule new appointments with available doctors.
  - Cancel existing appointments if necessary.

### Doctor Features

- **Appointment Management**:
  - Approve, reject, or mark patient appointments as completed.
- **Examination Section**:
  - View and update patient medical records and history.
  - Write and update prescriptions for patients.

## Images

### Common Features

- **Login**
  ![Login](/src/images/login.png)

### Patient Features

- **Register**
  ![Register](/src/images/register.png)

- **Home**
  ![Home](/src/images/patient/patient-home.png)

- **Appointments**
  ![Appointments](/src/images/patient/patient-appointment.png)
  ![Select Doctor for Create Appointment](/src/images/patient/doctor-list.png)
  ![New Appointment](/src/images/patient/create-appointment.png)

- **Medical Records**
  ![Medical Records](/src/images/patient/patient-medical-records.png)

- **Profile**
  ![Details](/src/images/patient/patient-profile-1.png)
  ![Emergency Contacts](/src/images/patient/patient-profile-2.png)

### Doctor Features

- **Home**
  ![Home](/src/images/doctor/doctor-home.png)

- **Appointments**
  ![Appointments](/src/images/doctor/doctor-appointment.png)
  ![Examination](/src/images/doctor/doctor-examination.png)

- **Profile**
  ![Profile](/src/images/doctor/doctor-profile.png)

## Technologies Used

- **TypeScript**: A statically typed language that enhances JavaScript with better tooling and error prevention.
  <br><a href="https://www.typescriptlang.org/" target="_blank">TypeScript Website</a>

- **Vue.js**: A progressive JavaScript framework for building user interfaces, used with both Composition and Options API.
  <br><a href="https://vuejs.org/" target="_blank">Vue.js Website</a>

- **Pinia**: A simple and modern state management library for Vue.js, providing centralized and reactive state management.
  <br><a href="https://pinia.vuejs.org/" target="_blank">Pinia Website</a>

- **Tailwind CSS**: A utility-first CSS framework for rapid UI development with a mobile-first and responsive design approach.
  <br><a href="https://tailwindcss.com/" target="_blank">Tailwind CSS Website</a>

- **HTML**: The standard markup language used to create and structure the content on the web.
  <br><a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank">HTML Documentation</a>

## Installation

To run the frontend project, you need to have the backend server up and running. Please follow these steps:

1. **Clone the Backend Repository**: - Clone the backend repository and follow its README instructions to set it up and run it.

- Backend repository: [hospital-management-backend](https://github.com/furkanates07/hospital-management-backend)

2. Clone the repository: `https://github.com/furkanates07/hospital-management-frontend.git`

3. Navigate to the project directory: `cd hospital-management-system-frontend`

4. Install dependencies: `npm install`

5. Set up your baseURL from src/services/apiclient.ts

6. Run the project: `npm run dev`

## Contributing

Feel free to submit issues or pull requests if you find any bugs or want to add new features.
