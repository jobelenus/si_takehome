export interface User {
    name: string
}
export interface Message {
    user: User
    index: number
    message: string
}