"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

type ContractStatus =
  | "EM_ANDAMENTO"
  | "AGUARDANDO_PAGAMENTO"
  | "PAGO"
  | "ATRASADO"
  | "CONCLUIDO"
  | "CANCELADO";

type ClientRecord = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  contractsCount: number;
};

type ContractRecord = {
  id: string;
  title: string;
  description: string | null;
  value: number;
  paymentType: string | null;
  status: ContractStatus;
  startDate: string;
  deliveryDate: string | null;
  dueDate: string | null;
  fileUrl: string | null;
  fileName: string | null;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  client: {
    id: string;
    name: string;
    email: string | null;
    company: string | null;
  };
};

type Props = {
  adminName: string;
  initialClients: ClientRecord[];
  initialContracts: ContractRecord[];
};

const statusOptions: { value: ContractStatus; label: string }[] = [
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "AGUARDANDO_PAGAMENTO", label: "Aguardando pagamento" },
  { value: "PAGO", label: "Pago" },
  { value: "ATRASADO", label: "Atrasado" },
  { value: "CONCLUIDO", label: "Concluido" },
  { value: "CANCELADO", label: "Cancelado" },
];

const receivableStatuses = new Set<ContractStatus>([
  "EM_ANDAMENTO",
  "AGUARDANDO_PAGAMENTO",
  "ATRASADO",
]);

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const emptyContractForm = {
  id: "",
  title: "",
  value: "",
  paymentType: "",
  status: "EM_ANDAMENTO" as ContractStatus,
  startDate: "",
  deliveryDate: "",
  dueDate: "",
  description: "",
  clientId: "",
  newClientName: "",
  newClientEmail: "",
  newClientPhone: "",
  newClientCompany: "",
};

function dateInputValue(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

function displayDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : "-";
}

function statusLabel(status: ContractStatus) {
  return statusOptions.find((option) => option.value === status)?.label ?? status;
}

async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "Nao foi possivel concluir a acao.");
  }

  return data as T;
}

export function DashboardClient({
  adminName,
  initialClients,
  initialContracts,
}: Props) {
  const [clients, setClients] = useState(initialClients);
  const [contracts, setContracts] = useState(initialContracts);
  const [statusFilter, setStatusFilter] = useState<"TODOS" | ContractStatus>("TODOS");
  const [clientFilter, setClientFilter] = useState("TODOS");
  const [form, setForm] = useState(emptyContractForm);
  const [useNewClient, setUseNewClient] = useState(initialClients.length === 0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredContracts = useMemo(() => {
    return contracts.filter((contract) => {
      const matchesStatus = statusFilter === "TODOS" || contract.status === statusFilter;
      const matchesClient = clientFilter === "TODOS" || contract.clientId === clientFilter;
      return matchesStatus && matchesClient;
    });
  }, [clientFilter, contracts, statusFilter]);

  const summary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return contracts.reduce(
      (acc, contract) => {
        if (receivableStatuses.has(contract.status)) {
          acc.receivable += contract.value;
        }

        if (contract.status === "ATRASADO") {
          acc.overdue += 1;
        }

        const updatedAt = new Date(contract.updatedAt);
        if (
          contract.status === "PAGO" &&
          updatedAt.getMonth() === currentMonth &&
          updatedAt.getFullYear() === currentYear
        ) {
          acc.paidThisMonth += contract.value;
        }

        return acc;
      },
      { receivable: 0, overdue: 0, paidThisMonth: 0 },
    );
  }, [contracts]);

  function updateForm(field: keyof typeof emptyContractForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function refreshData() {
    const [clientsResponse, contractsResponse] = await Promise.all([
      fetch("/api/clients"),
      fetch("/api/contracts"),
    ]);

    const [nextClients, nextContracts] = await Promise.all([
      readJson<(ClientRecord & { _count?: { contracts: number } })[]>(clientsResponse),
      readJson<ContractRecord[]>(contractsResponse),
    ]);

    setClients(
      nextClients.map((client) => ({
        ...client,
        contractsCount: client.contractsCount ?? client._count?.contracts ?? 0,
      })),
    );
    setContracts(nextContracts);
  }

  function startEdit(contract: ContractRecord) {
    setError("");
    setMessage("");
    setUseNewClient(false);
    setForm({
      id: contract.id,
      title: contract.title,
      value: String(contract.value),
      paymentType: contract.paymentType ?? "",
      status: contract.status,
      startDate: dateInputValue(contract.startDate),
      deliveryDate: dateInputValue(contract.deliveryDate),
      dueDate: dateInputValue(contract.dueDate),
      description: contract.description ?? "",
      clientId: contract.clientId,
      newClientName: "",
      newClientEmail: "",
      newClientPhone: "",
      newClientCompany: "",
    });
  }

  function resetForm() {
    setForm(emptyContractForm);
    setUseNewClient(clients.length === 0);
  }

  async function createClientIfNeeded() {
    if (!useNewClient) {
      return form.clientId;
    }

    const response = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.newClientName,
        email: form.newClientEmail,
        phone: form.newClientPhone,
        company: form.newClientCompany,
      }),
    });

    const client = await readJson<ClientRecord>(response);
    return client.id;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      if (!(formElement instanceof HTMLFormElement)) {
        throw new Error("Nao foi possivel ler os dados do formulario.");
      }

      const formData = new FormData(formElement);
      const clientId = await createClientIfNeeded();

      if (!clientId) {
        throw new Error("Selecione um cliente ou cadastre um novo.");
      }

      formData.set("clientId", clientId);

      const response = await fetch(
        form.id ? `/api/contracts/${form.id}` : "/api/contracts",
        {
          method: form.id ? "PATCH" : "POST",
          body: formData,
        },
      );

      await readJson<ContractRecord>(response);
      await refreshData();
      setMessage(form.id ? "Contrato atualizado." : "Contrato criado.");
      resetForm();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Nao foi possivel salvar o contrato.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(contractId: string) {
    setError("");
    setMessage("");

    const confirmed = window.confirm("Excluir este contrato?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: "DELETE",
      });
      await readJson<{ success: boolean }>(response);
      await refreshData();
      setMessage("Contrato excluido.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Nao foi possivel excluir o contrato.",
      );
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-6 text-[var(--ink)] sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.24em] text-[var(--signal)]">
              Painel admin
            </p>
            <h1 className="mt-2 font-display text-2xl text-[var(--ink)]">
              Contratos e clientes
            </h1>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">
              Sessao ativa: {adminName}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="rounded-md border border-[var(--border)] px-4 py-2 text-sm text-[var(--ink)] transition hover:border-[var(--data)] hover:text-[var(--data)]"
              href="/"
            >
              Site publico
            </Link>
            <button
              className="rounded-md border border-[var(--border)] px-4 py-2 text-sm text-[var(--ink)] transition hover:border-[var(--signal)] hover:text-[var(--signal)]"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              type="button"
            >
              Sair
            </button>
          </div>
        </header>

        <section className="grid gap-3 md:grid-cols-3">
          <SummaryCard label="Total a receber" value={moneyFormatter.format(summary.receivable)} />
          <SummaryCard label="Contratos atrasados" value={String(summary.overdue)} />
          <SummaryCard label="Pagos no mes" value={moneyFormatter.format(summary.paidThisMonth)} />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 border border-[var(--border)] bg-[var(--surface)] p-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block font-display text-xs uppercase tracking-[0.16em] text-[var(--data)]">
                  Status
                </span>
                <select
                  className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--data)]"
                  onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                  value={statusFilter}
                >
                  <option value="TODOS">Todos</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block font-display text-xs uppercase tracking-[0.16em] text-[var(--data)]">
                  Cliente
                </span>
                <select
                  className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] px-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--data)]"
                  onChange={(event) => setClientFilter(event.target.value)}
                  value={clientFilter}
                >
                  <option value="TODOS">Todos</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
              <div className={filteredContracts.length > 0 ? "overflow-x-auto" : ""}>
                <table
                  className={`w-full border-collapse text-left text-sm ${
                    filteredContracts.length > 0 ? "min-w-[860px]" : ""
                  }`}
                >
                  <thead className="bg-[var(--bg-elevated)] font-display text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                    <tr>
                      <th className="px-4 py-3">Contrato</th>
                      <th className="px-4 py-3">Cliente</th>
                      <th className="px-4 py-3">Valor</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Vencimento</th>
                      <th className="px-4 py-3">Arquivo</th>
                      <th className="px-4 py-3">Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContracts.map((contract) => (
                      <tr
                        className="border-t border-[var(--border)] align-top"
                        key={contract.id}
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-[var(--ink)]">{contract.title}</p>
                          <p className="mt-1 text-xs text-[var(--ink-muted)]">
                            Inicio {displayDate(contract.startDate)}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-[var(--ink-muted)]">
                          {contract.client.name}
                        </td>
                        <td className="px-4 py-3 text-[var(--ink)]">
                          {moneyFormatter.format(contract.value)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs text-[var(--signal)]">
                            {statusLabel(contract.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[var(--ink-muted)]">
                          {displayDate(contract.dueDate)}
                        </td>
                        <td className="px-4 py-3">
                          {contract.fileUrl ? (
                            <a
                              className="text-[var(--data)] hover:text-[var(--signal)]"
                              href={contract.fileUrl}
                              rel="noreferrer"
                              target="_blank"
                            >
                              PDF
                            </a>
                          ) : (
                            <span className="text-[var(--ink-faint)]">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              className="rounded-md border border-[var(--border)] px-3 py-1 text-xs text-[var(--ink)] hover:border-[var(--data)] hover:text-[var(--data)]"
                              onClick={() => startEdit(contract)}
                              type="button"
                            >
                              Editar
                            </button>
                            <button
                              className="rounded-md border border-[var(--border)] px-3 py-1 text-xs text-[var(--late)] hover:border-[var(--late)]"
                              onClick={() => handleDelete(contract.id)}
                              type="button"
                            >
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredContracts.length === 0 ? (
                      <tr>
                        <td
                          className="bg-[var(--surface)] px-4 py-12 text-center text-sm text-[var(--ink-muted)]"
                          colSpan={7}
                        >
                          Nenhum contrato encontrado. Crie o primeiro contrato no formulario ao lado.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <aside className="border border-[var(--border)] bg-[var(--surface)] p-4 xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg text-[var(--ink)]">
                  {form.id ? "Editar contrato" : "Novo contrato"}
                </h2>
                <p className="mt-1 text-xs text-[var(--ink-muted)]">
                  Selecione um cliente ou cadastre rapidamente.
                </p>
              </div>
              {form.id ? (
                <button
                  className="rounded-md border border-[var(--border)] px-3 py-1 text-xs text-[var(--ink-muted)] hover:text-[var(--signal)]"
                  onClick={resetForm}
                  type="button"
                >
                  Novo
                </button>
              ) : null}
            </div>

            <form className="space-y-2.5" onSubmit={handleSubmit}>
              <Field label="Titulo">
                <input
                  className="input"
                  name="title"
                  onChange={(event) => updateForm("title", event.target.value)}
                  required
                  value={form.title}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Valor">
                  <input
                    className="input"
                    min="0"
                    name="value"
                    onChange={(event) => updateForm("value", event.target.value)}
                    required
                    step="0.01"
                    type="number"
                    value={form.value}
                  />
                </Field>
                <Field label="Status">
                  <select
                    className="input"
                    name="status"
                    onChange={(event) => updateForm("status", event.target.value)}
                    value={form.status}
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Forma de pagamento">
                <input
                  className="input"
                  name="paymentType"
                  onChange={(event) => updateForm("paymentType", event.target.value)}
                  value={form.paymentType}
                />
              </Field>

              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Inicio">
                  <input
                    className="input"
                    name="startDate"
                    onChange={(event) => updateForm("startDate", event.target.value)}
                    required
                    type="date"
                    value={form.startDate}
                  />
                </Field>
                <Field label="Entrega">
                  <input
                    className="input"
                    name="deliveryDate"
                    onChange={(event) => updateForm("deliveryDate", event.target.value)}
                    type="date"
                    value={form.deliveryDate}
                  />
                </Field>
                <Field label="Vencimento">
                  <input
                    className="input"
                    name="dueDate"
                    onChange={(event) => updateForm("dueDate", event.target.value)}
                    type="date"
                    value={form.dueDate}
                  />
                </Field>
              </div>

              <Field label="Descricao">
                <textarea
                  className="input min-h-20 resize-y py-2"
                  name="description"
                  onChange={(event) => updateForm("description", event.target.value)}
                  value={form.description}
                />
              </Field>

              <div className="border-t border-[var(--border)] pt-2.5">
                <div className="mb-2.5 flex gap-2">
                  <button
                    className={`rounded-md border px-3 py-2 text-xs ${
                      !useNewClient
                        ? "border-[var(--data)] text-[var(--data)]"
                        : "border-[var(--border)] text-[var(--ink-muted)]"
                    }`}
                    onClick={() => setUseNewClient(false)}
                    type="button"
                  >
                    Cliente existente
                  </button>
                  <button
                    className={`rounded-md border px-3 py-2 text-xs ${
                      useNewClient
                        ? "border-[var(--data)] text-[var(--data)]"
                        : "border-[var(--border)] text-[var(--ink-muted)]"
                    }`}
                    onClick={() => setUseNewClient(true)}
                    type="button"
                  >
                    Novo cliente
                  </button>
                </div>

                {useNewClient ? (
                  <div className="grid gap-3">
                    <Field label="Nome do cliente">
                      <input
                        className="input"
                        onChange={(event) => updateForm("newClientName", event.target.value)}
                        required={useNewClient}
                        value={form.newClientName}
                      />
                    </Field>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Email">
                        <input
                          className="input"
                          onChange={(event) => updateForm("newClientEmail", event.target.value)}
                          type="email"
                          value={form.newClientEmail}
                        />
                      </Field>
                      <Field label="Telefone">
                        <input
                          className="input"
                          onChange={(event) => updateForm("newClientPhone", event.target.value)}
                          value={form.newClientPhone}
                        />
                      </Field>
                    </div>
                    <Field label="Empresa">
                      <input
                        className="input"
                        onChange={(event) => updateForm("newClientCompany", event.target.value)}
                        value={form.newClientCompany}
                      />
                    </Field>
                  </div>
                ) : (
                  <Field label="Cliente">
                    <select
                      className="input"
                      name="clientId"
                      onChange={(event) => updateForm("clientId", event.target.value)}
                      required={!useNewClient}
                      value={form.clientId}
                    >
                      <option value="">Selecione</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}
              </div>

              <Field label="PDF do contrato">
                <input
                  accept="application/pdf,.pdf"
                  className="block w-full text-xs text-[var(--ink-muted)] file:mr-3 file:rounded-md file:border file:border-[var(--border)] file:bg-[var(--bg-elevated)] file:px-3 file:py-2 file:text-[var(--ink)]"
                  name="file"
                  type="file"
                />
              </Field>

              {error ? (
                <p className="rounded-md border border-[var(--late)] px-3 py-2 text-sm text-[var(--late)]">
                  {error}
                </p>
              ) : null}
              {message ? (
                <p className="rounded-md border border-[var(--ok)] px-3 py-2 text-sm text-[var(--ok)]">
                  {message}
                </p>
              ) : null}

              <button
                className="w-full rounded-md border border-[var(--signal)] bg-[var(--signal)] px-4 py-3 font-display text-xs uppercase tracking-[0.14em] text-[var(--bg)] transition hover:border-[var(--data)] hover:bg-[var(--data)] disabled:cursor-not-allowed disabled:border-[var(--signal-dim)] disabled:bg-[var(--signal-dim)]"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Salvando..." : form.id ? "Salvar edicao" : "Criar contrato"}
              </button>
            </form>
          </aside>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] p-4">
      <p className="font-display text-xs uppercase tracking-[0.16em] text-[var(--ink-muted)]">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl text-[var(--signal)]">{value}</p>
    </div>
  );
}

function Field({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-[0.68rem] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}
