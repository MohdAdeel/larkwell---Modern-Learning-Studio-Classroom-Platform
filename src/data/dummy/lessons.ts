import type { Lesson, LessonType, Section } from "@/types";

type Row = [string, string, LessonType, number];

const curriculum: Record<string, { title: string; lessons: Row[] }[]> = {
  "course-quiet-calculus": [
    {
      title: "Seeing change",
      lessons: [
        ["The picture before the formula", "Slope as a story, before the symbols arrive.", "video", 16],
        ["Limits, drawn slowly", "What it means for a value to settle.", "live", 55],
        ["A first derivative", "From a tangent line to a rate you can name.", "practice", 25],
      ],
    },
    {
      title: "Working the idea",
      lessons: [
        ["Rules without superstition", "Product and chain rules from a picture.", "reading", 18],
        ["Problems worth finishing", "A short set Helen expects you to write cleanly.", "practice", 30],
        ["Office hour on the board", "Bring the problem that will not sit still.", "live", 50],
      ],
    },
  ],
  "course-statistics-calmly": [
    {
      title: "Spread",
      lessons: [
        ["Mean is not the story", "Why a single number flatters a messy set.", "video", 14],
        ["Drawing a distribution", "Histograms that do not lie by accident.", "live", 50],
        ["Spread in a sentence", "Say what the variation is doing.", "practice", 20],
      ],
    },
    {
      title: "Samples",
      lessons: [
        ["Who is missing", "A sample is a choice.", "reading", 16],
        ["Uncertainty, said plainly", "Intervals without the theater.", "live", 50],
        ["A chart you would sign", "Rewrite a misleading graphic.", "practice", 25],
      ],
    },
  ],
  "course-bridge-notes": [
    {
      title: "Balance",
      lessons: [
        ["Both sides of the line", "What an equation is promising.", "reading", 12],
        ["Naming the unknown", "Variables that mean something.", "practice", 20],
        ["A quiet problem set", "Archived practice from the old studio.", "practice", 20],
      ],
    },
    {
      title: "Keeping notes",
      lessons: [
        ["Show the step you trust", "Writing algebra another person can check.", "video", 12],
        ["Common slips", "The mistakes Helen still sees.", "reading", 10],
        ["Closing the notebook", "How this studio used to end.", "live", 40],
      ],
    },
  ],
  "course-motion-studio": [
    {
      title: "Arrows",
      lessons: [
        ["What a force is for", "A push, a pull, and the object that feels them.", "video", 15],
        ["Free-body, slowly", "One diagram, then the argument.", "live", 55],
        ["Newton without chanting", "The law as a sentence.", "reading", 14],
      ],
    },
    {
      title: "Motion",
      lessons: [
        ["Position, velocity, story", "Graphs that describe a walk.", "practice", 22],
        ["The ramp problem", "A live class with one careful example.", "live", 50],
        ["Units are part of the answer", "Checking before you box a number.", "practice", 18],
      ],
    },
  ],
  "course-waves-light": [
    {
      title: "What repeats",
      lessons: [
        ["A pulse on a string", "The simplest wave worth drawing.", "video", 14],
        ["Frequency and pitch", "Hearing the graph.", "live", 50],
        ["Superposition", "Two waves, one rope.", "practice", 20],
      ],
    },
    {
      title: "Light",
      lessons: [
        ["Reflection you can predict", "Angles, without the folklore.", "reading", 12],
        ["Bending at a boundary", "A live ray diagram.", "live", 50],
        ["A short light lab", "Three sketches and a conclusion.", "practice", 24],
      ],
    },
  ],
  "course-cell-stories": [
    {
      title: "The room",
      lessons: [
        ["A cell is a workplace", "Jobs before vocabulary lists.", "video", 13],
        ["Membrane, drawn", "What gets in, and why the drawing matters.", "live", 50],
        ["Organelles with errands", "Name them after you know the task.", "practice", 20],
      ],
    },
    {
      title: "The sketch",
      lessons: [
        ["Lab sketches that stay useful", "Labels, scale, and honesty.", "reading", 12],
        ["Comparing two cells", "Plant and animal, without the poster.", "live", 45],
        ["From picture to paragraph", "Write what the sketch showed.", "practice", 18],
      ],
    },
  ],
  "course-field-journal": [
    {
      title: "Looking",
      lessons: [
        ["Arrive before you name", "The first ten minutes in a place.", "reading", 12],
        ["A habitat sketch", "Edges, light, and what moves.", "practice", 20],
        ["Notes another person can use", "Dates, places, and doubt.", "video", 14],
      ],
    },
    {
      title: "Checking",
      lessons: [
        ["When a guess is too early", "Holding the identification.", "live", 45],
        ["A return visit", "What changed, what you missed.", "practice", 18],
        ["Sharing a page", "Studio critique of a field note.", "live", 40],
      ],
    },
  ],
  "course-french-table": [
    {
      title: "The market",
      lessons: [
        ["Asking for what you want", "Polite, specific, repeatable.", "video", 12],
        ["At the stall", "A live scene with prices and quantities.", "live", 45],
        ["The note on the bag", "Writing a short request.", "practice", 15],
      ],
    },
    {
      title: "The table",
      lessons: [
        ["Ordering without panic", "The phrases that buy you a moment.", "reading", 10],
        ["A meal with questions", "Live conversation, corrected gently.", "live", 50],
        ["A letter home", "Past tense, only as far as you need.", "practice", 20],
      ],
    },
  ],
  "course-spanish-hour": [
    {
      title: "A visit",
      lessons: [
        ["At the door", "Greetings that sound like you.", "video", 11],
        ["Family names and news", "A live five-minute visit.", "live", 40],
        ["Making a plan", "Time, place, and a verb you trust.", "practice", 16],
      ],
    },
    {
      title: "Yesterday",
      lessons: [
        ["The past, in small doses", "What you did, not the whole tense chart.", "reading", 12],
        ["Telling a short day", "Live storytelling.", "live", 45],
        ["A message to a cousin", "Write it, then say it.", "practice", 15],
      ],
    },
  ],
  "course-atlantic-worlds": [
    {
      title: "Documents",
      lessons: [
        ["How to enter a source", "Date, author, and the reason it exists.", "reading", 18],
        ["A ship's list", "Seminar on a trade document.", "live", 70],
        ["Citation without clutter", "A trail another reader can follow.", "practice", 20],
      ],
    },
    {
      title: "Argument",
      lessons: [
        ["A claim with a edge", "What you are willing to defend.", "video", 14],
        ["Empire and the household", "A second seminar.", "live", 70],
        ["The paragraph that carries it", "Draft and response.", "practice", 25],
      ],
    },
  ],
  "course-organic-maps": [
    {
      title: "The city",
      lessons: [
        ["Groups as neighborhoods", "Alcohols, carbonyls, and the rest of the map.", "video", 16],
        ["Drawing the map", "A live tour of one molecule.", "live", 55],
        ["Recognize before you react", "Drills that stay visual.", "practice", 20],
      ],
    },
    {
      title: "A path",
      lessons: [
        ["Why this product", "Reasoning, not a coin toss.", "reading", 14],
        ["One mechanism, aloud", "Live board work.", "live", 55],
        ["Explain it to a peer", "A written mechanism in sentences.", "practice", 22],
      ],
    },
  ],
  "course-lab-notes": [
    {
      title: "Before the bench",
      lessons: [
        ["A procedure someone can repeat", "Steps, amounts, and warnings.", "reading", 12],
        ["The page layout", "What belongs in the left margin.", "video", 10],
        ["Draft a method", "Practice with a simple titration.", "practice", 20],
      ],
    },
    {
      title: "After",
      lessons: [
        ["Observation versus hope", "Write what happened.", "reading", 10],
        ["A result table", "Numbers with units and doubt.", "practice", 18],
        ["Studio review of a page", "Planned live critique.", "live", 40],
      ],
    },
  ],
  "course-close-reading": [
    {
      title: "Attention",
      lessons: [
        ["The word doing the work", "How to mark a page.", "video", 13],
        ["Reading a paragraph aloud", "Live studio on one passage.", "live", 50],
        ["Margin notes worth keeping", "A method, not a decoration.", "practice", 18],
      ],
    },
    {
      title: "Evidence",
      lessons: [
        ["Quote, then talk", "Don't let the quotation finish the thought.", "reading", 12],
        ["Two readings of a sentence", "Seminar.", "live", 50],
        ["A page of criticism", "Short response, specific claim.", "practice", 22],
      ],
    },
  ],
  "course-essay-architecture": [
    {
      title: "Spine",
      lessons: [
        ["A claim you can say aloud", "If it vanishes when spoken, it is not ready.", "video", 12],
        ["Openings that earn the next sentence", "Live workshop.", "live", 50],
        ["Evidence in an order", "Not everything you found belongs.", "practice", 20],
      ],
    },
    {
      title: "Revision",
      lessons: [
        ["The reader's path", "Where they stumble.", "reading", 12],
        ["Line edits, after the idea", "A workshop on three paragraphs.", "live", 50],
        ["An ending that lands", "Stop apologizing in the last line.", "practice", 16],
      ],
    },
  ],
  "course-hearing-harmony": [
    {
      title: "Listening",
      lessons: [
        ["Before the name", "Sing the bass, then talk.", "video", 12],
        ["Cadences by ear", "Live listening studio.", "live", 45],
        ["A progression on paper", "Only after you can hear it.", "practice", 18],
      ],
    },
    {
      title: "Writing",
      lessons: [
        ["Triads without clutter", "Spacing that a choir could sing.", "reading", 12],
        ["Four bars together", "Live writing on the board.", "live", 50],
        ["Name the color", "Major, minor, and the words in between.", "practice", 16],
      ],
    },
  ],
  "course-programs-care": [
    {
      title: "Small programs",
      lessons: [
        ["A program you can read tomorrow", "Names, shape, and one job.", "video", 16],
        ["Errors as sentences", "Live debugging, slowly.", "live", 55],
        ["A function with a promise", "What it takes, what it returns.", "practice", 24],
      ],
    },
    {
      title: "Review",
      lessons: [
        ["Reading someone else's code", "Kindness and precision.", "reading", 14],
        ["A diff worth commenting on", "Live review.", "live", 50],
        ["Leave the file better", "A small refactor with a note.", "practice", 25],
      ],
    },
  ],
  "course-markets-plain": [
    {
      title: "The story",
      lessons: [
        ["A price is a sentence", "What people are actually doing.", "video", 13],
        ["Supply, without the costume", "Live examples from ordinary markets.", "live", 50],
        ["Explain it to a neighbor", "A one-minute version.", "practice", 15],
      ],
    },
    {
      title: "The chart",
      lessons: [
        ["Axes that tell the truth", "What was left off.", "reading", 12],
        ["Wages and trade-offs", "Seminar on a simple model.", "live", 50],
        ["The hidden assumption", "Find it, then say whether it matters.", "practice", 20],
      ],
    },
  ],
};

export function buildCurriculum() {
  const sections: Section[] = [];
  const lessons: Lesson[] = [];
  for (const [courseId, groups] of Object.entries(curriculum)) {
    const slug = courseId.replace("course-", "");
    groups.forEach((group, sectionIndex) => {
      const sectionId = `section-${slug}-${sectionIndex + 1}`;
      sections.push({
        id: sectionId,
        courseId,
        title: group.title,
        order: sectionIndex + 1,
      });
      group.lessons.forEach((lesson, lessonIndex) => {
        lessons.push({
          id: `lesson-${slug}-${sectionIndex + 1}${lessonIndex + 1}`,
          courseId,
          sectionId,
          title: lesson[0],
          summary: lesson[1],
          type: lesson[2],
          durationMin: lesson[3],
          order: lessonIndex + 1,
        });
      });
    });
  }
  return { sections, lessons };
}

export const { sections, lessons } = buildCurriculum();
