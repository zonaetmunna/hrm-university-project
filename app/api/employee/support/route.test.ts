import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { GET, POST, PUT } from "./route";

// Mock the necessary dependencies
jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    user: {
      findUnique: jest.fn(),
    },
    supportTicket: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    ticketMessage: {
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// Mock the console.error to prevent test output clutter
jest.spyOn(console, "error").mockImplementation(() => {});

describe("Support Ticket API", () => {
  let mockPrisma: any;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockPrisma = new PrismaClient();
    
    // Mock the NextRequest
    global.Request = jest.fn().mockImplementation((url, options) => {
      return {
        url,
        json: jest.fn().mockResolvedValue(options?.body ? JSON.parse(options.body) : {}),
      };
    }) as any;
  });

  describe("GET /api/employee/support", () => {
    it("should return 401 if user is not authenticated", async () => {
      // Setup
      (getServerSession as jest.Mock).mockResolvedValue(null);
      const req = new NextRequest("http://localhost/api/employee/support");
      
      // Execute
      const response = await GET(req);
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(401);
      expect(data.error).toBe("You must be signed in to access this endpoint");
    });

    it("should return 404 if user not found", async () => {
      // Setup
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { email: "test@example.com" }
      });
      mockPrisma.user.findUnique.mockResolvedValue(null);
      
      const req = new NextRequest("http://localhost/api/employee/support");
      
      // Execute
      const response = await GET(req);
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(404);
      expect(data.error).toBe("User not found");
    });

    it("should return a specific ticket when ticketId is provided", async () => {
      // Setup
      const mockUser = { 
        id: "user1", 
        email: "test@example.com", 
        role: "employee" 
      };
      const mockTicket = { 
        id: "ticket1", 
        title: "Test Ticket", 
        creatorId: "user1" 
      };
      
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { email: mockUser.email }
      });
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.supportTicket.findUnique.mockResolvedValue(mockTicket);
      
      const req = new NextRequest("http://localhost/api/employee/support?id=ticket1");
      
      // Execute
      const response = await GET(req);
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual(mockTicket);
      expect(mockPrisma.supportTicket.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: "ticket1" }
      }));
    });

    it("should return all tickets for admin users", async () => {
      // Setup
      const mockUser = { 
        id: "admin1", 
        email: "admin@example.com", 
        role: "admin" 
      };
      const mockTickets = [
        { id: "ticket1", title: "Test Ticket 1", creatorId: "user1", status: "Pending" },
        { id: "ticket2", title: "Test Ticket 2", creatorId: "user2", status: "Resolved" }
      ];
      
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { email: mockUser.email }
      });
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.supportTicket.findMany.mockResolvedValue(mockTickets);
      
      const req = new NextRequest("http://localhost/api/employee/support");
      
      // Execute
      const response = await GET(req);
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(200);
      expect(data.tickets).toEqual(mockTickets);
      expect(data.stats.totalTickets).toBe(2);
      expect(data.stats.activeTickets).toBe(1);
      expect(data.stats.resolvedTickets).toBe(1);
    });
  });

  describe("POST /api/employee/support", () => {
    it("should return 401 if user is not authenticated", async () => {
      // Setup
      (getServerSession as jest.Mock).mockResolvedValue(null);
      const req = new NextRequest("http://localhost/api/employee/support", {
        method: "POST",
        body: JSON.stringify({}),
      });
      
      // Execute
      const response = await POST(req);
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(401);
      expect(data.error).toBe("You must be signed in to access this endpoint");
    });

    it("should return 400 if required fields are missing", async () => {
      // Setup
      const mockUser = { id: "user1", email: "test@example.com" };
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { email: mockUser.email }
      });
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      
      const req = new NextRequest("http://localhost/api/employee/support", {
        method: "POST",
        body: JSON.stringify({ title: "Test Ticket" }), // Missing description and department
      });
      
      // Execute
      const response = await POST(req);
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required fields");
    });

    it("should create a new ticket successfully", async () => {
      // Setup
      const mockUser = { id: "user1", email: "test@example.com" };
      const ticketData = {
        title: "Test Ticket",
        description: "This is a test ticket",
        department: "IT",
        message: "Initial message"
      };
      const createdTicket = {
        id: "ticket1",
        ...ticketData,
        creatorId: mockUser.id
      };
      
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { email: mockUser.email }
      });
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.supportTicket.create.mockResolvedValue(createdTicket);
      
      const req = new NextRequest("http://localhost/api/employee/support", {
        method: "POST",
        body: JSON.stringify(ticketData),
      });
      
      // Execute
      const response = await POST(req);
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(201);
      expect(data).toEqual(createdTicket);
      expect(mockPrisma.supportTicket.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          title: ticketData.title,
          description: ticketData.description,
          department: ticketData.department,
          creatorId: mockUser.id
        })
      }));
      expect(mockPrisma.ticketMessage.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          content: ticketData.message,
          userId: mockUser.id,
          ticketId: createdTicket.id
        })
      }));
    });
  });

  describe("PUT /api/employee/support", () => {
    it("should return 401 if user is not authenticated", async () => {
      // Setup
      (getServerSession as jest.Mock).mockResolvedValue(null);
      const req = new NextRequest("http://localhost/api/employee/support", {
        method: "PUT",
        body: JSON.stringify({}),
      });
      
      // Execute
      const response = await PUT(req);
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(401);
      expect(data.error).toBe("You must be signed in to access this endpoint");
    });

    it("should return 400 if ticket ID is missing", async () => {
      // Setup
      const mockUser = { id: "user1", email: "test@example.com" };
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { email: mockUser.email }
      });
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      
      const req = new NextRequest("http://localhost/api/employee/support", {
        method: "PUT",
        body: JSON.stringify({ status: "Resolved" }), // Missing id
      });
      
      // Execute
      const response = await PUT(req);
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(400);
      expect(data.error).toBe("Ticket ID is required");
    });

    it("should return 404 if ticket not found", async () => {
      // Setup
      const mockUser = { id: "user1", email: "test@example.com" };
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { email: mockUser.email }
      });
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.supportTicket.findUnique.mockResolvedValue(null);
      
      const req = new NextRequest("http://localhost/api/employee/support", {
        method: "PUT",
        body: JSON.stringify({ id: "non-existent-ticket" }),
      });
      
      // Execute
      const response = await PUT(req);
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(404);
      expect(data.error).toBe("Ticket not found");
    });

    it("should update a ticket and add a message successfully", async () => {
      // Setup
      const mockUser = { 
        id: "user1", 
        email: "test@example.com", 
        role: "admin" 
      };
      const existingTicket = {
        id: "ticket1",
        title: "Test Ticket",
        creatorId: "user2", // Different user
        status: "Pending"
      };
      const updatedTicket = {
        ...existingTicket,
        status: "Resolved",
        messages: [{ id: "msg1", content: "Resolving this ticket", userId: mockUser.id }]
      };
      
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { email: mockUser.email }
      });
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.supportTicket.findUnique.mockResolvedValue(existingTicket);
      mockPrisma.supportTicket.update.mockResolvedValue({ ...existingTicket, status: "Resolved" });
      mockPrisma.ticketMessage.create.mockResolvedValue({ 
        id: "msg1", 
        content: "Resolving this ticket", 
        userId: mockUser.id 
      });
      mockPrisma.supportTicket.findUnique.mockResolvedValueOnce(updatedTicket);
      
      const req = new NextRequest("http://localhost/api/employee/support", {
        method: "PUT",
        body: JSON.stringify({ 
          id: "ticket1", 
          status: "Resolved",
          message: "Resolving this ticket"
        }),
      });
      
      // Execute
      const response = await PUT(req);
      const data = await response.json();
      
      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual(updatedTicket);
      expect(mockPrisma.supportTicket.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: "ticket1" },
        data: expect.objectContaining({
          status: "Resolved"
        })
      }));
      expect(mockPrisma.ticketMessage.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          content: "Resolving this ticket",
          userId: mockUser.id,
          ticketId: "ticket1"
        })
      }));
    });
  });
}); 