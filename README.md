# DB_Teb API

**DB_Teb API** is a comprehensive backend system for a shop tailored to individuals with diabetes. This API facilitates the management of vendors, product categories, products, exercise plans, dietary plans, and user authentication. The goal is to provide a structured backend for introducing and managing products and health-related resources for diabetes care.

---


# postman curl 

## baseurl = http://localhost:5000/ 

## Features

### 1. **Vendor Management**
- **GET** `/vendor/all`: Retrieve a list of all vendors.
- **POST** `/vendor/create`: Add a new vendor.  
  **Fields:** `{ website, name }`
- **POST** `/vendor/update/:vId`: Update an existing vendor by ID.  
  **Fields:** `{ website, name }`
- **DELETE** `/vendor/delete/:vId`: Delete a vendor by ID.

### 2. **Category Management**
- **GET** `/category/all`: Retrieve a list of all categories.
- **POST** `/category/create`: Add a new category.  
  **Fields:** `{ catName }`
- **POST** `/category/update/:catId`: Update an existing category by ID.  
  **Fields:** `{ catName }`
- **DELETE** `/category/delete/:catId`: Delete a category by ID.

### 3. **Product Management**
- **GET** `/product/all`: Retrieve a list of all products.
- **GET** `/product/all?search=test`: Retrieve a list of products including "test".
- **GET** `/product/all?sortPrice=asc(desc)`: Retrieve a list of products sorted by price in ascending (asc) or descending (desc) order.
- **GET** `/product/all?category=673493b9532ddb20a7bebad3`: Retrieve a list of products filtered by the specified category ID.
- **GET** `/product/:productId`: Retrieve a specific product by ID.
- **POST** `/product/create`: Add a new product.  
  **Fields:** `{ name, description, price, productUrl, categories, vendor, image }`
- **POST** `/product/update/:productId`: Update an existing product by ID.  
  **Fields:** `{ name, description, price, productUrl, categories, vendor, image }`
- **DELETE** `/product/delete/:productId`: Delete a product by ID.

### 4. **Exercise Management**
- **GET** `/exercise/all`: Retrieve a list of all exercises.
- **POST** `/exercise/create`: Add a new exercise.  
  **Fields:** `{ name, duration, intensity }`  
  **`intensity` Enum:** `['آسان', 'متوسط', 'دشوار']`
- **POST** `/exercise/update/:excId`: Update an existing exercise by ID.  
  **Fields:** `{ name, duration, intensity }`
- **DELETE** `/exercise/delete/:excId`: Delete an exercise by ID.

### 5. **Diet Management**
- **GET** `/diet/all`: Retrieve a list of all dietary plans.
- **POST** `/diet/create`: Add a new dietary plan.  
  **Fields:** `{ title, breakfast, lunch, dinner, snacks(optional) }`
- **POST** `/diet/update/:dietId`: Update an existing dietary plan by ID.  
  **Fields:** `{ title, breakfast, lunch, dinner, snacks(optional) }`
- **DELETE** `/diet/delete/:dietId`: Delete a dietary plan by ID.

### 6. **User Authentication**
- **POST** `/auth/signup`: Register a new user (admin or regular).  
  **Fields:** `{ email, password, role = 'user or admin' }`
- **POST** `/auth/signin`: Authenticate a user and retrieve a session token.  
  **Fields:** `{ email, password }`

---
## Getting Started

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>

2. Install dependencies:
     ```bash
    npm install
3. Create a .env file in the root directory with the following values:
    ```bash
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret_key>
    PORT=5000
4. To start the API server:
    ```bash
        npm run dev
    
    
The server will run on http://localhost:5000 by default.
