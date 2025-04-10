import { NextResponse } from 'next/server';

// Mock data for demonstration
const mockProjects = [
  {
    id: '1',
    name: 'HR System Upgrade',
    description: 'Upgrading the existing HR management system with new features',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
  },
  {
    id: '2',
    name: 'Employee Training Portal',
    description: 'Development of a new employee training and certification portal',
    status: 'on-hold',
    startDate: '2024-02-15',
    endDate: '2024-08-15',
  },
  {
    id: '3',
    name: 'Performance Review System',
    description: 'Implementation of automated performance review system',
    status: 'completed',
    startDate: '2023-10-01',
    endDate: '2024-01-31',
  },
];

export async function GET() {
  try {
    // In a real application, this would fetch from a database
    return NextResponse.json(mockProjects);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.description || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real application, this would save to a database
    const newProject = {
      id: Date.now().toString(),
      status: 'active',
      ...body,
    };

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 