import type { backendInterface } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);

const sample1: import("../backend").LectureRecord = {
  id: "sample-1",
  url: "https://www.youtube.com/watch?v=aircAruvnKk",
  title: "But what is a Neural Network? | Deep Learning, Chapter 1",
  thumbnailUrl: "https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg",
  createdAt: now - BigInt(7_200_000_000_000),
  summary:
    "This lecture provides an intuitive introduction to neural networks, explaining how they are inspired by the brain and how they learn to recognize patterns. It walks through a simple digit-recognition example, introducing the concept of layers, neurons, activations, weights, and biases.",
  takeaways: [
    "A neural network is composed of layers of neurons, each connected to the next via weighted edges",
    "Activations represent how strongly a neuron fires, typically between 0 and 1",
    "Weights and biases are the learnable parameters that determine how information flows through the network",
    "Learning means finding the weights and biases that minimize prediction error on training data",
    "Deep networks can learn hierarchical features: edges → shapes → objects",
  ],
  tableOfContents: [
    { title: "Introduction", timestamp: BigInt(0), summary: "Motivation and overview of neural networks as pattern recognizers." },
    { title: "Neurons and Activations", timestamp: BigInt(45), summary: "What a neuron is, what activation means, and the sigmoid function." },
    { title: "Layers", timestamp: BigInt(130), summary: "Input, hidden, and output layers and their roles in the network." },
    { title: "Weights and Biases", timestamp: BigInt(220), summary: "How parameters control information flow and what learning means." },
    { title: "Forward Pass", timestamp: BigInt(330), summary: "Computing activations layer by layer to produce a prediction." },
  ],
  transcript: [
    { timestamp: BigInt(0), text: "Imagine you want a computer to recognize handwritten digits — how would you even begin?" },
    { timestamp: BigInt(20), text: "Neural networks are loosely inspired by how biological neurons in the brain pass signals to one another." },
    { timestamp: BigInt(45), text: "A neuron holds a number called its activation, representing how strongly it fires." },
    { timestamp: BigInt(80), text: "The first layer consists of 784 neurons, one per pixel of a 28×28 image." },
    { timestamp: BigInt(130), text: "Hidden layers in between learn increasingly abstract representations of the input." },
    { timestamp: BigInt(180), text: "The output layer has 10 neurons, one per digit class — the most active one is the prediction." },
    { timestamp: BigInt(220), text: "Each connection has a weight: a positive weight amplifies, a negative weight suppresses." },
    { timestamp: BigInt(280), text: "A bias shifts the activation threshold, letting neurons fire only above a certain level." },
    { timestamp: BigInt(330), text: "During a forward pass, activations propagate through every layer to produce the final output." },
    { timestamp: BigInt(400), text: "Learning is the process of adjusting all weights and biases to minimize prediction error." },
  ],
  qa: [
    {
      id: "qa-sample1-1",
      question: "Why do we need multiple hidden layers?",
      answer:
        "Multiple hidden layers allow the network to learn hierarchical features. Early layers detect simple patterns like edges, middle layers combine those into shapes, and later layers assemble shapes into complex objects.",
      timestamp: BigInt(130),
      createdAt: now - BigInt(3_600_000_000_000),
    },
  ],
};

const sample2: import("../backend").LectureRecord = {
  id: "sample-2",
  url: "https://www.youtube.com/watch?v=kPRA0W1kECg",
  title: "15 Sorting Algorithms in 6 Minutes",
  thumbnailUrl: "https://img.youtube.com/vi/kPRA0W1kECg/maxresdefault.jpg",
  createdAt: now - BigInt(3_600_000_000_000),
  summary:
    "A fast-paced visual tour of 15 classic sorting algorithms. Each algorithm is demonstrated with an animated visualization, making it easy to understand how different strategies compare elements and rearrange them into sorted order.",
  takeaways: [
    "Bubble sort and selection sort are O(n²) — simple but slow for large inputs",
    "Merge sort guarantees O(n log n) using a divide-and-conquer strategy",
    "Quicksort is O(n log n) on average but O(n²) worst-case; pivot choice matters",
    "Radix sort and counting sort can achieve O(n) time by avoiding comparisons",
    "No comparison-based sort can beat O(n log n) in the worst case",
  ],
  tableOfContents: [
    { title: "Bubble Sort", timestamp: BigInt(0), summary: "Repeatedly swap adjacent elements that are out of order." },
    { title: "Selection Sort", timestamp: BigInt(30), summary: "Find the minimum element and place it at the front each pass." },
    { title: "Insertion Sort", timestamp: BigInt(60), summary: "Build a sorted prefix by inserting each element in the right place." },
    { title: "Merge Sort", timestamp: BigInt(120), summary: "Divide array in half, sort each half, merge the results." },
    { title: "Quick Sort", timestamp: BigInt(180), summary: "Partition around a pivot, recursively sort each partition." },
    { title: "Radix Sort", timestamp: BigInt(270), summary: "Sort digit by digit from least significant to most significant." },
  ],
  transcript: [
    { timestamp: BigInt(0), text: "Bubble sort compares each pair of adjacent elements and swaps them if they are out of order." },
    { timestamp: BigInt(30), text: "Selection sort scans the unsorted region for the minimum and moves it to the front." },
    { timestamp: BigInt(60), text: "Insertion sort maintains a sorted prefix and inserts each new element in its correct position." },
    { timestamp: BigInt(120), text: "Merge sort divides the array in half, recursively sorts both halves, then merges them." },
    { timestamp: BigInt(180), text: "Quicksort picks a pivot element and partitions the array into elements smaller and larger than it." },
    { timestamp: BigInt(270), text: "Radix sort processes one digit position at a time, using a stable sub-sort at each step." },
  ],
  qa: [],
};

const sample3: import("../backend").LectureRecord = {
  id: "sample-3",
  url: "https://www.youtube.com/watch?v=_f-qkGJBPts",
  title: "The Feynman Technique — The Best Way to Learn Anything",
  thumbnailUrl: "https://img.youtube.com/vi/_f-qkGJBPts/maxresdefault.jpg",
  createdAt: now - BigInt(1_800_000_000_000),
  summary:
    "Nobel Prize-winning physicist Richard Feynman developed a simple four-step technique to deeply understand any concept. By pretending to teach a topic to a child, you quickly identify gaps in your understanding.",
  takeaways: [
    "Step 1: Choose a concept and write its name at the top of a blank page",
    "Step 2: Explain the concept in simple language as if teaching a child",
    "Step 3: Identify gaps — wherever your explanation breaks down, return to the source",
    "Step 4: Simplify further, using analogies to replace technical jargon",
    "If you cannot explain it simply, you do not understand it well enough yet",
  ],
  tableOfContents: [
    { title: "Why Most Studying Fails", timestamp: BigInt(0), summary: "The difference between familiarity and genuine understanding." },
    { title: "Step 1 — Choose a Concept", timestamp: BigInt(40), summary: "Pick what you want to learn and commit it to paper." },
    { title: "Step 2 — Teach It Simply", timestamp: BigInt(80), summary: "Write an explanation using only simple everyday language." },
    { title: "Step 3 — Find the Gaps", timestamp: BigInt(140), summary: "Where your explanation breaks, those are your learning targets." },
    { title: "Step 4 — Simplify and Use Analogies", timestamp: BigInt(220), summary: "Replace jargon with stories and analogies for deep retention." },
  ],
  transcript: [
    { timestamp: BigInt(0), text: "Most students confuse recognizing information with actually understanding it." },
    { timestamp: BigInt(25), text: "Feynman believed the ultimate test of understanding is whether you can explain it to a child." },
    { timestamp: BigInt(40), text: "Step one: choose a concept — write its name at the top of a blank sheet of paper." },
    { timestamp: BigInt(80), text: "Step two: explain the concept using only plain language, as if teaching a 12-year-old." },
    { timestamp: BigInt(140), text: "Step three: wherever your explanation stumbles, you have found a gap in your knowledge." },
    { timestamp: BigInt(220), text: "Step four: review your explanation and look for any remaining complexity or jargon." },
    { timestamp: BigInt(300), text: "Repeat the cycle until your explanation is clear, simple, and complete — that is true mastery." },
  ],
  qa: [
    {
      id: "qa-sample3-1",
      question: "How is this different from just re-reading notes?",
      answer:
        "Re-reading creates an illusion of competence — material feels familiar so your brain thinks you know it. The Feynman Technique forces active recall and construction of an explanation from scratch.",
      timestamp: undefined,
      createdAt: now - BigInt(900_000_000_000),
    },
  ],
};

const lectures: import("../backend").LectureRecord[] = [sample1, sample2, sample3];

export const mockBackend: backendInterface = {
  getLectures: async () => lectures,
  getLecture: async (id) => lectures.find((l) => l.id === id) ?? null,
  processLecture: async (_url) => ({
    __kind__: "ok",
    ok: sample1,
  }),
  askQuestion: async (_lectureId, question, _timestamp) => ({
    __kind__: "ok",
    ok: `Great question! "${question}" — Here is an AI-generated answer based on the lecture content. The key insight here is that understanding the fundamentals is essential before moving to advanced topics.`,
  }),
  addQuestion: async (_lectureId, _question, _timestamp) => "qa-new-1",
  deleteLecture: async (_id) => true,
  downloadNotes: async (lectureId) => {
    const lecture = lectures.find((l) => l.id === lectureId);
    if (!lecture) return null;
    return `# ${lecture.title}\n\n## Summary\n${lecture.summary}\n\n## Key Takeaways\n${lecture.takeaways.map((t) => `- ${t}`).join("\n")}\n\n## Table of Contents\n${lecture.tableOfContents.map((c) => `- [${c.title}]`).join("\n")}`;
  },
  transform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),
};
