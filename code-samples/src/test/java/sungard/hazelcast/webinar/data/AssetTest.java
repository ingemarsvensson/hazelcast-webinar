package sungard.hazelcast.webinar.data;

import org.junit.Test;

import sungard.hazelcast.webinar.data.model.Asset;
import sungard.hazelcast.webinar.data.model.TemporalKey;

import com.hazelcast.client.HazelcastClient;
import com.hazelcast.client.config.ClientConfig;
import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.core.IMap;
import com.hazelcast.nio.serialization.ClassDefinitionBuilder;
import com.hazelcast.query.SqlPredicate;

public class AssetTest {

    private HazelcastInstance client = getClient();

    @Test
    public void lookupAsset() {

    	IMap<TemporalKey, Asset> assetMap = client.getMap("asset");
    	System.out.println(assetMap.values(new SqlPredicate("ticker='ingemar@risk'")));

    }


    private HazelcastInstance getClient() {

        ClientConfig clientConfig = new ClientConfig();
        clientConfig.getGroupConfig().setName("local-test").setPassword("local-test-pass");
        clientConfig.getNetworkConfig().addAddress("127.0.0.1");
        clientConfig.getSerializationConfig().addPortableFactory(1, new ClassFactory());
        clientConfig.getNetworkConfig().setConnectionTimeout(10000);
        ClassDefinitionBuilder builder = new ClassDefinitionBuilder(1, 100);
        builder.addUTFField("ticker");
        builder.addLongField("asOfTime");
        clientConfig.getSerializationConfig().addClassDefinition(builder.build());
        builder = new ClassDefinitionBuilder(1, 200);
        builder.addUTFField("ticker");
        builder.addLongField("asOfTime");
        builder.addDoubleField("value");
        clientConfig.getSerializationConfig().addClassDefinition(builder.build());
        builder = new ClassDefinitionBuilder(1, 900);
        builder.addUTFField("key");
        builder.addLongField("asOfTime");
        builder.addLongField("asOfTimeNull");
        clientConfig.getSerializationConfig().addClassDefinition(builder.build());
        return HazelcastClient.newHazelcastClient(clientConfig);

    }

}
