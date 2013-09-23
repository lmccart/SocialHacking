##Unofficial Google Voice API SMS Bot Processing Example

I wouldn't normally write code like this with so many nested classes.  This is more of a proof of concept demo I ripped out of a project. 

You should change the DB_PATH_PREFIX to point to the directory of you sms.db file or change the code to reference the Sketch's data path. For more information about using SQLite and Processing please reference this [tutorial](http://cs.smith.edu/dftwiki/index.php/Tutorial:_SQLite_and_Processing,_Part_I). 

You will need to supply a Google Voice Username and Password.  You should enter those as the values of USER_NAME and PASSWORD at the top of the sketch. 

You will need to repalce the "REPLACE ME" strings in the response from the NLP bot we are hijacking with interesting phrases.  These items can be found in the Elbot class. 

    line = line.replace("a robot", "REPLACE ME");
    line = line.replace("robot", "REPLACE ME");
    line = line.replace("to computer trade shows", "to the mountains");
    line = line.replace("Elbot", "YOUR NAME HERE").replace("Robot", "YOUR NAME HERE").replace("Artificial Solutions", "SOMETHING CLEVER ABOUT WHO MADE YOU");
    line = line.replace(hRef, "");
    line = line.replace( hRefClose, "");


All dependances are included as JARS.  Please check the [google-voice-java](https://code.google.com/p/google-voice-java/) page for any [updates](https://code.google.com/p/google-voice-java/downloads/list) and [documentation](https://code.google.com/p/google-voice-java/wiki/GettingStarted). 


Please note this paragraph from the [google-voice-java documentation](https://code.google.com/p/google-voice-java/wiki/GettingStarted) and correct your code accordingly. 

    When creating the Voice object, your login details are stored in memory and the Google    Client Login token or "auth" key is obtained. This token is passed back on all subsequent calls. If your programme runs long enough, that token will expire and any further calls to the Voice object will either result in an exception, or HTML for the Google Voice login screen.
  
  
    
