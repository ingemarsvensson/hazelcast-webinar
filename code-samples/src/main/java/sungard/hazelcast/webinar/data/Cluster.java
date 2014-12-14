package sungard.hazelcast.webinar.data;

import java.util.ArrayList;
import java.util.List;

import sungard.hazelcast.webinar.data.model.Asset;
import sungard.hazelcast.webinar.data.model.Price;
import sungard.hazelcast.webinar.data.model.TemporalKey;

import com.hazelcast.config.Config;
import com.hazelcast.config.MaxSizeConfig;
import com.hazelcast.core.Hazelcast;
import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.core.IMap;
import com.hazelcast.nio.serialization.ClassDefinitionBuilder;

public class Cluster {

    private static final int NUM_INSTANCES = 4;
    private List<HazelcastInstance> instances = new ArrayList<>(NUM_INSTANCES);

    public void start() {

        Config config = new Config();
        config.getGroupConfig()
            .setName("local-test")
            .setPassword("local-test-pass");

        config
            .getSerializationConfig()
            .addPortableFactory(1, new ClassFactory());
        
        MaxSizeConfig maxSizeConfig = new MaxSizeConfig();
        maxSizeConfig.setSize(100000);
        config.getMapConfig("price")
            .setMaxSizeConfig(maxSizeConfig );

        ClassDefinitionBuilder builder = new ClassDefinitionBuilder(1, 100);
        builder.addUTFField("ticker");
        builder.addLongField("asOfTime");
        config.getSerializationConfig().addClassDefinition(builder.build());

        builder = new ClassDefinitionBuilder(1, 200);
        builder.addUTFField("ticker");
        builder.addLongField("asOfTime");
        builder.addDoubleField("value");
        config.getSerializationConfig().addClassDefinition(builder.build());

        builder = new ClassDefinitionBuilder(1, 900);
        builder.addUTFField("key");
        builder.addLongField("asOfTime");
        builder.addBooleanField("asOfTimeNull");
        config.getSerializationConfig().addClassDefinition(builder.build());

        for (int i = 0; i < NUM_INSTANCES; i++) {
            instances.add(Hazelcast.newHazelcastInstance(config));
        }

        IMap<TemporalKey, Asset> assetMap = instances.get(0).getMap("asset");
        IMap<TemporalKey, Price> priceMap = instances.get(0).getMap("price");
        DataPublisher publisher = new DataPublisher();
        publisher.prime(assetMap, priceMap);
        publisher.startTix(assetMap, priceMap);

    }

    public void stop() {

        for (HazelcastInstance instance : instances) {
            instance.shutdown();
        }

    }

    public static void main(String[] args) {

        Cluster cluster = new Cluster();
        cluster.start();

    }

}
