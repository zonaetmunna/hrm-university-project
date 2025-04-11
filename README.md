This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## HR Management System Components

### EmployeeProfile

The `EmployeeProfile` component is used to display and manage an employee's personal information, education, experience, skills, and documents.

#### Features

- Display employee personal information
- View education history
- View work experience
- View skills and documents
- Edit profile information through a dialog

#### Usage

```tsx
import { EmployeeProfile } from "@/components/dashboard/employee/employee-profile";

export default function EmployeeDashboard() {
  return (
    <div className="container mx-auto">
      <EmployeeProfile />
    </div>
  );
}
```

#### API Integration

The component integrates with the following API endpoints:

- `GET /api/employee/profile` - Fetches employee profile data
- `PUT /api/employee/profile` - Updates employee profile data

#### Data Structure

The component expects the following data structure from the API:

```typescript
interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatar?: string;
  initials?: string;
  position?: string;
  department?: string;
  joinDate?: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  documents: Document[];
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Experience {
  position: string;
  company: string;
  duration: string;
}

interface Document {
  name: string;
  type: string;
  size: string;
}
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
