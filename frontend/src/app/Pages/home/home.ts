import { Component,OnInit } from '@angular/core';
import { FileLister } from '../../utils/interfaces';
import {Filetypes,FILETYPE_ICONS} from '../../utils/types';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { MatAnchor } from "@angular/material/button";


@Component({
  selector: 'app-home',
  imports: [
    CommonModule, MatCardModule, MatDividerModule,
    MatListModule, MatIconModule,
    MatAnchor
],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
public fileTypeIcons = FILETYPE_ICONS; 
public filetypes: Filetypes[] = Object.keys(FILETYPE_ICONS) as Filetypes[];
public testFiles: FileLister[] = [
  {
    name: "report.pdf",
    type: "pdf",
    size: 245_000,                         
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
  },
  {
    name: "image.pdf",
    type: "pdf",
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
