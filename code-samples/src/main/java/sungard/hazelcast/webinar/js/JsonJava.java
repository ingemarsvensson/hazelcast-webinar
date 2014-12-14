package sungard.hazelcast.webinar.js;

import com.google.gson.Gson;

public class JsonJava {

    public static Object from(String className, String json) throws ClassNotFoundException {
        Gson gson = new Gson();
        Class<?> cls = Class.forName(className);
        return gson.fromJson(json, cls);
    }

}
