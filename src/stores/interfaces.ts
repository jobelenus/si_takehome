export interface User {
    name: string
}
export interface Message {
    user: User
    index: number
    message: string
}
// this represents a message that was sent, but not yet confirmed by the backend
// thats why it has no index
export interface PendingMessage {
    user: User
    message: string
}
export type SendMessage = (username: string, msg: string) => Promise<void>