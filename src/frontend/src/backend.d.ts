import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface Script {
    id: string;
    title: string;
    content: string;
    createdAt: bigint;
    description: string;
    author: Principal;
    updatedAt: bigint;
    category: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createScript(title: string, description: string, category: string, content: string): Promise<string>;
    deleteScript(id: string): Promise<void>;
    filterScriptsByCategory(category: string): Promise<Array<Script>>;
    getAllScripts(): Promise<Array<Script>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDeletedScripts(): Promise<Array<Script>>;
    getScript(id: string): Promise<Script>;
    getScriptsByAuthor(author: Principal): Promise<Array<Script>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    permanentlyDeleteScript(id: string): Promise<void>;
    restoreScript(id: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchScriptsByTitle(title: string): Promise<Array<Script>>;
    updateScript(id: string, title: string, description: string, category: string, content: string): Promise<void>;
}
