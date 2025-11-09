from fastapi import FastAPI
from app.routes import router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Beispiel FastAPI Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# API-Routen registrieren
app.include_router(router)
