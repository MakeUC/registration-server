export class LoginDTO {
  email: string
  password: string
}

export class RegisterDTO {
  registrantId: string
  password: string
}

export class ResetDTO {
  email: string
}

export class ChangePasswordDTO {
  oldPassword: string
  newPassword: string
}

export class CurrentUserDTO {
  id: string
}