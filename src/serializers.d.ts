export declare function iString<Deserializer>(key?: string, data?: string): string;
export declare namespace iString {
    var serialize: typeof iString;
}
export declare function iNumber<Deserializer>(key?: string, data?: string | number): number | undefined;
export declare namespace iNumber {
    var serialize: typeof iNumber;
}
export declare function iDate<Deserializer>(key: string | undefined, data: string | number | Date): Date | undefined;
export declare namespace iDate {
    var serialize: (key: string | undefined, data: Date) => string | undefined;
}
