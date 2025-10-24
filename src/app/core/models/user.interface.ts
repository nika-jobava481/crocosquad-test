export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    company: {
        name: string;
    };
}

export interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;
}

export interface Todo {
    id: number;
    userId: number;
    title: string;
    completed: boolean;
}

export interface Comment {
    id: number;
    postId: number;
    name: string;
    email: string;
    body: string;
}
