import java.util.*;

class MacLookup {
  TreeMap<String, String> macs;
  
  MacLookup() {
    macs = new TreeMap<String, String>();
    String[] lines = loadStrings("mac.txt");
    for(int i = 0; i < lines.length; i++) {
      String[] parts = split(lines[i], "\t");
      String mac = parts[0], name = parts[1];
      macs.put(mac, name);
    }
  }
  String getCompany(String mac) {
    String identifier = mac.substring(0, 8);
    String company = macs.get(identifier);
    return company == null ? identifier : company;
  }
  String getSummary(String mac) {
    String name = getCompany(mac);
    name = split(name, " ")[0];
    return name + mac.substring(8);
  }
}
