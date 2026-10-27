"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, EmptyState, PageHeader } from "@/components/ui/feedback";
import { Field, Input, Textarea } from "@/components/ui/fields";
import { formatDateTime } from "@/lib/formatters";
import { personById } from "@/lib/selectors";
import { useStore } from "@/lib/mock-store";

export function InboxView() {
  const { state, actions } = useStore();
  const userId = state.session.userId;
  const conversations = state.conversations.filter((item) => userId && item.participantIds.includes(userId));
  const [active, setActive] = useState(conversations[0]?.id ?? "");
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");
  const [to, setTo] = useState("teacher-helen-01");
  const conversation = conversations.find((item) => item.id === active) ?? conversations[0];

  if (!userId) return <EmptyState title="Sign in to read messages" body="Choose a demo profile from the header." />;

  return (
    <div className="space-y-4">
      <PageHeader title="Messages" description="Sample conversations. Replies stay in this browser." />
      <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
        <div className="space-y-2">
          {conversations.map((item) => (
            <button key={item.id} type="button" onClick={() => setActive(item.id)} className={`w-full rounded-2xl border px-3 py-3 text-left text-sm ${conversation?.id === item.id ? "border-teal bg-teal-soft" : "border-line bg-surface"}`}>
              <p className="font-medium">{item.subject}</p>
              <p className="text-muted">{item.participantIds.filter((id) => id !== userId).map((id) => personById(state, id)?.name).join(", ")}</p>
            </button>
          ))}
          {conversations.length === 0 ? <EmptyState title="No conversations" body="Start one below." /> : null}
        </div>
        <Card>
          {conversation ? (
            <>
              <h2 className="font-serif text-2xl">{conversation.subject}</h2>
              <div className="mt-4 space-y-3">
                {conversation.messages.map((message) => (
                  <div key={message.id} className="rounded-2xl bg-paper px-3 py-2 text-sm">
                    <p className="text-xs text-muted">{personById(state, message.senderId)?.name} · {formatDateTime(message.sentAt)}</p>
                    <p className="mt-1">{message.body}</p>
                  </div>
                ))}
              </div>
              <form className="mt-4 flex gap-2" onSubmit={(event) => { event.preventDefault(); if (!body.trim()) return; actions.sendMessage(conversation.id, userId, body.trim()); setBody(""); }}>
                <Input aria-label="Reply" value={body} onChange={(event) => setBody(event.target.value)} />
                <Button type="submit">Send</Button>
              </form>
            </>
          ) : null}
        </Card>
      </div>
      <Card>
        <h2 className="font-serif text-2xl">New note</h2>
        <div className="mt-3 grid gap-3">
          <Field label="To" htmlFor="to">
            <select id="to" className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm" value={to} onChange={(event) => setTo(event.target.value)}>
              {[...state.teachers, ...state.students].filter((person) => person.id !== userId).map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
            </select>
          </Field>
          <Field label="Subject" htmlFor="subject"><Input id="subject" value={subject} onChange={(event) => setSubject(event.target.value)} /></Field>
          <Field label="Message" htmlFor="new-body"><Textarea id="new-body" value={body} onChange={(event) => setBody(event.target.value)} /></Field>
          <Button onClick={() => {
            if (!subject.trim() || !body.trim()) return;
            const id = actions.startConversation([userId, to], subject.trim(), userId, body.trim());
            setActive(id);
            setSubject("");
            setBody("");
          }}>Start conversation</Button>
        </div>
      </Card>
    </div>
  );
}
