package sungard.hazelcast.webinar.data.model;

import java.io.IOException;

import com.hazelcast.nio.serialization.Portable;
import com.hazelcast.nio.serialization.PortableReader;
import com.hazelcast.nio.serialization.PortableWriter;

public class Asset implements Portable {

    public String ticker;
    public Long asOfTime;

    @Override
    public int getClassId() {
        return 1;
    }

    @Override
    public int getFactoryId() {
        return 1;
    }

    @Override
    public void readPortable(PortableReader reader) throws IOException {
        ticker = reader.readUTF("ticker");
        asOfTime = reader.readLong("asOfTime");
    }

    @Override
    public void writePortable(PortableWriter writer) throws IOException {
        writer.writeUTF("ticker", ticker);
        writer.writeLong("asOfTime", asOfTime);
    }

	@Override
	public String toString() {
		return "Asset [ticker=" + ticker + ", asOfTime=" + asOfTime + "]";
	}

}
