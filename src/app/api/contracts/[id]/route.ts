import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { ContractStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const uploadDir = path.join(process.cwd(), "public", "uploads", "contracts");
const statuses = new Set<string>(Object.values(ContractStatus));

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function notFound() {
  return NextResponse.json({ error: "Contract not found" }, { status: 404 });
}

function text(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function dateValue(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? new Date(`${value}T00:00:00`) : null;
}

async function saveContractFile(formData: FormData) {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return {};
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Only PDF files are allowed");
  }

  await mkdir(uploadDir, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const fileName = `${randomUUID()}-${safeName}`;
  const filePath = path.join(uploadDir, fileName);
  const bytes = await file.arrayBuffer();

  await writeFile(filePath, Buffer.from(bytes));

  return {
    fileName: file.name,
    fileUrl: `/uploads/contracts/${fileName}`,
  };
}

async function contractDataFromFormData(formData: FormData) {
  const title = text(formData, "title");
  const value = Number(text(formData, "value"));
  const clientId = text(formData, "clientId");
  const startDate = dateValue(formData, "startDate");
  const status = text(formData, "status") ?? ContractStatus.EM_ANDAMENTO;

  if (!title) {
    throw new Error("Title is required");
  }

  if (!clientId) {
    throw new Error("Client is required");
  }

  if (!Number.isFinite(value)) {
    throw new Error("Value is required");
  }

  if (!startDate || Number.isNaN(startDate.getTime())) {
    throw new Error("Start date is required");
  }

  if (!statuses.has(status)) {
    throw new Error("Invalid status");
  }

  return {
    title,
    description: text(formData, "description"),
    value,
    paymentType: text(formData, "paymentType"),
    status: status as ContractStatus,
    startDate,
    deliveryDate: dateValue(formData, "deliveryDate"),
    dueDate: dateValue(formData, "dueDate"),
    clientId,
    ...(await saveContractFile(formData)),
  };
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
  const contract = await prisma.contract.findUnique({
    where: { id },
    include: { client: true },
  });

  if (!contract) {
    return notFound();
  }

  return NextResponse.json(contract);
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

  try {
    const formData = await request.formData();
    const contract = await prisma.contract.update({
      where: { id },
      data: await contractDataFromFormData(formData),
      include: { client: true },
    });

    return NextResponse.json(contract);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFound();
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
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
    await prisma.contract.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return notFound();
    }

    throw error;
  }

  return NextResponse.json({ success: true });
}
