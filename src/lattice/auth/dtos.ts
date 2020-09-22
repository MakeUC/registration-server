export class LoginDTO {
  email: string
  password: string
}

export class RegisterDTO {
  registrantId: string
  password: string
}

export class ResetRequestDTO {
  email: string
}

export class ResetTokenDTO {
  id: string
  currentPassword: string
  createdAt: Date
}

export class ResetPasswordDTO {
  resetToken: string
  password: string
}

export class ChangePasswordDTO {
  oldPassword: string
  newPassword: string
}

export class CurrentUserDTO {
  id: string
}