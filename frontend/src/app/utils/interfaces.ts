import { Filetypes } from "./types";
export interface FileLister {
  name: string;
  type: Filetypes;
  size: number;
  modifiedDate: Date;
  updloadedBy: string;     
  file: File;
}
