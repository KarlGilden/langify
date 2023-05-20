import { createContext } from "react";

interface AuthContext {
    accessToken:string;
    setAccessToken: (accessToken: string) => void;
}

export const AuthContext = createContext<AuthContext>({
    accessToken: "",
    setAccessToken: () => {}
});