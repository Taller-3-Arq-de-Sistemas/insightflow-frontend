# InsightFlow Frontend

A modern web application for managing users, workspaces, and documents built with Next.js 16, React 19, and TypeScript. This is the frontend client for the InsightFlow microservices ecosystem.

## Tech Stack

- **Next.js** 16.0.10 (App Router)
- **React** 19.2.0
- **TypeScript** 5
- **TanStack React Query** 5.90.12
- **React Hook Form** 7.68.0 + **Zod** 4.1.13
- **Axios** 1.13.2
- **Tailwind CSS** 4
- **Lucide React** (icons)
- **Radix UI** (Dialog, Label components)

## Pre-requisites

- [Node.js](https://nodejs.org/) (version 18+)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/Taller-3-Arq-de-Sistemas/insightflow-frontend.git
```

2. **Navigate to the project directory**

```bash
cd insightflow-frontend
```

3. **Install dependencies**

```bash
npm install
```

4. **Create environment file**

```bash
cp .env.example .env.local
```

Update the API URLs as needed:

```env
NEXT_PUBLIC_API_USERS_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_API_WORKSPACES_URL=https://insightflow-workspaces.onrender.com/api
NEXT_PUBLIC_API_DOCUMENTS_URL=https://insightflow-documents-y31i.onrender.com/documents
NEXT_PUBLIC_API_TASKS_URL=http://localhost:3000/api/v1/
NEXT_PUBLIC_TEST_USER_ID=your-test-user-id
```

5. **Start the development server**

```bash
npm run dev
```

The application will be running at http://localhost:3000.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Features

### Authentication
- Login and registration with JWT token management
- Role-based access control (Admin, User, Editor)
- Automatic token validation and refresh

### User Management
- List all users with search functionality
- Create and delete users (Admin only)
- Profile page for updating personal information (full name and username)

### Workspaces
- View workspaces the user belongs to
- Create new workspaces with name, description, theme, and image
- Edit workspace details
- Delete workspaces (soft delete, owner only)
- View workspace members and their roles

### Documents
- Create documents within workspaces
- Search documents by ID
- Edit document title and JSON content
- Delete documents (soft delete)

### Dashboard
- Statistics overview (total users, active, inactive)
- Quick actions for navigation
- Recent users list

## Project Structure

```
src/
├── api/                        # HTTP clients and services for Users API
│   ├── clients/                # Axios instances with interceptors
│   ├── services/               # Auth and Users service modules
│   └── tasks/                  # Tasks service
├── app/                        # Next.js App Router pages
│   ├── (auth)/                 # Login and register pages
│   ├── (dashboard)/            # Dashboard, users, and profile pages
│   ├── documents/              # Documents management page
│   ├── workspaces/             # Workspaces list page
│   └── workspace-detail/       # Workspace detail page
├── clients/                    # Additional API clients (Workspaces)
├── components/                 # React components
│   ├── ui/                     # Reusable UI components
│   └── workspaces/             # Workspace-specific components
├── context/                    # React Context (AuthContext)
├── hooks/                      # Custom React hooks
├── interfaces/                 # TypeScript interfaces
│   ├── documents/              # Document DTOs and responses
│   └── workspaces/             # Workspace DTOs and responses
├── lib/                        # Utility functions
├── services/                   # API services (Workspaces, Documents)
├── types/                      # TypeScript type definitions
└── views/                      # Page view components
```

## API Integration

This frontend connects to multiple InsightFlow microservices:

### Users Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Login with email and password |
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/logout` | Logout and invalidate token |
| POST | `/api/v1/auth/validate` | Validate a JWT token |
| GET | `/api/v1/users` | List all active users |
| GET | `/api/v1/users/{id}` | Get user by ID |
| POST | `/api/v1/users` | Create a new user (Admin only) |
| PATCH | `/api/v1/users/{id}` | Update user profile |
| DELETE | `/api/v1/users/{id}` | Delete user (Admin only) |

### Workspaces Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspaces/user/{userId}` | Get workspaces for a user |
| GET | `/api/workspaces/{id}` | Get workspace details |
| POST | `/api/workspaces/{ownerId}` | Create a new workspace |
| PATCH | `/api/workspaces/{id}` | Update workspace |
| DELETE | `/api/workspaces/{id}` | Delete workspace (soft delete) |

### Documents Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/documents/{id}` | Get document by ID |
| POST | `/documents` | Create a new document |
| PATCH | `/documents/{id}` | Update document |
| DELETE | `/documents/{id}` | Delete document (soft delete) |

### Tasks Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get tasks |
| GET | `/tasks/{id}` | Get task by ID |
| POST | `/tasks` | Create a new task |
| PATCH | `/tasks/{id}` | Update task |
| DELETE | `/tasks/{id}` | Delete task (soft delete) |

## Default Credentials

The backend seeder creates an admin user:

- **Email**: `jairo.calcina@admin.com`
- **Password**: `AReallyGoodP4ssw0rd`

## Deployment

### Firebase Hosting

The project includes GitHub Actions workflows for:
- Preview deployments on pull requests
- Production deployments on main branch merges

Build the project:

```bash
npm run build
```

## Author

- [@Jairo Calcina](https://github.com/Broukt)
