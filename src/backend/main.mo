import Map "mo:core/Map";
import Time "mo:core/Time";
import LectureLib "lib/lecture";
import LectureMixin "mixins/lecture-api";
import Types "types/lecture";

actor {
  let lectureStore : LectureLib.LectureStore = Map.empty<Types.LectureId, Types.LectureRecord>();

  // Pre-populate with sample content on first load
  do {
    if (lectureStore.isEmpty()) {
      let now = Time.now();

      // Sample 1: Introduction to Neural Networks
      let sample1Id = "sample-1";
      let sample1 : Types.LectureRecord = {
        id = sample1Id;
        url = "https://www.youtube.com/watch?v=aircAruvnKk";
        title = "But what is a Neural Network? | Deep Learning, Chapter 1";
        thumbnailUrl = "https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg";
        createdAt = now - 7_200_000_000_000;
        summary = "This lecture provides an intuitive introduction to neural networks, explaining how they are inspired by the brain and how they learn to recognize patterns. It walks through a simple digit-recognition example, introducing the concept of layers, neurons, activations, weights, and biases. By the end, you will understand how a network can transform raw pixel data into meaningful predictions.";
        takeaways = [
          "A neural network is composed of layers of neurons, each connected to the next via weighted edges",
          "Activations represent how strongly a neuron fires, typically between 0 and 1",
          "Weights and biases are the learnable parameters that determine how information flows through the network",
          "Learning means finding the weights and biases that minimize prediction error on training data",
          "Deep networks can learn hierarchical features: edges → shapes → objects",
        ];
        tableOfContents = [
          { title = "Introduction"; timestamp = 0; summary = "Motivation and overview of neural networks as pattern recognizers." },
          { title = "Neurons and Activations"; timestamp = 45; summary = "What a neuron is, what activation means, and the sigmoid function." },
          { title = "Layers"; timestamp = 130; summary = "Input, hidden, and output layers and their roles in the network." },
          { title = "Weights and Biases"; timestamp = 220; summary = "How parameters control information flow and what learning means." },
          { title = "Forward Pass"; timestamp = 330; summary = "Computing activations layer by layer to produce a prediction." },
        ];
        transcript = [
          { timestamp = 0; text = "Imagine you want a computer to recognize handwritten digits — how would you even begin?" },
          { timestamp = 20; text = "Neural networks are loosely inspired by how biological neurons in the brain pass signals to one another." },
          { timestamp = 45; text = "A neuron holds a number called its activation, representing how strongly it fires." },
          { timestamp = 80; text = "The first layer consists of 784 neurons, one per pixel of a 28×28 image." },
          { timestamp = 130; text = "Hidden layers in between learn increasingly abstract representations of the input." },
          { timestamp = 180; text = "The output layer has 10 neurons, one per digit class — the most active one is the prediction." },
          { timestamp = 220; text = "Each connection has a weight: a positive weight amplifies, a negative weight suppresses." },
          { timestamp = 280; text = "A bias shifts the activation threshold, letting neurons fire only above a certain level." },
          { timestamp = 330; text = "During a forward pass, activations propagate through every layer to produce the final output." },
          { timestamp = 400; text = "Learning is the process of adjusting all weights and biases to minimize prediction error." },
        ];
        qa = [
          {
            id = "qa-sample1-1";
            question = "Why do we need multiple hidden layers?";
            answer = "Multiple hidden layers allow the network to learn hierarchical features. Early layers detect simple patterns like edges, middle layers combine those into shapes, and later layers assemble shapes into complex objects. Without depth, the network can only learn simple linear mappings.";
            timestamp = ?130;
            createdAt = now - 3_600_000_000_000;
          },
        ];
      };

      // Sample 2: Sorting Algorithms
      let sample2Id = "sample-2";
      let sample2 : Types.LectureRecord = {
        id = sample2Id;
        url = "https://www.youtube.com/watch?v=kPRA0W1kECg";
        title = "15 Sorting Algorithms in 6 Minutes";
        thumbnailUrl = "https://img.youtube.com/vi/kPRA0W1kECg/maxresdefault.jpg";
        createdAt = now - 3_600_000_000_000;
        summary = "A fast-paced visual tour of 15 classic sorting algorithms. Each algorithm is demonstrated with an animated visualization, making it easy to understand how different strategies compare elements and rearrange them into sorted order. The lecture covers O(n²) algorithms like bubble sort and insertion sort, O(n log n) algorithms like merge sort and quicksort, and exotic approaches like radix sort and shell sort.";
        takeaways = [
          "Bubble sort and selection sort are O(n²) — simple but slow for large inputs",
          "Merge sort guarantees O(n log n) using a divide-and-conquer strategy",
          "Quicksort is O(n log n) on average but O(n²) worst-case; pivot choice matters",
          "Radix sort and counting sort can achieve O(n) time by avoiding comparisons",
          "No comparison-based sort can beat O(n log n) in the worst case",
        ];
        tableOfContents = [
          { title = "Bubble Sort"; timestamp = 0; summary = "Repeatedly swap adjacent elements that are out of order." },
          { title = "Selection Sort"; timestamp = 30; summary = "Find the minimum element and place it at the front each pass." },
          { title = "Insertion Sort"; timestamp = 60; summary = "Build a sorted prefix by inserting each element in the right place." },
          { title = "Merge Sort"; timestamp = 120; summary = "Divide array in half, sort each half, merge the results." },
          { title = "Quick Sort"; timestamp = 180; summary = "Partition around a pivot, recursively sort each partition." },
          { title = "Radix Sort"; timestamp = 270; summary = "Sort digit by digit from least significant to most significant." },
        ];
        transcript = [
          { timestamp = 0; text = "Bubble sort compares each pair of adjacent elements and swaps them if they are out of order." },
          { timestamp = 30; text = "Selection sort scans the unsorted region for the minimum and moves it to the front." },
          { timestamp = 60; text = "Insertion sort maintains a sorted prefix and inserts each new element in its correct position." },
          { timestamp = 90; text = "Shell sort is a generalization of insertion sort that first sorts elements far apart." },
          { timestamp = 120; text = "Merge sort divides the array in half, recursively sorts both halves, then merges them." },
          { timestamp = 160; text = "The merge step takes O(n) time and the recursion depth is O(log n), giving O(n log n) overall." },
          { timestamp = 180; text = "Quicksort picks a pivot element and partitions the array into elements smaller and larger than it." },
          { timestamp = 230; text = "With a good pivot strategy, quicksort runs in O(n log n) on average and is very cache-friendly." },
          { timestamp = 270; text = "Radix sort processes one digit position at a time, using a stable sub-sort at each step." },
          { timestamp = 320; text = "Counting sort counts occurrences of each value and reconstructs the sorted array in O(n + k) time." },
        ];
        qa = [];
      };

      // Sample 3: The Feynman Technique
      let sample3Id = "sample-3";
      let sample3 : Types.LectureRecord = {
        id = sample3Id;
        url = "https://www.youtube.com/watch?v=_f-qkGJBPts";
        title = "The Feynman Technique — The Best Way to Learn Anything";
        thumbnailUrl = "https://img.youtube.com/vi/_f-qkGJBPts/maxresdefault.jpg";
        createdAt = now - 1_800_000_000_000;
        summary = "Nobel Prize-winning physicist Richard Feynman developed a simple four-step technique to deeply understand any concept. By pretending to teach a topic to a child, you quickly identify gaps in your understanding. You then return to source material to fill those gaps and repeat until your explanation is clear and simple. This lecture explains each step with practical examples and demonstrates why teaching is the best form of learning.";
        takeaways = [
          "Step 1: Choose a concept and write its name at the top of a blank page",
          "Step 2: Explain the concept in simple language as if teaching a child",
          "Step 3: Identify gaps — wherever your explanation breaks down, return to the source",
          "Step 4: Simplify further, using analogies to replace technical jargon",
          "If you cannot explain it simply, you do not understand it well enough yet",
        ];
        tableOfContents = [
          { title = "Why Most Studying Fails"; timestamp = 0; summary = "The difference between familiarity and genuine understanding." },
          { title = "Step 1 — Choose a Concept"; timestamp = 40; summary = "Pick what you want to learn and commit it to paper." },
          { title = "Step 2 — Teach It Simply"; timestamp = 80; summary = "Write an explanation using only simple everyday language." },
          { title = "Step 3 — Find the Gaps"; timestamp = 140; summary = "Where your explanation breaks, those are your learning targets." },
          { title = "Step 4 — Simplify and Use Analogies"; timestamp = 220; summary = "Replace jargon with stories and analogies for deep retention." },
        ];
        transcript = [
          { timestamp = 0; text = "Most students confuse recognizing information with actually understanding it." },
          { timestamp = 25; text = "Feynman believed the ultimate test of understanding is whether you can explain it to a child." },
          { timestamp = 40; text = "Step one: choose a concept — write its name at the top of a blank sheet of paper." },
          { timestamp = 80; text = "Step two: explain the concept using only plain language, as if teaching a 12-year-old." },
          { timestamp = 110; text = "Avoid jargon. If you use a technical term, define it in simple words immediately." },
          { timestamp = 140; text = "Step three: wherever your explanation stumbles, you have found a gap in your knowledge." },
          { timestamp = 180; text = "Go back to the source material, read until you can fill that gap, then continue your explanation." },
          { timestamp = 220; text = "Step four: review your explanation and look for any remaining complexity or jargon." },
          { timestamp = 260; text = "Replace complex phrases with analogies drawn from everyday experience." },
          { timestamp = 300; text = "Repeat the cycle until your explanation is clear, simple, and complete — that is true mastery." },
        ];
        qa = [
          {
            id = "qa-sample3-1";
            question = "How is this different from just re-reading notes?";
            answer = "Re-reading creates an illusion of competence — material feels familiar so your brain thinks you know it. The Feynman Technique forces active recall and construction of an explanation from scratch, which immediately exposes what you cannot yet verbalize. Struggling to explain something is precisely the signal that tells you where to study harder.";
            timestamp = null;
            createdAt = now - 900_000_000_000;
          },
        ];
      };

      lectureStore.add(sample1Id, sample1);
      lectureStore.add(sample2Id, sample2);
      lectureStore.add(sample3Id, sample3);
    };
  };

  include LectureMixin(lectureStore);
};
