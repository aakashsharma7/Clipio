from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import openai
import os
from supabase import create_client, Client
import numpy as np
from PIL import Image
import requests
from io import BytesIO
import json

app = FastAPI(title="Clipio AI Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
openai.api_key = os.getenv("OPENAI_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

# Initialize Supabase client
supabase: Client = create_client(supabase_url, supabase_key)

class AssetData(BaseModel):
    url: str
    title: str
    description: Optional[str] = None
    file_type: str

class TaggingRequest(BaseModel):
    assets: List[AssetData]

class SimilarityRequest(BaseModel):
    asset_id: str
    limit: int = 10

class TaggingResponse(BaseModel):
    asset_id: str
    tags: List[str]
    confidence: float

class SimilarityResponse(BaseModel):
    similar_assets: List[dict]
    scores: List[float]

@app.get("/")
async def root():
    return {"message": "Clipio AI Service is running"}

@app.post("/tag-assets", response_model=List[TaggingResponse])
async def tag_assets(request: TaggingRequest):
    """Generate AI tags for multiple assets"""
    try:
        results = []
        
        for asset in request.assets:
            # Generate tags based on asset type and content
            if asset.file_type == "image":
                tags = await generate_image_tags(asset.url, asset.title, asset.description)
            else:
                tags = await generate_text_tags(asset.title, asset.description)
            
            # Calculate confidence based on tag quality
            confidence = calculate_confidence(tags)
            
            results.append(TaggingResponse(
                asset_id=asset.url,  # Using URL as ID for now
                tags=tags,
                confidence=confidence
            ))
        
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating tags: {str(e)}")

@app.post("/find-similar", response_model=SimilarityResponse)
async def find_similar_assets(request: SimilarityRequest):
    """Find similar assets based on visual or semantic similarity"""
    try:
        # Get the reference asset
        asset_response = supabase.table("assets").select("*").eq("id", request.asset_id).execute()
        
        if not asset_response.data:
            raise HTTPException(status_code=404, detail="Asset not found")
        
        reference_asset = asset_response.data[0]
        
        # Get all assets for comparison
        all_assets_response = supabase.table("assets").select("*").execute()
        all_assets = all_assets_response.data
        
        # Calculate similarities
        similar_assets = []
        scores = []
        
        for asset in all_assets:
            if asset["id"] != request.asset_id:
                similarity_score = calculate_similarity(reference_asset, asset)
                similar_assets.append(asset)
                scores.append(similarity_score)
        
        # Sort by similarity score
        sorted_pairs = sorted(zip(similar_assets, scores), key=lambda x: x[1], reverse=True)
        similar_assets, scores = zip(*sorted_pairs[:request.limit])
        
        return SimilarityResponse(
            similar_assets=list(similar_assets),
            scores=list(scores)
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding similar assets: {str(e)}")

@app.post("/analyze-design")
async def analyze_design(asset_data: AssetData):
    """Provide design feedback and suggestions"""
    try:
        if asset_data.file_type != "image":
            raise HTTPException(status_code=400, detail="Design analysis only supports images")
        
        # Analyze the image using OpenAI Vision API
        analysis = await analyze_image_design(asset_data.url, asset_data.title)
        
        return {
            "asset_id": asset_data.url,
            "analysis": analysis,
            "suggestions": generate_design_suggestions(analysis)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing design: {str(e)}")

async def generate_image_tags(url: str, title: str, description: Optional[str] = None) -> List[str]:
    """Generate tags for images using OpenAI Vision API"""
    try:
        # Download image
        response = requests.get(url)
        image = Image.open(BytesIO(response.content))
        
        # Prepare prompt for OpenAI
        prompt = f"""
        Analyze this image and generate relevant tags for a design asset management system.
        Title: {title}
        Description: {description or 'No description provided'}
        
        Generate 5-8 relevant tags that would help designers find this asset.
        Focus on: design style, color palette, subject matter, use case, mood, technique.
        Return only the tags as a comma-separated list.
        """
        
        # Use OpenAI Vision API
        response = openai.ChatCompletion.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": url
                            }
                        }
                    ]
                }
            ],
            max_tokens=100
        )
        
        tags_text = response.choices[0].message.content
        tags = [tag.strip() for tag in tags_text.split(',')]
        
        return tags[:8]  # Limit to 8 tags
    
    except Exception as e:
        # Fallback to basic tags based on file type
        return ["image", "design", "visual", "creative"]

async def generate_text_tags(title: str, description: Optional[str] = None) -> List[str]:
    """Generate tags for non-image assets using OpenAI"""
    try:
        prompt = f"""
        Analyze this asset and generate relevant tags for a design asset management system.
        Title: {title}
        Description: {description or 'No description provided'}
        
        Generate 5-8 relevant tags that would help designers find this asset.
        Focus on: content type, subject matter, use case, style, category.
        Return only the tags as a comma-separated list.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=100
        )
        
        tags_text = response.choices[0].message.content
        tags = [tag.strip() for tag in tags_text.split(',')]
        
        return tags[:8]
    
    except Exception as e:
        # Fallback to basic tags
        return ["document", "file", "content"]

def calculate_confidence(tags: List[str]) -> float:
    """Calculate confidence score for generated tags"""
    # Simple confidence calculation based on tag count and quality
    base_confidence = min(len(tags) / 8.0, 1.0)
    
    # Boost confidence for specific, descriptive tags
    quality_indicators = ["modern", "minimal", "vintage", "abstract", "geometric", "organic"]
    quality_score = sum(1 for tag in tags if tag.lower() in quality_indicators) / len(quality_indicators)
    
    return min(base_confidence + quality_score * 0.2, 1.0)

def calculate_similarity(asset1: dict, asset2: dict) -> float:
    """Calculate similarity between two assets"""
    # Simple similarity calculation based on shared tags
    tags1 = set(asset1.get("tags", []) + asset1.get("ai_tags", []))
    tags2 = set(asset2.get("tags", []) + asset2.get("ai_tags", []))
    
    if not tags1 or not tags2:
        return 0.0
    
    intersection = len(tags1.intersection(tags2))
    union = len(tags1.union(tags2))
    
    return intersection / union if union > 0 else 0.0

async def analyze_image_design(url: str, title: str) -> dict:
    """Analyze image design using OpenAI Vision API"""
    try:
        prompt = """
        Analyze this design image and provide feedback on:
        1. Color harmony and palette
        2. Composition and layout
        3. Typography (if present)
        4. Visual hierarchy
        5. Overall aesthetic appeal
        
        Provide specific, constructive feedback that would help improve the design.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {"url": url}
                        }
                    ]
                }
            ],
            max_tokens=300
        )
        
        return {
            "feedback": response.choices[0].message.content,
            "score": 8.5  # Mock score for now
        }
    
    except Exception as e:
        return {
            "feedback": "Unable to analyze design at this time.",
            "score": 0.0
        }

def generate_design_suggestions(analysis: dict) -> List[str]:
    """Generate design improvement suggestions"""
    # Mock suggestions based on analysis
    suggestions = [
        "Consider adjusting the color contrast for better readability",
        "Try experimenting with different layout arrangements",
        "Add more whitespace to improve visual breathing room",
        "Consider using a more consistent typography hierarchy"
    ]
    
    return suggestions

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
