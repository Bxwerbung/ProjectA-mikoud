-- Erstellung der Tabelle, um Dateien und zugehörige Metadaten zu speichern
CREATE TABLE items (
    -- Eindeutige ID für jeden Eintrag (Primärschlüssel)
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Metadaten-Spalten (von deinem Frontend-Payload)
    
    -- Dateiname (Originalname)
    name TEXT NOT NULL,
    
    -- Dateityp (MIME-Type, z.B. 'image/jpeg')
    type TEXT,
    
    -- Dateigröße in Bytes
    size INTEGER NOT NULL,
    
    -- Datum der letzten Modifikation (ISO 8601 String)
    modifiedDate TEXT NOT NULL,
    
    -- Benutzer, der die Datei hochgeladen hat
    uploadedBy TEXT NOT NULL,
    
    -- ----------------------------------------------------
    -- Dateireferenz-Spalte (Wichtig!)
    -- ----------------------------------------------------
    
    -- Speicherpfad: Pfad zur Datei auf dem Server-Dateisystem.
    -- Dies ist die standardmäßige Methode, um Dateien in DBs zu referenzieren.
    server_path TEXT NOT NULL UNIQUE,
    
    -- Optional: Datum, wann der Eintrag erstellt wurde
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Index auf den Dateinamen für schnelle Suchen
CREATE INDEX idx_item_name ON items (name);