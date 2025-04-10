/**
 * Tests for the Support Ticket API type definitions
 */
import {
    CreateTicketRequest,
    ErrorResponse,
    SupportTicket,
    TicketMessage,
    TicketWithMessages,
    UpdateTicketRequest
} from './types';

describe('Support Ticket API Types', () => {
  test('SupportTicket structure is correctly defined', () => {
    // Create a valid SupportTicket object
    const ticket: SupportTicket = {
      id: 'ticket-1',
      title: 'Test Ticket',
      description: 'This is a test ticket',
      department: 'IT',
      status: 'Pending',
      priority: 'Normal',
      creatorId: 'user-1',
      assignedId: 'user-2',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // TypeScript will catch any type errors at compile time,
    // but we can also verify existence of properties at runtime
    expect(ticket).toHaveProperty('id');
    expect(ticket).toHaveProperty('title');
    expect(ticket).toHaveProperty('description');
    expect(ticket).toHaveProperty('department');
    expect(ticket).toHaveProperty('status');
    expect(ticket).toHaveProperty('priority');
    expect(ticket).toHaveProperty('creatorId');
    expect(ticket).toHaveProperty('assignedId');
    expect(ticket).toHaveProperty('createdAt');
    expect(ticket).toHaveProperty('updatedAt');
  });

  test('TicketMessage structure is correctly defined', () => {
    const message: TicketMessage = {
      id: 'message-1',
      content: 'This is a test message',
      userId: 'user-1',
      ticketId: 'ticket-1',
      createdAt: new Date(),
      user: {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'employee'
      }
    };

    expect(message).toHaveProperty('id');
    expect(message).toHaveProperty('content');
    expect(message).toHaveProperty('userId');
    expect(message).toHaveProperty('ticketId');
    expect(message).toHaveProperty('createdAt');
    expect(message.user).toHaveProperty('id');
    expect(message.user).toHaveProperty('email');
  });

  test('TicketWithMessages extends SupportTicket correctly', () => {
    const ticketWithMessages: TicketWithMessages = {
      id: 'ticket-1',
      title: 'Test Ticket',
      description: 'This is a test ticket',
      department: 'IT',
      status: 'Pending',
      priority: 'Normal',
      creatorId: 'user-1',
      assignedId: 'user-2',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          id: 'message-1',
          content: 'This is a test message',
          userId: 'user-1',
          ticketId: 'ticket-1',
          createdAt: new Date()
        }
      ],
      creator: {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'employee'
      },
      assignedTo: {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'support'
      }
    };

    // Verify SupportTicket properties
    expect(ticketWithMessages).toHaveProperty('id');
    expect(ticketWithMessages).toHaveProperty('title');
    expect(ticketWithMessages).toHaveProperty('description');
    
    // Verify extended properties
    expect(ticketWithMessages).toHaveProperty('messages');
    expect(Array.isArray(ticketWithMessages.messages)).toBe(true);
    expect(ticketWithMessages).toHaveProperty('creator');
    expect(ticketWithMessages).toHaveProperty('assignedTo');
  });

  test('CreateTicketRequest has required fields', () => {
    const createRequest: CreateTicketRequest = {
      title: 'New Ticket',
      description: 'This is a new ticket',
      department: 'IT',
      priority: 'High',
      message: 'Initial message'
    };

    expect(createRequest).toHaveProperty('title');
    expect(createRequest).toHaveProperty('description');
    expect(createRequest).toHaveProperty('department');
    expect(createRequest).toHaveProperty('priority');
    expect(createRequest).toHaveProperty('message');
  });

  test('UpdateTicketRequest has the correct structure', () => {
    const updateRequest: UpdateTicketRequest = {
      id: 'ticket-1',
      status: 'In Progress',
      priority: 'High',
      message: 'Update message',
      assignedId: 'user-3'
    };

    expect(updateRequest).toHaveProperty('id');
    expect(updateRequest).toHaveProperty('status');
    expect(updateRequest).toHaveProperty('priority');
    expect(updateRequest).toHaveProperty('message');
    expect(updateRequest).toHaveProperty('assignedId');
  });

  test('Error response has the correct structure', () => {
    const error: ErrorResponse = {
      error: 'An error occurred',
      code: 'BAD_REQUEST',
      details: 'Missing required fields'
    };

    expect(error).toHaveProperty('error');
    expect(error).toHaveProperty('code');
    expect(error).toHaveProperty('details');
  });
}); 