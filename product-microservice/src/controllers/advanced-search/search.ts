import { Request, Response } from "express";
import { embed } from "../../grpc/client/aiCommunication/embed";
import { esClient } from "../../elasticsearch/client";
import { StatusCodes } from "http-status-codes";
import { estypes } from "@elastic/elasticsearch";

interface SearchRequest {
  index: "class_templates" | "courses";
  searchQuery?: string;
  danceCategoriesIds?: number[];
  advancementLevelsIds?: number[];
  priceMin?: number;
  priceMax?: number;
  topK: number;
  numCandidates: number;
  page: number;
  itemsPerPage: number;
}

export async function search(
  req: Request<{}, {}, {}, SearchRequest>,
  res: Response,
) {
  const {
    index,
    danceCategoriesIds,
    advancementLevelsIds,
    topK,
    numCandidates,
    page,
    itemsPerPage,
  } = req.query;

  let { searchQuery } = req.query;

  if (!searchQuery) {
    searchQuery = "dance class or course"
  }

  const query_vector = (await embed(searchQuery, true)).embeddingList;

  let { priceMin, priceMax } = req.query;
  priceMin ??= 0;
  priceMax ??= 9999999;

  const filters: estypes.QueryDslQueryContainer[] = [];

  if (danceCategoriesIds && danceCategoriesIds.length > 0) {
    filters.push({
      terms: { "danceCategory.id": danceCategoriesIds },
    });
  }

  if (advancementLevelsIds && advancementLevelsIds.length > 0) {
    filters.push({
      terms: { "advancementLevel.id": advancementLevelsIds },
    });
  }

  filters.push({
    range: { price: { gte: priceMin, lte: priceMax } },
  });

  const knn: estypes.KnnSearch = {
    field: "descriptionEmbedded",
    query_vector,
    k: topK,
    num_candidates: numCandidates,
    ...(filters.length > 0 ? { filter: { bool: { must: filters } } } : {}),
  };

  const searchRequest: estypes.SearchRequest = {
    index,
    knn,
    size: topK,
  };

  const result = await esClient.search(searchRequest);

  const response = result.hits.hits
    .map((hit: any) => {
      const { descriptionEmbedded, ...document } = hit._source as Record<
        string,
        any
      >;
      return {
        document: document,
        score: hit._score,
      };
    })
    .sort((a: any, b: any) => (a.score && b.score ? b.score - a.score : 0));

  res
    .status(StatusCodes.OK)
    .json(response.slice((page - 1) * itemsPerPage, page * itemsPerPage));
}
