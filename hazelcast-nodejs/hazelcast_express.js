var java = require("java");

var express = require('express');
var app = express();

// Add to class path
java.classpath.push("hazelcast-3.3.1.jar");
java.classpath.push("hazelcast-client-3.3.1.jar");
java.classpath.push("webinar-1.0.jar");
java.classpath.push("gson.jar");

// Create class references
var HazelcastClientClass = java.import("com.hazelcast.client.HazelcastClient");
var ClientConfigClass = java.import("com.hazelcast.client.config.ClientConfig");
var SqlPredicateClass = java.import("com.hazelcast.query.SqlPredicate");
var ArrayListClass = java.import('java.util.ArrayList');
var ClassFactoryClass = java.import("sungard.hazelcast.webinar.data.ClassFactory");
var TemporalKeyClass = java.import("sungard.hazelcast.webinar.data.model.TemporalKey");

// Set up Hazelcast client
var clientConfig = new ClientConfigClass();
var groupConfig = clientConfig.getGroupConfigSync();
groupConfig.setNameSync("local-test");
groupConfig.setPasswordSync("local-test-pass");
var networkConfig = clientConfig.getNetworkConfigSync();
var addresses = new ArrayListClass();
addresses.addSync("127.0.0.1");
networkConfig.setAddressesSync(addresses);
var serializationConfig = clientConfig.getSerializationConfigSync();
var classFactory = new ClassFactoryClass();
serializationConfig.addPortableFactorySync(1, classFactory);
var hazelcastClient = HazelcastClientClass.newHazelcastClientSync(clientConfig);
var map = hazelcastClient.getMapSync("price");

app.get('/', function(req,res) {

	map.values(new SqlPredicateClass(req.query.query), function(error, result) {
		res.json({data:result.toArraySync()});
	});

});

app.listen(8081);