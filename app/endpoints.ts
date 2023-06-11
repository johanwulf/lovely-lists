import { NextRequest } from "next/server"

type ListData = {
    id: number
}

// define the type of data you expect from the API
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
    listId: number
    completed: boolean
}

export type List = {
    name: string
    id: number
    totalItems: number
    completedItems: number
    uncompletedItems: number
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
    getList: async (listId: string): Promise<List> => {
        return api<List>(`/api/lists/${listId}`, "GET")
    },
    createList: async (listName: string): Promise<ListResponse> => {
        return api<ListResponse>(`/api/lists/${listName}`, "POST")
    },
    getAllLists: async (): Promise<ListOverview[]> => {
        return api<ListOverview[]>(`/api/lists`, "GET")
    },
    createItem: async (itemName: string, listId: string): Promise<ListEntry> => {
        return api<ListEntry>(`/api/item/${itemName}/${listId}`, "POST")
    },
}
