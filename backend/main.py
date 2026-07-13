from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import json
import os
from services.gemini import get_stadium_recommendation, get_chat_response, get_emergency_response

app = FastAPI(title="StadiumMind API")

# Setup CORS so the React frontend can call it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StadiumData(BaseModel):
    stats: Optional[Dict[str, Any]] = None
    heatmap: Optional[List[Dict[str, Any]]] = None
    hourlyTraffic: Optional[Dict[str, Any]] = None

@app.post("/recommendation")
async def get_recommendation(data: Optional[StadiumData] = None):
    stadium_data = None
    
    if data and data.stats:
        stadium_data = data.dict()
    else:
        json_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'stadium.json')
        try:
            with open(json_path, 'r') as f:
                stadium_data = json.load(f)
        except Exception as e:
            return {"error": f"Failed to read stadium.json: {str(e)}"}
            
    result = get_stadium_recommendation(stadium_data)
    return result

class ChatRequest(BaseModel):
    message: str
    stadiumData: Optional[StadiumData] = None

@app.post("/chat")
async def chat_with_ai(req: ChatRequest):
    stadium_data = None
    
    if req.stadiumData and req.stadiumData.stats:
        stadium_data = req.stadiumData.dict()
    else:
        json_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'stadium.json')
        try:
            with open(json_path, 'r') as f:
                stadium_data = json.load(f)
        except Exception as e:
            return {"error": f"Failed to read stadium.json: {str(e)}"}
            
    result = get_chat_response(req.message, stadium_data)
    return result

class EmergencyRequest(BaseModel):
    incidentType: str
    stadiumData: Optional[StadiumData] = None

@app.post("/emergency")
async def handle_emergency(req: EmergencyRequest):
    stadium_data = None
    
    if req.stadiumData and req.stadiumData.stats:
        stadium_data = req.stadiumData.dict()
    else:
        json_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'stadium.json')
        try:
            with open(json_path, 'r') as f:
                stadium_data = json.load(f)
        except Exception as e:
            return {"error": f"Failed to read stadium.json: {str(e)}"}
            
    result = get_emergency_response(req.incidentType, stadium_data)
    return result

@app.get("/")
def read_root():
    return {"status": "StadiumMind API is online"}
