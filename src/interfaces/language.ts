export interface Language {
  _id: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  code: string;
  name: string;
  nativeName: string;
  def: boolean;
}
