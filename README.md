# 俊之网络工作室

---

*bi20200601163937*

## j4https.java

```java
import java.io.*;
import java.net.*;
import java.util.*;

public class j4https {
	private static char PORT = 8888;
	private static String PAGE = "index.html";
	private static String PATH = System.getProperty("user.dir");
	private static final String VERSION_INFO = "j4https 1.0.3.3 - bi20200215175285";
	private static final String[][] TYPE = {
		{"image/gif", ".gif"},
		{"image/jpeg", ".jpeg"},
		{"image/jpeg", ".jpg"},
		{"image/png", ".png"},
		{"text/css", ".css"},
		{"text/html", ".htm"},
		{"text/html", ".html"},
		{"text/javascript", ".js"},
		{"text/xml", ".xml"},
		{"text/xsl", ".xsl"}
	};

	public static void main(String[] args) {
		try {
			for(int i = 0; i < args.length; i++) {
				if(args[i].toLowerCase().startsWith("-page:")) {
					PAGE = args[i].substring(6);
					continue;
				}

				if(args[i].toLowerCase().startsWith("-path:")) {
					PATH = args[i].substring(6);
					continue;
				}

				if(args[i].toLowerCase().startsWith("-port:")) {
					PORT = (char)Integer.valueOf(args[i].substring(6)).intValue();
				}
			}

			ServerSocket ss = new ServerSocket(PORT);
			System.out.println(VERSION_INFO);

			while(true) {
				Socket s = ss.accept();
				BufferedReader br = new BufferedReader(new InputStreamReader(s.getInputStream()));
				doSwitch(s, br.readLine());
				br.close();
				s.close();
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
	}

	private static void doSwitch(Socket skt, String url) {
		if(url == null) {
			return;
		} else {
			System.out.println("[" + new Date() + "] " + url);
			String s = url.substring(url.indexOf('/') + 1, url.lastIndexOf('/') - 5);
			url = s.equals("") ? PAGE : s;
		}

		for(int i = 0; i < TYPE.length; i++) {
			if(url.toLowerCase().endsWith(TYPE[i][1])) {
				doTransfer(skt, TYPE[i][0], url);
				return;
			}
		}

		isNotFound(skt);
	}

	private static void doTransfer(Socket skt, String TYPE, String PAGE) {
		File f = new File(PATH + File.separator + PAGE);
		try(
			  FileInputStream fis = new FileInputStream(f);
			  PrintStream ps = new PrintStream(skt.getOutputStream());
			) {
			Long l = f.length();
			byte[] b = new byte[l.intValue()];

			ps.println("HTTP/1.1 200 OK");
			ps.println("Content-Type:" + TYPE);
			ps.println("Content-Length:" + l);
			ps.println("Server:" + VERSION_INFO);
			ps.println("Date:" + new Date());
			ps.println();

			fis.read(b);

			ps.write(b);
			ps.flush();
		} catch(IOException e) {
			isNotFound(skt);
		}
	}

	private static void isNotFound(Socket skt) {
		try(PrintWriter pw = new PrintWriter(skt.getOutputStream())) {
			pw.println("HTTP/1.0 404 Not found");
			pw.println("Server:" + VERSION_INFO);
			pw.println("Date:" + new Date());
			pw.println();
			pw.flush();
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
}
```



## j4zip.java

```java
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.zip.*;

public class j4zip {
  private static final String VERSION_INFO = "j4zip 1.0.1.1 - bi20190827152651";

  public static void main(String[] args) throws Exception {
    if(args.length > 0) {
      for(String s : args) {
        zipack(new File(s));
      }
    }

    System.out.println(VERSION_INFO);
    System.exit(0);
  }

  private static void zipack(File src) throws Exception {
    System.out.println(src.getName() + " (");
    SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
    FileOutputStream fos = new FileOutputStream(src.getName() + " " + sdf.format(new Date()) + "b2.zip");
    CheckedOutputStream cos = new CheckedOutputStream(fos, new CRC32());

    ZipOutputStream zos = new ZipOutputStream(cos);
    zos.setComment(VERSION_INFO);
    zos.setLevel(Deflater.BEST_COMPRESSION);
    zos.setMethod(ZipOutputStream.DEFLATED);
    zipack(src, src.isDirectory() ? "" : src.getName(), zos);
    zos.close();

    cos.close();
    fos.close();
    System.out.println(")\r\n");
  }

  private static void zipack(File src, String path, ZipOutputStream zos) throws Exception {
    if(src.isDirectory()) {
      path += path.equals("") ? "" : File.separator;

      for(File f : src.listFiles()) {
        zipack(f, path + f.getName(), zos);
      }
    }

    if(src.isFile()) {
      zos.putNextEntry(new ZipEntry(path));
      System.out.println(path);

      Long l = src.length();
      byte[] b = new byte[l.intValue()];
      FileInputStream fis = new FileInputStream(src);
      fis.read(b);
      fis.close();

      zos.write(b);
      zos.flush();
      zos.closeEntry();
    }
  }
}
```



## setip.101.131.bat

```bat
@echo off&title %~n0 - bi20200122105316

call:lookup "Ethernet adapter"
if "%nic%"=="" (call:lookup "本地连接")
if "%nic%"=="" (call:lookup "以太网适配器")

for /f "delims=. tokens=1,2,3" %%l in ("%~n0") do (
  if "%nic%"=="" (nic=%%l)
  netsh interface ip set addr "%nic%" static 192.168.%%m.%%n 255.255.255.0 192.168.%%m.1
  netsh interface ip set dns "%nic%" static 101.198.198.198 primary validate=no
  netsh interface ip add dns "%nic%" 219.141.136.10 validate=no
)

cls
ipconfig /all
pause
exit

:lookup
for /f "tokens=2*" %%i in ('ipconfig /all^|find %1') do set name=%%i
for /f "tokens=1* delims=:" %%i in ("%name%") do set nic=%%i
```



## DNSet.bat

```bat
@echo off&title %~n0 - bi20200217133734

call:lookup "Ethernet adapter"
if "%nic%"=="" (call:lookup "本地连接")
if "%nic%"=="" (call:lookup "以太网适配器")

netsh interface ip set dns "%nic%" static 101.198.198.198 primary validate=no
netsh interface ip add dns "%nic%" 219.141.136.10 validate=no

cls
ipconfig /all
pause
exit

:lookup
for /f "tokens=2*" %%i in ('ipconfig /all^|find %1') do set name=%%i
for /f "tokens=1* delims=:" %%i in ("%name%") do set nic=%%i
```



&copy; 2000 - 2020 Junet Workshop. All rights reserved.
