type ListResponse = {
    id: number
    name: string
}
export type ListOverview = {
    name: string
    id: number
    totalItems: number
    completedItems: number
    uncompletedItems: number
}

export type ListEntry = {
    id: number
    name: string
    listId?: number
    completed: boolean
}

export type List = {
    name: string
    id: number
    items: ListEntry[]
}

async function api<T>(
    url: string,
    method: "GET" | "POST" | "DELETE"
): Promise<T> {
    const response = await fetch(url, {
        method,
    })
    const result = await response.json()
    return result as T
}

export const endpoints = {
    getList: async (listId: number): Promise<List> => {
        return api<List>(`/api/lists/${listId}`, "GET")
    },
    createList: async (listName: string): Promise<ListResponse> => {
        return api<ListResponse>(`/api/lists/${listName}`, "POST")
    },
    deleteList: async (listId: number): Promise<ListResponse> => {
        return api<ListResponse>(`/api/lists/${listId}`, "DELETE")
    },
    getAllLists: async (): Promise<ListOverview[]> => {
        return api<ListOverview[]>(`/api/lists`, "GET")
    },
    createItem: async (listId: number, itemName: string): Promise<ListEntry> => {
        return api<ListEntry>(`/api/item/${listId}/${itemName}`, "POST")
    },
    deleteItem: async (itemId: number): Promise<ListEntry> => {
        return api<ListEntry>(`/api/item/${itemId}`, "DELETE")
    },
}
