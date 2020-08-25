import { User, Group, Language, Media, Template, Widget } from '../interfaces';

export function Mock(dbInit: {
  users?: User[];
  groups?: Group[];
  languages?: Language[];
  media?: Media[];
  templates?: Template[];
  widgets?: Widget[];
}) {}
