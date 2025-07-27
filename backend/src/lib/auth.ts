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
  const PK = sub;
  const SK = "META";

  try {
    return await userRepository.get(PK, SK);
  } catch (err) {

    if (err instanceof UserNotFoundError) {
      return await userRepository.create(PK, SK);
    }

    throw new AppError("An error occurred while retrieving user details");
  }
}
