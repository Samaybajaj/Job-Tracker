# Job Application Tracker

A fullstack **Job Application Tracker** web application built with Java Spring Boot and MySQL. The app allows users to add, track, update, and manage their job applications in one place — with a visual dashboard showing application statistics by status.

## Tech Stack

- **Backend**: Java 17, Spring Boot 3.x
- **API**: Spring MVC REST Controllers
- **ORM**: Spring Data JPA + Hibernate
- **Database**: MySQL 8.0
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (Fetch API)
- **Build Tool**: Maven

## Database Setup

1. Make sure you have MySQL installed and running.
2. The application will automatically create the database schema based on the entities (using `spring.jpa.hibernate.ddl-auto=update`), but you need the database created.
3. Open MySQL shell and run:
   ```sql
   CREATE DATABASE IF NOT EXISTS job_tracker_db;
   ```
4. Update your `application.properties` with your MySQL username and password:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

## How to run the Spring Boot app

1. Open a terminal in the `job-tracker` folder.
2. Run the following Maven command:
   ```bash
   ./mvnw spring-boot:run
   ```
   Or if you don't have the wrapper, just use:
   ```bash
   mvn spring-boot:run
   ```
3. Once started, open your browser and go to `http://localhost:8080`

## Screenshots

*(Add screenshots here)*
