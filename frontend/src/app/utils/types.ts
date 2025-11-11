export type Filetypes =
  | "application/pdf"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "image/png"
  | "image/jpeg"
  | "text/plain"
  | "video/mp4"
  | "audio/mpeg"
  | "application/zip"
  | "application/vnd.rar"
  | "application/x-msdownload"
  | "other";

export const FILETYPE_ICONS: Record<Filetypes, string> = {
  "application/pdf": "picture_as_pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "description",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "grid_on",
  "image/png": "image",
  "image/jpeg": "image",
  "text/plain": "article",
  "video/mp4": "videocam",
  "audio/mpeg": "audiotrack",
  "application/zip": "folder_zip",
  "application/vnd.rar": "folder_zip",
  "application/x-msdownload": "terminal",
  other: "insert_drive_file",
};
