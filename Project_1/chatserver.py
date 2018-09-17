import sys
from socket import *

def chat(connection, clientName, userName):
	recvMessage = ""
	while 1:            #Loop runs till chat ends
		receive = connection.recv(501)[0:-1]
		if receive == "": #Waits for a new connection if nothing is received
			print "Waiting for a new connection"
			break

		print "{}> {}".format(clientName, receive) #Fills {} with clientName and message received
		sending = ""
		while len(sending) > 500 or len(sending) == 0: #While string is less than 500 or equal to 0, fill string with input from command line
			sending = raw_input("{}>".format(userName)) #Fills {} with userName 
		if sending == "\quit":      #Quits chat if quit is typed in command line
			print "Your connection has ended"
			break
		connection.send(sending)
			
def saveUser(connection, userName):     #Returns the client user name for server use
	clientName = connection.recv(1024)
	connection.send(userName)
	return clientName
	
if __name__ == "__main__":
	#Prompts message and exits program, if number of arguments is not 2
	if len(sys.argv) != 2:
        	print "MUST enter an available port number to run server"
		exit(1)

	portNumber = sys.argv[1]
	newSocket = socket(AF_INET, SOCK_STREAM)         #Socket functions are taken from https://docs.python.org/2/howto/sockets.html
    	newSocket.bind(('', int(portNumber)))           
    	newSocket.listen(1)         
    	userName = ""
    	while len(userName) > 10 or len(userName) == 0:     #While userName is less than 10 or equal to 0, fill userName with input from command line
        	userName = raw_input("Enter a username that is 10 characters or less. ")
        	print "Server is  ready for messages."
    	while 1:       #Loops untill connection is ended
         	connection, address = newSocket.accept()                         
        	print "Connected at address {}".format(address)
        
        	chat(connection, saveUser(connection, userName), userName)
        
        	connection.close()
        
        
        

	
