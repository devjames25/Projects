To run this program, the cleint and the server must be on different servers(different versions of flip). I used flip2 and flip3 for testing/

In order to compile ftserver.c, type make to run the Makefile. After that type ftserver <port number> to start the server and await the client.
Ex: ftserver 13000

In order to compile the client, type chmod +x ftclient.py.

In order to get the directory list, type python ftclient.py <server name> <port number> -l <data port>
Ex: python ftclient.py flip3 13000 -l 13003
Extra: data port should be close to port number 


In order to get a single file, type python ftclient.py <server name> <port number> -g <file name> <data port>
Ex: python ftclient.py flip3 13000 -g notes.txt 13003


