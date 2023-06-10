export type List = {
    name: string
    id: string
    totalItems: number
    completedItems: number
    items: ListItem[]
}

export type ListItem = {
    name: string
    id: number
    completed: boolean
}
