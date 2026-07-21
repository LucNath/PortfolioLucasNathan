import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./DashboardClient";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const [clients, contracts] = await Promise.all([
    prisma.client.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { contracts: true } } },
    }),
    prisma.contract.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true },
    }),
  ]);

  return (
    <DashboardClient
      adminName={session.user.name ?? session.user.email ?? "Admin"}
      initialClients={clients.map((client) => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        notes: client.notes,
        contractsCount: client._count.contracts,
      }))}
      initialContracts={contracts.map((contract) => ({
        id: contract.id,
        title: contract.title,
        description: contract.description,
        value: contract.value,
        paymentType: contract.paymentType,
        status: contract.status,
        startDate: contract.startDate.toISOString(),
        deliveryDate: contract.deliveryDate?.toISOString() ?? null,
        dueDate: contract.dueDate?.toISOString() ?? null,
        fileUrl: contract.fileUrl,
        fileName: contract.fileName,
        createdAt: contract.createdAt.toISOString(),
        updatedAt: contract.updatedAt.toISOString(),
        clientId: contract.clientId,
        client: {
          id: contract.client.id,
          name: contract.client.name,
          email: contract.client.email,
          company: contract.client.company,
        },
      }))}
    />
  );
}
