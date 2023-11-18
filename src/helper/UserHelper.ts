import { DbHelper } from "@helper/DbHelper";
import generateUniqueId from "generate-unique-id";
import { SessionInterface } from "@interface/SessionInterface";
import { UserInterface } from "@interface/UserInterface";

export class UserHelper {
  public static async addUserDatabase(user: UserInterface): Promise<void> {
    user.database = "db" + generateUniqueId({
      useNumbers: true,
      useLetters: true,
      length: 32
    });

    await DbHelper.rootDb().collection("user").updateOne(
      { _id: user._id },
      { $set: { database: user.database } },
    );
  }

  private static async addUserSession(user: UserInterface, session: SessionInterface): Promise<void> {
    user.sessions = user.sessions || [];
    user.sessions.push(session);

    await DbHelper.rootDb().collection("user").updateOne(
      { _id: user._id },
      { $set: { sessions: user.sessions } },
    );
  }

  private static async generateSession(): Promise<SessionInterface> {
    const now: number = Math.ceil(Date.now() / 1000);

    const accessTokenExpires: number = now + 3600;
    const refreshTokenExpires: number = now + 86400;

    const accessToken: string = generateUniqueId({
      useNumbers: true,
      useLetters: true,
      length: 32,
    });

    const refreshToken: string = generateUniqueId({
      useNumbers: true,
      useLetters: true,
      length: 32,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    };
  }

  public static async getToken(login: string, password: string): Promise<SessionInterface> {
    return new Promise(async (resolve, reject): Promise<SessionInterface | void> => {
      const user: UserInterface = await DbHelper.rootDb().collection("user").findOne({
        login,
        password,
      });

      if (!user) {
        return reject("Login or password are incorrect");
      }

      const session: SessionInterface = await this.generateSession();
      await this.addUserSession(user, session);

      resolve(session);
    });
  }

  public static async refreshToken(
    login: string,
    password: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<SessionInterface> {
    return new Promise(async (resolve, reject): Promise<SessionInterface | void> => {
      const user: UserInterface = await DbHelper.rootDb().collection("user").findOne({
        login,
        password,
        "sessions.accessToken": accessToken,
        "sessions.refreshToken": refreshToken,
      });

      if (!user) {
        return reject("User not found");
      }

      if (!user.sessions) {
        return reject("User session is invalid");
      }

      const now: number = Math.ceil(Date.now() / 1000);

      const requestedSession: SessionInterface = user.sessions.find((session: SessionInterface) => {
        return session.accessToken === accessToken && session.refreshToken === refreshToken;
      });

      if (!requestedSession) {
        return reject("Refresh or access tokens is invalid");
      }

      if (requestedSession.refreshTokenExpires < now) {
        return reject("Refresh token is expired");
      }

      const sessions: Array<SessionInterface> = user.sessions.filter((session: SessionInterface) => {
        return session.accessToken !== accessToken && session.refreshToken !== refreshToken;
      });

      const newSession: SessionInterface = await this.generateSession();
      sessions.push(newSession);
      user.sessions = sessions;

      await this.addUserSession(user, newSession);

      resolve(newSession);
    });
  }

  public static async isValidAccessToken(accessToken: string): Promise<void> {
    return new Promise(async (resolve, reject): Promise<void> => {
      this.getUserByAccessToken(accessToken)
        .then((user: UserInterface) => {
          const now: number = Math.ceil(Date.now() / 1000);
          const requestedSession: SessionInterface = user.sessions.find((session: SessionInterface) => {
            return session.accessToken === accessToken && session.accessTokenExpires > now;
          });

          if (!requestedSession) {
            return reject("Access token is expired");
          }

          resolve();
        });
    });
  }

  public static async getUserByAccessToken(accessToken: string): Promise<UserInterface> {
    return new Promise((resolve, reject) => {
      DbHelper.rootDb().collection("user")
        .findOne({ "sessions.accessToken": accessToken })
        .then((user: UserInterface) => {
          if (!user) {
            return reject("Invalid access token");
          }
          resolve(user);
        });
    });
  }
}
