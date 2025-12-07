export interface Article {
    id: number;
    tag: string;
    title: string;
    author: string;
    date: string;
    readTime: string;
    content: string;
    img: string;
    isGated?: boolean;
}
