package sungard.hazelcast.webinar.data;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import org.junit.Test;

import sungard.hazelcast.webinar.data.model.Asset;
import sungard.hazelcast.webinar.data.model.Price;
import sungard.hazelcast.webinar.data.model.TemporalKey;

import com.hazelcast.client.HazelcastClient;
import com.hazelcast.client.config.ClientConfig;
import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.core.IMap;
import com.hazelcast.nio.serialization.ClassDefinitionBuilder;
import com.hazelcast.query.SqlPredicate;

public class TimeTravel {

    private Calendar calendar = new GregorianCalendar();
    private HazelcastInstance client = getClient();
    { calendar.add(Calendar.DAY_OF_MONTH, -1); }
    private Long yesterday = calendar.getTime().getTime();
    { calendar.add(Calendar.DAY_OF_MONTH, -1); }
    private Long twoDaysAgo = calendar.getTime().getTime();

    @Test
    public void testPrices() {

        IMap<TemporalKey, Price> priceMap = client.getMap("price");

        // Get all prices for a ticker
        //SqlPredicate query = new SqlPredicate("ticker = 'ADN.L'");

        // Get all historical prices for a ticker
        //SqlPredicate query = new SqlPredicate("ticker = 'ADN.L' and asOfTime <= " + yesterday);

        // Get all historical prices for all assets
        //SqlPredicate query = new SqlPredicate("asOfTime <= " + yesterday);

        // Get an asset price for a day
        SqlPredicate query = new SqlPredicate("ticker = 'ADN.L' and asOfTime between " + twoDaysAgo + " and " + yesterday);

        printSorted(priceMap.values(query));

    }

    //@Test
    public void testAssets() throws InterruptedException {

        IMap<TemporalKey, Asset> assetMap = client.getMap("asset");

        // Save a new record
        Asset asset = new Asset();
        asset.ticker = "asset_foo";
        asset.asOfTime = new Date().getTime();
        assetMap.set(new TemporalKey(asset.ticker), asset);
        System.out.println("New record: " + asset.ticker + " asOfTime: " + new Date(asset.asOfTime));

        // Get the new record back
        Asset currentVersion = assetMap.get(new TemporalKey(asset.ticker));
        System.out.println("Current version: " + currentVersion.ticker + " asOfTime: " + new Date(currentVersion.asOfTime));

        Thread.sleep(2000);

        // Save the old version
        Asset oldVersion = assetMap.get(new TemporalKey(asset.ticker));
        assetMap.set(new TemporalKey(oldVersion.ticker, oldVersion.asOfTime), oldVersion);

        // Save the new version
        asset.asOfTime = new Date().getTime();
        assetMap.set(new TemporalKey(asset.ticker), asset);

        currentVersion = assetMap.get(new TemporalKey(asset.ticker));
        assertEquals(asset.asOfTime, currentVersion.asOfTime);

    }

    private void printSorted(Collection<Price> prices) {

        List<Price> result = new ArrayList<>(prices);

        Collections.sort(result, new Comparator<Price>() {
            @Override
            public int compare(Price from, Price to) {
                return from.asOfTime.compareTo(to.asOfTime);
            }
        });

        for(Price price : result) {
            System.out.println("Price for: " + price.ticker + " was: " + price.value + " at: " + new Date(price.asOfTime));
        }
        
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
