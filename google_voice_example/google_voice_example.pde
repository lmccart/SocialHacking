//
// Google Voice Unoffical API Example
// Programmatically Send and Receive SMS Messages
// By Dan Moore
// @theDANtheMAN
// 

import com.techventus.server.voice.Voice;
import com.techventus.server.voice.datatypes.records.SMS;
import com.techventus.server.voice.datatypes.records.SMSThread;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.Calendar;
import java.util.Collection;
import java.util.HashMap;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import processing.net.*;
import de.bezier.data.sql.SQLite;
import processing.core.PApplet;

Voice mVoice;
Elbot elbot;
Database smsDB;
String DB_PATH_PREFIX = "/Users/dantheman/Documents/Processing/google_voice_example/";
String USER_NAME="";
String PASSWORD="";
void setup() {
  size(500, 500);
  smsDB = new Database(this);
  elbot = new Elbot();
  try {
    mVoice = new Voice(USER_NAME, PASSWORD);
  } 
  catch (IOException e) {
  }
}

void draw() {
  if (keyPressed) {
    sendMessage();
  }
  if (frameCount%60 == 0) {
    getMessages();
  }
}


void sendMessage() {
  sendSMS("", "I like cake");
}

void sendSMS(String number, String message) {
  println("seding SMS message");
  try {
    String line = elbot.getMessage(message);
    mVoice.sendSMS(number, line);
  } 
  catch (Exception e1) {
    e1.printStackTrace();
  }
}

void getMessages() {
  try {

    Collection<SMSThread> msg = mVoice.getSMSThreads();
    if (msg != null) {
      for (SMSThread p : msg) {
        Collection<SMS> sms = p.getAllSMS();
        for (SMS s : sms) {
          if (!s.getFrom().getName().equalsIgnoreCase("me")) {
            HashMap<String, String> smsMessage = new HashMap<String, String>();
            smsMessage.put("from_ID", String
              .format("%d", 
            String.format("%s%s%s", 
            s.getDateTime(), 
            s.getContent(), 
            s.getFrom().getNumber())
              .hashCode()));

            smsMessage.put("from_Name", s.getFrom().getName());
            smsMessage.put("from_Number", s.getFrom().getNumber());
            smsMessage.put("date", s.getDateTime().toString());

            String message = s.getContent();
            message = message.replace("'", "''");
            smsMessage.put("message", message);

            if (!smsDB.containsKeyValue(smsDB.SMS_TABLE, 
            "from_ID", smsMessage.get("from_ID"), smsDB.db)) {
              try {

                smsDB.InsertRow(smsDB.SMS_TABLE, smsMessage, smsDB.db);
                sendSMS(s.getFrom().getNumber(), s.getContent());
              } 
              catch (Exception e) {
                e.printStackTrace();
              }
            }
            else {
              //mParent.println("Already Has This SMS");
            }
          }
        }
      }
    }
  }
  catch (IOException e) {

    e.printStackTrace();
  }
}

public class Elbot {
  public String domain = "elbot_e.csoica.artificial-solutions.com";
  public String addr = "/cgi-bin/elbot.cgi";
  public  String URL = "http://elbot_e.csoica.artificial-solutions.com/cgi-bin/elbot.cgi";
  public  String hRef = "<a href=\"";
  public  String hRefClose = "\" target=\"";
  public  String music ="<a href=\"http://www.youtube.com/watch?v=1c_rY4uOCSY\" target=\"_blank\">video</a>";
  public Elbot() {
  }

  public String getMessage(String message) throws Exception {

    Map<String, String> data = new HashMap<String, String>(3);
    data.put("IDENT", "PnEo1kyU2G");
    data.put("USERLOGID", "PnEo1kyU2G");
    data.put("ENTRY", message); 
    URL siteUrl = new URL(URL);
    HttpURLConnection conn = (HttpURLConnection) siteUrl.openConnection();
    conn.setRequestMethod("POST");
    conn.setDoOutput(true);
    conn.setDoInput(true);

    DataOutputStream out = new DataOutputStream(conn.getOutputStream());

    Set keys = data.keySet();
    Iterator keyIter = keys.iterator();
    String content = "";
    for (int i=0; keyIter.hasNext(); i++) {
      Object key = keyIter.next();
      if (i!=0) {
        content += "&";
      }
      content += key + "=" + URLEncoder.encode(data.get(key), "UTF-8");
    }
    out.writeBytes(content);
    out.flush();
    out.close();
    BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
    String line = "";
    StringBuilder b = new StringBuilder();
    while ( (line=in.readLine ())!=null) {
      b.append(line);
    }    
    in.close();

    line = b.toString();
    line = line.substring(line.indexOf("   -->")+6, line.indexOf("<!-- E"));


    line = line.replace("a robot", "an artificial life form");
    line = line.replace("robot", "sculpture");
    line = line.replace("to computer trade shows", "to the mountains");
    line = line.replace("Elbot", "YOUR NAME HERE").replace("Robot", "YOUR NAME HERE").replace("Artificial Solutions", "SOMETHING CLEVER ABOUT WHO MADE YOU");
    line = line.replace(hRef, "");
    line = line.replace( hRefClose, "");

    return line;
  }
}
public class Database {
  public  String SMS_DB = "sms.db";
  public  String SMS_TABLE = "message";
  public SQLite db;
 
  public Database(PApplet p) {
    db = new SQLite(p, String.format("%s/%s", DB_PATH_PREFIX, SMS_DB));
    db.setDebug(true);
  }
  public void InsertValue(String table, String column, String value, SQLite db) {
    if (db.connect()) {
      db.execute(String.format("INSERT INTO %s (%s) VALUES(%s)", table, 
      column, value));
      db.close();
    }
  }

  public void InsertRow(String table, HashMap<String, String> data, SQLite db)
  throws Exception {
    if (db.connect()) {
      StringBuilder column = new StringBuilder();
      StringBuilder value = new StringBuilder();
      int count = 0;
      for (String keyString : data.keySet()) {
        if (count == 0) {
          column.append(String.format("'%s'", keyString));
          value.append(String.format("'%s'", data.get(keyString)));
        } 
        else {
          column.append(String.format(",'%s'", keyString));
          value.append(String.format(",'%s'", data.get(keyString)));
        }
        count++;
      }
      db.execute(String.format("INSERT INTO %s (%s) VALUES (%s)", table, column.toString(), value.toString()));
      db.close();
    }
  }

  public void UpdateRowWhere(String table, HashMap<String, String> data, 
  String where, String match, SQLite db) throws Exception {
    if (db.connect()) {
      StringBuilder column = new StringBuilder();
      StringBuilder value = new StringBuilder();
      int count = 0;
      for (String keyString : data.keySet()) {
        if (count == 0) {
          column.append(String.format("'%s'", keyString));
          value.append(String.format("'%s'", data.get(keyString)));
        } 
        else {
          column.append(String.format(",'%s'", keyString));
          value.append(String.format(",'%s'", data.get(keyString)));
        }
        count++;
      }
      db.execute(String.format("INSERT OR REPLACE INTO %s (%s) VALUES (%s)", table, column.toString(), value.toString()));
      db.close();
    }
  }

  public void UpdateIfNullWhere(String table, String column, String value, 
  String where, String whereValue, SQLite db) {
    if (db.connect()) {
      db.execute(String.format(
      "UPDATE %s SET %s=IFNULL(%s, %s) WHERE %s=%s", table, 
      column, column, value, where, whereValue));
      db.close();
    }
  }

  public void UpdateWhere(String table, String column, String value, 
  String where, String whereValue, SQLite db) {
    if (db.connect()) {
      db.execute(String.format("UPDATE %s SET %s = %s WHERE %s=%s", 
      table, column, value, where, whereValue));
      db.close();
    }
  }

  public boolean containsKeyValue(String table, String key, String value, SQLite db) {
    boolean contains = false;
    if (db.connect()) {  
      int count = 0;
      db.query(String.format("SELECT * FROM %s where %s = '%s'", table, key, value));
      while (db.next ()) {
        count++;
      }
      if (count > 0) {
        contains = true;
      }
      db.close();
    }
    //System.out.println(String.format("%s contains %s %b", table, value, contains));
    return contains;
  }

  public HashMap<String, String> getTable(String table, SQLite db) {
    HashMap<String, String> data = new HashMap<String, String>();
    if (db.connect()) {
      db.query(String.format("SELECT * FROM %s", table));
      String[] column = db.getColumnNames();
      while (db.next ()) {
        for (int i = 0; i < column.length; i++) {
          data.put(column[i], db.getString(column[i]));
        }
      }
      db.close();
    }
    return data;
  }
}

