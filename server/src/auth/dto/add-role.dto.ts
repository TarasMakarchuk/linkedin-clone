import { Role } from '../entity/role.enum';

export class AddRoleDto {
    readonly value: Role;
    readonly userId: string;
}