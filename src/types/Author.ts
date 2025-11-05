export interface Author {
  id: number
  userId: number
  name: string
  surname: string
  created_at: Date
  updated_at: Date
}

export interface AuthorInput {
  userId: number
  name: string
  surname: string
}

export interface AuthorUpdateInput {
  name?: string
  surname?: string
}
