"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Circle,
  Eraser,
  Grid2x2,
  Highlighter,
  Minus,
  MousePointer2,
  PenLine,
  Redo2,
  Square,
  Trash2,
  Type,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button, IconButton, LinkButton } from "@/components/ui/button";
import { Card, DemoNote, EmptyState, PageHeader, StatusBadge } from "@/components/ui/feedback";
import { Dialog, useConfirm } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/fields";
import { useToast } from "@/components/ui/toast";
import { copyText } from "@/lib/clipboard";
import { formatDateTime } from "@/lib/formatters";
import { courseById, personById } from "@/lib/selectors";
import { useStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";
import type { BoardVisibility, Stroke, StrokeTool, Whiteboard } from "@/types";

const colors = ["#1B2421", "#2A5C56", "#4C6C84", "#A56A4E", "#73896D", "#A6843C", "#7A3333"];
const EMPTY_STROKES: Stroke[] = [];

const tools: { id: StrokeTool; label: string; icon: typeof PenLine }[] = [
  { id: "pen", label: "Pen", icon: PenLine },
  { id: "highlighter", label: "Highlighter", icon: Highlighter },
  { id: "eraser", label: "Eraser", icon: Eraser },
  { id: "line", label: "Line", icon: Minus },
  { id: "arrow", label: "Arrow", icon: ArrowUpRight },
  { id: "rect", label: "Rectangle", icon: Square },
  { id: "ellipse", label: "Circle", icon: Circle },
  { id: "text", label: "Text", icon: Type },
];

export function MyBoards() {
  const { state } = useStore();
  return <BoardList ownerId={state.session.userId ?? undefined} />;
}

export function BoardList({ ownerId }: { ownerId?: string }) {
  const { state, actions } = useStore();
  const router = useRouter();
  const confirm = useConfirm();
  const toast = useToast();
  const [title, setTitle] = useState("");
  const boards = state.boards.filter((board) => (ownerId ? board.ownerId === ownerId : true));
  return (
    <div className="space-y-4">
      <PageHeader title="Whiteboards" description="Each board has its own id. A copy is a different board." actions={
        <div className="flex gap-2">
          <Input aria-label="Board title" placeholder="New board title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <Button onClick={() => {
            if (!ownerId || !title.trim()) return;
            const role = state.session.role === "teacher" ? "teacher" : "student";
            const id = actions.createBoard({ title: title.trim(), ownerId, ownerRole: role, visibility: "private" });
            router.push(routes.whiteboard(id));
          }}>Create</Button>
        </div>
      } />
      <div className="grid gap-3">
        {boards.map((board) => (
          <Card key={board.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-muted">{board.id}</p>
              <h2 className="font-serif text-2xl">{board.title}</h2>
              <p className="text-sm text-muted">Updated {formatDateTime(board.updatedAt)} · {personById(state, board.ownerId)?.name}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={board.visibility} />
              <LinkButton href={routes.whiteboard(board.id)} size="sm">Open</LinkButton>
              <Button size="sm" variant="secondary" onClick={() => { const id = actions.duplicateBoard(board.id); toast({ title: "Board duplicated" }); router.push(routes.whiteboard(id)); }}>Duplicate</Button>
              <Button size="sm" variant="ghost" onClick={async () => {
                const ok = await confirm({ title: "Delete this board?", body: "The id will no longer open a drawing in this browser.", confirmLabel: "Delete", tone: "danger" });
                if (ok) actions.deleteBoard(board.id);
              }}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke, width: number, height: number) {
  const px = (point: { x: number; y: number }) => ({ x: point.x * width, y: point.y * height });
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  const scale = width / 1000;
  if (stroke.tool === "highlighter") {
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = stroke.width * 8 * scale;
  } else if (stroke.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = stroke.width * 14 * scale;
  } else {
    ctx.lineWidth = stroke.width * 1.6 * scale;
  }
  const points = stroke.points.map(px);
  if (stroke.tool === "text" && stroke.text) {
    ctx.font = `${18 + stroke.width * 4}px Fraunces, Georgia, serif`;
    ctx.fillText(stroke.text, points[0]?.x ?? 0, points[0]?.y ?? 0);
  } else if ((stroke.tool === "rect" || stroke.tool === "ellipse") && points.length >= 2) {
    const [a, b] = points;
    const w = b.x - a.x;
    const h = b.y - a.y;
    ctx.beginPath();
    if (stroke.tool === "rect") ctx.strokeRect(a.x, a.y, w, h);
    else {
      ctx.ellipse(a.x + w / 2, a.y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (points.length) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    if (stroke.tool === "pen" || stroke.tool === "highlighter" || stroke.tool === "eraser") {
      points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    } else {
      const end = points[points.length - 1];
      ctx.lineTo(end.x, end.y);
    }
    ctx.stroke();
    if (stroke.tool === "arrow" && points.length > 1) {
      const end = points[points.length - 1];
      const prev = points[points.length - 2];
      const angle = Math.atan2(end.y - prev.y, end.x - prev.x);
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(end.x - 14 * Math.cos(angle - 0.4), end.y - 14 * Math.sin(angle - 0.4));
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(end.x - 14 * Math.cos(angle + 0.4), end.y - 14 * Math.sin(angle + 0.4));
      ctx.stroke();
    }
  }
  ctx.restore();
}

export function BoardWorkspace() {
  const params = useParams<{ boardId: string }>();
  const { state } = useStore();
  const board = state.boards.find((item) => item.id === params.boardId);
  if (!board) {
    return <EmptyState title="Board not in this browser" body="The id does not match a board in the demo data or your local changes." action={<LinkButton href={routes.student.whiteboards}>All boards</LinkButton>} />;
  }
  return <BoardEditor key={board.id} board={board} />;
}

function BoardEditor({ board }: { board: Whiteboard }) {
  const { state, actions } = useStore();
  const confirm = useConfirm();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [tool, setTool] = useState<StrokeTool>("pen");
  const [color, setColor] = useState(colors[0]);
  const [width, setWidth] = useState(2);
  const [zoom, setZoom] = useState(1);
  const [title, setTitle] = useState(board.title);
  const [shareOpen, setShareOpen] = useState(false);
  const [draft, setDraft] = useState<Stroke | null>(null);
  const [history, setHistory] = useState<Stroke[][]>([]);
  const [future, setFuture] = useState<Stroke[][]>([]);
  const [localPages, setLocalPages] = useState(board.pages);
  const [saveState, setSaveState] = useState<"saved" | "saving">("saved");
  const [textPrompt, setTextPrompt] = useState<{ x: number; y: number } | null>(null);
  const [textValue, setTextValue] = useState("");
  const drawing = useRef(false);
  const dirty = useRef(false);

  const strokes = localPages[pageIndex]?.strokes ?? EMPTY_STROKES;
  const visible = useMemo(() => (draft ? [...strokes, draft] : strokes), [draft, strokes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "#FFFcf8";
    ctx.fillRect(0, 0, rect.width, rect.height);
    if (board.background === "grid") {
      ctx.strokeStyle = "#E7E1D6";
      ctx.lineWidth = 1;
      for (let x = 0; x < rect.width; x += 28) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rect.height);
        ctx.stroke();
      }
      for (let y = 0; y < rect.height; y += 28) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }
    }
    visible.forEach((stroke) => drawStroke(ctx, stroke, rect.width, rect.height));
  }, [visible, board.background, zoom, pageIndex]);

  useEffect(() => {
    if (!dirty.current) return;
    const timer = window.setTimeout(() => {
      dirty.current = false;
      actions.updateBoard(board.id, { pages: localPages, title });
      setSaveState("saved");
    }, 700);
    return () => window.clearTimeout(timer);
  }, [actions, board.id, localPages, title]);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width)),
      y: Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height)),
    };
  };

  const markDirty = () => {
    dirty.current = true;
    setSaveState("saving");
  };

  const commitStroke = (stroke: Stroke) => {
    markDirty();
    setHistory((current) => [...current.slice(-39), strokes]);
    setFuture([]);
    setLocalPages((pages) => pages.map((page, index) => index === pageIndex ? { ...page, strokes: [...page.strokes, stroke] } : page));
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (tool === "text") {
      setTextPrompt(pointFromEvent(event));
      return;
    }
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Drawing still follows the pointer when capture is unavailable.
    }
    drawing.current = true;
    const point = pointFromEvent(event);
    setDraft({ id: "draft", tool, color, width, points: [point] });
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const point = pointFromEvent(event);
    setDraft((current) => current ? { ...current, points: [...current.points, point] } : current);
  };

  const onPointerUp = () => {
    drawing.current = false;
    if (!draft || draft.points.length === 0) return;
    const finished = { ...draft, id: `stroke-${draft.points.length}-${draft.points[0].x.toFixed(3)}` };
    setDraft(null);
    commitStroke(finished);
  };

  const undo = () => {
    const previous = history[history.length - 1];
    if (!previous) return;
    markDirty();
    setFuture((current) => [strokes, ...current]);
    setHistory((current) => current.slice(0, -1));
    setLocalPages((pages) => pages.map((page, index) => index === pageIndex ? { ...page, strokes: previous } : page));
  };

  const redo = () => {
    const next = future[0];
    if (!next) return;
    markDirty();
    setHistory((current) => [...current, strokes]);
    setFuture((current) => current.slice(1));
    setLocalPages((pages) => pages.map((page, index) => index === pageIndex ? { ...page, strokes: next } : page));
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="flex flex-wrap items-center gap-2 border-b border-line bg-surface px-3 py-3">
        <LinkButton href={state.session.role === "teacher" ? routes.teacher.whiteboards : routes.student.whiteboards} variant="ghost" size="sm">Boards</LinkButton>
        <Input aria-label="Board title" value={title} onChange={(event) => { markDirty(); setTitle(event.target.value); }} className="max-w-xs" />
        <span className="text-xs text-muted">{saveState === "saving" ? "Saving…" : "Saved on this device"}</span>
        <span className="ml-auto text-xs text-muted">{board.id}</span>
        <Button size="sm" variant="secondary" onClick={() => setShareOpen(true)}>Share</Button>
      </header>
      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex gap-1 overflow-auto border-b border-line bg-surface p-2 lg:w-16 lg:flex-col lg:border-r lg:border-b-0">
          {tools.map((item) => {
            const Icon = item.icon;
            return (
              <IconButton key={item.id} label={item.label} className={tool === item.id ? "bg-teal-soft text-teal-deep" : ""} onClick={() => setTool(item.id)}>
                <Icon className="size-4" />
              </IconButton>
            );
          })}
          <IconButton label="Undo" onClick={undo}><Undo2 className="size-4" /></IconButton>
          <IconButton label="Redo" onClick={redo}><Redo2 className="size-4" /></IconButton>
          <IconButton label="Clear board" onClick={async () => {
            const ok = await confirm({ title: "Clear this page?", body: "You can undo the clear.", confirmLabel: "Clear", tone: "danger" });
            if (!ok) return;
            markDirty();
            setHistory((current) => [...current, strokes]);
            setLocalPages((pages) => pages.map((page, index) => index === pageIndex ? { ...page, strokes: [] } : page));
          }}><Trash2 className="size-4" /></IconButton>
        </div>
        <div ref={wrapRef} className="relative min-h-[70vh] flex-1 overflow-auto p-3">
          <div style={{ width: `${Math.round(zoom * 100)}%`, minWidth: 320 }} className="mx-auto h-[72vh]">
            <canvas
              ref={canvasRef}
              aria-label="Drawing canvas"
              className="h-full w-full touch-none rounded-3xl border border-line shadow-soft"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            />
          </div>
          {strokes.length === 0 && !draft ? <p className="pointer-events-none absolute inset-x-0 top-8 text-center text-sm text-muted">An empty page. Choose a pen and draw.</p> : null}
          {textPrompt ? (
            <form
              className="absolute left-6 top-6 z-10 flex gap-2 rounded-2xl border border-line bg-surface p-2 shadow-soft"
              onSubmit={(event) => {
                event.preventDefault();
                if (textValue.trim()) commitStroke({ id: "text", tool: "text", color, width, points: [textPrompt], text: textValue.trim() });
                setTextValue("");
                setTextPrompt(null);
              }}
            >
              <Input aria-label="Board text" value={textValue} onChange={(event) => setTextValue(event.target.value)} autoFocus />
              <Button type="submit" size="sm">Place</Button>
            </form>
          ) : null}
        </div>
        <aside className="space-y-4 border-t border-line bg-surface p-4 lg:w-64 lg:border-t-0 lg:border-l">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Color</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {colors.map((swatch) => (
                <button key={swatch} type="button" aria-label={swatch} className="size-7 rounded-full border border-line" style={{ background: swatch, outline: color === swatch ? "2px solid #1B2421" : undefined, outlineOffset: 2 }} onClick={() => setColor(swatch)} />
              ))}
            </div>
          </div>
          <Field label="Thickness" htmlFor="thickness">
            <input id="thickness" type="range" min={1} max={8} value={width} onChange={(event) => setWidth(Number(event.target.value))} className="w-full accent-teal" />
          </Field>
          <div className="flex gap-2">
            <IconButton label="Zoom out" onClick={() => setZoom((value) => Math.max(0.6, value - 0.1))}><ZoomOut className="size-4" /></IconButton>
            <IconButton label="Zoom in" onClick={() => setZoom((value) => Math.min(2, value + 0.1))}><ZoomIn className="size-4" /></IconButton>
            <IconButton label="Fit" onClick={() => setZoom(1)}><MousePointer2 className="size-4" /></IconButton>
            <IconButton label="Toggle grid" onClick={() => actions.updateBoard(board.id, { background: board.background === "grid" ? "plain" : "grid" })}><Grid2x2 className="size-4" /></IconButton>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Page {pageIndex + 1} of {localPages.length}</span>
            <Button size="sm" variant="secondary" onClick={() => { markDirty(); setLocalPages((pages) => [...pages, { id: `page-${pages.length + 1}`, strokes: [] }]); }}>Add page</Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setPageIndex((index) => Math.max(0, index - 1))}>Previous</Button>
            <Button size="sm" variant="ghost" onClick={() => setPageIndex((index) => Math.min(localPages.length - 1, index + 1))}>Next</Button>
          </div>
          <Button variant="secondary" onClick={() => { const id = actions.duplicateBoard(board.id); router.push(routes.whiteboard(id)); }}>Duplicate</Button>
          <Button variant="ghost" onClick={async () => {
            const ok = await confirm({ title: `Delete ${board.title}?`, body: "This removes the board from the demo on this device.", confirmLabel: "Delete", tone: "danger" });
            if (!ok) return;
            actions.deleteBoard(board.id);
            router.push(state.session.role === "teacher" ? routes.teacher.whiteboards : routes.student.whiteboards);
          }}>Delete</Button>
        </aside>
      </div>
      <ShareDialog board={board} open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}

function ShareDialog({ board, open, onClose }: { board: Whiteboard; open: boolean; onClose: () => void }) {
  const { state, actions } = useStore();
  const toast = useToast();
  const path = routes.whiteboard(board.id);
  return (
    <Dialog open={open} title="Share this board" description="The link opens this board inside the current demo. It is not a live multi-device share." onClose={onClose}>
      <DemoNote>Copying the link copies a URL for this browser’s data. Another device will not see your drawing unless it already has the same demo record.</DemoNote>
      <p className="mt-3 rounded-xl bg-paper px-3 py-2 text-sm">{path}</p>
      <div className="mt-3">
        <Field label="Visibility" htmlFor="visibility">
          <Select id="visibility" value={board.visibility} onChange={(event) => actions.updateBoard(board.id, { visibility: event.target.value as BoardVisibility })}>
            <option value="private">Private</option>
            <option value="class">Class</option>
            <option value="course">Course</option>
            <option value="link">Anyone with the link, in this demo</option>
          </Select>
        </Field>
      </div>
      <dl className="mt-4 space-y-1 text-sm text-muted">
        <div>Owner: {personById(state, board.ownerId)?.name}</div>
        <div>Created {formatDateTime(board.createdAt)}</div>
        <div>Updated {formatDateTime(board.updatedAt)}</div>
        {board.courseId ? <div>Course: {courseById(state, board.courseId)?.title}</div> : null}
      </dl>
      <Button className="mt-4" onClick={async () => {
        const ok = await copyText(`${window.location.origin}${path}`);
        toast({ title: ok ? "Link copied" : "Could not copy", description: path });
      }}>Copy link</Button>
    </Dialog>
  );
}
