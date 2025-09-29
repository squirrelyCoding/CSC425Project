# Deliverable 5: Message API

A RESTful API for a message board application built with Node.js, Express, and MongoDB. This project fulfills the requirements for Deliverable 5.

## Setup & Installation

1.  Clone the repository.
2.  Install the required dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory and add the following environment variables:
    ```
    MONGO_URI=<your_mongodb_connection_string>
    PORT=5000
    ```
4.  Start the server:
    ```bash
    node server.js
    ```

## Data Models

### User Model

| Field      | Type   | Validation       | Description            |
| :--------- | :----- | :--------------- | :--------------------- |
| `username` | String | Required, Unique | The user's screen name |
| `email`    | String | Required, Unique | The user's email       |

### Message Model

| Field   | Type     | Validation | Description                   |
| :------ | :------- | :--------- | :---------------------------- |
| `user`  | ObjectId | Required   | Reference to the User model.  |
| `text`  | String   | Required   | The content of the message.   |

## API Endpoints

Base URL: `http://localhost:5000/api`

### Message Routes

* **`POST /messages`**
    * **Description**: Creates a new message.
    * **Body**: `{ "user": "ObjectId", "text": "String" }`
    * **Response**: `201 Created` with the new message object.

* **`GET /messages`**
    * **Description**: Retrieves all messages.
    * **Response**: `200 OK` with an array of message objects.

* **`PUT /messages/:id`**
    * **Description**: Updates a message's text by its ID.
    * **Body**: `{ "text": "String" }`
    * **Response**: `200 OK` with the updated message object or `404 Not Found`.

* **`DELETE /messages/:id`**
    * **Description**: Deletes a message by its ID.
    * **Response**: `200 OK` with a success message or `404 Not Found`.