import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util'; //to promosify the scrypt function

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string): Promise<string> {
    // Generate a random salt
    const salt = randomBytes(8).toString('hex');

    // hash the password with the salt using scrypt
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    // return hashed password and salt
    return `${buf.toString('hex')}.${salt}`; // Return the hashed password and salt
  }

  static async compare(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    // get the hashed and salt from the stored password
    const [hashedPassword, salt] = storedPassword.split('.');

    // hash the supplied password with the same salt
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer; // Hash the password with the salt

    // compare the hashed password with the stored hash
    return buf.toString('hex') === hashedPassword; // Compare the hashed password with the stored hash
  }
}
