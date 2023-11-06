import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  async hash(text: string): Promise<string> {
    const hash = await bcrypt.hash(text, 10);
    return hash;
  }

  async compare(text: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(text, hash);
    return isMatch;
  }
}
