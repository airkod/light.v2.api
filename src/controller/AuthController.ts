import { UserHelper } from "@helper/UserHelper";
import { SessionInterface } from "@interface/SessionInterface";

export class AuthController {
  static auth(body: { login: string, password: string }): Promise<SessionInterface> {
    return UserHelper.getToken(
      body.login,
      body.password,
    );
  }
}
