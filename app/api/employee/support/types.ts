/**
 * Support Ticket API Type Definitions
 * 
 * This file contains TypeScript interfaces for the Support Ticket API requests and responses.
 */

/**
 * Filter parameters for ticket queries
 */
export interface TicketQueryParams {
  id?: string;
  status?: 'Pending' | 'In Progress' | 'Resolved';
  department?: string;
  createdBy?: string;
}

/**
 * Basic user information
 */
export interface UserInfo {
  id: string;
  name?: string | null;
  email: string;
  role?: string;
}

/**
 * Message in a support ticket
 */
export interface TicketMessage {
  id: string;
  content: string;
  userId: string;
  ticketId: string;
  createdAt: Date;
  user?: UserInfo;
}

/**
 * Support ticket structure
 */
export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  department: string;
  status: string;
  priority: string;
  creatorId: string;
  assignedId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Ticket with additional message data
 */
export interface TicketWithMessages extends SupportTicket {
  messages: TicketMessage[];
  creator?: UserInfo;
  assignedTo?: UserInfo;
}

/**
 * Structure for multi-ticket response
 */
export interface TicketsResponse {
  tickets: SupportTicket[];
  stats: {
    totalTickets: number;
    activeTickets: number;
    resolvedTickets: number;
  };
}

/**
 * Response for a single ticket request
 */
export type SingleTicketResponse = TicketWithMessages;

/**
 * Request body for creating a new ticket
 */
export interface CreateTicketRequest {
  title: string;
  description: string;
  department: string;
  message?: string;
  priority?: 'Low' | 'Normal' | 'High' | 'Urgent';
  assignedId?: string;
}

/**
 * Request body for updating a ticket
 */
export interface UpdateTicketRequest {
  id: string;
  status?: 'Pending' | 'In Progress' | 'Resolved';
  message?: string;
  priority?: 'Low' | 'Normal' | 'High' | 'Urgent';
  assignedId?: string;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  error: string;
  code?: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL_ERROR';
  details?: string;
} 