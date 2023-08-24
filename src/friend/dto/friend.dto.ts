import { BadRequestError } from "../../error/error";
import { emailRegex } from "../../helpers/regex";

export class FriendDto {
  email(email: string) {
    if (!email) throw new BadRequestError("Email required");
    if (!emailRegex.test(email)) throw new BadRequestError("Invalid email");
  }

  checkId(id: string) {
    if (!id) throw new BadRequestError("ID invitation required");
  }
}
