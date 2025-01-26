# Authentication API Endpoints

## Endpoints

### 1. **Login**
   - **Endpoint**: `POST /auth/login`
   - **Description**: Authenticates a user using the local strategy and establishes a session upon successful login and sending a hashedId for the created session as a cookie which will be again send for further req to the backend.
   - **Request Body**:
     ```json
     {
       "username": "user123",
       "password": "password123"
     }
     ```
   - **Response**:
     - **Success**:
       ```json
       {
         "message": "Login successful"
       }
       ```
     - **Failure**:
       - **400 Bad Request**:
         ```json
         {
           "message": "Error message"
         }
         ```
       - **401 Unauthorized**:
         ```json
         {
           "message": "Authentication failed"
         }
         ```

### 2. **Sign Up**
   - **Endpoint**: `POST /auth/signup`
   - **Description**: Registers a new user by hashing their password and storing their credentials in the database.
   - **Request Body**:
     ```json
     {
       "username": "newuser",
       "password": "securepassword"
     }
     ```
   - **Response**:
     - **Success**:
       ```json
       {
         "message": "user successfully signed up",
         "data": {
           "_id": "user_id",
           "username": "newuser",
           "password": "hashed_password"
         }
       }
       ```
     - **Failure**:
       - **400 Bad Request**:
         ```json
         {
           "message": "Error message"
         }
         ```

### 3. **Logout**
   - **Endpoint**: `GET /auth/logout`
   - **Description**: Logs out the authenticated user and destroys the session.
   - **Response**:
     - **Success**:
       ```json
       {
         "message": "Logout successful"
       }
       ```
     - **Failure**:
       - **500 Internal Server Error**:
         ```json
         {
           "message": "Error message"
         }
         
