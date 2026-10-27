import type {
  Announcement,
  AppState,
  Assignment,
  Course,
  LiveClass,
  Material,
  Review,
  Session,
  Student,
  Teacher,
  Ticket,
  Whiteboard,
} from "@/types";
import { createId, localStamp } from "@/lib/ids";

type Commit = (recipe: (draft: AppState) => void) => void;

export function createActions(commit: Commit) {
  return {
    signIn(role: Session["role"], userId: string | null) {
      commit((draft) => {
        draft.session = { role, userId };
      });
    },
    signOut() {
      commit((draft) => {
        draft.session = { role: "guest", userId: null };
      });
    },
    updateStudent(id: string, patch: Partial<Student>) {
      commit((draft) => {
        const student = draft.students.find((item) => item.id === id);
        if (student) Object.assign(student, patch);
      });
    },
    updateTeacher(id: string, patch: Partial<Teacher>) {
      commit((draft) => {
        const teacher = draft.teachers.find((item) => item.id === id);
        if (teacher) Object.assign(teacher, patch);
      });
    },
    setStudentStatus(id: string, status: Student["status"]) {
      commit((draft) => {
        const student = draft.students.find((item) => item.id === id);
        if (student) student.status = status;
      });
    },
    setTeacherStatus(id: string, status: Teacher["status"]) {
      commit((draft) => {
        const teacher = draft.teachers.find((item) => item.id === id);
        if (teacher) teacher.status = status;
      });
    },
    setTeacherVerification(id: string, verification: Teacher["verification"]) {
      commit((draft) => {
        const teacher = draft.teachers.find((item) => item.id === id);
        if (teacher) teacher.verification = verification;
      });
    },
    enroll(studentId: string, courseId: string) {
      let created = false;
      commit((draft) => {
        if (draft.enrollments.some((item) => item.studentId === studentId && item.courseId === courseId)) return;
        const course = draft.courses.find((item) => item.id === courseId);
        if (!course || course.status === "archived" || course.status === "draft") return;
        draft.enrollments.push({
          id: createId("enroll"),
          studentId,
          courseId,
          status: "active",
          completedLessonIds: [],
          enrolledAt: localStamp(),
          lastOpenedAt: localStamp(),
        });
        course.enrolledCount += 1;
        created = true;
      });
      return created;
    },
    setEnrollmentStatus(id: string, status: AppState["enrollments"][number]["status"]) {
      commit((draft) => {
        const enrollment = draft.enrollments.find((item) => item.id === id);
        if (enrollment) enrollment.status = status;
      });
    },
    toggleLesson(studentId: string, courseId: string, lessonId: string) {
      commit((draft) => {
        const enrollment = draft.enrollments.find((item) => item.studentId === studentId && item.courseId === courseId);
        if (!enrollment) return;
        const done = enrollment.completedLessonIds.includes(lessonId);
        enrollment.completedLessonIds = done
          ? enrollment.completedLessonIds.filter((id) => id !== lessonId)
          : [...enrollment.completedLessonIds, lessonId];
        const total = draft.lessons.filter((lesson) => lesson.courseId === courseId).length;
        enrollment.status = total > 0 && enrollment.completedLessonIds.length >= total ? "completed" : "active";
        enrollment.lastOpenedAt = localStamp();
      });
    },
    touchEnrollment(studentId: string, courseId: string) {
      commit((draft) => {
        const enrollment = draft.enrollments.find((item) => item.studentId === studentId && item.courseId === courseId);
        if (enrollment) enrollment.lastOpenedAt = localStamp();
      });
    },
    createCourse(input: Pick<Course, "title" | "subtitle" | "description" | "categoryId" | "level" | "teacherId" | "language" | "price">) {
      const id = createId("course", input.title);
      commit((draft) => {
        draft.courses.unshift({
          ...input,
          id,
          durationHours: 6,
          rating: 0,
          reviewCount: 0,
          enrolledCount: 0,
          status: "draft",
          tags: ["Draft"],
          outcomes: ["Describe the aim of the course in one sentence"],
          cover: { from: "#d7e6e1", to: "#e7e1d6", motif: "arc" },
          updatedAt: localStamp(),
          createdAt: localStamp(),
        });
        draft.sections.push({ id: createId("section", "opening"), courseId: id, title: "Opening", order: 1 });
      });
      return id;
    },
    updateCourse(id: string, patch: Partial<Course>) {
      commit((draft) => {
        const course = draft.courses.find((item) => item.id === id);
        if (!course) return;
        Object.assign(course, patch, { updatedAt: localStamp() });
      });
    },
    addSection(courseId: string, title: string) {
      const id = createId("section", title);
      commit((draft) => {
        const order = draft.sections.filter((section) => section.courseId === courseId).length + 1;
        draft.sections.push({ id, courseId, title, order });
      });
      return id;
    },
    renameSection(id: string, title: string) {
      commit((draft) => {
        const section = draft.sections.find((item) => item.id === id);
        if (section) section.title = title;
      });
    },
    addLesson(sectionId: string, title: string, summary: string) {
      const id = createId("lesson", title);
      commit((draft) => {
        const section = draft.sections.find((item) => item.id === sectionId);
        if (!section) return;
        const order = draft.lessons.filter((lesson) => lesson.sectionId === sectionId).length + 1;
        draft.lessons.push({
          id,
          courseId: section.courseId,
          sectionId,
          title,
          summary,
          durationMin: 20,
          type: "reading",
          order,
        });
      });
      return id;
    },
    updateLesson(id: string, patch: Partial<AppState["lessons"][number]>) {
      commit((draft) => {
        const lesson = draft.lessons.find((item) => item.id === id);
        if (lesson) Object.assign(lesson, patch);
      });
    },
    deleteLesson(id: string) {
      commit((draft) => {
        draft.lessons = draft.lessons.filter((lesson) => lesson.id !== id);
      });
    },
    moveLesson(id: string, direction: -1 | 1) {
      commit((draft) => {
        const lesson = draft.lessons.find((item) => item.id === id);
        if (!lesson) return;
        const siblings = draft.lessons.filter((item) => item.sectionId === lesson.sectionId).sort((a, b) => a.order - b.order);
        const index = siblings.findIndex((item) => item.id === id);
        const swap = siblings[index + direction];
        if (!swap) return;
        const order = lesson.order;
        lesson.order = swap.order;
        swap.order = order;
      });
    },
    createClass(input: Omit<LiveClass, "id" | "attendance" | "status"> & { status?: LiveClass["status"] }) {
      const id = createId("class", input.title);
      commit((draft) => {
        draft.classes.unshift({ ...input, id, status: input.status ?? "scheduled", attendance: [] });
      });
      return id;
    },
    updateClass(id: string, patch: Partial<LiveClass>) {
      commit((draft) => {
        const item = draft.classes.find((entry) => entry.id === id);
        if (item) Object.assign(item, patch);
      });
    },
    createBoard(input: Pick<Whiteboard, "title" | "ownerId" | "ownerRole" | "courseId" | "visibility">) {
      const id = createId("board", input.title);
      const stamp = localStamp();
      commit((draft) => {
        draft.boards.unshift({
          ...input,
          id,
          createdAt: stamp,
          updatedAt: stamp,
          background: "grid",
          pages: [{ id: createId("page"), strokes: [] }],
        });
      });
      return id;
    },
    updateBoard(id: string, patch: Partial<Whiteboard>) {
      commit((draft) => {
        const board = draft.boards.find((item) => item.id === id);
        if (!board) return;
        Object.assign(board, patch, { updatedAt: localStamp() });
      });
    },
    duplicateBoard(id: string) {
      const newId = createId("board", "copy");
      commit((draft) => {
        const board = draft.boards.find((item) => item.id === id);
        if (!board) return;
        const stamp = localStamp();
        draft.boards.unshift({
          ...structuredClone(board),
          id: newId,
          title: `${board.title} copy`,
          createdAt: stamp,
          updatedAt: stamp,
          pages: board.pages.map((page) => ({
            id: createId("page"),
            strokes: page.strokes.map((stroke) => ({ ...structuredClone(stroke), id: createId("stroke") })),
          })),
        });
      });
      return newId;
    },
    deleteBoard(id: string) {
      commit((draft) => {
        draft.boards = draft.boards.filter((board) => board.id !== id);
      });
    },
    createFolder(name: string, ownerId: string) {
      const id = createId("folder", name);
      commit((draft) => {
        draft.folders.push({ id, name, ownerId });
      });
      return id;
    },
    createMaterial(input: Omit<Material, "id" | "updatedAt" | "favoriteBy"> & { favoriteBy?: string[] }) {
      const id = createId("material", input.title);
      commit((draft) => {
        draft.materials.unshift({ ...input, id, favoriteBy: input.favoriteBy ?? [], updatedAt: localStamp() });
      });
      return id;
    },
    updateMaterial(id: string, patch: Partial<Material>) {
      commit((draft) => {
        const material = draft.materials.find((item) => item.id === id);
        if (material) Object.assign(material, patch, { updatedAt: localStamp() });
      });
    },
    deleteMaterial(id: string) {
      commit((draft) => {
        draft.materials = draft.materials.filter((item) => item.id !== id);
      });
    },
    toggleFavorite(materialId: string, userId: string) {
      commit((draft) => {
        const material = draft.materials.find((item) => item.id === materialId);
        if (!material) return;
        material.favoriteBy = material.favoriteBy.includes(userId)
          ? material.favoriteBy.filter((id) => id !== userId)
          : [...material.favoriteBy, userId];
      });
    },
    createAssignment(input: Omit<Assignment, "id" | "status"> & { status?: Assignment["status"] }) {
      const id = createId("assign", input.title);
      commit((draft) => {
        draft.assignments.unshift({ ...input, id, status: input.status ?? "draft" });
        const studentIds = draft.enrollments.filter((item) => item.courseId === input.courseId).map((item) => item.studentId);
        for (const studentId of studentIds) {
          draft.submissions.push({ id: createId("sub"), assignmentId: id, studentId, status: "not-started" });
        }
      });
      return id;
    },
    updateAssignment(id: string, patch: Partial<Assignment>) {
      commit((draft) => {
        const assignment = draft.assignments.find((item) => item.id === id);
        if (assignment) Object.assign(assignment, patch);
      });
    },
    saveSubmission(assignmentId: string, studentId: string, body: string, submit: boolean) {
      commit((draft) => {
        let submission = draft.submissions.find((item) => item.assignmentId === assignmentId && item.studentId === studentId);
        if (!submission) {
          submission = { id: createId("sub"), assignmentId, studentId, status: "not-started" };
          draft.submissions.push(submission);
        }
        submission.body = body;
        submission.status = submit ? "submitted" : "in-progress";
        if (submit) submission.submittedAt = localStamp();
      });
    },
    reviewSubmission(id: string, score: number, feedback: string) {
      commit((draft) => {
        const submission = draft.submissions.find((item) => item.id === id);
        if (!submission) return;
        submission.score = score;
        submission.feedback = feedback;
        submission.status = "returned";
      });
    },
    setPlan(userId: string, planId: string, interval: "monthly" | "annual", amount: number, description: string) {
      commit((draft) => {
        const existing = draft.subscriptions.find((item) => item.userId === userId);
        const stamp = localStamp();
        if (existing) {
          existing.planId = planId;
          existing.interval = interval;
          existing.status = "active";
          existing.renewsAt = stamp.slice(0, 10);
        } else {
          draft.subscriptions.push({
            id: createId("sub"),
            userId,
            planId,
            interval,
            status: "active",
            renewsAt: stamp.slice(0, 10),
            startedAt: stamp.slice(0, 10),
          });
        }
        draft.invoices.unshift({
          id: createId("inv"),
          userId,
          amount,
          status: "paid",
          description,
          issuedAt: stamp.slice(0, 10),
        });
      });
    },
    setInvoiceStatus(id: string, status: AppState["invoices"][number]["status"]) {
      commit((draft) => {
        const invoice = draft.invoices.find((item) => item.id === id);
        if (invoice) invoice.status = status;
      });
    },
    markNotice(id: string, read: boolean) {
      commit((draft) => {
        const notice = draft.notices.find((item) => item.id === id);
        if (notice) notice.read = read;
      });
    },
    markAllNotices(userId: string) {
      commit((draft) => {
        draft.notices.forEach((notice) => {
          if (notice.userId === userId) notice.read = true;
        });
      });
    },
    addNotice(input: Omit<AppState["notices"][number], "id" | "createdAt" | "read">) {
      commit((draft) => {
        draft.notices.unshift({ ...input, id: createId("note"), createdAt: localStamp(), read: false });
      });
    },
    sendMessage(conversationId: string, senderId: string, body: string) {
      commit((draft) => {
        const conversation = draft.conversations.find((item) => item.id === conversationId);
        if (!conversation) return;
        conversation.messages.push({ id: createId("msg"), senderId, body, sentAt: localStamp() });
      });
    },
    startConversation(participantIds: string[], subject: string, senderId: string, body: string) {
      const id = createId("conv", subject);
      commit((draft) => {
        draft.conversations.unshift({
          id,
          participantIds,
          subject,
          messages: [{ id: createId("msg"), senderId, body, sentAt: localStamp() }],
        });
      });
      return id;
    },
    addReview(input: Omit<Review, "id" | "createdAt" | "hidden">) {
      const id = createId("review");
      commit((draft) => {
        draft.reviews.unshift({ ...input, id, createdAt: localStamp(), hidden: false });
        const course = draft.courses.find((item) => item.id === input.courseId);
        if (course) {
          const visible = draft.reviews.filter((review) => review.courseId === course.id && !review.hidden);
          course.reviewCount = visible.length;
          course.rating = visible.length
            ? Math.round((visible.reduce((sum, review) => sum + review.rating, 0) / visible.length) * 10) / 10
            : 0;
        }
      });
      return id;
    },
    setReviewHidden(id: string, hidden: boolean) {
      commit((draft) => {
        const review = draft.reviews.find((item) => item.id === id);
        if (review) review.hidden = hidden;
      });
    },
    addAnnouncement(input: Omit<Announcement, "id" | "createdAt">) {
      const id = createId("announce", input.title);
      commit((draft) => {
        draft.announcements.unshift({ ...input, id, createdAt: localStamp() });
      });
      return id;
    },
    updateAnnouncement(id: string, patch: Partial<Announcement>) {
      commit((draft) => {
        const announcement = draft.announcements.find((item) => item.id === id);
        if (announcement) Object.assign(announcement, patch);
      });
    },
    deleteAnnouncement(id: string) {
      commit((draft) => {
        draft.announcements = draft.announcements.filter((item) => item.id !== id);
      });
    },
    addTicket(input: Omit<Ticket, "id" | "createdAt" | "replies" | "status">) {
      const id = createId("ticket", input.subject);
      commit((draft) => {
        draft.tickets.unshift({ ...input, id, createdAt: localStamp(), status: "open", replies: [] });
      });
      return id;
    },
    updateTicket(id: string, patch: Partial<Pick<Ticket, "status" | "priority">>) {
      commit((draft) => {
        const ticket = draft.tickets.find((item) => item.id === id);
        if (ticket) Object.assign(ticket, patch);
      });
    },
    replyTicket(id: string, authorId: string, body: string) {
      commit((draft) => {
        const ticket = draft.tickets.find((item) => item.id === id);
        if (!ticket) return;
        ticket.replies.push({ id: createId("reply"), authorId, body, sentAt: localStamp() });
        ticket.status = "waiting";
      });
    },
    addCategory(name: string, description: string) {
      const id = createId("cat", name);
      commit((draft) => {
        draft.categories.push({ id, name, description });
      });
      return id;
    },
    updateCategory(id: string, name: string, description: string) {
      commit((draft) => {
        const category = draft.categories.find((item) => item.id === id);
        if (category) Object.assign(category, { name, description });
      });
    },
    deleteCategory(id: string) {
      let removed = false;
      commit((draft) => {
        if (draft.courses.some((course) => course.categoryId === id)) return;
        draft.categories = draft.categories.filter((category) => category.id !== id);
        removed = true;
      });
      return removed;
    },
    updateSettings(patch: Partial<AppState["settings"]>) {
      commit((draft) => {
        Object.assign(draft.settings, patch);
      });
    },
  };
}
