import { ChangeDetectorRef, Component, OnInit,ViewChild,NgZone   } from '@angular/core';
import { FileLister } from '../../utils/interfaces';
import {Filetypes,FILETYPE_ICONS} from '../../utils/types';
import { CommonModule, provideCloudinaryLoader } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { MatAnchor } from "@angular/material/button";
import { WebsocketService } from '../../utils/websocket.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Logger } from '../../utils/logger';
import { R } from '@angular/cdk/keycodes';
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
  private baseUrl: string = 'http://192.168.0.93:8000'


  constructor
  (
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private ws: WebsocketService
  ) 
  {
    this.ws.onMessage((items) => {
      this.testFiles = items;
      this.cdr.detectChanges();
    });
  }




public fileTypeIcons = FILETYPE_ICONS; 
public filetypes: Filetypes[] = Object.keys(FILETYPE_ICONS) as Filetypes[];
public testFiles: FileLister[] = [];



currentUser: string = "test user";

  getData()
  {
    this.http.get<FileLister[]>(`${this.baseUrl}/items`)
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
  ngOnInit() 
  {
    this.getData();
    document.body.classList.add("fade-in");
    setTimeout(() => document.body.classList.remove("fade-in"), 500);

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

  this.http.post('http://192.168.0.93:8000/items', formData).subscribe({
    next: (response) => {
      Logger("info", 'Antwort vom Backend:', response);
      this.getData();

    },
    error: (err) => {
      Logger("error", 'Fehler beim Senden der Daten:',formData, err);
    }
  });
}

downloadQueue(ids: number[]) {
  if (!ids || ids.length === 0) return;

  const queue = [...ids];
  
  // ANNAHME: Du hast in deiner Klasse (Komponente oder Service) eine Eigenschaft 
  // namens 'localItems', die die Metadaten enthält.
  
  // Definiere die Hilfsfunktion, die auf die Instanzdaten zugreift (daher 'this' benötigt)
  const getItemFilenameById = (id: number): string => {
      // 1. Suche das Item-Objekt im lokalen Array
      const item = this.testFiles.find(item => item.id === id);
      
      // 2. Gib den Namen zurück, oder einen Fallback, falls nicht gefunden
      // Verwende Optional Chaining (?.) für Sicherheit
      return item?.name || `download_${id}.dat`; 
  };


  const next = () => {
    if (queue.length === 0) {
      console.log('Alle Downloads abgeschlossen.');
      return;
    }

    const id = queue.shift()!;
    const url = `http://192.168.0.93:8000/items/${id}/download`;
    const id3 = 32    
    // 🎯 Hier wird die korrekte Funktion aufgerufen
    const filename = getItemFilenameById(id); 

    this.http.get<Blob>(url, {
      responseType: "blob" as 'json',
      observe: "response" 
    }).subscribe({
      // ... (Rest der subscribe-Logik) ...
      next: (response) => {
        // ... (Blob-Erstellung und Klick-Logik) ...
        const blob = response.body; 
        
        if (blob) {
            const urlBlob = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = urlBlob;
            
            // 🎯 Der Name ist nun garantiert der Originalname
            link.download = filename; 
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(urlBlob);
        } else {
            console.error(`Download fehlgeschlagen: Kein Body für ID ${id}`);
        }

        next();
      },
      error: (err) => {
        console.error(`Download Fehler für ID ${id}:`, err);
        next();
      }
    });
  };

  next();
  this.getData();
  this.cdr.detectChanges();
}
wantDelete = false;
private deleteTimeout: any = null;

deleteQueue(ids: number[]) {
  if (!ids || ids.length === 0) return;
  if (!this.wantDelete) {
    this.wantDelete = true;

    // Timer setzen
    this.deleteTimeout = setTimeout(() => {
      this.wantDelete = false;
      this.deleteTimeout = null;
    }, 3000);

    return;
  }

  // Zweiter Klick: löschen
  if (this.deleteTimeout) {
    clearTimeout(this.deleteTimeout);
    this.deleteTimeout = null;
  }

  this.wantDelete = false;


  const queue = [...ids];

  const next = () => {
    if (queue.length === 0) {
      console.log('Alle Downloads abgeschlossen.');
      this.getData();
      return;
    }

    const id = queue.shift()!;
    const url = `http://192.168.0.93:8000/items/${id}`;
    


    this.http.delete(url, {
      responseType: "blob" as 'json',
      observe: "response" 
    }).subscribe({

      next: (response) => {        
        Logger("info", `Datei mit ID ${id} gelöscht.`);
        next();
      },
      error: (err) => {
        console.error(`Download Fehler für ID ${id}:`, err);
        next();
      }
    });
  };

  next();

}

@ViewChild('Files') Files: any;

get selectedIds(): any[] {
  if (!this.Files) return [];
  return this.Files.selectedOptions.selected.map((o: any) => o.value);
}

}
