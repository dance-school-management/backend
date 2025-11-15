import { Request, Response } from "express";
import { embed } from "../../grpc/client/aiCommunication/embed";
import { esClient } from "../../elasticsearch/client";
import { StatusCodes } from "http-status-codes";
import { estypes } from "@elastic/elasticsearch";

interface SearchRequest {
  index: "class_templates" | "courses";
  searchQuery?: string;
  danceCategoriesIds?: number[] | number;
  advancementLevelsIds?: number[] | number;
  priceMin?: number;
  priceMax?: number;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  topK: number;
  numCandidates: number;
  page: number;
  itemsPerPage: number;
}

export async function search(
  req: Request<{}, {}, {}, SearchRequest>,
  res: Response,
) {
  const { index, topK, numCandidates, page, itemsPerPage } = req.query;

  let { searchQuery } = req.query;

  let startDateFrom;
  let startDateTo;
  let endDateFrom;
  let endDateTo;

  if (req.query.startDateFrom)
    startDateFrom = new Date(req.query.startDateFrom);
  if (req.query.startDateTo) startDateTo = new Date(req.query.startDateTo);
  if (req.query.endDateFrom) endDateFrom = new Date(req.query.endDateFrom);
  if (req.query.endDateTo) endDateTo = new Date(req.query.endDateTo);

  if (!searchQuery) {
    searchQuery = "dance class or course";
  }

  const query_vector = (await embed(searchQuery, true)).embeddingList;

  let { priceMin, priceMax } = req.query;
  priceMin ??= 0;
  priceMax ??= 9999999;

  const filters: estypes.QueryDslQueryContainer[] = [];

  let danceCategoriesIds: null | number | number[];
  let advancementLevelsIds: null | number | number[];

  if (req.query.danceCategoriesIds) {
    if (Array.isArray(req.query.danceCategoriesIds))
      danceCategoriesIds = req.query.danceCategoriesIds;
    else danceCategoriesIds = [req.query.danceCategoriesIds];
  } else {
    danceCategoriesIds = null;
  }

  if (req.query.advancementLevelsIds) {
    if (Array.isArray(req.query.advancementLevelsIds))
      advancementLevelsIds = req.query.advancementLevelsIds;
    else advancementLevelsIds = [req.query.advancementLevelsIds];
  } else {
    advancementLevelsIds = null;
  }

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

  if (index === "courses" && startDateFrom) {
    filters.push({
      range: { startDate: { gte: startDateFrom } },
    });
  }

  if (index === "courses" && endDateFrom) {
    filters.push({
      range: { endDate: { gte: endDateFrom } },
    });
  }

  if (index === "courses" && startDateTo) {
    filters.push({
      range: { startDate: { lte: startDateTo } },
    });
  }

  if (index === "courses" && endDateTo) {
    filters.push({
      range: { endDate: { lte: endDateTo } },
    });
  }

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
