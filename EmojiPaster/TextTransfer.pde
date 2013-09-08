import java.awt.datatransfer.*;
import java.awt.Toolkit;
import java.io.*;

public final class TextTransfer implements ClipboardOwner {
  public void lostOwnership( Clipboard aClipboard, Transferable aContents) {
  }
  public void setClipboardContents( String aString ) {
    StringSelection stringSelection = new StringSelection( aString );
    Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    clipboard.setContents( stringSelection, this );
  }
  public String getClipboardContents() {
    String result = "";
    Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    Transferable contents = clipboard.getContents(null);
    if ((contents != null) && contents.isDataFlavorSupported(DataFlavor.stringFlavor)) {
      try {
        result = (String)contents.getTransferData(DataFlavor.stringFlavor);
      }
      catch (UnsupportedFlavorException ex) {
        System.out.println(ex);
        ex.printStackTrace();
      }
      catch (IOException ex) {
        System.out.println(ex);
        ex.printStackTrace();
      }
    }
    return result;
  }
} 

