export type ListResponse = {
    id: number;
    name: string;
};

export type ListOverview = {
    name: string;
    id: number;
    order: number;
    totalItems: number;
    completedItems: number;
    uncompletedItems: number;
};

export type ListEntry = {
    id: number;
    name: string;
    listId?: number;
    description?: string | null;
    completed: boolean;
    order: number;
};

export type List = {
    name: string;
    id: number;
    items: ListEntry[];
};
