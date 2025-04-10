# Employee Support Ticket API

This API provides endpoints for managing employee support tickets within the HR Management System.

## API Endpoints

### GET /api/employee/support

Retrieves support tickets based on user roles and query parameters.

#### Query Parameters

- `id` (optional): Retrieves a specific ticket by ID
- `status` (optional): Filters tickets by status (e.g., "Pending", "In Progress", "Resolved")
- `department` (optional): Filters tickets by department
- `createdBy` (optional): Filters tickets created by a specific user ID

#### Response

- For a specific ticket:

  ```json
  {
    "id": "ticket-id",
    "title": "Ticket Title",
    "description": "Ticket Description",
    "department": "IT",
    "status": "Pending",
    "creatorId": "user-id",
    "createdAt": "2023-05-15T10:30:00Z",
    "updatedAt": "2023-05-15T10:30:00Z",
    "messages": [
      {
        "id": "message-id",
        "content": "Message content",
        "userId": "user-id",
        "createdAt": "2023-05-15T10:30:00Z"
      }
    ]
  }
  ```

- For multiple tickets:
  ```json
  {
    "tickets": [
      {
        "id": "ticket-id",
        "title": "Ticket Title",
        "description": "Ticket Description",
        "department": "IT",
        "status": "Pending",
        "creatorId": "user-id",
        "createdAt": "2023-05-15T10:30:00Z",
        "updatedAt": "2023-05-15T10:30:00Z"
      }
    ],
    "stats": {
      "totalTickets": 10,
      "activeTickets": 5,
      "resolvedTickets": 5
    }
  }
  ```

#### Access Control

- Employees can view only their own tickets
- Department staff can view tickets for their department
- Admins and HR staff can view all tickets

### POST /api/employee/support

Creates a new support ticket.

#### Request Body

```json
{
  "title": "Ticket Title",
  "description": "Detailed ticket description",
  "department": "IT",
  "message": "Optional initial message"
}
```

#### Required Fields

- `title`: The ticket title
- `description`: Detailed description of the issue
- `department`: Department the ticket should be directed to

#### Optional Fields

- `message`: Initial message to include with the ticket

#### Response

Returns the created ticket:

```json
{
  "id": "new-ticket-id",
  "title": "Ticket Title",
  "description": "Detailed ticket description",
  "department": "IT",
  "status": "Pending",
  "creatorId": "user-id",
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-15T10:30:00Z"
}
```

### PUT /api/employee/support

Updates an existing support ticket or adds a reply.

#### Request Body

```json
{
  "id": "ticket-id",
  "status": "Resolved",
  "message": "Ticket resolution details",
  "priority": "Normal",
  "assignedId": "staff-user-id"
}
```

#### Required Fields

- `id`: The ID of the ticket to update

#### Optional Fields

- `status`: Update the ticket status ("Pending", "In Progress", "Resolved")
- `message`: Add a new message to the ticket
- `priority`: Update ticket priority (Low, Normal, High, Urgent)
- `assignedId`: Assign the ticket to a user

#### Response

Returns the updated ticket with any new messages:

```json
{
  "id": "ticket-id",
  "title": "Ticket Title",
  "description": "Ticket Description",
  "department": "IT",
  "status": "Resolved",
  "creatorId": "user-id",
  "createdAt": "2023-05-15T10:30:00Z",
  "updatedAt": "2023-05-16T14:45:00Z",
  "messages": [
    {
      "id": "message-id",
      "content": "Initial message",
      "userId": "user-id",
      "createdAt": "2023-05-15T10:30:00Z"
    },
    {
      "id": "new-message-id",
      "content": "Ticket resolution details",
      "userId": "admin-id",
      "createdAt": "2023-05-16T14:45:00Z"
    }
  ]
}
```

## Access Control

- All authenticated users can create tickets
- Ticket creators can update their own tickets and add messages
- Department staff can update tickets in their department
- Admins and HR staff can update any ticket

## Error Handling

- 401: Unauthorized - User not authenticated
- 403: Forbidden - User does not have permission
- 404: Not Found - Ticket or user not found
- 400: Bad Request - Missing required fields
- 500: Internal Server Error - Server-side error

## Changelog

### Version 1.1.0 - 2023-11-25

- Fixed type definitions to properly align with Prisma schema models
- Updated SupportTicket and TicketMessage interfaces
- Improved type safety across API endpoints
- Updated priority values to match schema: 'Low', 'Normal', 'High', 'Urgent'
- Renamed assigneeId to assignedId to match schema field name

### Version 1.0.0 - 2023-11-04

- Initial implementation of support ticket API
- Added GET, POST, and PUT methods
- Implemented role-based access control
- Added comprehensive test coverage
