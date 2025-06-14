# University Trading Platform Frontend

This is the frontend for the University Trading Platform, built with React and Vite, using Material UI for components.

## Project Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd university-trading-platform-frontend
    ```

2.  **Install dependencies:**
    Make sure you have Node.js and npm (or yarn) installed.
    ```bash
    npm install
    # or
    # yarn install
    ```

## Development Server

To start the development server:

```bash
npm run dev
# or
# yarn dev
```

This will typically start the server on `http://localhost:3000`.
The application proxies API requests starting with `/api` to `http://localhost:8080` (configurable in `vite.config.js`). Make sure your backend Spring Boot application is running on the configured port.

## Building for Production

To create a production build:

```bash
npm run build
# or
# yarn build
```

The build artifacts will be located in the `dist/` directory.

## Linting

To run the linter:

```bash
npm run lint
# or
# yarn lint
```

## Project Structure

-   `public/`: Static assets.
-   `src/`: Source files.
    -   `App.jsx`: Main application component with routing.
    -   `main.jsx`: Entry point of the React application.
    -   `index.css`: Global styles.
    -   `components/`: (To be created) Reusable UI components.
    -   `pages/`: (To be created) Page-level components.
    -   `services/`: (To be created) API service functions.
    -   `contexts/`: (To be created) React context for global state management.
-   `index.html`: Main HTML file.
-   `vite.config.js`: Vite configuration.
-   `package.json`: Project dependencies and scripts.
-   `README.md`: This file.

## Backend Controllers Overview

This frontend is designed to interact with a backend that has the following controllers and primary functionalities:

*   **UserController:** Handles user registration, login, profile management, user listing, and status changes.
*   **GoodsController:** Manages goods including filtering, insertion, updates, fetching details, status changes, and type retrieval.
*   **ShopController:** Manages shop information, filtering, level and status updates, and name changes.
*   **DealController:** Handles deal creation, filtering, receipt confirmation, returns, and status updates. Includes automated tasks for deal completion.
*   **ShopCarController:** Manages shopping cart functionalities like adding items, updating counts, and retrieving cart contents.
*   **CommentController:** Handles comments on goods.

Make sure the backend API endpoints in `vite.config.js` and any API service files match the actual backend routes.