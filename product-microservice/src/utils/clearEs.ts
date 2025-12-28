import { esClient } from "../elasticsearch/client";

(async function clearEs() {
if (await esClient.indices.exists({ index: "class_templates" }))
    await esClient.indices.delete({ index: "class_templates" });
  if (await esClient.indices.exists({ index: "courses" }))
    await esClient.indices.delete({ index: "courses" });
})()

