import { AuthDto } from "./auth.dto";
import { BadRequestError } from "../../error/error";

export interface IRegisterDto {
  email: string;
  password: string;
  firstname: string;
}

export class RegisterDto extends AuthDto {
  validate(register: IRegisterDto) {
    this.email(register.email);
    this.password(register.password);
    this.firstname(register.firstname);
  }

  private firstname(name: string) {
    if (!name) throw new BadRequestError("Firstname required");
    if (typeof name !== "string") throw new BadRequestError("Firstname only string");
  }
}
