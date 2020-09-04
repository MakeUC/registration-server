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

export class CurrentUserDTO {
  id: string
}