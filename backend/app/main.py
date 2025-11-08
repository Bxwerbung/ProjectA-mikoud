from fastapi import FastAPI
from app.routes import router

app = FastAPI(title="Beispiel FastAPI Backend")

# API-Routen registrieren
app.include_router(router)
