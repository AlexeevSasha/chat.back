import { AuthDto } from "./auth.dto";

export interface ILoginDto {
  email: string;
  password: string;
}

export class LoginDto extends AuthDto {
  validate(login: ILoginDto) {
    this.email(login.email);
    this.password(login.password);
  }
}
