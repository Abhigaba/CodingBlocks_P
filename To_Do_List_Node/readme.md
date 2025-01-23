# To-Do List Application

This is a simple To-Do List application built using Node.js and MongoDB. The app allows users to manage tasks with priority-based functionality, including adding tasks, fetching all tasks, deleting tasks, and swapping task priorities (moving up or down).

## Features

- Add a new task to the list.
- Fetch all tasks with their details.
- Delete a task by its ID.
- Change the priority of a task (move up or down).

## Requirements

- [Node.js](https://nodejs.org/) installed on your system.
- [MongoDB](https://www.mongodb.com/) for the database.

## API Endpoints

### 1. **Fetch All Tasks**
   - **Endpoint**: `GET /fetchRouter`
   - **Description**: Retrieves all tasks stored in the database.
   - **Response**:
     ```json
     {
       "message": "Data fetched successfully",
       "data": [
         {
           "_id": "task_id",
           "name": "Sample Task",
           "priority": 1
         }
       ]
     }
     ```
### 2. **Add a New Task**
   - **Endpoint**:  `GET /addRoute/:task`
   - **Description**: Adds a new task to the database with a priority just greater than largest priority present in the database.
   - **Response**:
     ```json
     {
       "message": "Task added successfully",
       "task": {
         "_id": "task_id",
         "title": "New Task",
         "priority": "priority"
       }
     }
     ```
### 3. **Delete a Task**
   - **Endpoint**: `DELETE /deleteRouter/:taskId`
   - **Description**: Deletes a task using its unique ID.
   - **Response**:
     ```json
     {
       "message": "Task deleted successfully"
     }
     ```
### 4. **Update Task Priority**
   - **Endpoint**: `PATCH /priorityRouter/:taskPriorityid`
   - **Description**: Swaps the priority of a task with another task based on the provided direction (up or down) by calculating the just greater and just lesser priority elements.
   - **Request Body**:
     ```json
     {
       "priorityChange": "1" // Use '1' to move up or '-1' to move down
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Priorities successfully swapped"
     }
     ```

