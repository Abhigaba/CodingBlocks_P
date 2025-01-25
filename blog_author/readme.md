# API Documentation

## Introduction

This application serves as a backend API for managing blogs and authors. It is built using Node.js and Express.js, providing a robust and scalable architecture for handling CRUD operations on blogs and authors. The application includes endpoints for retrieving, adding, updating, and deleting data while maintaining relationships between authors and their blogs.

The primary features of the application include:

- **Author Management**: Allows the creation, retrieval, updating, and deletion of authors.
- **Blog Management**: Facilitates the creation, retrieval, updating, and deletion of blogs, along with linking them to their respective authors.
- **Data Integrity**: Ensures that deleting an author also removes all associated blogs to maintain consistency.
- **Error Handling**: Provides appropriate error messages and status codes for various scenarios, including validation errors and server issues.

## Requirements

- [Node.js](https://nodejs.org/) installed on your system.
- [MongoDB](https://www.mongodb.com/) for the database.
- [React] for the frontend

# Blog API Endpoints

## Endpoints

## BlogRoute 

### 1. **Fetch All Blogs**
   - **Endpoint**: `GET /blog/fetch`
   - **Description**: Retrieves all blogs stored in the database along with their associated authors.
   - **Response**:
     ```json
     {
       "message": "blogs fetched succesfully",
       "data": [
         {
           "_id": "blog_id",
           "title": "Sample Blog Title",
           "author": {
             "name": "Author Name",
             "imageUrl": "Author Image URL"
           },
           "content": "Blog Content"
         }
       ]
     }
     ```

### 2. **Fetch Blog by ID**
   - **Endpoint**: `GET /blog/fetch/:id`
   - **Description**: Retrieves a single blog by its unique ID, including the associated author's name.
   - **Response**:
     ```json
     {
       "message": "blogs fetched succesfully",
       "data": {
         "_id": "blog_id",
         "title": "Sample Blog Title",
         "author": {
           "name": "Author Name"
         },
         "content": "Blog Content"
       }
     }
     ```

### 3. **Add a New Blog**
   - **Endpoint**: `POST /blog/add`
   - **Description**: Adds a new blog to the database. Requires a valid author ID.
   - **Request Body**:
     ```json
     {
       "title": "New Blog Title",
       "author": "author_id",
       "content": "Blog Content"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "New blog successfully added",
       "data": {
         "_id": "new_blog_id",
         "title": "New Blog Title",
         "author": "author_id",
         "content": "Blog Content"
       }
     }
     ```

### 4. **Update a Blog**
   - **Endpoint**: `PATCH /blog/update/:id`
   - **Description**: Updates an existing blog's details by its unique ID.
   - **Request Body**:
     ```json
     {
       "title": "Updated Blog Title",
       "content": "Updated Content"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "User saved successfully"
     }
     ```

### 5. **Delete a Blog**
   - **Endpoint**: `DELETE /blog/delete/:id`
   - **Description**: Deletes a blog by its unique ID.
   - **Response**:
     ```json
     {
       "message": "User Deleted successfully"
     }
     

## AuthorRoute

### 1. **Fetch All Authors**
   - **Endpoint**: `GET /author/fetch`
   - **Description**: Retrieves all authors stored in the database.
   - **Response**:
     ```json
     {
       "message": "author fetched succesfully",
       "data": [
         {
           "_id": "author_id",
           "name": "Author Name",
           "otherFields": "..."
         }
       ]
     }
     ```

### 2. **Fetch Author by ID**
   - **Endpoint**: `GET /author/fetch/:id`
   - **Description**: Retrieves a single author by their unique ID.
   - **Response**:
     ```json
     {
       "message": "author fetched succesfully",
       "data": {
         "_id": "author_id",
         "name": "Author Name",
         "otherFields": "..."
       }
     }
     ```

### 3. **Add a New Author**
   - **Endpoint**: `POST /author/add`
   - **Description**: Adds a new author to the database.
   - **Request Body**:
     ```json
     {
       "name": "New Author Name",
       "otherFields": "..."
     }
     ```
   - **Response**:
     ```json
     {
       "message": "New author successfully added",
       "data": {
         "_id": "new_author_id",
         "name": "New Author Name",
         "otherFields": "..."
       }
     }
     ```

### 4. **Update an Author**
   - **Endpoint**: `PATCH /author/update/:id`
   - **Description**: Updates an existing author's details by their unique ID.
   - **Request Body**:
     ```json
     {
       "name": "Updated Author Name",
       "otherFields": "..."
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Author saved successfully"
     }
     ```

### 5. **Delete an Author**
   - **Endpoint**: `DELETE /author/delete/:id`
   - **Description**: Deletes an author by their unique ID and removes all blogs associated with that author.
   - **Response**:
     ```json
     {
       "message": "Author Deleted successfully"
     }
     ```
