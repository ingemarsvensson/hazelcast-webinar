package sungard.hazelcast.webinar.data.model;

import java.io.IOException;

import com.hazelcast.nio.serialization.Portable;
import com.hazelcast.nio.serialization.PortableReader;
import com.hazelcast.nio.serialization.PortableWriter;

public class TemporalKey implements Portable, Comparable<TemporalKey> {

    public String key;
    public Long asOfTime;

    public TemporalKey() {
    }

    public TemporalKey(String key) {
        this.key = key;
    }

    public TemporalKey(String key, Long asOfTime) {
        this.key = key;
        this.asOfTime = asOfTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TemporalKey that = (TemporalKey) o;

        if (asOfTime != null ? !asOfTime.equals(that.asOfTime) : that.asOfTime != null) return false;
        if (key != null ? !key.equals(that.key) : that.key != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = key != null ? key.hashCode() : 0;
        result = 31 * result + (asOfTime != null ? asOfTime.hashCode() : 0);
        return result;
    }

    @Override
    public int getFactoryId() {
        return 1;
    }

    @Override
    public int getClassId() {
        return 900;
    }

    @Override
    public void writePortable(PortableWriter writer) throws IOException {
        writer.writeUTF("key", key);
        if(asOfTime != null) {
            writer.writeLong("asOfTime", asOfTime);
            writer.writeBoolean("asOfTimeNull", false);
        } else {
            writer.writeBoolean("asOfTimeNull", true);
        }
    }

    @Override
    public void readPortable(PortableReader reader) throws IOException {
        key = reader.readUTF("key");
        if(reader.hasField("asOfTime") && !reader.readBoolean("asOfTimeNull")) {
            asOfTime = reader.readLong("asOfTime");
        } else {
            asOfTime = null;
        }
    }

    @Override
    public int compareTo(TemporalKey o) {
        return 0;
    }

}