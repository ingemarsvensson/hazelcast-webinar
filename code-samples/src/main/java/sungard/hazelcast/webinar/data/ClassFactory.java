package sungard.hazelcast.webinar.data;

import sungard.hazelcast.webinar.data.model.Asset;
import sungard.hazelcast.webinar.data.model.Price;
import sungard.hazelcast.webinar.data.model.TemporalKey;

import com.hazelcast.nio.serialization.Portable;
import com.hazelcast.nio.serialization.PortableFactory;

public class ClassFactory implements PortableFactory {

    @Override
    public Portable create(int classId) {
        if(classId == 1) {
            return new Asset();
        } else if(classId == 2) {
            return new Price();
        } else if(classId == 9) {
            return new TemporalKey();
        }
        throw new IllegalArgumentException("Invalid classId " + classId);
    }

}
