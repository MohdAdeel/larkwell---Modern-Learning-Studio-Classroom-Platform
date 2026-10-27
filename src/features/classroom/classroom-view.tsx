"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Hand, Mic, MicOff, MonitorUp, PhoneOff, Video, VideoOff, PenLine, FolderOpen, Maximize2 } from "lucide-react";
import { Button, IconButton, LinkButton } from "@/components/ui/button";
import { Avatar, DemoNote, EmptyState } from "@/components/ui/feedback";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/fields";
import { personById, teacherById } from "@/lib/selectors";
import { useStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";
import { formatTime } from "@/lib/formatters";

const reactions = ["👍", "✨", "❓", "👏"];

export function ClassroomView() {
  const params = useParams<{ classId: string }>();
  const { state } = useStore();
  const liveClass = state.classes.find((item) => item.id === params.classId);
  const router = useRouter();
  const [mic, setMic] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [hand, setHand] = useState(false);
  const [panel, setPanel] = useState<"chat" | "people" | "agenda">("agenda");
  const [chat, setChat] = useState<{ id: string; name: string; body: string }[]>([
    { id: "seed", name: "Studio", body: "This chat stays on this device. Nobody else receives it." },
  ]);
  const [draft, setDraft] = useState("");
  const [reaction, setReaction] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(liveClass?.status === "live" ? 20 * 60 : 0);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (cameraOn && video && stream) video.srcObject = stream;
  }, [cameraOn]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  if (!liveClass) {
    return <div className="p-8"><EmptyState title="Class not found" body="That session is not in the demo calendar." action={<LinkButton href={routes.calendar}>Calendar</LinkButton>} /></div>;
  }

  const teacher = teacherById(state, liveClass.teacherId);
  const me = state.session.userId ? personById(state, state.session.userId) : undefined;
  const people = [liveClass.teacherId, ...liveClass.studentIds];
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");

  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraOn(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch {
      setCameraOn(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#1b2421] text-paper">
      <header className="flex flex-wrap items-center gap-3 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-paper/60">Demo classroom</p>
          <h1 className="font-serif text-2xl">{liveClass.title}</h1>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs">{liveClass.status} · {formatTime(liveClass.start)}</span>
        <span className="text-sm text-paper/70">{minutes}:{seconds}</span>
        <span className="ml-auto text-xs text-paper/70">Connection steady · simulated</span>
        <Button variant="danger" size="sm" onClick={() => setLeaveOpen(true)}><PhoneOff className="size-4" /> Leave</Button>
      </header>
      <div className="px-4"><DemoNote>Video, audio, and screen share are simulated. A camera preview, if you allow it, never leaves this device.</DemoNote></div>
      <div className="grid flex-1 gap-3 p-4 lg:grid-cols-[1fr_20rem]">
        <section className="flex flex-col gap-3">
          <div className="relative min-h-72 flex-1 overflow-hidden rounded-3xl bg-[#24302c]">
            {sharing ? (
              <div className="flex h-full flex-col justify-between p-8">
                <p className="text-xs uppercase tracking-[0.16em] text-paper/60">Demo slide</p>
                <div>
                  <h2 className="font-serif text-4xl">{liveClass.agenda[0]}</h2>
                  <ul className="mt-4 space-y-2 text-paper/80">{liveClass.agenda.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <p className="text-sm text-paper/60">Presented locally. Nothing is shared to a call.</p>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Avatar name={teacher?.name ?? "Teacher"} tone={teacher?.avatarTone ?? 0} size="lg" />
                  <p className="mt-3 font-medium">{teacher?.name}</p>
                  <p className="text-sm text-paper/60">Speaking · simulated</p>
                </div>
              </div>
            )}
            {reaction ? <p className="absolute bottom-6 left-6 animate-float text-4xl">{reaction}</p> : null}
          </div>
          <div className="flex gap-2 overflow-auto">
            {people.map((id) => {
              const person = personById(state, id);
              const local = id === me?.id;
              return (
                <div key={id} className="w-36 shrink-0 rounded-2xl bg-[#24302c] p-3">
                  {local && cameraOn ? <video ref={videoRef} autoPlay muted playsInline className="mb-2 h-16 w-full rounded-xl object-cover" /> : <Avatar name={person?.name ?? "Guest"} tone={person?.tone ?? 0} />}
                  <p className="mt-2 truncate text-sm">{person?.name ?? "Guest"}{local ? " · you" : ""}</p>
                  <p className="text-xs text-paper/50">{id === liveClass.teacherId ? "Host" : hand && local ? "Hand raised" : "Listening"}</p>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 rounded-full bg-[#24302c] px-3 py-2">
            <IconButton label={mic ? "Mute microphone" : "Unmute microphone"} className="text-paper hover:bg-white/10" onClick={() => setMic((value) => !value)}>{mic ? <Mic className="size-4" /> : <MicOff className="size-4" />}</IconButton>
            <IconButton label={cameraOn ? "Turn camera off" : "Turn camera preview on"} className="text-paper hover:bg-white/10" onClick={toggleCamera}>{cameraOn ? <Video className="size-4" /> : <VideoOff className="size-4" />}</IconButton>
            <IconButton label="Present a demo slide" className="text-paper hover:bg-white/10" onClick={() => setSharing((value) => !value)}><MonitorUp className="size-4" /></IconButton>
            <IconButton label="Raise hand" className="text-paper hover:bg-white/10" onClick={() => setHand((value) => !value)}><Hand className="size-4" /></IconButton>
            {reactions.map((item) => (
              <button key={item} type="button" className="rounded-full px-2 py-1 text-lg" aria-label={`React with ${item}`} onClick={() => { setReaction(item); window.setTimeout(() => setReaction(null), 1600); }}>{item}</button>
            ))}
            {liveClass.boardId ? <LinkButton href={routes.whiteboard(liveClass.boardId)} size="sm" variant="secondary"><PenLine className="size-4" /> Board</LinkButton> : null}
            <LinkButton href={state.session.role === "teacher" ? routes.teacher.materials : routes.student.materials} size="sm" variant="secondary"><FolderOpen className="size-4" /> Materials</LinkButton>
            <IconButton label="Full screen" className="text-paper hover:bg-white/10" onClick={() => document.documentElement.requestFullscreen?.()}><Maximize2 className="size-4" /></IconButton>
          </div>
        </section>
        <aside className="rounded-3xl bg-[#24302c] p-4">
          <div className="flex gap-2 text-sm">
            {(["agenda", "people", "chat"] as const).map((item) => (
              <button key={item} type="button" className={`rounded-full px-3 py-1 capitalize ${panel === item ? "bg-paper text-ink" : "text-paper/70"}`} onClick={() => setPanel(item)}>{item}</button>
            ))}
          </div>
          {panel === "agenda" ? (
            <div className="mt-4 space-y-3 text-sm">
              <p className="text-paper/70">{liveClass.notes || "No notes yet."}</p>
              <ul className="space-y-2">{liveClass.agenda.map((item) => <li key={item} className="rounded-2xl bg-white/5 px-3 py-2">{item}</li>)}</ul>
            </div>
          ) : null}
          {panel === "people" ? (
            <ul className="mt-4 space-y-2 text-sm">
              {people.map((id) => <li key={id} className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2"><span>{personById(state, id)?.name}</span>{id === liveClass.teacherId ? <span className="text-xs">Host</span> : null}</li>)}
            </ul>
          ) : null}
          {panel === "chat" ? (
            <div className="mt-4 flex h-[24rem] flex-col">
              <div className="flex-1 space-y-2 overflow-auto text-sm">
                {chat.map((message) => <p key={message.id}><span className="text-paper/60">{message.name}: </span>{message.body}</p>)}
              </div>
              <form className="mt-3 flex gap-2" onSubmit={(event) => { event.preventDefault(); if (!draft.trim()) return; setChat((items) => [...items, { id: `local-${items.length}`, name: me?.name ?? "You", body: draft.trim() }]); setDraft(""); }}>
                <Input aria-label="Message" value={draft} onChange={(event) => setDraft(event.target.value)} className="bg-[#1b2421] text-paper" />
                <Button type="submit" size="sm">Send</Button>
              </form>
            </div>
          ) : null}
        </aside>
      </div>
      <Dialog open={leaveOpen} title="Leave the class?" description="You will return to your studio. The simulated room stays available." onClose={() => setLeaveOpen(false)}>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setLeaveOpen(false)}>Stay</Button>
          <Button variant="danger" onClick={() => router.push(state.session.role === "teacher" ? routes.teacher.live : routes.student.classes)}>Leave class</Button>
        </div>
      </Dialog>
    </div>
  );
}
