import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv"

dotenv.config({ path: ".env.development.local" });

const PORT = process.env.ES_PORT
const ES_HOST = process.env.ES_HOST

export const esClient = new Client({
  node: `http://${ES_HOST}:${PORT}`
})

export interface CourseDocument {
  id: number
  name: string
  description: string
  descriptionEmbedded: number[]
  danceCategory: {
    id: number
    name: string
    description: string
  } | null
  advancementLevel: {
    id: number
    name: string
    description: string
  } | null
  price: number
  startDate: Date
  endDate: Date
}

export interface ClassTemplateDocument {
  id: number
  name: string
  description: string
  descriptionEmbedded: number[]
  danceCategory: {
    id: number
    name: string
    description: string
  } | null
  advancementLevel: {
    id: number
    name: string
    description: string
  } | null
  price: number
}