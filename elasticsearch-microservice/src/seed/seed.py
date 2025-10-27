from src.elastic import esClientHost
import json
from src.model import embed

if esClientHost.indices.exists(index="class_templates"):
  esClientHost.indices.delete(index="class_templates")
if esClientHost.indices.exists(index="courses"):
  esClientHost.indices.delete(index="courses")

with open("../data/product/classTemplates.json", "r", encoding="utf-8") as f1, \
     open("../data/product/danceCategories.json", "r", encoding="utf-8") as f2, \
     open("../data/product/advancementLevels.json", "r", encoding="utf-8") as f3, \
     open("../data/product/courses.json", "r", encoding="utf-8") as f4:
  class_templates = json.load(f1)
  dance_categories = json.load(f2)
  advancement_levels = json.load(f3)
  courses = json.load(f4)

  for class_template in class_templates:
    dance_category = next((dc for dc in dance_categories if dc["id"] == class_template["danceCategoryId"]), None)
    advancement_level = next((al for al in advancement_levels if al["id"] == class_template["advancementLevelId"]), None)
    doc = json.dumps({
        "id": class_template["id"],
        "name": class_template["name"],
        "description": class_template["description"],
        "description_embedded": embed(class_template["description"]),
        "dance_category": {
          "id": dance_category["id"],
          "name": dance_category["name"],
          "description": dance_category["description"] 
        } if dance_category else None,
        "advancement_level": {
           "id": advancement_level["id"],
           "name": advancement_level["name"],
           "description": advancement_level["description"]
        } if advancement_level else None,
        "price": class_template["price"]
      })
    
    esClientHost.index(index="class_templates", document=doc)

  for course in courses:
      dance_category = next((dc for dc in dance_categories if dc["id"] == course["danceCategoryId"]), None)
      advancement_level = next((al for al in advancement_levels if al["id"] == course["advancementLevelId"]), None)
      doc = json.dumps({
          "id": course["id"],
          "name": course["name"],
          "description": course["description"],
          "description_embedded": embed(course["description"]),
          "dance_category": {
            "id": dance_category["id"],
            "name": dance_category["name"],
            "description": dance_category["description"] 
          } if dance_category else None,
          "advancement_level": {
            "id": advancement_level["id"],
            "name": advancement_level["name"],
            "description": advancement_level["description"]
          } if advancement_level else None,
          "price": course["customPrice"]
        })
      
      esClientHost.index(index="courses", document=doc)

print("Seed command in es-microservice has been executed")