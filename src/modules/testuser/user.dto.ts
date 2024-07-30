export interface INewUser {
  email: string,
  name: string
  phone: string
  address: string
  date_of_birth: string
  emirate: string
  country: string
  city: string
  isAdmin: boolean
  can_add: boolean,
  can_edit: boolean
  password: string
}
export interface IEditUser {
  id: number,
  email: string,
  name: string
  phone: string
  address: string
  date_of_birth: string
  country: string
  emirate: string
  city: string
  can_add: boolean,
  can_edit: boolean
}
export interface IUserID {
  userId: number
}
export interface IEditPassword {
  password: string
}