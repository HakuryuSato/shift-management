import { User as NextAuthUser } from "next-auth";
import { User as CustomUserType } from "@/types/User";

// NextAuthUserに自前のUser型を結合
export interface CustomNextAuthUser extends NextAuthUser, CustomUserType { 
    role?: "user" | "admin";
}




