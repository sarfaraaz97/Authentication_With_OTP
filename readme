# Authentication With OTP 🔐

A comprehensive Spring Boot application implementing secure user authentication with OTP (One-Time Password) verification via email. This project features JWT-based authentication, email verification, password reset functionality, and a modern security architecture.

## ✨ Features

- **User Registration** with email verification
- **Secure Login** with OTP authentication 
- **JWT Token-based** authentication
- **Email OTP Verification** for registration and login
- **Password Reset** with OTP verification
- **Input Validation** with comprehensive error handling
- **Async Email Processing** for better performance
- **Automatic OTP Cleanup** with scheduled tasks
- **CORS Configuration** for frontend integration
- **PostgreSQL Database** integration
- **Rate Limiting** and security best practices

## 🛠️ Tech Stack

- **Backend Framework**: Spring Boot 3.4.3
- **Security**: Spring Security 6.x
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: PostgreSQL with JPA/Hibernate
- **Email Service**: Spring Boot Starter Mail (SMTP)
- **Validation**: Jakarta Bean Validation
- **Password Encryption**: BCrypt
- **Build Tool**: Maven
- **Java Version**: Java 23

## 📋 Prerequisites

Before running this application, ensure you have:

- **Java 23** or higher
- **Maven 3.6+**
- **PostgreSQL 12+**
- **Gmail Account** (for SMTP email service)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/sarfaraaz97/Authentication_With_OTP.git
cd Authentication_With_OTP/Backend
```

### 2. Database Setup
```sql
-- Create PostgreSQL database
CREATE DATABASE saffu;
-- The application will automatically create tables using JPA
```

### 3. Configure Application Properties
Update `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/saffu
spring.datasource.username=your_postgres_username
spring.datasource.password=your_postgres_password

# Email Configuration (Gmail SMTP)
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password  # Use Gmail App Password
```

### 4. Install Dependencies
```bash
mvn clean install
```

### 5. Run the Application
```bash
# Using Maven
mvn spring-boot:run

# Or using the wrapper (Linux/Mac)
./mvnw spring-boot:run

# Or using the wrapper (Windows)
mvnw.cmd spring-boot:run
```

The application will start on `http://localhost:8080`

## 📱 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/auth/register` | User registration | `RegisterRequest` |
| `POST` | `/auth/verify-registration` | Verify registration OTP | `OtpVerificationRequest` |
| `POST` | `/auth/login` | User login (sends OTP) | `LoginRequest` |
| `POST` | `/auth/verify-login` | Verify login OTP | `OtpVerificationRequest` |
| `POST` | `/auth/resend-otp` | Resend OTP | `ResendOtpRequest` |
| `POST` | `/auth/forgot-password` | Forgot password | `ForgotPasswordRequest` |
| `POST` | `/auth/reset-password` | Reset password with OTP | `ResetPasswordRequest` |

### Protected Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/home` | Home page | ✅ |
| `GET` | `/about` | About page | ✅ |
| `GET` | `/students` | Get students list | ✅ |
| `POST` | `/add` | Add student | ✅ |

## 📝 Request/Response Examples

### Registration Request
```json
POST /auth/register
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123"
}
```

### Login Request
```json
POST /auth/login
{
    "email": "john@example.com",
    "password": "securePassword123"
}
```

### OTP Verification Request
```json
POST /auth/verify-login
{
    "email": "john@example.com",
    "otp": "123456"
}
```

### Successful Login Response
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "username": "john_doe",
        "email": "john@example.com"
    }
}
```

## 🔧 Configuration

### Email Configuration (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password for your application
3. Use the App Password in `application.properties`

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_16_character_app_password
```

### JWT Configuration
- **Token Expiration**: 3 minutes (configurable in `JwtService.java`)
- **Secret Key**: Auto-generated using HmacSHA256
- **Algorithm**: HS256

### OTP Configuration
- **OTP Length**: 6 digits
- **Expiration Time**: 5 minutes
- **Cleanup Schedule**: Every hour

## 📁 Project Structure

```
Backend/
├── src/
│   ├── main/
│   │   ├── java/org/example/springsecurity/
│   │   │   ├── config/           # Security & CORS configuration
│   │   │   ├── controller/       # REST controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── exception/       # Global exception handling
│   │   │   ├── model/           # JPA entities
│   │   │   ├── repo/            # JPA repositories
│   │   │   ├── service/         # Business logic services
│   │   │   └── SpringSecurityApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── mvnw, mvnw.cmd              # Maven wrapper scripts
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### OTP Records Table
```sql
CREATE TABLE otp_records (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expiry_time TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(20) NOT NULL
);
```

## 🔒 Security Features

- **Password Hashing**: BCrypt with strength 12
- **JWT Authentication**: Stateless token-based auth
- **CORS Protection**: Configured for frontend integration
- **Input Validation**: Comprehensive validation with custom messages
- **OTP Expiration**: Time-based OTP invalidation
- **Rate Limiting**: Prevents OTP spam
- **SQL Injection Protection**: JPA/Hibernate parameter binding
- **Session Management**: Stateless session policy

## 🧪 Testing

### Run Tests
```bash
mvn test
```

### Test Coverage
```bash
mvn jacoco:report
```

### Manual API Testing
Use tools like Postman or curl to test the endpoints:

```bash
# Register a new user
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

## 🚀 Deployment

### Production Configuration
1. **Update application.properties** for production:
```properties
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
logging.level.org.springframework.security=WARN
```

2. **Environment Variables**:
```bash
export DB_URL=jdbc:postgresql://production-db:5432/authdb
export DB_USERNAME=prod_user
export DB_PASSWORD=secure_password
export MAIL_USERNAME=noreply@yourcompany.com
export MAIL_PASSWORD=app_password
```

### Docker Deployment
```dockerfile
FROM openjdk:23-jdk-slim
COPY target/SpringSecurity-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```bash
# Build and run
mvn clean package
docker build -t auth-otp-app .
docker run -p 8080:8080 auth-otp-app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow Spring Boot best practices
- Write unit tests for new features
- Update documentation
- Follow conventional commit messages
- Ensure code passes all existing tests

## 🐛 Troubleshooting

### Common Issues

1. **Email not sending**:
   - Verify Gmail App Password is correct
   - Check if 2FA is enabled on Gmail
   - Ensure firewall allows SMTP traffic

2. **Database connection errors**:
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database `saffu` exists

3. **JWT token issues**:
   - Check if token has expired (3 minutes)
   - Verify Authorization header format: `Bearer <token>`

4. **OTP not working**:
   - Check if OTP has expired (5 minutes)
   - Verify email address is correct
   - Check spam folder

## 📞 Support

For support and questions:
- **GitHub Issues**: [Create an issue](https://github.com/sarfaraaz97/Authentication_With_OTP/issues)
- **Email**: Contact the repository owner

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Sarfaraaz** - [@sarfaraaz97](https://github.com/sarfaraaz97)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Spring Security for robust authentication features
- PostgreSQL for reliable database service
- Gmail SMTP for email delivery

---

## 🔄 Version History

- **v1.0.0** - Initial release with OTP authentication
- **v1.1.0** - Added password reset functionality
- **v1.2.0** - Improved error handling and validation

⭐ **Star this repository if you found it helpful!** ⭐
