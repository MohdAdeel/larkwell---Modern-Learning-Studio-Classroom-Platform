"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DemoNote, PageHeader, StatusBadge } from "@/components/ui/feedback";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/fields";
import { useToast } from "@/components/ui/toast";
import { plans } from "@/data/dummy/subscriptions";
import { formatDate, formatMoney } from "@/lib/formatters";
import { useStore } from "@/lib/mock-store";
import { isCardNumber, isCvc, isExpiry, isRequired, type FieldErrors } from "@/lib/validators";
import { cn } from "@/lib/cn";
import type { Plan } from "@/types";

export function PricingView() {
  const [annual, setAnnual] = useState(true);
  const [selected, setSelected] = useState<Plan | null>(null);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Pricing"
        title="A membership, not a maze of add-ons"
        description="Student and teacher plans. Billing in this demo never charges a card. The ledger updates only in your browser."
        actions={
          <div className="inline-flex rounded-full bg-paper-deep p-1 text-sm">
            <button type="button" className={cn("rounded-full px-3 py-1.5", !annual && "bg-surface shadow-soft")} onClick={() => setAnnual(false)}>Monthly</button>
            <button type="button" className={cn("rounded-full px-3 py-1.5", annual && "bg-surface shadow-soft")} onClick={() => setAnnual(true)}>Annual</button>
          </div>
        }
      />
      {(["student", "teacher"] as const).map((audience) => (
        <section key={audience} className="mt-10">
          <h2 className="font-serif text-2xl capitalize">{audience} plans</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {plans.filter((plan) => plan.audience === audience).map((plan) => {
              const price = annual ? plan.annual : plan.monthly;
              return (
                <article key={plan.id} className={cn("flex flex-col rounded-3xl border bg-surface p-6", plan.recommended ? "border-teal shadow-soft" : "border-line")}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl">{plan.name}</h3>
                    {plan.recommended ? <span className="text-xs font-medium text-teal">Recommended</span> : null}
                  </div>
                  <p className="mt-3 font-serif text-4xl">{price === 0 ? "Free" : formatMoney(price)}</p>
                  <p className="text-sm text-muted">{price === 0 ? "No demo charge" : annual ? "per year, simulated" : "per month, simulated"}</p>
                  <p className="mt-3 text-sm leading-6 text-ink-soft">{plan.description}</p>
                  <ul className="mt-4 flex-1 space-y-2 text-sm text-ink-soft">
                    {plan.features.map((feature) => (
                      <li key={feature}>· {feature}</li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-muted">{plan.limits.join(" · ")}</p>
                  <Button className="mt-5" variant={plan.recommended ? "primary" : "secondary"} onClick={() => setSelected(plan)}>
                    Choose {plan.name}
                  </Button>
                </article>
              );
            })}
          </div>
        </section>
      ))}
      <CheckoutDialog plan={selected} annual={annual} onClose={() => setSelected(null)} />
    </div>
  );
}

export function CheckoutDialog({ plan, annual, onClose }: { plan: Plan | null; annual: boolean; onClose: () => void }) {
  const { state, actions } = useStore();
  const toast = useToast();
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const submit = () => {
    const next: FieldErrors = {};
    if (!isRequired(name)) next.name = "Name the card holder.";
    if (!isCardNumber(card)) next.card = "Use 16 digits. Nothing is charged.";
    if (!isExpiry(expiry)) next.expiry = "Use MM/YY.";
    if (!isCvc(cvc)) next.cvc = "Use 3 or 4 digits.";
    setErrors(next);
    if (Object.keys(next).length || !plan) return;
    const userId = state.session.userId ?? (plan.audience === "teacher" ? "teacher-helen-01" : "student-maya-01");
    if (!state.session.userId) actions.signIn(plan.audience, userId);
    const amount = annual ? plan.annual : plan.monthly;
    actions.setPlan(userId, plan.id, annual ? "annual" : "monthly", amount, `${plan.name} · ${annual ? "annual" : "monthly"}`);
    toast({ title: "Membership updated", description: "Simulated checkout only. No payment was sent.", tone: "success" });
    onClose();
  };

  return (
    <Dialog open={Boolean(plan)} title={plan ? `Checkout · ${plan.name}` : ""} description="This form checks the shape of a card and then updates the demo ledger." onClose={onClose}>
      <DemoNote>No payment is processed. Use any 16-digit number, for example 4242 4242 4242 4242.</DemoNote>
      <div className="mt-4 grid gap-3">
        <Field label="Name" htmlFor="card-name" error={errors.name}>
          <Input id="card-name" value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
        <Field label="Card number" htmlFor="card-number" error={errors.card}>
          <Input id="card-number" inputMode="numeric" value={card} onChange={(event) => setCard(event.target.value)} placeholder="4242 4242 4242 4242" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Expiry" htmlFor="card-expiry" error={errors.expiry}>
            <Input id="card-expiry" value={expiry} onChange={(event) => setExpiry(event.target.value)} placeholder="04/28" />
          </Field>
          <Field label="CVC" htmlFor="card-cvc" error={errors.cvc}>
            <Input id="card-cvc" value={cvc} onChange={(event) => setCvc(event.target.value)} placeholder="123" />
          </Field>
        </div>
        <Button onClick={submit}>Confirm simulated payment</Button>
      </div>
    </Dialog>
  );
}

export function MembershipView({ audience }: { audience: "student" | "teacher" }) {
  const { state } = useStore();
  const userId = state.session.userId;
  const subscription = state.subscriptions.find((item) => item.userId === userId);
  const plan = plans.find((item) => item.id === subscription?.planId);
  const invoices = state.invoices.filter((invoice) => invoice.userId === userId);
  const earnings = state.earnings.filter((item) => item.teacherId === userId);
  const [annual, setAnnual] = useState(subscription?.interval !== "monthly");
  const [selected, setSelected] = useState<Plan | null>(null);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Billing" title={audience === "teacher" ? "Your teaching plan" : "Your membership"} description="Status, history, and a simulated way to change plans." />
      <section className="rounded-3xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted">Current plan</p>
            <h2 className="font-serif text-3xl">{plan?.name ?? "No plan"}</h2>
          </div>
          {subscription ? <StatusBadge status={subscription.status} /> : null}
        </div>
        {subscription ? <p className="mt-2 text-sm text-ink-soft">Renews {formatDate(subscription.renewsAt)} · {subscription.interval}</p> : null}
      </section>
      <div className="flex justify-end">
        <div className="inline-flex rounded-full bg-paper-deep p-1 text-sm">
          <button type="button" className={cn("rounded-full px-3 py-1.5", !annual && "bg-surface")} onClick={() => setAnnual(false)}>Monthly</button>
          <button type="button" className={cn("rounded-full px-3 py-1.5", annual && "bg-surface")} onClick={() => setAnnual(true)}>Annual</button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.filter((item) => item.audience === audience).map((item) => (
          <article key={item.id} className="rounded-3xl border border-line bg-surface p-5">
            <h3 className="font-serif text-2xl">{item.name}</h3>
            <p className="mt-2 text-sm text-ink-soft">{item.description}</p>
            <Button className="mt-4" variant={item.id === plan?.id ? "secondary" : "primary"} onClick={() => setSelected(item)}>
              {item.id === plan?.id ? "Renew this plan" : item.monthly > (plan?.monthly ?? 0) ? "Upgrade" : "Change plan"}
            </Button>
          </article>
        ))}
      </div>
      <section>
        <h2 className="font-serif text-2xl">Ledger</h2>
        <div className="mt-3 overflow-auto rounded-3xl border border-line">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-paper-deep text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-t border-line bg-surface">
                  <td className="px-4 py-3">{formatDate(invoice.issuedAt)}</td>
                  <td className="px-4 py-3">{invoice.description}</td>
                  <td className="px-4 py-3">{formatMoney(invoice.amount)}</td>
                  <td className="px-4 py-3"><StatusBadge status={invoice.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {audience === "teacher" ? (
        <section>
          <h2 className="font-serif text-2xl">Teaching pool</h2>
          <p className="mt-1 text-sm text-muted">Sample payout notes. Nothing is transferred.</p>
          <ul className="mt-3 space-y-2">
            {earnings.map((earning) => (
              <li key={earning.id} className="flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3 text-sm">
                <span>{earning.label}</span>
                <span className="flex items-center gap-3">{formatMoney(earning.amount)} <StatusBadge status={earning.status} /></span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <CheckoutDialog plan={selected} annual={annual} onClose={() => setSelected(null)} />
    </div>
  );
}
