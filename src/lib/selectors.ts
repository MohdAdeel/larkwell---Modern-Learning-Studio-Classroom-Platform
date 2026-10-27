import type { AppState, Role } from "@/types";

export function courseById(state: AppState, id: string) {
  return state.courses.find((course) => course.id === id);
}

export function teacherById(state: AppState, id: string) {
  return state.teachers.find((teacher) => teacher.id === id);
}

export function studentById(state: AppState, id: string) {
  return state.students.find((student) => student.id === id);
}

export function personById(state: AppState, id: string) {
  const student = studentById(state, id);
  if (student) return { id, name: student.name, email: student.email, role: "student" as const, tone: student.avatarTone };
  const teacher = teacherById(state, id);
  if (teacher) return { id, name: teacher.name, email: teacher.email, role: "teacher" as const, tone: teacher.avatarTone };
  const admin = state.admins.find((item) => item.id === id);
  if (admin) return { id, name: admin.name, email: admin.email, role: "admin" as const, tone: admin.avatarTone };
  return undefined;
}

export function categoryById(state: AppState, id: string) {
  return state.categories.find((category) => category.id === id);
}

export function sectionsForCourse(state: AppState, courseId: string) {
  return state.sections
    .filter((section) => section.courseId === courseId)
    .sort((a, b) => a.order - b.order);
}

export function lessonsForCourse(state: AppState, courseId: string) {
  return state.lessons
    .filter((lesson) => lesson.courseId === courseId)
    .sort((a, b) => a.sectionId.localeCompare(b.sectionId) || a.order - b.order);
}

export function lessonsForSection(state: AppState, sectionId: string) {
  return state.lessons.filter((lesson) => lesson.sectionId === sectionId).sort((a, b) => a.order - b.order);
}

export function enrollmentFor(state: AppState, studentId: string, courseId: string) {
  return state.enrollments.find((item) => item.studentId === studentId && item.courseId === courseId);
}

export function progressFor(state: AppState, studentId: string, courseId: string) {
  const enrollment = enrollmentFor(state, studentId, courseId);
  const total = lessonsForCourse(state, courseId).length;
  if (!enrollment || total === 0) return 0;
  return Math.round((enrollment.completedLessonIds.length / total) * 100);
}

export function subscriptionFor(state: AppState, userId: string) {
  return state.subscriptions.find((item) => item.userId === userId);
}

export function unreadCount(state: AppState, userId: string) {
  return state.notices.filter((notice) => notice.userId === userId && !notice.read).length;
}

export function classesFor(state: AppState, role: Role, userId: string) {
  if (role === "teacher") return state.classes.filter((item) => item.teacherId === userId);
  if (role === "student") return state.classes.filter((item) => item.studentIds.includes(userId));
  return state.classes;
}

export function studentsForTeacher(state: AppState, teacherId: string) {
  const courseIds = new Set(state.courses.filter((course) => course.teacherId === teacherId).map((course) => course.id));
  const ids = new Set(
    state.enrollments.filter((item) => courseIds.has(item.courseId)).map((item) => item.studentId),
  );
  return state.students.filter((student) => ids.has(student.id));
}

export function visibleMaterials(state: AppState, role: Role | "guest", userId: string | null) {
  if (role === "admin") return state.materials;
  return state.materials.filter((material) => {
    if (userId && material.ownerId === userId) return true;
    if (material.visibility === "private") return false;
    if (!userId || role === "guest") return material.visibility === "course";
    if (role === "teacher") {
      const course = material.courseId ? courseById(state, material.courseId) : undefined;
      return course?.teacherId === userId || material.visibility === "course";
    }
    if (!material.courseId) return material.visibility === "course";
    return Boolean(enrollmentFor(state, userId, material.courseId));
  });
}
