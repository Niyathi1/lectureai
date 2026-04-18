import Time "mo:core/Time";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Types "../types/lecture";
import LectureLib "../lib/lecture";

mixin (lectureStore : LectureLib.LectureStore) {

  // Transform callback required by IC HTTP outcalls
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Generate a simple unique ID from timestamp + size
  private func generateId() : Text {
    let t = Time.now();
    let size = lectureStore.size();
    t.toText() # "-" # size.toInt().toText();
  };

  // Extract YouTube video ID from URL
  private func extractVideoId(url : Text) : Text {
    let parts = url.split(#text "v=").toArray();
    if (parts.size() < 2) return "unknown";
    let afterV = parts[1];
    let idParts = afterV.split(#text "&").toArray();
    idParts[0];
  };

  public shared func processLecture(url : Text) : async { #ok : Types.LectureRecord; #err : Text } {
    let videoId = extractVideoId(url);

    let mockTitle = "Introduction to Machine Learning — Lecture " # videoId;
    let mockThumbnail = "https://img.youtube.com/vi/" # videoId # "/maxresdefault.jpg";

    let mockTranscript : [Types.TranscriptSegment] = [
      { timestamp = 0; text = "Welcome to this lecture on machine learning fundamentals." },
      { timestamp = 30; text = "Today we will cover supervised learning, starting with linear regression." },
      { timestamp = 90; text = "Linear regression finds the best-fit line through data points by minimizing the sum of squared errors." },
      { timestamp = 180; text = "The cost function J(theta) measures how well our hypothesis fits the training data." },
      { timestamp = 270; text = "Gradient descent iteratively updates parameters to minimize the cost function." },
      { timestamp = 360; text = "Learning rate alpha controls how large each update step is — too large diverges, too small is slow." },
      { timestamp = 450; text = "Feature scaling and normalization help gradient descent converge faster." },
      { timestamp = 540; text = "Next we look at logistic regression for classification problems." },
      { timestamp = 630; text = "The sigmoid function maps any real number to a value between 0 and 1, giving us a probability." },
      { timestamp = 720; text = "In summary, linear and logistic regression are foundational building blocks of machine learning." },
    ];

    let mockTakeaways : [Text] = [
      "Linear regression minimizes sum of squared errors to find the best-fit line",
      "Gradient descent is an iterative optimization algorithm used to minimize cost functions",
      "Learning rate must be chosen carefully — too high causes divergence, too low is inefficient",
      "Feature normalization accelerates gradient descent convergence",
      "Logistic regression extends linear regression to classification using the sigmoid function",
    ];

    let mockChapters : [Types.Chapter] = [
      { title = "Introduction"; timestamp = 0; summary = "Overview of the lecture topics: supervised learning and regression methods." },
      { title = "Linear Regression"; timestamp = 30; summary = "Explanation of linear regression, cost function, and parameter fitting." },
      { title = "Gradient Descent"; timestamp = 270; summary = "Iterative optimization algorithm for minimizing cost functions with learning rate discussion." },
      { title = "Feature Scaling"; timestamp = 450; summary = "Techniques to normalize features for faster convergence." },
      { title = "Logistic Regression"; timestamp = 540; summary = "Classification using logistic regression and the sigmoid function." },
    ];

    let mockSummary = "This lecture provides a comprehensive introduction to supervised machine learning. It covers linear regression as a model for predicting continuous values, explains the cost function and gradient descent optimization algorithm, discusses practical considerations like learning rate and feature scaling, and introduces logistic regression for binary classification problems using the sigmoid activation function.";

    let id = generateId();
    let now = Time.now();

    let args : Types.AddLectureArgs = {
      url;
      title = mockTitle;
      thumbnailUrl = mockThumbnail;
      transcript = mockTranscript;
      summary = mockSummary;
      takeaways = mockTakeaways;
      tableOfContents = mockChapters;
    };

    let record = LectureLib.addLecture(lectureStore, args, id, now);
    #ok(record);
  };

  public query func getLecture(id : Types.LectureId) : async ?Types.LectureRecord {
    LectureLib.getLecture(lectureStore, id);
  };

  public query func getLectures() : async [Types.LectureRecord] {
    LectureLib.getLectures(lectureStore);
  };

  public shared func deleteLecture(id : Types.LectureId) : async Bool {
    LectureLib.deleteLecture(lectureStore, id);
  };

  public shared func askQuestion(
    lectureId : Types.LectureId,
    question : Text,
    timestamp : ?Nat,
  ) : async { #ok : Text; #err : Text } {
    switch (LectureLib.getLecture(lectureStore, lectureId)) {
      case null #err("Lecture not found");
      case (?lecture) {
        let answer = generateAnswer(question, lecture, timestamp);

        let qaId = Time.now().toText() # "-qa";
        let qa : Types.QA = {
          id = qaId;
          question;
          answer;
          timestamp;
          createdAt = Time.now();
        };

        switch (LectureLib.addQA(lectureStore, lectureId, qa)) {
          case null #err("Failed to save Q&A");
          case (?_) #ok(answer);
        };
      };
    };
  };

  // Keep addQuestion as alias for backwards compat with original mixin contract
  public shared func addQuestion(
    lectureId : Types.LectureId,
    question : Text,
    timestamp : ?Nat,
  ) : async Text {
    switch (LectureLib.getLecture(lectureStore, lectureId)) {
      case null Runtime.trap("Lecture not found");
      case (?lecture) {
        let answer = generateAnswer(question, lecture, timestamp);
        let qaId = Time.now().toText() # "-qa";
        let qa : Types.QA = {
          id = qaId;
          question;
          answer;
          timestamp;
          createdAt = Time.now();
        };
        ignore LectureLib.addQA(lectureStore, lectureId, qa);
        answer;
      };
    };
  };

  public query func downloadNotes(lectureId : Types.LectureId) : async ?Text {
    switch (LectureLib.getLecture(lectureStore, lectureId)) {
      case null null;
      case (?lecture) {
        var notes = "# " # lecture.title # "\n\n";
        notes #= "Source: " # lecture.url # "\n\n";

        notes #= "## Summary\n\n";
        notes #= lecture.summary # "\n\n";

        notes #= "## Key Takeaways\n\n";
        for (takeaway in lecture.takeaways.values()) {
          notes #= "- " # takeaway # "\n";
        };
        notes #= "\n";

        notes #= "## Table of Contents\n\n";
        for (chapter in lecture.tableOfContents.values()) {
          let mins = chapter.timestamp / 60;
          let secs = chapter.timestamp % 60;
          let timeStr = mins.toInt().toText() # ":" # (if (secs < 10) "0" else "") # secs.toInt().toText();
          notes #= "- [" # timeStr # "] " # chapter.title # " — " # chapter.summary # "\n";
        };
        notes #= "\n";

        notes #= "## Transcript\n\n";
        for (segment in lecture.transcript.values()) {
          let mins = segment.timestamp / 60;
          let secs = segment.timestamp % 60;
          let timeStr = mins.toInt().toText() # ":" # (if (secs < 10) "0" else "") # secs.toInt().toText();
          notes #= "[" # timeStr # "] " # segment.text # "\n";
        };
        notes #= "\n";

        if (lecture.qa.size() > 0) {
          notes #= "## Questions & Answers\n\n";
          for (qa in lecture.qa.values()) {
            notes #= "**Q: " # qa.question # "**\n";
            notes #= "A: " # qa.answer # "\n\n";
          };
        };

        ?notes;
      };
    };
  };

  // Helper: generate a contextual answer for a question about a lecture
  private func generateAnswer(question : Text, lecture : Types.LectureRecord, timestamp : ?Nat) : Text {
    let qLower = question.toLower();

    let contextHint = switch (timestamp) {
      case null "";
      case (?ts) {
        switch (
          lecture.transcript.find(func(s : Types.TranscriptSegment) : Bool {
            s.timestamp <= ts and ts <= s.timestamp + 60
          })
        ) {
          case null "";
          case (?seg) " At that moment in the lecture: \"" # seg.text # "\"";
        };
      };
    };

    if (qLower.contains(#text "gradient") or qLower.contains(#text "descent")) {
      "Gradient descent is an iterative optimization algorithm that updates model parameters in the direction of steepest descent of the cost function. Each update step is scaled by the learning rate alpha." # contextHint;
    } else if (qLower.contains(#text "learning rate") or qLower.contains(#text "alpha")) {
      "The learning rate (alpha) controls the step size during gradient descent. A value too large causes the algorithm to overshoot and diverge; too small makes convergence very slow. Typical values range from 0.001 to 0.1." # contextHint;
    } else if (qLower.contains(#text "cost") or qLower.contains(#text "loss")) {
      "The cost function J(theta) measures the average error between predictions and actual values. For linear regression this is the mean squared error. Minimizing J(theta) gives us the best model parameters." # contextHint;
    } else if (qLower.contains(#text "sigmoid") or qLower.contains(#text "logistic")) {
      "The sigmoid function sigma(z) = 1 / (1 + e^(-z)) maps any real value to the range (0, 1), making it ideal for representing probabilities. Logistic regression uses it to predict the probability of a class." # contextHint;
    } else if (qLower.contains(#text "feature") or qLower.contains(#text "normali") or qLower.contains(#text "scal")) {
      "Feature scaling (normalization) transforms features to a similar range, typically [0, 1] or zero mean / unit variance. This prevents features with large magnitudes from dominating gradient descent and speeds convergence." # contextHint;
    } else if (qLower.contains(#text "linear regression")) {
      "Linear regression models the relationship between input features and a continuous output as a linear function y = theta_0 + theta_1 * x_1 + ... It is trained by minimizing the mean squared error cost function." # contextHint;
    } else {
      "Based on the lecture \"" # lecture.title # "\": " # lecture.summary # contextHint;
    };
  };

};
