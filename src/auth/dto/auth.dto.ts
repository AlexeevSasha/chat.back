import { emailRegex, passwordLengthRegex, passwordUppercaseLetterRegex } from "../../helpers/regex";
import { BadRequestError } from "../../error/error";

export class AuthDto {
  protected email(email: string) {
    if (!email) throw new BadRequestError("Email required");
    if (!emailRegex.test(email)) throw new BadRequestError("Invalid email");
  }

  protected password(password: string) {
    if (!password) throw new BadRequestError("Password required");
    if (!passwordLengthRegex.test(password)) throw new BadRequestError("Password from 4 to 20 characters");
    if (!passwordUppercaseLetterRegex.test(password)) throw new BadRequestError("Password must contain one or more uppercase letters");
  }
}
