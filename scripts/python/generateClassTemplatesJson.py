import os
import json
from google import genai
from google.genai import types
from pydantic import BaseModel, Field, conlist
from typing import List, Optional
from dotenv import load_dotenv
import random

# --- Configuration and Schemas ---

REGENERATE_NAMES_AND_DESCRIPTIONS_WITH_GEMINI = False
# !! Parts of code that are not wrapped with this flag to be True are actually parts of playground, custom fixes !!


# Wczytanie zmiennych z pliku .env na początku skryptu
load_dotenv()

# Set the API key from an environment variable
# Make sure you have the 'GEMINI_API_KEY' environment variable set
try:
    API_KEY = os.environ["GEMINI_API_KEY"]
except KeyError:
    print("ERROR: Please set the 'GEMINI_API_KEY' environment variable.")
    exit()

# Initialize the Gemini client
ai = genai.Client(api_key=API_KEY)

# Parameters
COUNT = 10  # Number of class suggestions
MODEL_NAME = "gemini-2.5-flash"
TEMPERATURE = 0.8  # Creativity level
CLASS_TEMPLATES_OUTPUT_FILENAME = "../../data/product/classTemplatesGemini.json"
DANCE_CATEGORIES_OUTPUT_FILENAME = "../../data/product/danceCategoriesGemini.json"

CACHED_CLASS_TEMPLATES_FILENAME = "cachedClassTemplatesData.json"
CACHED_DANCE_CATEGORIES_FILENAME = "cachedDanceCategoriesData.json"

# Define the schema for a single class template using Pydantic
class ClassTemplateSuggestion(BaseModel):
    """Schema for a single dance class template suggestion."""
    name: str = Field(
        ...,
        description="A creative name (title) of a dance class",
    )
    description: str = Field(
        ...,
        description=(
            "A creative description of a dance class, outlining its features - "
            "who is the class for? what is the advancement level? what is the dance style, "
            "what are its main points? where is it conducted? something else?"
        ),
    )
    danceCategoryName: str = Field(
        ...,
        description=(
            "A dance style name for the provided dance class"
        ),
    )
    danceCategoryDescription: str = Field(
        ...,
        description=(
            "Description of dance style for the provided dance class"
        ),
    )

# Define the output schema for the entire list
# We use conlist to specify that we expect a list of ClassTemplateSuggestion items
class ClassTemplateList(BaseModel):
    """The main output schema: a list of class template suggestions."""
    # Note: Gemini often wraps the output in a top-level key when using Pydantic schema
    class_templates: conlist(ClassTemplateSuggestion, min_length=1) 

# --- Main Logic ---

def generate_and_save_class_templates(count: int, temperature: float):
    """
    Generates dance class suggestions using the Gemini model and saves them to a JSON file.
    """
    if REGENERATE_NAMES_AND_DESCRIPTIONS_WITH_GEMINI:
        prompt = f"Generate {count} unique dance class suggestions. Return the data in JSON format compliant with the provided schema."
        
        print(
            f"\n🤖 Generating {count} suggestions with model {MODEL_NAME} (Temperature: {temperature})..."
        )

    dance_class_templates_raw = []

    try:
        # P O P R A W K A:
        # Konwertujemy model Pydantic bezpośrednio na słownik JSON Schema
        # i przekazujemy go do SDK.
        if REGENERATE_NAMES_AND_DESCRIPTIONS_WITH_GEMINI:
            json_schema = ClassTemplateList.model_json_schema() 
            
            response = ai.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    # SDK Google GenAI (w nowszych wersjach) akceptuje słownik JSON Schema (dict)
                    response_schema=json_schema, 
                    temperature=temperature,
                ),
            )
            
            # The response text is a JSON string
            json_string = response.text.strip()
            
            if not json_string:
                print("Model did not return JSON content.")
                return

            # Load and validate the JSON data
            # The response from Gemini will typically be in the format: {"class_templates": [...]}
            data = json.loads(json_string)
            
            # Extract the list of class templates
            dance_class_templates_raw = data.get("class_templates", [])

            if not dance_class_templates_raw:
                print("Model generated 0 dance classes in the 'class_templates' field.")
                return
        else:
            with open(CACHED_CLASS_TEMPLATES_FILENAME, 'r', encoding='utf-8') as f:
                dance_class_templates_raw = json.load(f)

        # Prepare data for saving
        class_templates_for_save = []
        dance_categories_for_save = []
        for idx, item in enumerate(dance_class_templates_raw):
            if REGENERATE_NAMES_AND_DESCRIPTIONS_WITH_GEMINI:
                dance_categories_for_save.append({
                    "id": idx + 60,
                    "name": item.get("danceCategoryName"),
                    "description": item.get("danceCategoryDescription"),
                    "photoPath": "no photo path"
                })
                
            # We save the data generated by the AI
            if REGENERATE_NAMES_AND_DESCRIPTIONS_WITH_GEMINI:
                class_templates_for_save.append({
                    "id": idx + 60,
                    "name": item.get("name"),
                    "description": item.get("description"),
                    # You could add other fixed/random fields here if needed for the final structure:
                    "danceCategoryId": idx + 60,
                    "advancementLevelId": random.randint(1, 3),
                    "classType": "GROUP_CLASS",
                    "price": random.randint(30, 59), 
                    "courseId": None,
                    "currency": "PLN",
                    "scheduleTileColor": "#123456"
                })  
            else:
                class_templates_for_save.append({
                    "id": item.get("id"),
                    "name": item.get("name"),
                    "description": item.get("description"),
                    # You could add other fixed/random fields here if needed for the final structure:
                    "danceCategoryId": item.get("danceCategoryId"),
                    "advancementLevelId": item.get("advancementLevelId"),
                    "classType": item.get("classType"),
                    "price": item.get("price"), 
                    "courseId": item.get("courseId"),
                    "currency": "PLN",
                    "scheduleTileColor": "#123456"
                })
            
        # Save to a JSON file
        with open(CLASS_TEMPLATES_OUTPUT_FILENAME, 'w', encoding='utf-8') as f:
            # use ensure_ascii=False for proper saving of non-ASCII characters (e.g., Polish diacritics)
            json.dump(class_templates_for_save, f, ensure_ascii=False, indent=2)

        with open(CACHED_CLASS_TEMPLATES_FILENAME, 'w', encoding='utf-8') as f:
            # use ensure_ascii=False for proper saving of non-ASCII characters (e.g., Polish diacritics)
            json.dump(class_templates_for_save, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Successfully generated and saved {len(class_templates_for_save)} templates to file '{CLASS_TEMPLATES_OUTPUT_FILENAME}'")
        
        if REGENERATE_NAMES_AND_DESCRIPTIONS_WITH_GEMINI:
            with open(DANCE_CATEGORIES_OUTPUT_FILENAME, 'w', encoding='utf-8') as f:
                json.dump(dance_categories_for_save, f, ensure_ascii=False, indent=2)

            with open(CACHED_DANCE_CATEGORIES_FILENAME, 'w', encoding='utf-8') as f:
                json.dump(dance_categories_for_save, f, ensure_ascii=False, indent=2)

        print(f"✅ Successfully generated and saved {len(dance_categories_for_save)} dance categories to file '{DANCE_CATEGORIES_OUTPUT_FILENAME}'")

    except json.JSONDecodeError:
        print(f"ERROR: Failed to parse the response as JSON:\n{json_string}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# --- Execution ---

if __name__ == "__main__":
    generate_and_save_class_templates(COUNT, TEMPERATURE)
