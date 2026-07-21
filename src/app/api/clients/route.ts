import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function cleanText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const text = value.trim();
  return text ? text : null;
}

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return unauthorized();
  }

  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { contracts: true } } },
  });

  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return unauthorized();
  }

  const body = await request.json();
  const name = cleanText(body.name);

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const client = await prisma.client.create({
    data: {
      name,
      email: cleanText(body.email),
      phone: cleanText(body.phone),
      company: cleanText(body.company),
      notes: cleanText(body.notes),
    },
    include: { _count: { select: { contracts: true } } },
  });

  return NextResponse.json(client, { status: 201 });
}
