import sys
from socket import *

#Sources used:
#http://www.pythonforbeginners.com/files/reading-and-writing-files-in-python
#https://programminghistorian.org/en/lessons/working-with-text-files
#https://docs.python.org/2/tutorial/inputoutput.html

#Create a socket connection
#References source:https://docs.python.org/2/howto/sockets.html
def createSocket():    
    if sys.argv[3] == "-l":
        numArguments = 4
    elif sys.argv[3] == "-g":                               
        numArguments = 5

    serverPort = int(sys.argv[numArguments])
    serverSocket = socket(AF_INET, SOCK_STREAM)
    serverSocket.bind(("", serverPort))
    serverSocket.listen(1)
    dataSocket, address = serverSocket.accept()
    return dataSocket

#Connects to the server
#References source:https://docs.python.org/2/howto/sockets.html    
def connectServer():                                              
    serverName = sys.argv[1]+".engr.oregonstate.edu"       
   
    serverPort = int(sys.argv[2])                                      
    clientSocket = socket(AF_INET,SOCK_STREAM)              
    
    #Connects the socket to the given server
    clientSocket.connect((serverName, serverPort))              
    
    return clientSocket
    
#get IP address
#References source:http://stackoverflow.com/questions/24196932/how-can-i-get-the-ip-address-of-eth0-in-python
def getIP():
    s = socket(AF_INET, SOCK_DGRAM)     
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]

#Get file from server
def getFile(dataSocket):                   
    f = open(sys.argv[4], "w")    
    buffer = dataSocket.recv(1000)
    
    #Receives data from server while loop runs
    while "__done__" not in buffer:        
        f.write(buffer)
        buffer = dataSocket.recv(1000)
        
#Get directory list from server        
def getList(dataSocket):
    fileName = dataSocket.recv(100)     
    
    #Receives data from server and prints file name
    while fileName != "done":        
        print fileName
        fileName = dataSocket.recv(100)


#Gets data from server
def getData(clientSocket): 
    if sys.argv[3] == "-g":
        print "Reqesting file {}".format(sys.argv[4])   
        portnumber = 5
    elif sys.argv[3] == "-l":
        print "Requesting list."
        portnumber = 4
    
    clientSocket.send(sys.argv[portnumber])     
    
    clientSocket.recv(1024)
    
    if sys.argv[3] == "-g":
        clientSocket.send("g")
    else:
        clientSocket.send("l")
    
    clientSocket.recv(1024)
    
    clientSocket.send(getIP())                  
    response = clientSocket.recv(1024)
    
    if response == "FAIL":                                                       
        print "Invalid command."
        exit(1)
    
    if sys.argv[3] == "-g":
        clientSocket.send(sys.argv[4])
        response = clientSocket.recv(1024)
        if response != "File found":                            
            print "Server did not find the file.'"
            return
    
    dataSocket = createSocket()

    if(sys.argv[3] == "-g"):        #Get file 
        getFile(dataSocket)
    elif sys.argv[3] == "-l":       #Get directory list
        getList(dataSocket)

    
    dataSocket.close()             




if __name__ == "__main__":    
                                                                                
    if len(sys.argv) < 5 or len(sys.argv) > 6:
        print "You must specify either five or six arguments."
        exit(1)
        
    elif (sys.argv[1] != "flip1" and sys.argv[1] != "flip2" and sys.argv[1] != "flip3"):    
        print "Please enter correct server name."
        exit(1)
        
    elif (int(sys.argv[2]) < 1024 or int(sys.argv[2]) > 65535):                                
        print "Please enter a port number in the range 1024-65535"
        exit(1)
        
    elif (sys.argv[3] != "-g" and sys.argv[3] != "-l"):                     
        print "Invalid command. You must specify either -g or -l"
        exit(1)
        
    elif (sys.argv[3] == "-l" and (int(sys.argv[4])  < 1024 or int(sys.argv[4]) > 65535)):        
        print "Please enter correct port number."
        exit(1)
        
    elif (sys.argv[3] == "-g" and (int(sys.argv[5]) < 1024 or int(sys.argv[5]) > 65535)):        
        print "Please enter correct port number."
        exit(1)
    
    clientSocket = connectServer()  
    
    
    getData(clientSocket)                
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
