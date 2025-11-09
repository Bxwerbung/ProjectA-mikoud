import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FileLister } from '../../utils/interfaces';
import {Filetypes,FILETYPE_ICONS} from '../../utils/types';
import { CommonModule, provideCloudinaryLoader } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { MatAnchor } from "@angular/material/button";

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Logger } from '../../utils/logger';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatDividerModule,
    MatListModule, MatIconModule,MatAnchor,HttpClientModule
    
    
],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  constructor
  (
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  )
  {}
public fileTypeIcons = FILETYPE_ICONS; 
public filetypes: Filetypes[] = Object.keys(FILETYPE_ICONS) as Filetypes[];
public testFiles: FileLister[] = [];

currentUser: string = "test user";


  ngOnInit() 
  {
    document.body.classList.add("fade-in");
    setTimeout(() => document.body.classList.remove("fade-in"), 500);
            this.http.get<FileLister[]>('http://127.0.0.1:8000/items')
      .subscribe({
        next: (data) => {
          this.testFiles = [...data];
          Logger("info",'Daten vom Backend:', data);

          Logger("info",'Daten vom in testFiles:', this.testFiles);
          this.cdr.detectChanges(); 
        },
        error: (err) => {
          Logger("error",'Fehler beim Laden der Dateien:', err);
        }
      });
  }

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;
const files = Array.from(input.files);
const formData = new FormData();

  // 1. Die binären Daten anhängen
  // Schlüsselname: 'files'
  files.forEach(file => {
    // Wenn der Schlüsselname bei jedem Aufruf derselbe ist ('files'),
    // fasst der Browser diese automatisch zu einem Array zusammen.
    formData.append('files', file, file.name); 
  });

  // 2. Die Metadaten erstellen (OHNE die eigentliche File-Instanz)
  const metaForBackend = files.map(file => ({
    name: file.name,
    type: file.type,
    size: file.size,
    modifiedDate: file.lastModified ? new Date(file.lastModified).toISOString() : new Date().toISOString(),
    uploadedBy: "currentUser"
    // Fügen Sie hier alle spezifischen Daten hinzu, die Sie pro Datei brauchen
  }));

  // 3. Die Metadaten als JSON-String anhängen
  // Schlüsselname: 'meta'
  formData.append('meta', JSON.stringify(metaForBackend));

  // 4. Zusätzliche Daten
  formData.append("code", "200");

  this.http.post('http://127.0.0.1:8000/items', formData).subscribe({
    next: (response) => {
      Logger("info", 'Antwort vom Backend:', response);
    },
    error: (err) => {
      Logger("error", 'Fehler beim Senden der Daten:',formData, err);
    }
  });
}




}
