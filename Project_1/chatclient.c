#include <stdio.h>
#include <sys/socket.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <string.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <unistd.h>
#include <netdb.h>

//Alot of this program references Beej's guide with a little help from geeksforgeeks.org

//Creates the address information
//References Beej's guide
struct addrinfo* createAddress(char* address, char* port){
	struct addrinfo hints;
	struct addrinfo *res;
	int rv;
	
	memset(&hints, 0, sizeof hints);
	hints.ai_family = AF_INET;
	hints.ai_socktype = SOCK_STREAM;

	if ((rv = getaddrinfo(address, port, &hints, &res)) != 0) {
		fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(rv));
		exit(1);
	}
	
	return res;

}

//This function creates a socket with the address info
//References Beej's Guide 
int createSocket(struct addrinfo* res){
	int sockfd;
	
	if((sockfd = socket(res->ai_family, res->ai_socktype, res->ai_protocol)) == -1){
		fprintf(stderr, "Error. Not created.\n");
		exit(1);
	}
	return sockfd;
	
}
//This functioon connects the socket with the address info
//References Beej's Guide
void connectSocket(int socketfd, struct addrinfo *res){
	int status;
	if((status = connect(socketfd, res->ai_addr, res->ai_addrlen)) == -1){
		fprintf(stderr, "Error.\n");
		exit(1);
	}
}

//This function connects the client with the server and sends a string input to the server.
void chat(int sockfd, char* username, char* servername){
	int state;
	int bytes = 0;
	
	char inputChars[500];
	memset(inputChars, 0, sizeof(inputChars));	
	char outputChars[500];
	memset(outputChars, 0, sizeof(outputChars));
	
	fgets(inputChars, 500, stdin);
	
	while(1){
		printf("%s>", username);
		fgets(inputChars, 500, stdin);
		
		if(strcmp(inputChars, "\\quit\n") == 0){
			break;
		}
		
		bytes = send(sockfd, inputChars, strlen(inputChars),0);
			if(bytes == -1){
				fprintf(stderr, "Error. Data was not sent properly.\n");
				exit(1);
		}
		
	state = recv(sockfd, outputChars, 500, 0);      //Receives the data from the server. References Beej's Guide
		
		if (state == -1){
			fprintf(stderr, "Error. Data not received properly\n");
			exit(1);
		}
        
		else if (state == 0){                              //Server ended the program
			printf("Program ended by server.\n");
			break;
		}
		else{                                                       
			printf("%s> %s\n", servername, outputChars); //Prints string data from server
		}
		
		memset(inputChars, 0, sizeof(inputChars));      
		memset(outputChars, 0, sizeof(outputChars));
	}
	
	close(sockfd);                                  
	printf("Connection is now closed.\n");
	
}

//This function sends the userName from the client to ther server and receives the servername from the server 
void greeting(int sockfd, char * username, char * servername){
	
 	int sendingcode = send(sockfd, username, strlen(username), 0);
	
	int receivingcode = recv(sockfd, servername, 10, 0);
}

int main(int argc, char *argv[]){
	char userName[10];
	char serverName[10];
	
        //Stopps program from running if the server name and port number isn't entered
	if(argc != 3){
		fprintf(stderr, "MUST RUN: ./chat [server] [port]\n");
		exit(1);
	}
	
	printf("Enter user's name(10 character limit):");
	scanf("%s", userName);
	
        //argv[1] is the server name like flip3 and argv[2] is the port number like 0000
	struct addrinfo* res = createAddress(argv[1], argv[2]);
	
	int socketfd = createSocket(res);
	connectSocket(socketfd, res);
	
	greeting(socketfd, userName, serverName);
	chat(socketfd, userName, serverName);
	freeaddrinfo(res); //All finished with this structure. References Beej's Guide

}
