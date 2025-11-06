import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FileLister {
  name: string;
  type: string;
  size: number;
  modifiedDate: Date;
  updloadedBy: string;
  file: File;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
public testFiles: FileLister[] = [
  {
    name: "report.pdf",
    type: "pdf",
    size: 245_000,                         // in Bytes
    modifiedDate: new Date("2025-01-10"),
    updloadedBy: "admin",
    file: new File(["dummy"], "report.pdf", { type: "application/pdf" })
  },
  {
    name: "image.png",
    type: "png",
    size: 820_000,
    modifiedDate: new Date("2025-03-02"),
    updloadedBy: "testUser",
    file: new File(["dummy"], "image.png", { type: "image/png" })
  }
];



  ngOnInit() {
    document.body.classList.add("fade-in");
    setTimeout(() => document.body.classList.remove("fade-in"), 500);
  }
}
