import { env } from "@env";

export class CryptHelper {
  static async encrypt(value: any) {
    return new Promise((resolve) => {
      const signature = env.secure.signature;
      let plaintext = JSON.stringify(value);
      let cypherText = [];
      let salt = Math.random().toString().slice(2);

      plaintext = Array.from(plaintext).map((c: string) => {
        if (c.charCodeAt(0) < 128) {
          return c.charCodeAt(0).toString(16).padStart(2, "0");
        }
        return encodeURIComponent(c).replace(/\%/g, "").toLowerCase();
      }).join("");

      // Convert each hex to decimal
      const plaintextMatch = plaintext.match(/.{1,2}/g).map(x => parseInt(x, 16));

      // Perform xor operation
      for (let i = 0; i < plaintextMatch.length; i++) {
        cypherText.push(
          plaintextMatch[i]
          ^ signature.charCodeAt(Math.floor(i % signature.length))
          ^ salt.charCodeAt(Math.floor(i % salt.length)),
        );
      }

      // Convert to hex
      cypherText = cypherText.map((x: any) => {
        return x.toString(16).padStart(2, "0");
      });

      resolve([ cypherText.join(""), salt ]);
    });
  }

  static async decrypt(data: any) {
    return new Promise((resolve, reject) => {
      try {
        const signature = env.secure.signature;
        let [ cypherText, salt ] = data;

        cypherText = cypherText.match(/.{1,2}/g).map((x: any) => parseInt(x, 16));
        let plaintext = [];

        for (let i = 0; i < cypherText.length; i++) {
          plaintext.push((
            cypherText[i]
            ^ signature.charCodeAt(Math.floor(i % signature.length))
            ^ salt.charCodeAt(Math.floor(i % salt.length))
          ).toString(16).padStart(2, "0"));
        }
        resolve(JSON.parse(decodeURIComponent("%" + plaintext.join("").match(/.{1,2}/g).join("%"))));
      } catch (e) {
        reject(e);
      }
    });
  }
}
