package sungard.hazelcast.webinar.data;

import java.util.Scanner;

import org.apache.commons.daemon.Daemon;
import org.apache.commons.daemon.DaemonContext;
import org.apache.commons.daemon.DaemonInitException;

public class ClusterDaemon implements Daemon {

    private static Cluster cluster = null;
    private static ClusterDaemon instance = new ClusterDaemon();

    @Override
    public void init(DaemonContext context) throws DaemonInitException, Exception {
    }

    @Override
    public void start() throws Exception {
    }

    @Override
    public void stop() throws Exception {
    }

    @Override
    public void destroy() {
    }

    public static void main(String[] args) {

        instance.initialize();
        Scanner sc = new Scanner(System.in);
        System.out.printf("Enter 'stop' to halt cluster: ");
        while (!sc.nextLine().toLowerCase().equals("stop"));
        instance.terminate();
        sc.close();

    }

    private void terminate() {

        if (cluster != null) {
            cluster.stop();
            cluster = null;
        }

    }

    private void initialize() {

        if (cluster == null) {
            cluster = new Cluster();
        }
        cluster.start();

    }

}
