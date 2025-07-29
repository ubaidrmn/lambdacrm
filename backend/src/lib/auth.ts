import { AppError, UserNotFoundError } from "@/lib/errors";
import UserRepository from "@/repositories/user.repository";
import { User } from "@/types/user.model";

/**
 * Retrieves the authenticated user from the database.
 * If not found, creates a new user record. 
 * 
 * Each Cognito user must have a one-to-one mapping with 
 * User entity in the table at any given time.
 */
export async function getAuthenticatedUser(sub: string): Promise<User> {
  const userRepository = new UserRepository();

  try {
    return await userRepository.findUserBySub(sub);
  } catch (err) {

    if (err instanceof UserNotFoundError) {
      return await userRepository.createUser(sub);
    }

    throw new AppError("An error occurred while retrieving user details");
  }
}
