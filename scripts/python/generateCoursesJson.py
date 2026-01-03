import os
import json
from google import genai
from google.genai import types
from pydantic import BaseModel, Field, conlist
from typing import List, Optional
from dotenv import load_dotenv
import random

# --- Configuration and Schemas ---

REGENERATE_NAMES_AND_DESCRIPTIONS_WITH_GEMINI = True
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
COUNT = 20  # Number of course suggestions
MODEL_NAME = "gemini-2.5-flash"
TEMPERATURE = 0.8  # Creativity level
COURSES_OUTPUT_FILENAME = "../../data/product/coursesGemini.json"
CLASS_TEMPLATES_OUTPUT_FILENAME = "../../data/product/classTemplatesForCoursesGemini.json"
DANCE_CATEGORIES_OUTPUT_FILENAME = "../../data/product/danceCategoriesForCoursesGemini.json"

CACHED_COURSES_FILENAME = "cachedCoursesData.json"
CACHED_CLASS_TEMPLATES_FILENAME = "cachedClassTemplatesForCoursesData.json"
CACHED_DANCE_CATEGORIES_FILENAME = "cachedDanceCategoriesForCoursesData.json"

# Define the schema for a single class template using Pydantic
class CourseSuggestion(BaseModel):
    """Schema for a single dance class template suggestion."""
    name: str = Field(
        ...,
        description="A creative name (title) of a dance course",
    )
    description: str = Field(
        ...,
        description=(
            "A creative description of a dance course, outlining its features - "
            "who is the course for? what is the advancement level? what is the dance style, "
            "what are its main points? where is it conducted? who is the instructor? how does the instructor conduct the classes? "
            "what can you learn from this course?"
        ),
    )
    classTemplateName: str = Field(
        ...,
        description=(
            "A creative name (title) of a dance class template of classes conducted in terms of the provided course"
        )
    )
    classTemplateDescription: str = Field(
        ...,
        description=(
            "A short description of a dance class template of classes conducted in terms of the provided course"
        )
    )
    danceCategoryName: str = Field(
        ...,
        description=(
            "A dance style name for the provided dance course"
        ),
    )
    danceCategoryDescription: str = Field(
        ...,
        description=(
            "Description of dance style for the provided dance course"
        ),
    )

# Define the output schema for the entire list
# We use conlist to specify that we expect a list of ClassTemplateSuggestion items
class CourseList(BaseModel):
    """The main output schema: a list of class template suggestions."""
    # Note: Gemini often wraps the output in a top-level key when using Pydantic schema
    courses: conlist(CourseSuggestion, min_length=1) 

# --- Main Logic ---

def generate_and_save_courses(count: int, temperature: float):
    """
    Generates dance class suggestions using the Gemini model and saves them to a JSON file.
    """
    if REGENERATE_NAMES_AND_DESCRIPTIONS_WITH_GEMINI:
        prompt = f"Generate {count} unique dance course suggestions. Return the data in JSON format compliant with the provided schema."
        
        print(
            f"\n🤖 Generating {count} suggestions with model {MODEL_NAME} (Temperature: {temperature})..."
        )

    try:
        # P O P R A W K A:
        # Konwertujemy model Pydantic bezpośrednio na słownik JSON Schema
        # i przekazujemy go do SDK.
        if REGENERATE_NAMES_AND_DESCRIPTIONS_WITH_GEMINI:
            json_schema = CourseList.model_json_schema() 
            
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
            dance_courses_raw = data.get("courses", [])

            if not dance_courses_raw:
                print("Model generated 0 dance classes in the 'class_templates' field.")
                return

        # Prepare data for saving
        courses_for_save = []
        class_templates_for_save = []
        dance_categories_for_save = []
        for idx, item in enumerate(dance_courses_raw):
            if REGENERATE_NAMES_AND_DESCRIPTIONS_WITH_GEMINI:
                dance_categories_for_save.append({
                    "id": idx + 20,
                    "name": item.get("danceCategoryName") + " 2",
                    "description": item.get("danceCategoryDescription"),
                    "photoPath": "no photo path"
                })
                
            # We save the data generated by the AI
            if REGENERATE_NAMES_AND_DESCRIPTIONS_WITH_GEMINI:
                courses_for_save.append({
                    "id": idx + 11,
                    "name": item.get("name"),
                    "description": item.get("description"),
                    # You could add other fixed/random fields here if needed for the final structure:
                    "danceCategoryId": idx + 20,
                    "advancementLevelId": random.randint(1, 3),
                    "courseStatus": "SALE",
                    "customPrice": random.randint(300, 590), 
                })  
            
            if REGENERATE_NAMES_AND_DESCRIPTIONS_WITH_GEMINI:
                class_templates_for_save.append({
                    "id": idx + 35,
                    "name": item.get("classTemplateName"),
                    "description": item.get("classTemplateDescription"),
                    "danceCategoryId": idx + 20,
                    "advancementLevelId": random.randint(1, 3),
                    "classType": "GROUP_CLASS",
                    "price": random.randint(30, 59),
                    "courseId": idx + 11,
                    "currency": "PLN",
                    "scheduleTileColor": "#123456"
                })
            
        # Save to a JSON file
        with open(CACHED_DANCE_CATEGORIES_FILENAME, 'w', encoding='utf-8') as f:
            # use ensure_ascii=False for proper saving of non-ASCII characters (e.g., Polish diacritics)
            json.dump(dance_categories_for_save, f, ensure_ascii=False, indent=2)

        with open(CACHED_CLASS_TEMPLATES_FILENAME, 'w', encoding='utf-8') as f:
            # use ensure_ascii=False for proper saving of non-ASCII characters (e.g., Polish diacritics)
            json.dump(class_templates_for_save, f, ensure_ascii=False, indent=2)

        with open(CACHED_COURSES_FILENAME, 'w', encoding='utf-8') as f:
            # use ensure_ascii=False for proper saving of non-ASCII characters (e.g., Polish diacritics)
            json.dump(courses_for_save, f, ensure_ascii=False, indent=2)
        
        if REGENERATE_NAMES_AND_DESCRIPTIONS_WITH_GEMINI:
            with open(DANCE_CATEGORIES_OUTPUT_FILENAME, 'w', encoding='utf-8') as f:
                json.dump(dance_categories_for_save, f, ensure_ascii=False, indent=2)

            with open(CACHED_DANCE_CATEGORIES_FILENAME, 'w', encoding='utf-8') as f:
                json.dump(dance_categories_for_save, f, ensure_ascii=False, indent=2)
            
            with open(COURSES_OUTPUT_FILENAME, 'w', encoding='utf-8') as f:
              json.dump(courses_for_save, f, ensure_ascii=False, indent=2)

            with open(CACHED_COURSES_FILENAME, 'w', encoding='utf-8') as f:
              json.dump(courses_for_save, f, ensure_ascii=False, indent=2)
            
            with open(CLASS_TEMPLATES_OUTPUT_FILENAME, 'w', encoding='utf-8') as f:
              json.dump(class_templates_for_save, f, ensure_ascii=False, indent=2)

            with open(CACHED_CLASS_TEMPLATES_FILENAME, 'w', encoding='utf-8') as f:
              json.dump(class_templates_for_save, f, ensure_ascii=False, indent=2)

        print(f"✅ Successfully generated all of the data!")

    except json.JSONDecodeError:
        print(f"ERROR: Failed to parse the response as JSON:\n{json_string}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# --- Execution ---

if __name__ == "__main__":
    generate_and_save_courses(COUNT, TEMPERATURE)
