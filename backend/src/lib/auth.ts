import { AppError, UserNotFoundError } from "@/lib/errors";
import UserRepository from "@/repositories/user.repository";
import { User } from "@/types/user.model";
import {
  CognitoIdentityProviderClient,
  GetUserCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { jwtDecode } from "jwt-decode";

/**
 * Retrieves the authenticated user from the database.
 * If not found, creates a new user record. 
 * 
 * Each Cognito user must have a one-to-one mapping with 
 * User entity in the table at any given time.
 */
export async function getAuthenticatedUser(accessToken: string): Promise<User> {
  const payload = jwtDecode(accessToken);
  const sub = payload.sub
  if (!sub) { throw new Error("Invalid access token!"); }

  const userRepository = new UserRepository();

  try {
    // Try to get the user from DB.

    const user: User = await userRepository.findById(`USER_${sub}`);
    return user;

  } catch (err) {

    if (!(err instanceof UserNotFoundError)) { throw new AppError("An error occured when retreiving user details!"); };

    // If user doesn't exist in the DB, try getting info from cognito & store a record in the DB.

    const cognito = new CognitoIdentityProviderClient({ region: "us-east-2" });
    console.log("[COGNITO-IDP SDK COMMAND RUNING]")
    const command = new GetUserCommand({ AccessToken: accessToken });
  
    try {
      const response = await cognito.send(command);
      if (!response.UserAttributes) { throw new Error("User attributes not defined!"); }

      const attributes = Object.fromEntries(
        (response.UserAttributes || []).map(attr => [attr.Name, attr.Value])
      );

      const cognitoUser = {
        email: attributes.email,
        name: attributes.name,
        verified: Boolean(attributes.email_verified),
        picture: attributes?.picture,
        sub: attributes.sub
      }

      const user: User = await userRepository.create(cognitoUser);
      return user;

    } catch (err) {
      throw new AppError("Invalid or expired access token");
    }
  }
}
