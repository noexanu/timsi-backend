import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import argon2 from 'argon2';
import { nanoid } from 'nanoid';

@Entity()
export default class User {
  @PrimaryColumn('text', { nullable: false })
    id!: string;

  @Column('text', { nullable: false })
    email: string;

  @Column('text', { nullable: true })
    password!: string | null;

  @BeforeInsert()
  async generateId() {
    this.id = nanoid();
  }

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await argon2.hash(this.password, {
        type: argon2.argon2id,
      });
    }
  }

  constructor(
    email: string,
    password: string | null = null,
  ) {
    this.email = email;
    this.password = password;
  }
}
