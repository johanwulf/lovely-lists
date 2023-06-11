import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function parseParams(params: { [key: string]: string }): {
    [key: string]: number | string | boolean
} {
    const parsedParams: {
        [key: string]: number | string | boolean
    } = {}
    for (const key of Object.keys(params)) {
        const value = params[key]
        if (value === "true" || value === "false") {
            parsedParams[key] = value === "true"
        } else if (isNaN(Number(value))) {
            parsedParams[key] = value
        } else {
            parsedParams[key] = Number(value)
        }
    }
    return parsedParams
}
