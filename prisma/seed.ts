import { PrismaClient } from '@prisma/client'; // Ensure PrismaClient is correctly imported
import { hash } from 'bcryptjs'; // Importing hash function for password hashing

const prisma = new PrismaClient(); // Initialize Prisma Client for database operations

/**
 * Interfaces for typesafe data handling
 */
interface Department {
  id: string;
  name: string;
  description: string | null;
}

interface Departments {
  it: Department;
  hr: Department;
  finance: Department;
  marketing: Department;
  operations: Department;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface Users {
  admin: User;
  hr: User;
  leads: {
    it: User;
    marketing: User;
  };
  employees: {
    it1: User;
    it2: User;
    marketing: User;
    finance: User;
  };
}

/**
 * Seed script for HR Management System
 * Creates test data for development and demonstration
 * 
 * @version 1.0.0
 * @date 2025-04-10
 */
async function main(): Promise<void> {
  console.log('Starting database seed...');

  // Create departments
  const departments = await createDepartments();
  
  // Create users with different roles
  const users = await createUsers(departments);
  
  // Create HR data
  await createHRData(users);

  console.log('Database seed completed successfully!');
}

/**
 * Create departments for the organization
 * @returns Object containing department records
 */
async function createDepartments(): Promise<Departments> {
  console.log('Creating departments...');

  const itDepartment = await prisma.department.upsert({
    where: { name: 'IT' },
    update: {},
    create: {
      name: 'IT',
      description: 'Information Technology Department',
    },
  });

  const hrDepartment = await prisma.department.upsert({
    where: { name: 'HR' },
    update: {},
    create: {
      name: 'HR',
      description: 'Human Resources Department',
    },
  });

  const financeDepartment = await prisma.department.upsert({
    where: { name: 'Finance' },
    update: {},
    create: {
      name: 'Finance',
      description: 'Financial Management Department',
    },
  });
  
  const marketingDepartment = await prisma.department.upsert({
    where: { name: 'Marketing' },
    update: {},
    create: {
      name: 'Marketing',
      description: 'Marketing and Sales Department',
    },
  });

  const operationsDepartment = await prisma.department.upsert({
    where: { name: 'Operations' },
    update: {},
    create: {
      name: 'Operations',
      description: 'Operations and Logistics Department',
    },
  });

  console.log('Departments created successfully');
  return {
    it: itDepartment,
    hr: hrDepartment,
    finance: financeDepartment,
    marketing: marketingDepartment,
    operations: operationsDepartment
  };
}

/**
 * Create users with different roles
 * @param departments - Object containing department records
 * @returns Object containing user records by role
 */
async function createUsers(departments: Departments): Promise<Users> {
  console.log('Creating users...');

  // Create admin user
  const adminPassword = await hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
    },
  });

  // Create HR user
  const hrPassword = await hash('hr123', 10);
  const hr = await prisma.user.upsert({
    where: { email: 'hr@example.com' },
    update: {},
    create: {
      name: 'HR Manager',
      email: 'hr@example.com',
      password: hrPassword,
      role: 'hr',
      position: 'HR Manager',
      departmentId: departments.hr.id,
    },
  });

  // Create team leads
  const itLeadPassword = await hash('lead123', 10);
  const itLead = await prisma.user.upsert({
    where: { email: 'itlead@example.com' },
    update: {},
    create: {
      name: 'IT Team Lead',
      email: 'itlead@example.com',
      password: itLeadPassword,
      role: 'team_lead',
      position: 'IT Team Lead',
      departmentId: departments.it.id,
    },
  });

  const marketingLeadPassword = await hash('lead123', 10);
  const marketingLead = await prisma.user.upsert({
    where: { email: 'marketinglead@example.com' },
    update: {},
    create: {
      name: 'Marketing Team Lead',
      email: 'marketinglead@example.com',
      password: marketingLeadPassword,
      role: 'team_lead',
      position: 'Marketing Team Lead',
      departmentId: departments.marketing.id,
    },
  });

  // Create employees
  const employeePassword = await hash('employee123', 10);
  
  const itEmployee1 = await prisma.user.upsert({
    where: { email: 'itemployee1@example.com' },
    update: {},
    create: {
      name: 'John Developer',
      email: 'itemployee1@example.com',
      password: employeePassword,
      role: 'employee',
      position: 'Software Developer',
      departmentId: departments.it.id,
    },
  });

  const itEmployee2 = await prisma.user.upsert({
    where: { email: 'itemployee2@example.com' },
    update: {},
    create: {
      name: 'Jane QA',
      email: 'itemployee2@example.com',
      password: employeePassword,
      role: 'employee',
      position: 'QA Specialist',
      departmentId: departments.it.id,
    },
  });

  const marketingEmployee = await prisma.user.upsert({
    where: { email: 'marketingemployee@example.com' },
    update: {},
    create: {
      name: 'Mark Sales',
      email: 'marketingemployee@example.com',
      password: employeePassword,
      role: 'employee',
      position: 'Sales Representative',
      departmentId: departments.marketing.id,
    },
  });

  const financeEmployee = await prisma.user.upsert({
    where: { email: 'financeemployee@example.com' },
    update: {},
    create: {
      name: 'Finance Analyst',
      email: 'financeemployee@example.com',
      password: employeePassword,
      role: 'employee',
      position: 'Financial Analyst',
      departmentId: departments.finance.id,
    },
  });

  console.log('Users created successfully');
  return {
    admin,
    hr,
    leads: {
      it: itLead,
      marketing: marketingLead,
    },
    employees: {
      it1: itEmployee1,
      it2: itEmployee2,
      marketing: marketingEmployee,
      finance: financeEmployee,
    }
  };
}

/**
 * Create HR data (leaves, attendance, documents, payslips, etc.)
 * @param users - Object containing user records by role
 */
async function createHRData(users: Users): Promise<void> {
  console.log('Creating HR data...');

  // Create leaves
  await createLeaves(users);
  
  // Create attendance records
  await createAttendance(users);
  
  // Create support tickets
  await createSupportTickets(users);
  
  // Create announcements
  await createAnnouncements(users);
  
  // Create goals and performance metrics
  await createPerformanceData(users);
  
  // Create projects
  await createProjects();
  
  // Create payslips
  await createPayslips(users);

  console.log('HR data created successfully');
}

/**
 * Create leave records for users
 * @param users - Object containing user records by role
 */
async function createLeaves(users: Users): Promise<void> {
  // Leave for IT employee - approved
  await prisma.leave.upsert({
    where: { id: 'leave-test-1' },
    update: {},
    create: {
      id: 'leave-test-1',
      userId: users.employees.it1.id,
      type: 'Annual',
      startDate: new Date('2025-04-15'),
      endDate: new Date('2025-04-20'),
      status: 'approved',
      reason: 'Family vacation',
    },
  });

  // Leave for IT employee - pending
  await prisma.leave.upsert({
    where: { id: 'leave-test-2' },
    update: {},
    create: {
      id: 'leave-test-2',
      userId: users.employees.it2.id,
      type: 'Sick',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-05-03'),
      status: 'pending',
      reason: 'Not feeling well',
    },
  });

  // Leave for Marketing employee - rejected
  await prisma.leave.upsert({
    where: { id: 'leave-test-3' },
    update: {},
    create: {
      id: 'leave-test-3',
      userId: users.employees.marketing.id,
      type: 'Annual',
      startDate: new Date('2025-04-25'),
      endDate: new Date('2025-05-05'),
      status: 'rejected',
      reason: 'Personal travel',
    },
  });
}

/**
 * Create attendance records for users
 * @param users - Object containing user records by role
 */
async function createAttendance(users: Users): Promise<void> {
  // Today's attendance for IT employee 1
  await prisma.attendance.upsert({
    where: { id: 'attendance-test-1' },
    update: {},
    create: {
      id: 'attendance-test-1',
      userId: users.employees.it1.id,
      date: new Date(),
      checkIn: new Date(new Date().setHours(9, 0, 0, 0)),
      checkOut: null,
      status: 'present',
    },
  });

  // Yesterday's attendance for IT employee 1
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  await prisma.attendance.upsert({
    where: { id: 'attendance-test-2' },
    update: {},
    create: {
      id: 'attendance-test-2',
      userId: users.employees.it1.id,
      date: yesterday,
      checkIn: new Date(yesterday.setHours(9, 5, 0, 0)),
      checkOut: new Date(yesterday.setHours(18, 0, 0, 0)),
      status: 'present',
    },
  });

  // Absence for Marketing employee
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  await prisma.attendance.upsert({
    where: { id: 'attendance-test-3' },
    update: {},
    create: {
      id: 'attendance-test-3',
      userId: users.employees.marketing.id,
      date: twoDaysAgo,
      checkIn: null,
      checkOut: null,
      status: 'absent',
    },
  });
}

/**
 * Create support tickets for users
 * @param users - Object containing user records by role
 */
async function createSupportTickets(users: Users): Promise<void> {
  // Support ticket 1 - IT issue
  await prisma.supportTicket.upsert({
    where: { id: 'ticket-test-1' },
    update: {},
    create: {
      id: 'ticket-test-1',
      title: 'Cannot access email',
      description: 'I am unable to access my work email since this morning',
      department: 'IT',
      status: 'Pending',
      priority: 'High',
      creatorId: users.employees.marketing.id,
      assignedId: users.leads.it.id,
      messages: {
        create: [
          {
            content: 'I have tried restarting my computer but it still doesn\'t work',
            userId: users.employees.marketing.id,
          },
          {
            content: 'I\'ll look into this right away. Have you tried clearing your browser cache?',
            userId: users.leads.it.id,
          }
        ]
      }
    },
  });

  // Support ticket 2 - HR issue
  await prisma.supportTicket.upsert({
    where: { id: 'ticket-test-2' },
    update: {},
    create: {
      id: 'ticket-test-2',
      title: 'Benefits question',
      description: 'I need clarification on the health insurance coverage',
      department: 'HR',
      status: 'In Progress',
      priority: 'Normal',
      creatorId: users.employees.it2.id,
      assignedId: users.hr.id,
      messages: {
        create: [
          {
            content: 'Can you provide details about vision coverage?',
            userId: users.employees.it2.id,
          },
          {
            content: 'I will prepare a detailed document and share with you today',
            userId: users.hr.id,
          }
        ]
      }
    },
  });
}

/**
 * Create announcements for the system
 * @param users - Object containing user records by role
 */
async function createAnnouncements(users: Users): Promise<void> {
  await prisma.announcement.upsert({
    where: { id: 'announcement-test-1' },
    update: {},
    create: {
      id: 'announcement-test-1',
      title: 'Company Picnic',
      content: 'We will be having our annual company picnic next month. Please save the date!',
      date: new Date(),
      author: 'HR Department',
      category: 'Event',
      isImportant: true,
      userId: users.hr.id,
    },
  });

  await prisma.announcement.upsert({
    where: { id: 'announcement-test-2' },
    update: {},
    create: {
      id: 'announcement-test-2',
      title: 'System Maintenance',
      content: 'The HR system will be undergoing maintenance this weekend. Please complete any urgent tasks before Friday.',
      date: new Date(),
      author: 'IT Department',
      category: 'System',
      isImportant: false,
      userId: users.leads.it.id,
    },
  });
}

/**
 * Create goals and performance metrics for users
 * @param users - Object containing user records by role
 */
async function createPerformanceData(users: Users): Promise<void> {
  // Goals for IT employee
  await prisma.goal.upsert({
    where: { id: 'goal-test-1' },
    update: {},
    create: {
      id: 'goal-test-1',
      userId: users.employees.it1.id,
      title: 'Learn React',
      description: 'Complete advanced React training',
      category: 'Professional Development',
      target: 'Complete 3 online courses',
      progress: 65,
      status: 'In Progress',
    },
  });

  // Performance metrics for IT employee
  await prisma.performanceMetric.upsert({
    where: { id: 'perf-test-1' },
    update: {},
    create: {
      id: 'perf-test-1',
      userId: users.employees.it1.id,
      productivity: 85,
      taskCompletion: 90,
      qualityScore: 80,
      attendance: 95,
      status: 'Excellent',
      period: 'Q1 2025',
    },
  });

  // Performance metrics for Marketing employee
  await prisma.performanceMetric.upsert({
    where: { id: 'perf-test-2' },
    update: {},
    create: {
      id: 'perf-test-2',
      userId: users.employees.marketing.id,
      productivity: 75,
      taskCompletion: 80,
      qualityScore: 70,
      attendance: 85,
      status: 'Good',
      period: 'Q1 2025',
    },
  });
}

/**
 * Create projects for the organization
 */
async function createProjects(): Promise<void> {
  await prisma.project.upsert({
    where: { id: 'project-test-1' },
    update: {},
    create: {
      id: 'project-test-1',
      name: 'Website Redesign',
      description: 'Redesign company website with modern UI/UX',
      status: 'In Progress',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-06-30'),
    },
  });

  await prisma.project.upsert({
    where: { id: 'project-test-2' },
    update: {},
    create: {
      id: 'project-test-2',
      name: 'Marketing Campaign',
      description: 'Q2 digital marketing campaign',
      status: 'Planning',
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-07-15'),
    },
  });
}

/**
 * Create payslip records for employees
 * @param users - Object containing user records by role
 */
async function createPayslips(users: Users): Promise<void> {
  console.log('Creating payslips...');
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
  
  // Create payslips for the current year (up to current month)
  for (let month = 1; month <= currentMonth; month++) {
    // IT Employee 1 payslip
    await prisma.payslip.upsert({
      where: { 
        id: `payslip-it1-${currentYear}-${month}` 
      },
      update: {},
      create: {
        id: `payslip-it1-${currentYear}-${month}`,
        userId: users.employees.it1.id,
        month,
        year: currentYear,
        basicSalary: 5000,
        allowances: 500,
        deductions: 1150,
        netSalary: 4350,
        status: "paid",
      }
    });
    
    // IT Employee 2 payslip
    await prisma.payslip.upsert({
      where: { 
        id: `payslip-it2-${currentYear}-${month}` 
      },
      update: {},
      create: {
        id: `payslip-it2-${currentYear}-${month}`,
        userId: users.employees.it2.id,
        month,
        year: currentYear,
        basicSalary: 4500,
        allowances: 450,
        deductions: 1050,
        netSalary: 3900,
        status: "paid",
      }
    });
    
    // Marketing Employee payslip
    await prisma.payslip.upsert({
      where: { 
        id: `payslip-marketing-${currentYear}-${month}` 
      },
      update: {},
      create: {
        id: `payslip-marketing-${currentYear}-${month}`,
        userId: users.employees.marketing.id,
        month,
        year: currentYear,
        basicSalary: 4200,
        allowances: 600,
        deductions: 950,
        netSalary: 3850,
        status: "paid",
      }
    });
    
    // Finance Employee payslip
    await prisma.payslip.upsert({
      where: { 
        id: `payslip-finance-${currentYear}-${month}` 
      },
      update: {},
      create: {
        id: `payslip-finance-${currentYear}-${month}`,
        userId: users.employees.finance.id,
        month,
        year: currentYear,
        basicSalary: 4800,
        allowances: 400,
        deductions: 1100,
        netSalary: 4100,
        status: "paid",
      }
    });
  }
  
  // Create a pending payslip for next month if we're not in December
  if (currentMonth < 12) {
    const nextMonth = currentMonth + 1;
    
    // IT Employee 1 next month payslip (pending)
    await prisma.payslip.upsert({
      where: { 
        id: `payslip-it1-${currentYear}-${nextMonth}` 
      },
      update: {},
      create: {
        id: `payslip-it1-${currentYear}-${nextMonth}`,
        userId: users.employees.it1.id,
        month: nextMonth,
        year: currentYear,
        basicSalary: 5000,
        allowances: 500,
        deductions: 1150,
        netSalary: 4350,
        status: "pending",
      }
    });
    
    // IT Employee 2 next month payslip (pending)
    await prisma.payslip.upsert({
      where: { 
        id: `payslip-it2-${currentYear}-${nextMonth}` 
      },
      update: {},
      create: {
        id: `payslip-it2-${currentYear}-${nextMonth}`,
        userId: users.employees.it2.id,
        month: nextMonth,
        year: currentYear,
        basicSalary: 4500,
        allowances: 450,
        deductions: 1050,
        netSalary: 3900,
        status: "pending",
      }
    });
  }
  
  // Create previous year's payslips (December only for simplicity)
  const previousYear = currentYear - 1;
  
  // IT Employee 1 previous year payslip
  await prisma.payslip.upsert({
    where: { 
      id: `payslip-it1-${previousYear}-12` 
    },
    update: {},
    create: {
      id: `payslip-it1-${previousYear}-12`,
      userId: users.employees.it1.id,
      month: 12,
      year: previousYear,
      basicSalary: 4800, // Lower salary previous year
      allowances: 480,
      deductions: 1100,
      netSalary: 4180,
      status: "paid",
    }
  });
  
  // IT Employee 2 previous year payslip
  await prisma.payslip.upsert({
    where: { 
      id: `payslip-it2-${previousYear}-12` 
    },
    update: {},
    create: {
      id: `payslip-it2-${previousYear}-12`,
      userId: users.employees.it2.id,
      month: 12,
      year: previousYear,
      basicSalary: 4300, // Lower salary previous year
      allowances: 430,
      deductions: 1000,
      netSalary: 3730,
      status: "paid",
    }
  });
  
  console.log('Payslips created successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 