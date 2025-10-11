from elasticsearch import Elasticsearch

esClientDocker = Elasticsearch("http://elasticsearch:9200")
esClientHost = Elasticsearch("http://localhost:9200")