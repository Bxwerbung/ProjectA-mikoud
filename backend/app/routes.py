from fastapi import APIRouter, UploadFile, File, Form, HTTPException # <-- HIER FEHLT HTTPException!
from datetime import datetime
from typing import List, Dict
from pydantic import BaseModel
import sqlite3
import json
import os
import shutil

import time
router = APIRouter()
DATABASE_URL = "Main.db"  # Pfad zu deiner SQLite-Datei
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

items: List[Dict] = [
    {
        "id": 1,
        "name": "report.pdf",
        "type": "pdf",
        "size": 245_000,
        "modified_date": datetime(2025, 1, 10).isoformat(),
        "uploaded_by": "admin",

    },
    {
        "id": 2,
        "name": "report.pdf",
        "type": "pdf",
        "size": 245_000,
        "modified_date": datetime(2025, 1, 10).isoformat(),
        "uploaded_by": "admin",

    },
    {
        "id": 3,
        "name": "image.png",
        "type": "png",
        "size": 820_000,
        "modified_date": datetime(2025, 3, 2).isoformat(),
        "uploaded_by": "testUser",

    },
    {
        "id": 4,
        "name": "image.pdf",
        "type": "pdf",
        "size": 820_000,
        "modified_date": datetime(2025, 3, 2).isoformat(),
        "uploaded_by": "testUser",

    },
    {
        "id": 5,
        "name": "image.png",
        "type": "png",
        "size": 820_000,
        "modified_date": datetime(2025, 3, 2).isoformat(),
        "uploaded_by": "testUser",

    },    {
        "id": 6,
        "name": "image.png",
        "type": "png",
        "size": 820_000,
        "modified_date": datetime(2025, 3, 2).isoformat(),
        "uploaded_by": "testUser",

    },


]


def get_db():
    """Stellt eine SQLite-Verbindung her."""
    conn = sqlite3.connect(DATABASE_URL)
    conn.row_factory = sqlite3.Row  # Gibt Zeilen als Dictionaries zurück
    return conn

def init_db():
    """Erstellt die 'items' Tabelle, falls sie noch nicht existiert."""
    try:
        conn = sqlite3.connect(DATABASE_URL)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type TEXT,
                size INTEGER NOT NULL,
                modifiedDate TEXT NOT NULL,
                uploadedBy TEXT NOT NULL,
                server_path TEXT NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"ERROR: Fehler bei der Datenbank-Initialisierung: {e}")
init_db()
class MetaItem(BaseModel):
    name: str
    type: str
    size: int
    modifiedDate: datetime  
    uploadedBy: str


@router.get("/items")
async def get_items() -> List[Dict]:
    conn = get_db()
    cursor = conn.cursor()
    
    try:

        cursor.execute("SELECT * FROM items")

        rows = cursor.fetchall()

        items_list = [dict(row) for row in rows]
        
        return items_list
        
    except sqlite3.OperationalError as e:
        print(f"ERROR: Fehler beim Lesen der Items aus der DB: {e}")
        return []
        
    finally:
        conn.close()

@router.get("/items/{item_id}")
async def get_item(item_id: int):
    for item in items:
        if item["id"] == item_id:
            return item
    return {"error": "Item not found"}






@router.post("/items")
async def upload_item_and_save(
    code: int = Form(...),
    files: List[UploadFile] = File(...),
    meta: str = Form(...)
):
    try:
        meta_data = [MetaItem(**item) for item in json.loads(meta)]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Fehler bei der Validierung/Parsing der Metadaten: {e}")

    if len(files) != len(meta_data):
        raise HTTPException(status_code=400, detail="Anzahl der Dateien stimmt nicht mit der Anzahl der Metadaten überein.")

    conn = get_db()
    cursor = conn.cursor()
    file_info = []

    try:
        for i, (uploaded_file, meta_item) in enumerate(zip(files, meta_data)):

            timestamp = int(time.time() * 1000)
            unique_filename = f"{timestamp}_{i}_{os.path.basename(meta_item.name)}" 
            server_path = os.path.join(UPLOAD_DIR, unique_filename)

            try:
                with open(server_path, "wb") as buffer:
                    shutil.copyfileobj(uploaded_file.file, buffer) 

            finally:
                uploaded_file.file.close() 

            cursor.execute("""
                INSERT INTO items (name, type, size, modifiedDate, uploadedBy, server_path)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                meta_item.name,
                meta_item.type,
                meta_item.size,
                meta_item.modifiedDate.isoformat(), 
                meta_item.uploadedBy,
                server_path
            ))
            
            file_info.append({
                "original_name": meta_item.name,
                "server_path": server_path,
                "db_id": cursor.lastrowid
            })

        conn.commit()
        
    except Exception as e:

        conn.rollback()
        print(f"FATAL ERROR DURING UPLOAD/DB WRITE: {e}") 
        raise HTTPException(status_code=500, detail=f"Fehler beim Speichern oder Datenbank-Eintrag auf dem Server.")
        
    finally:
        conn.close()
    return {
        "status": "success",
        "message": f"Erfolgreich {len(files)} Dateien gespeichert und in DB eingetragen.",
        "received_code": code,
        "results": file_info
    }
@router.delete("/items/{item_id}")
async def delete_item(item_id: int):
    conn = get_db()
    cursor = conn.cursor()
    server_path = None
    
    try:
        cursor.execute("SELECT server_path FROM items WHERE id = ?", (item_id,))
        result = cursor.fetchone()
        
        if result is None:
            raise HTTPException(status_code=404, detail=f"Item mit ID {item_id} nicht gefunden.")
        
        server_path = result['server_path']

        cursor.execute("DELETE FROM items WHERE id = ?", (item_id,))        
        try:
            if os.path.exists(server_path):
                os.remove(server_path)
            else:
                print(f"WARNUNG: Physische Datei existiert nicht mehr unter {server_path}. Lösche DB-Eintrag trotzdem.")

        except OSError as e:
            print(f"FEHLER beim Löschen der Datei {server_path}: {e}")
            raise HTTPException(status_code=500, detail=f"Datenbank gelöscht, aber Fehler beim Löschen der Datei auf dem Server.")
        conn.commit()
        
        return {"status": "success", "message": f"Item mit ID {item_id} und zugehörige Datei erfolgreich gelöscht."}

    except HTTPException as http_exc:
        conn.rollback()
        raise http_exc
        
    except Exception as e:
        conn.rollback()
        print(f"FATAL ERROR DURING DELETE: {e}")
        raise HTTPException(status_code=500, detail="Ein interner Serverfehler ist aufgetreten. Transaktion rückgängig gemacht.")
        
    finally:
        conn.close()