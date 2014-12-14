package sungard.hazelcast.webinar.data;

import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Random;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import sungard.hazelcast.webinar.data.model.Asset;
import sungard.hazelcast.webinar.data.model.Price;
import sungard.hazelcast.webinar.data.model.TemporalKey;

import com.hazelcast.core.IMap;
import com.hazelcast.query.SqlPredicate;

public class DataPublisher {

    final static Logger logger = LoggerFactory.getLogger(DataPublisher.class);

    public void prime(IMap<TemporalKey, Asset> assetMap, IMap<TemporalKey, Price> priceMap) {

        Calendar calendar = new GregorianCalendar();
        Long asOfTime = calendar.getTime().getTime();

        // FTSE 100 tickers
        String[] tickers = { "AAL.L", "ABF.L", "ADM.L", "ADN.L", "AGK.L", "AHT.L", "ANTO.L", "ARM.L", "AV.L", "AZN.L", "BA.L", "BAB.L", "BARC.L", "BATS.L", "BG.L", "BLND.L", "BLT.L", "BNZL.L", "BP.L", "BRBY.L", "BT-A.L", "CCH.L", "CCL.L", "CNA.L", "CPG.L", "CPI.L", "CRH.L", "DC.L", "DGE.L", "DLG.L", "EXPN.L", "EZJ.L", "FLG.L", "FRES.L", "GFS.L", "GKN.L", "GLEN.L", "GSK.L", "HL.L", "HMSO.L", "HSBA.L", "IAG.L", "IHG.L", "III.L", "IMI.L", "IMT.L", "INTU.L", "ITRK.L", "ITV.L", "JMAT.L", "KGF.L", "LAND.L", "LGEN.L", "LLOY.L", "LSE.L", "MGGT.L", "MKS.L", "MNDI.L", "MRW.L", "NG.L", "NXT.L", "OML.L", "PFC.L", "PRU.L", "PSN.L", "PSON.L", "RB.L", "RBS.L", "RDSA.L", "RDSB.L", "REL.L", "RIO.L", "RMG.L", "RR.L", "RRS.L", "RSA.L", "SAB.L", "SBRY.L", "SDR.L", "SGE.L", "SHP.L", "SKY.L", "SL.L", "SMIN.L", "SN.L", "SPD.L", "SSE.L", "STAN.L", "STJ.L", "SVT.L", "TLW.L", "TPK.L", "TSCO.L", "TT.L", "ULVR.L", "UU.L", "VOD.L", "WEIR.L", "WOS.L", "WPP.L" };

        // Create assets and historical versions for the past 30 days
        for(String ticker : tickers) {
            Asset asset = new Asset();
            asset.ticker = ticker;
            asset.asOfTime = asOfTime;
            assetMap.set(new TemporalKey(asset.ticker, asset.asOfTime), asset);

            calendar = new GregorianCalendar();
            for(int j = 0; j < 30; j++) {
                calendar.add(Calendar.DAY_OF_MONTH, -1);
                asset.asOfTime = calendar.getTime().getTime();
                assetMap.set(new TemporalKey(asset.ticker, asset.asOfTime), asset);
            }
        }
        logger.info("Created 100 new assets");

        // For each asset and historical version, create a random price
        Random random = new Random();
        for(Asset asset : assetMap.values()) {
            Price price = new Price();
            price.ticker = asset.ticker;
            price.asOfTime = asset.asOfTime;
            price.value = random.nextDouble() * 10;
            priceMap.set(new TemporalKey(price.ticker, price.asOfTime), price);
            logger.info("Published price {} for {} at {}", price.value, price.ticker, new Date(price.asOfTime));
        }

    }

    public void startTix(IMap<TemporalKey, Asset> assetMap, IMap<TemporalKey, Price> priceMap) {

        Calendar calendar = new GregorianCalendar();
        calendar.add(Calendar.DAY_OF_MONTH, -1);

        final Random random = new Random();
        new Thread(new Runnable() {

            @Override
            public void run() {
                while(true) {
                    try {
                        // Get all today's assets
                        SqlPredicate query = new SqlPredicate("asOfTime > " + calendar.getTime().getTime());
                        Collection<Asset> result = assetMap.values(query);
                        for(Asset asset : result) {
                            Price price = new Price();
                            price.ticker = asset.ticker;
                            price.asOfTime = new Date().getTime();
                            price.value = random.nextDouble() * 10;
                            priceMap.put(new TemporalKey(price.ticker, price.asOfTime), price);
                            logger.info("Published price {} for {} at {}", price.value, price.ticker, new Date(price.asOfTime));
                        }
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                    }
                }
            }

        }).start();

    }

}
