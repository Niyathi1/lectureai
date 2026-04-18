import Common "common";

module {
  public type LectureId = Common.LectureId;

  public type TranscriptSegment = {
    timestamp : Nat;
    text : Text;
  };

  public type Chapter = {
    title : Text;
    timestamp : Nat;
    summary : Text;
  };

  public type QA = {
    id : Text;
    question : Text;
    answer : Text;
    timestamp : ?Nat;
    createdAt : Int;
  };

  public type LectureRecord = {
    id : LectureId;
    url : Text;
    title : Text;
    thumbnailUrl : Text;
    transcript : [TranscriptSegment];
    summary : Text;
    takeaways : [Text];
    tableOfContents : [Chapter];
    qa : [QA];
    createdAt : Int;
  };

  public type AddLectureArgs = {
    url : Text;
    title : Text;
    thumbnailUrl : Text;
    transcript : [TranscriptSegment];
    summary : Text;
    takeaways : [Text];
    tableOfContents : [Chapter];
  };
};
