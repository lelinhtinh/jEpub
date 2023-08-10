declare module jepub {
  export default class jEpub {
    init(parameters: any): void;
    date(date: Date): void;
    uuid(id: string | number): void;
    cover(data: Blob | ArrayBuffer): void;
    image(data: Blob | ArrayBuffer, IMG_ID: string): void;
    notes(content: string): void;
    add(title: string, content: string | Array<string>, index?: number): void;
    generate(type?: string, onUpdate?: (metadata: any) => void): Promise<Blob>;
    static html2text(html: string, noBr: boolean): Promise<Blob>;
  }
}
