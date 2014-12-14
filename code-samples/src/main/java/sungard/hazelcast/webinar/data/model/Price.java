package sungard.hazelcast.webinar.data.model;

import java.io.IOException;

import com.hazelcast.nio.serialization.Portable;
import com.hazelcast.nio.serialization.PortableReader;
import com.hazelcast.nio.serialization.PortableWriter;

public class Price implements Portable {

    public String ticker;
    public Double value;
    public Long asOfTime;

    @Override
    public int getClassId() {
        return 2;
    }

    @Override
    public int getFactoryId() {
        return 1;
    }

    @Override
    public void readPortable(PortableReader reader) throws IOException {
        ticker = reader.readUTF("ticker");
        value = reader.readDouble("value");
        asOfTime = reader.readLong("asOfTime");
    }

    @Override
    public void writePortable(PortableWriter writer) throws IOException {
        writer.writeUTF("ticker", ticker);
        writer.writeDouble("value", value);
        writer.writeLong("asOfTime", asOfTime);
    }

	@Override
	public String toString() {
		return "Price [ticker=" + ticker + ", value=" + value + ", asOfTime="
				+ asOfTime + "]";
	}

}
