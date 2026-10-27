import type { Conversation } from "@/types";

export const conversations: Conversation[] = [
  {
    id: "conv-maya-helen",
    participantIds: ["student-maya-01", "teacher-helen-01"],
    subject: "Thursday’s tangent",
    messages: [
      { id: "msg-1", senderId: "student-maya-01", body: "I kept the board, but the line still looks too steep when I redraw it.", sentAt: "2026-10-26T20:12:00" },
      { id: "msg-2", senderId: "teacher-helen-01", body: "Bring that redraw tomorrow. We will put both lines on the same curve and see which one the picture allows.", sentAt: "2026-10-26T21:04:00" },
      { id: "msg-3", senderId: "student-maya-01", body: "I will. I left a question on my own board as well.", sentAt: "2026-10-26T21:16:00" },
    ],
  },
  {
    id: "conv-maya-mateo",
    participantIds: ["student-maya-01", "teacher-mateo-01"],
    subject: "The error sentence",
    messages: [
      { id: "msg-4", senderId: "teacher-mateo-01", body: "When the program complains, read only the first sentence before you change anything.", sentAt: "2026-10-20T19:20:00" },
      { id: "msg-5", senderId: "student-maya-01", body: "It said the basket was not a number. I think I returned the whole list.", sentAt: "2026-10-20T19:48:00" },
      { id: "msg-6", senderId: "teacher-mateo-01", body: "That is the right reading. Monday we will change one line and leave the rest alone.", sentAt: "2026-10-20T20:05:00" },
    ],
  },
  {
    id: "conv-owen-helen",
    participantIds: ["student-owen-01", "teacher-helen-01"],
    subject: "Set three timing",
    messages: [
      { id: "msg-7", senderId: "student-owen-01", body: "I can finish the sketches Friday morning. Is that still inside the hour you read them?", sentAt: "2026-10-27T08:15:00" },
      { id: "msg-8", senderId: "teacher-helen-01", body: "Yes. Send them before noon and I will read the sentences the same day.", sentAt: "2026-10-27T08:40:00" },
    ],
  },
  {
    id: "conv-helen-irene",
    participantIds: ["teacher-helen-01", "admin-irene-01"],
    subject: "Hana’s invitation",
    messages: [
      { id: "msg-9", senderId: "admin-irene-01", body: "Hana Sato has a reader seat and an invitation still open. She listed statistics as her reason for joining.", sentAt: "2026-10-20T11:12:00" },
      { id: "msg-10", senderId: "teacher-helen-01", body: "I will keep Friday’s picture simple and not assume she has the earlier boards.", sentAt: "2026-10-20T12:02:00" },
    ],
  },
  {
    id: "conv-sofia-camille",
    participantIds: ["student-sofia-01", "teacher-camille-01"],
    subject: "The stall note",
    messages: [
      { id: "msg-11", senderId: "student-sofia-01", body: "I was not sure whether to ask the price before or after the quantity.", sentAt: "2026-10-25T18:40:00" },
      { id: "msg-12", senderId: "teacher-camille-01", body: "Either is polite. Quantity first is easier for the person behind the stall. Your note does that. Good.", sentAt: "2026-10-25T19:10:00" },
    ],
  },
  {
    id: "conv-leo-mateo",
    participantIds: ["student-leo-01", "teacher-mateo-01"],
    subject: "Naming the total",
    messages: [
      { id: "msg-13", senderId: "student-leo-01", body: "I called it result. It felt vague after I read it the next day.", sentAt: "2026-10-26T20:30:00" },
      { id: "msg-14", senderId: "teacher-mateo-01", body: "total is enough. If there are two totals, then the name has to say which.", sentAt: "2026-10-26T21:00:00" },
    ],
  },
];
