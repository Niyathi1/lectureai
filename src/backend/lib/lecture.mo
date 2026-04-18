import Map "mo:core/Map";
import Int "mo:core/Int";
import Types "../types/lecture";

module {
  public type LectureStore = Map.Map<Types.LectureId, Types.LectureRecord>;

  public func addLecture(
    store : LectureStore,
    args : Types.AddLectureArgs,
    id : Types.LectureId,
    createdAt : Int,
  ) : Types.LectureRecord {
    let record : Types.LectureRecord = {
      id;
      url = args.url;
      title = args.title;
      thumbnailUrl = args.thumbnailUrl;
      transcript = args.transcript;
      summary = args.summary;
      takeaways = args.takeaways;
      tableOfContents = args.tableOfContents;
      qa = [];
      createdAt;
    };
    store.add(id, record);
    record;
  };

  public func getLecture(
    store : LectureStore,
    id : Types.LectureId,
  ) : ?Types.LectureRecord {
    store.get(id);
  };

  public func getLectures(store : LectureStore) : [Types.LectureRecord] {
    let all = store.values().toArray();
    all.sort(func(a, b) = Int.compare(b.createdAt, a.createdAt));
  };

  public func deleteLecture(
    store : LectureStore,
    id : Types.LectureId,
  ) : Bool {
    switch (store.get(id)) {
      case null false;
      case (?_) {
        store.remove(id);
        true;
      };
    };
  };

  public func addQA(
    store : LectureStore,
    lectureId : Types.LectureId,
    qa : Types.QA,
  ) : ?Types.LectureRecord {
    switch (store.get(lectureId)) {
      case null null;
      case (?lecture) {
        let updated : Types.LectureRecord = {
          lecture with qa = lecture.qa.concat([qa])
        };
        store.add(lectureId, updated);
        ?updated;
      };
    };
  };
};
