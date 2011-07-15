# -*- coding: utf-8 -*-
from pyblueprints.neo4j import Neo4jIndexableGraph as Neo4jGraphDatabase
from pyblueprints.neo4j import Neo4jDatabaseConnectionError

from engines.gdb.backends import GraphDatabaseConnectionError
from engines.gdb.backends.blueprints import BlueprintsGraphDatabase


class GraphDatabase(BlueprintsGraphDatabase):

    def __init__(self, url, params=None, graph=None):
        self.url = url
        self.params = params or {}
        self.graph = graph
        try:
            self.gdb = Neo4jGraphDatabase(self.url)
        except Neo4jDatabaseConnectionError:
            raise GraphDatabaseConnectionError(self.url) 
