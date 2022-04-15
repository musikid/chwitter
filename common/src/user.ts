export class UserResponse {
  id!: string;
  name!: string;
  mail?: string;
  displayName!: string;
  avatarLink!: string;
  isFriend!: boolean;
  description!: string;

  constructor({
    id,
    name,
    mail,
    displayName,
    avatarLink,
    isFriend,
    description,
  }: {
    id: string;
    name: string;
    mail: string;
    displayName: string;
    avatarLink: string;
    isFriend: boolean;
    description: string;
  }) {
    this.id = id;
    this.name = name;
    this.mail = mail;
    this.displayName = displayName;
    this.avatarLink = avatarLink;
    this.isFriend = isFriend;
    this.description = description;
  }
}

export class UpdateUserParams {
  name?: string;
  mail?: string;
  avatar?: File;
  password?: string;
  displayName?: string;
  description?: string;
}

export class UsersResponse {
  users: UserResponse[];

  constructor({ users }: { users: UserResponse[] }) {
    this.users = users;
  }
}