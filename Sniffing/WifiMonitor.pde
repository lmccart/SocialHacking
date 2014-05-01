import java.io.*;
import java.util.regex.*;

class ProbeRequestFrame {
  public String mac;
  public String ssid;
  ProbeRequestFrame(String mac, String ssid) {
    this.mac = mac;
    this.ssid = ssid;
  }
}

class WifiMonitor extends Thread {
  boolean running = false;
  
  String command = "/usr/sbin/tcpdump -l -e -I -i en0";// 'type mgt subtype probe-req'";
  String patternString = ".+SA:([^ ]+) .+? Probe Request \\(([^)]*?)\\) .+";
  Pattern pattern;

  Process p;
  BufferedReader input;

  ArrayList<ProbeRequestFrame> probeRequestFrames = new ArrayList<ProbeRequestFrame>();

  void start() {
    running = true;
    try {
      p = Runtime.getRuntime().exec(command);
      input = new BufferedReader (new InputStreamReader(p.getInputStream()));
      pattern = Pattern.compile(patternString);
    }
    catch (Exception e) {
      e.printStackTrace();
    }
    super.start();
  }

  void run() {
    while (running) {
      try {
        print(".");
        String line = input.readLine ();
        if (line == null) {
          // but break when no more are immediately available
          break;
        }
        Matcher matcher = pattern.matcher(line);
        if (matcher.matches()) {
          probeRequestFrames.add(new ProbeRequestFrame(matcher.group(1), matcher.group(2)));
        }
      }
      catch (Exception e) {
        e.printStackTrace();
      }
    }
  }

  boolean hasNewProbeRequestFrame() {
    return !probeRequestFrames.isEmpty();
  }

  ProbeRequestFrame getNextProbeRequestFrame() {
    return probeRequestFrames.remove(0);
  }

  void quit() {
    try {
      input.close();
    } 
    catch (Exception e) {
      e.printStackTrace();
    }
    running = false;
    interrupt();
  }
}

