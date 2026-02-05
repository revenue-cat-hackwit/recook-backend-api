// Quick TypeScript check for withAuth
import type { NextResponse } from "next/server";
import { type AuthenticatedRequest, withAuth } from "./lib/authMiddleware";

// Test case that was failing before
const testHandler = withAuth<{ params: Promise<{ id: string }> }>(
  async (
    _req: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    console.log(id);
    return {} as NextResponse;
  },
);

export { testHandler };
