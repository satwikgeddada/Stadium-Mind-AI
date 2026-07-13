import os
import json
from pathlib import Path
from dotenv import load_dotenv
from google import genai

# Load .env from the backend directory
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

# Setup API Key for Gemini
api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

MODEL = "gemini-2.5-flash"


def get_stadium_recommendation(stadium_data: dict) -> dict:
    if not client:
        return {"recommendation": "GEMINI_API_KEY is not set. Please set your environment variable to receive AI recommendations."}

    try:
        prompt = f"""
You are an AI Stadium Operations Manager.
Analyze the stadium status.
Predict risks.
Recommend actions.
Keep response under 120 words.

Data:
{json.dumps(stadium_data, indent=2)}
"""
        response = client.models.generate_content(model=MODEL, contents=prompt)
        return {"recommendation": response.text}
    except Exception as e:
        return {"recommendation": f"Failed to connect to Gemini API: {str(e)}"}


def get_chat_response(message: str, stadium_data: dict) -> dict:
    if not client:
        return {"reply": "GEMINI_API_KEY is not set. Please set your environment variable to use the AI Assistant."}

    try:
        prompt = f"""
You are a helpful Stadium AI Assistant.
Answer the user's question accurately but concisely (under 40 words).
You MUST ONLY use the information provided in the JSON data below.
If the information to answer the question is not in the JSON data, say "I don't have information about that right now."

User Question: {message}

Stadium Data:
{json.dumps(stadium_data, indent=2)}
"""
        response = client.models.generate_content(model=MODEL, contents=prompt)
        return {"reply": response.text}
    except Exception as e:
        return {"reply": f"Failed to connect to Gemini API: {str(e)}"}


def get_emergency_response(incident_type: str, stadium_data: dict) -> dict:
    if not client:
        return {"error": "GEMINI_API_KEY is not set."}

    try:
        prompt = f"""
You are the AI Emergency Director for a smart stadium.
An emergency incident of type '{incident_type}' has been triggered.

Current Stadium Data:
{json.dumps(stadium_data, indent=2)}

Generate an emergency action plan returning EXACTLY the following JSON structure (do not use markdown formatting like ```json, just output the raw JSON):
{{
  "incidentSummary": "Brief description of the assumed situation based on type",
  "priority": "LOW, MEDIUM, HIGH, or CRITICAL",
  "immediateActions": ["Action 1", "Action 2", "Action 3"],
  "volunteerInstructions": "Specific instructions for stadium volunteers",
  "publicAnnouncement": "A calm, clear PA script to announce to the crowd"
}}
"""
        response = client.models.generate_content(model=MODEL, contents=prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]

        return json.loads(text.strip())
    except Exception as e:
        return {"error": f"Failed to generate emergency response: {str(e)}"}
