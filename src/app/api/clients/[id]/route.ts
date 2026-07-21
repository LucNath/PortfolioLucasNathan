import { Prisma } from "@prisma/client";
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

function notFound() {
  return NextResponse.json({ error: "Client not found" }, { status: 404 });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user) {
    return unauthorized();
  }

  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      contracts: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) {
    return notFound();
  }

  return NextResponse.json(client);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user) {
    return unauthorized();
  }

  const { id } = await params;
  const body = await request.json();
  const name = cleanText(body.name);

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const client = await prisma.client.update({
      where: { id },
      data: {
        name,
        email: cleanText(body.email),
        phone: cleanText(body.phone),
        company: cleanText(body.company),
        notes: cleanText(body.notes),
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFound();
    }

    throw error;
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user) {
    return unauthorized();
  }

  const { id } = await params;

  try {
    await prisma.client.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFound();
    }

    throw error;
  }

  return NextResponse.json({ success: true });
}
