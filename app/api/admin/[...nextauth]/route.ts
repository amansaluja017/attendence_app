import NextAuth from "next-auth";
import { adminAuthOptions } from "@/utils/admin.auth";

const handler = NextAuth(adminAuthOptions);

export {handler as GET, handler as POST};