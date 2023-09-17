import { ListResponse, ListOverview, List, ListEntry } from "@/types/list";

async function api<T>(url: string, method: "GET" | "POST" | "DELETE" | "PUT", body?: any): Promise<T> {
    const response = await fetch(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
    });
    const result = await response.json();
    return result as T;
}

export const endpoints = {
    getList: async (listId: number): Promise<List> => {
        return api<List>(`/api/lists/${listId}`, "GET");
    },
    createList: async (listName: string): Promise<ListResponse> => {
        return api<ListResponse>(`/api/lists/${listName}`, "POST");
    },
    deleteList: async (listId: number): Promise<ListResponse> => {
        return api<ListResponse>(`/api/lists/${listId}`, "DELETE");
    },
    getAllLists: async (): Promise<ListOverview[]> => {
        return api<ListOverview[]>(`/api/lists`, "GET");
    },
    reorderLists: async (firstList: ListOverview, secondList: ListOverview): Promise<ListOverview[]> => {
        return api<ListOverview[]>(`/api/lists/`, "POST", [firstList, secondList]);
    },
    createItem: async (listId: number, item: Partial<ListEntry>): Promise<ListEntry> => {
        return api<ListEntry>(`/api/item/${listId}`, "POST", item);
    },
    deleteItem: async (itemId: number): Promise<ListEntry> => {
        return api<ListEntry>(`/api/item/${itemId}`, "DELETE");
    },
    updateItem: async (item: ListEntry): Promise<ListEntry> => {
        return api<ListEntry>(`/api/item`, "PUT", item);
    },
    completeItem: async (itemId: number, item: ListEntry): Promise<ListEntry> => {
        return api<ListEntry>(`/api/item/${itemId}`, "PUT", item);
    },
    reorderItems: async (firstItem: ListEntry, secondItem: ListEntry): Promise<ListEntry[]> => {
        return api<ListEntry[]>(`/api/item`, "POST", [firstItem, secondItem]);
    },
};
