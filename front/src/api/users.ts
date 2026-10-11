import { request } from "./client";
import type { User } from "../types/user";

export function getUserByEmail() {
  return request<User>("/users/getUserByEmail");
}