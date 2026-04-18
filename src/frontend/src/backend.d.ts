import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TranscriptSegment {
    text: string;
    timestamp: bigint;
}
export interface LectureRecord {
    id: LectureId;
    qa: Array<QA>;
    url: string;
    title: string;
    thumbnailUrl: string;
    takeaways: Array<string>;
    createdAt: bigint;
    summary: string;
    transcript: Array<TranscriptSegment>;
    tableOfContents: Array<Chapter>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface QA {
    id: string;
    question: string;
    createdAt: bigint;
    answer: string;
    timestamp?: bigint;
}
export type LectureId = string;
export interface Chapter {
    title: string;
    summary: string;
    timestamp: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface backendInterface {
    addQuestion(lectureId: LectureId, question: string, timestamp: bigint | null): Promise<string>;
    askQuestion(lectureId: LectureId, question: string, timestamp: bigint | null): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteLecture(id: LectureId): Promise<boolean>;
    downloadNotes(lectureId: LectureId): Promise<string | null>;
    getLecture(id: LectureId): Promise<LectureRecord | null>;
    getLectures(): Promise<Array<LectureRecord>>;
    processLecture(url: string): Promise<{
        __kind__: "ok";
        ok: LectureRecord;
    } | {
        __kind__: "err";
        err: string;
    }>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
