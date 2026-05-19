# TruckTruck – Lightweight Transport Management System

TruckTruck is a full-stack web application designed for small trucking and transport businesses to replace manual processes such as spreadsheets, whiteboards, paper job sheets, and phone calls with a centralized transport management system.

The system allows administrators and dispatchers to manage transport jobs, assign drivers, and monitor delivery progress through a single platform.

---

## Features

### Administrator / Dispatcher Features
- Create transport jobs
- Assign jobs to drivers
- View all jobs
- Update job details
- Edit job status
- Filter jobs
- Manage driver records
- View delivery schedules
- Track job progress

### Driver Features
- Login securely
- View assigned jobs
- Update job status
- Add delivery comments
- Mark jobs as completed

---

## Tech Stack

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Spring Security

### Frontend
- HTML
- CSS
- JavaScript

### Database
- MySQL

### Tools
- IntelliJ IDEA
- Postman
- MySQL Workbench
- Git / GitHub

---

## Database Structure

Main entities currently implemented:

### Driver
- Driver ID
- Name
- Phone Number
- License Number
- Truck Type
- Username
- Password

### Job
- Job ID
- Pickup Location
- Delivery Location
- Job Date
- Weight
- Truck Type
- Status
- Comments
- Assigned Driver

---

## Future Improvements

- Role-based authentication (Admin / Dispatcher / Driver)
- Driver self-service dashboard
- Calendar scheduling view
- Google Maps address lookup integration
- Advanced filtering and reporting
- Notification system
- Responsive mobile design

