# Flask API Endpoints Required

## Authentication Endpoints

### POST /api/login
```json
Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "jwt-token-here",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com", 
    "name": "User Name"
  }
}
```

### POST /api/register
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name" // optional
}

Response:
{
  "access_token": "jwt-token-here",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

## Dashboard Endpoints

### GET /api/dashboard
**Headers:** Authorization: Bearer {jwt-token}

```json
Response:
{
  "totalTickets": 25,
  "overdueTickets": 3,
  "serverAlerts": 2,
  "avgServiceTime": "2h 15min",
  "resolutionRate": 94,
  "byResponsible": [
    {
      "name": "João Silva",
      "tickets": 8,
      "color": "#3b82f6"
    },
    {
      "name": "Maria Santos", 
      "tickets": 6,
      "color": "#10b981"
    },
    {
      "name": "Pedro Costa",
      "tickets": 4,
      "color": "#f59e0b"
    }
  ]
}
```

## Ticket Management Endpoints

### GET /api/tickets
**Headers:** Authorization: Bearer {jwt-token}

```json
Response: [
  {
    "id": "ticket-uuid",
    "title": "Server Error 500",
    "description": "Internal server error on API",
    "status": "open", // "open" | "in_progress" | "closed"
    "priority": "high", // "low" | "medium" | "high" | "critical"
    "assigned_to": "João Silva",
    "created_at": "2025-01-21T10:00:00Z",
    "updated_at": "2025-01-21T10:00:00Z"
  }
]
```

### POST /api/tickets
**Headers:** Authorization: Bearer {jwt-token}

```json
Request:
{
  "title": "New Issue",
  "description": "Description of the issue",
  "status": "open",
  "priority": "medium",
  "assigned_to": "João Silva"
}

Response:
{
  "id": "ticket-uuid",
  "title": "New Issue",
  "description": "Description of the issue",
  "status": "open",
  "priority": "medium", 
  "assigned_to": "João Silva",
  "created_at": "2025-01-21T10:00:00Z",
  "updated_at": "2025-01-21T10:00:00Z"
}
```

### PUT /api/tickets/{id}
**Headers:** Authorization: Bearer {jwt-token}

```json
Request:
{
  "status": "closed",
  "priority": "low"
}

Response:
{
  "id": "ticket-uuid",
  "title": "Updated Issue",
  "description": "Updated description",
  "status": "closed",
  "priority": "low",
  "assigned_to": "João Silva",
  "created_at": "2025-01-21T10:00:00Z", 
  "updated_at": "2025-01-21T12:00:00Z"
}
```

## User Profile Endpoint

### GET /api/profile
**Headers:** Authorization: Bearer {jwt-token}

```json
Response:
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "User Name"
}
```

## Required Flask Configuration

### CORS Setup
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"]) # Vite dev server
```

### JWT Middleware
```python
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app.config['JWT_SECRET_KEY'] = 'your-secret-key-here'
jwt = JWTManager(app)

@app.route('/api/login', methods=['POST'])
def login():
    # Validate credentials
    access_token = create_access_token(identity=user_id)
    return jsonify(access_token=access_token, user=user_data)

@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    user_id = get_jwt_identity()
    # Return dashboard data
```

## Error Response Format
```json
{
  "message": "Error description",
  "status": 400
}
```