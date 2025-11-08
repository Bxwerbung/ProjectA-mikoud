export type Filetypes = "pdf" | "docx" | "xlsx" | "png" | "jpg" | "txt" | "mp4" | "mp3" | "zip" | "rar" ;
export const FILETYPE_ICONS: Record<Filetypes, string> = 
{
  pdf:  "picture_as_pdf",
  docx: "description",
  xlsx: "grid_on",
  png:  "image",
  jpg:  "image",
  txt:  "article",
  mp4:  "videocam",
  mp3:  "audiotrack",
  zip:  "folder_zip",
  rar:  "folder_zip"
};
