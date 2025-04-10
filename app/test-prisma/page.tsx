import { prisma } from "@/lib/prisma";

export default async function TestPrismaPage() {
  // Use this to test if Prisma is working
  let userCount = 0;
  let error: string | null = null;
  
  try {
    userCount = await prisma.user.count();
  } catch (e: any) {
    error = e.message || "An unknown error occurred";
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Prisma Connection Test</h1>
      
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Prisma is working correctly!</p>
          <p>Found {userCount} users in the database.</p>
        </div>
      )}
      
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Troubleshooting Tips:</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Make sure your PostgreSQL server is running</li>
          <li>Check your DATABASE_URL in the .env file</li>
          <li>Run <code className="bg-gray-100 px-2 py-1 rounded">npx prisma db push</code> to sync your schema</li>
          <li>Run <code className="bg-gray-100 px-2 py-1 rounded">npx prisma generate</code> to update the Prisma client</li>
        </ul>
      </div>
    </div>
  );
} 