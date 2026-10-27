"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button, LinkButton } from "@/components/ui/button";
import { Badge, Card, EmptyState, PageHeader, StatusBadge } from "@/components/ui/feedback";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/fields";
import { useConfirm } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/formatters";
import { courseById, personById, visibleMaterials } from "@/lib/selectors";
import { useStore } from "@/lib/mock-store";
import { routes } from "@/lib/routes";
import type { MaterialType, MaterialVisibility } from "@/types";

const types: MaterialType[] = ["pdf", "document", "slides", "image", "video"];

export function LibraryView() {
  const { state, actions } = useStore();
  const confirm = useConfirm();
  const toast = useToast();
  const role = state.session.role === "guest" ? "guest" : state.session.role;
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [folder, setFolder] = useState("all");
  const [sort, setSort] = useState("updated");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [kind, setKind] = useState<MaterialType>("document");
  const [visibility, setVisibility] = useState<MaterialVisibility>("private");
  const userId = state.session.userId;
  const materials = useMemo(() => {
    return visibleMaterials(state, role, userId)
      .filter((item) => (type === "all" ? true : item.type === type))
      .filter((item) => (folder === "all" ? true : item.folderId === folder))
      .filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.subject.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (sort === "title" ? a.title.localeCompare(b.title) : b.updatedAt.localeCompare(a.updatedAt)));
  }, [folder, query, role, sort, state, type, userId]);

  return (
    <div className="space-y-4">
      <PageHeader title="Study materials" description="Sample notes, slides, and files. Uploads keep a name in this browser only." actions={<Button onClick={() => setOpen(true)}>Add material</Button>} />
      <div className="grid gap-2 md:grid-cols-4">
        <Input aria-label="Search materials" placeholder="Search" value={query} onChange={(event) => setQuery(event.target.value)} />
        <Select aria-label="Type" value={type} onChange={(event) => setType(event.target.value)}>
          <option value="all">All types</option>
          {types.map((item) => <option key={item}>{item}</option>)}
        </Select>
        <Select aria-label="Folder" value={folder} onChange={(event) => setFolder(event.target.value)}>
          <option value="all">All folders</option>
          {state.folders.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </Select>
        <Select aria-label="Sort" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="updated">Recently updated</option>
          <option value="title">Title</option>
        </Select>
      </div>
      <div className="flex gap-2 overflow-auto">
        {state.folders.map((item) => (
          <button key={item.id} type="button" onClick={() => setFolder(item.id)} className="rounded-full bg-paper-deep px-3 py-1 text-sm">{item.name}</button>
        ))}
      </div>
      {materials.length === 0 ? <EmptyState title="No materials here" body="Try another folder, or add a sample file." /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        {materials.map((material) => (
          <Card key={material.id}>
            <div className="flex items-center gap-2"><Badge>{material.type}</Badge><StatusBadge status={material.visibility} />{userId && material.favoriteBy.includes(userId) ? <Badge tone="gold">Favorite</Badge> : null}</div>
            <h2 className="mt-2 font-serif text-2xl">{material.title}</h2>
            <p className="text-sm text-muted">{material.subject} · {material.sizeLabel} · {formatDate(material.updatedAt)}</p>
            <p className="mt-2 text-sm text-ink-soft">{material.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <LinkButton href={routes.material(material.id)} size="sm">Preview</LinkButton>
              {userId ? <Button size="sm" variant="secondary" onClick={() => actions.toggleFavorite(material.id, userId)}>Favorite</Button> : null}
              {userId === material.ownerId ? <Button size="sm" variant="ghost" onClick={async () => {
                const ok = await confirm({ title: "Delete material?", body: "It disappears from this browser’s library.", confirmLabel: "Delete", tone: "danger" });
                if (ok) { actions.deleteMaterial(material.id); toast({ title: "Deleted" }); }
              }}>Delete</Button> : null}
            </div>
          </Card>
        ))}
      </div>
      <Dialog open={open} title="Add a material" description="Choose a local file if you want its name attached. The file is not uploaded." onClose={() => setOpen(false)}>
        <div className="grid gap-3">
          <Field label="Title" htmlFor="mat-title"><Input id="mat-title" value={title} onChange={(event) => setTitle(event.target.value)} /></Field>
          <Field label="File" htmlFor="mat-file" hint={fileName || "Optional. Only the name is kept."}>
            <input id="mat-file" type="file" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} />
          </Field>
          <Field label="Type" htmlFor="mat-type"><Select id="mat-type" value={kind} onChange={(event) => setKind(event.target.value as MaterialType)}>{types.map((item) => <option key={item}>{item}</option>)}</Select></Field>
          <Field label="Visibility" htmlFor="mat-vis"><Select id="mat-vis" value={visibility} onChange={(event) => setVisibility(event.target.value as MaterialVisibility)}><option value="private">Private</option><option value="course">Course</option><option value="class">Class</option></Select></Field>
          <Button onClick={() => {
            if (!title.trim() || !userId) return;
            actions.createMaterial({
              title: title.trim(),
              type: kind,
              subject: "Studio",
              folderId: state.folders.find((item) => item.ownerId === userId)?.id ?? "folder-studio",
              ownerId: userId,
              visibility,
              sizeLabel: fileName ? "Local file" : "1 KB",
              description: fileName ? `Attached name: ${fileName}` : "Added inside the demo.",
              previewText: fileName ? `This demo stored the file name “${fileName}” and not the file itself.` : "A short note created in the studio.",
            });
            setOpen(false);
            setTitle("");
            toast({ title: "Material added", tone: "success" });
          }}>Save to library</Button>
        </div>
      </Dialog>
    </div>
  );
}

export function MaterialDetail() {
  const params = useParams<{ materialId: string }>();
  const { state, actions } = useStore();
  const material = state.materials.find((item) => item.id === params.materialId);
  const [name, setName] = useState(material?.title ?? "");
  if (!material) return <EmptyState title="Material not found" body="It is not in the local library." action={<LinkButton href={routes.student.materials}>Library</LinkButton>} />;
  const course = material.courseId ? courseById(state, material.courseId) : undefined;
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
      <PageHeader eyebrow={material.type} title={material.title} description={material.description} />
      <Card>
        <p className="text-sm leading-7 text-ink-soft">{material.previewText}</p>
        <dl className="mt-4 space-y-1 text-sm text-muted">
          <div>Subject: {material.subject}</div>
          <div>Updated {formatDate(material.updatedAt)} · {material.sizeLabel}</div>
          <div>Owner: {personById(state, material.ownerId)?.name}</div>
          {course ? <div>Course: {course.title}</div> : null}
          <div>Visibility: {material.visibility}</div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          {material.downloadHref ? <a className="inline-flex h-10 items-center rounded-full bg-teal px-4 text-sm text-paper" href={material.downloadHref} download>Download sample</a> : <Button onClick={() => {
            const blob = new Blob([material.previewText], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${material.id}.txt`;
            link.click();
            URL.revokeObjectURL(url);
          }}>Download text</Button>}
          {state.session.userId === material.ownerId ? (
            <>
              <Input aria-label="Rename" value={name} onChange={(event) => setName(event.target.value)} />
              <Button variant="secondary" onClick={() => actions.updateMaterial(material.id, { title: name })}>Rename</Button>
              <Button variant="secondary" onClick={() => actions.createMaterial({ ...material, title: `${material.title} copy`, favoriteBy: [] })}>Duplicate</Button>
            </>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
