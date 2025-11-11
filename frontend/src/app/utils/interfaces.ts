import { Filetypes } from "./types";
export interface FileLister {
  id:number;
  name: string;
  type: Filetypes;
  size: number;
  modifiedDate: Date;
  updloadedBy: string;     
  files: File;
}
