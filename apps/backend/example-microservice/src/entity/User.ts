import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    user_id: number

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    email: string

    @Column()
    phone: string

    @Column()
    role: string

}
