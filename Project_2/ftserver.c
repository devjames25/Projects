#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <dirent.h>
#include <unistd.h>
#include <fcntl.h>

//Creates the address information
////References Beej's guide
struct addrinfo * createAddress(char * port){
	int status;
	struct addrinfo hints;
	struct addrinfo * res;
	
	memset(&hints, 0, sizeof hints);
	hints.ai_family = AF_INET;
	hints.ai_socktype = SOCK_STREAM;
	hints.ai_flags = AI_PASSIVE;

	if((status = getaddrinfo(NULL, port, &hints, &res)) != 0){
		fprintf(stderr,
				"getaddrinfo error: %s\nDid you enter the correct IP/Port?\n",
				gai_strerror(status));
		exit(1);
	}
	
	return res;
}

//Creates address info with the IP
//References Beej's guide
struct addrinfo * createAddressIP(char * address, char * port){
	int status;
	struct addrinfo hints;
	struct addrinfo * res;
	
	memset(&hints, 0, sizeof hints);
	hints.ai_family = AF_INET;
	hints.ai_socktype = SOCK_STREAM;

	if((status = getaddrinfo(address, port, &hints, &res)) != 0){
		fprintf(stderr,
				"getaddrinfo error: %s\nDid you enter the correct IP/Port?\n",
				gai_strerror(status));
		exit(1);
	}
	
	return res;
}

//Creates socket with address info
//References Beej's Guide
int createSocket(struct addrinfo * res){
	int sockfd;
	if ((sockfd = socket((struct addrinfo *)(res)->ai_family, res->ai_socktype, res->ai_protocol)) == -1){
		fprintf(stderr, "Error in creating socket\n");
		exit(1);
	}
	return sockfd;
}

//Connects socket to the address info given
//References Beej's Guid
void connectSocket(int sockfd, struct addrinfo * res){
	int status;
	if ((status = connect(sockfd, res->ai_addr, res->ai_addrlen)) == -1){
		fprintf(stderr, "Error in connecting socket\n");
		exit(1);
	}
}

//Binds socket to a port
////References Beej's guide
void bindSocket(int sockfd, struct addrinfo * res){
	if (bind(sockfd, res->ai_addr, res->ai_addrlen) == -1) {
		close(sockfd);
		fprintf(stderr, "Error in binding socket\n");
		exit(1);
	}
}

//Listens to incoming port
//References Beej's guide
void listenSocket(int sockfd){
	if(listen(sockfd, 5) == -1){
		close(sockfd);
		fprintf(stderr, "Error in listening on socket\n");
		exit(1);
	}
}

//Creates and returns an array of char  
char ** createArray(int size){
	char ** array = malloc(size*sizeof(char *));
	int i;
	for(i = 0; i < size; i++){
		array[i] = malloc(100*sizeof(char));
		memset(array[i],0,sizeof(array[i]));
	}
	return array;
}

//Deletes the char array
void deleteArray(char ** array, int size){
	int i;
	for (i = 0; i < size; i++){
		free(array[i]);
	}
	free(array);
}


//Gets the number of files in the directory, puts them in a char array, and returns the total number of files
//References source: https://stackoverflow.com/questions/11736060/how-to-read-all-files-in-a-folder-using-c 
int getFiles(char ** files){
	DIR * d;
	struct dirent * dir;
	d = opendir(".");
	int i = 0;
	if (d){
		while ((dir = readdir(d)) != NULL){
			if (dir->d_type == DT_REG){
				strcpy(files[i], dir->d_name);
				i++;
			}
		}
		closedir(d);
	}
	return i;
}

//Checks if file exist in the directory 
//References source: http://www.zentut.com/c-tutorial/c-file-exists/
int fileExist(char ** files, int numFiles, char * fileName){
	int fileExists = 0;
	int i;
	
	for (i = 0; i < numFiles; i++){
		if(strcmp(files[i], fileName) == 0){
			fileExists = 1;
		}
	}
	return fileExists;
}

//Sends the file to the client requesting
//References source: https://stackoverflow.com/questions/2014033/send-and-receive-a-file-in-socket-programming-in-linux-with-c-c-gcc-g
void sendFile(char * addressIP, char * port, char * fileName){

	sleep(2);
	struct addrinfo * res = createAddressIP(addressIP, port);
	int dataSocket = createSocket(res);
	connectSocket(dataSocket, res);
	
	char buffer[1000];
	
	memset(buffer, 0, sizeof(buffer));
	
	int fd = open(fileName, O_RDONLY);
	while (1) {
		
		int bytes_read = read(fd, buffer, sizeof(buffer)-1);
		if (bytes_read == 0) 
			break;

		if (bytes_read < 0) {
			fprintf(stderr, "Error reading file\n");
			return;
		}

		void *p = buffer;
		while (bytes_read > 0) {
			int bytes_written = send(dataSocket, p, sizeof(buffer),0);
			if (bytes_written < 0) {
				fprintf(stderr, "Error writing to socket\n");
				return;
			}
			bytes_read -= bytes_written;
			p += bytes_written;
		}
		
		memset(buffer, 0, sizeof(buffer));
	}
	
	memset(buffer, 0, sizeof(buffer));
	strcpy(buffer, "__done__");
	send(dataSocket, buffer, sizeof(buffer),0);
	
	close(dataSocket);
	freeaddrinfo(res);
}

//Sends the directory list to the client
//References source: https://stackoverflow.com/questions/2014033/send-and-receive-a-file-in-socket-programming-in-linux-with-c-c-gcc-g
void sendDirectory(char * addressIP, char * port, char ** files, int numFiles){
	sleep(2);
	struct addrinfo * res = createAddressIP(addressIP, port);
	int dataSocket = createSocket(res);
	connectSocket(dataSocket, res);
	
	int i;
	for (i = 0; i < numFiles; i++){
		send(dataSocket, files[i], 100,0);
	}

	char * done = "done";
	send(dataSocket, done, strlen(done),0);
	
	close(dataSocket);
	freeaddrinfo(res);
}

//Get and handles the request from client
//References Beej's guide
void getRequest(int new_fd){

	char * pass = "PASS";
	char * fail = "FAIL";
	char port[100];
	memset(port, 0, sizeof(port));
	recv(new_fd, port, sizeof(port)-1, 0);
	
	send(new_fd, pass, strlen(pass),0);
	
	char command[100];
	memset(command,0,sizeof(command));
	recv(new_fd, command, sizeof(command)-1, 0);
	
	send(new_fd, pass, strlen(pass),0);
	
	char addressIP[100];
	memset(addressIP,0,sizeof(addressIP));
	recv(new_fd, addressIP, sizeof(addressIP)-1,0);
	
	printf("Incoming connection from %s\n", addressIP);
	
	if(strcmp(command,"l") == 0){
		
		send(new_fd, pass, strlen(pass),0);
		printf("File list requested on port %s\n", port);
		printf("Sending file list to %s on port %s\n", addressIP, port);
		
		char ** files = createArray(100);
		
		int numFiles = getFiles(files);
		
		sendDirectory(addressIP, port, files, numFiles);
		
		deleteArray(files,100);
	}
	else if(strcmp(command, "g") == 0){
		
		send(new_fd, pass, strlen(pass),0);
		
		char fileName[100];
		memset(fileName, 0, sizeof(fileName));
		recv(new_fd, fileName, sizeof(fileName)-1,0);
		printf("File: %s requested on port %s\n", fileName, port);
		
		char ** files = createArray(100);
		int numFiles = getFiles(files);
		int fileExists = fileExist(files, numFiles, fileName);

		if(fileExists){
			
			printf("File found, sending %s to client\n", fileName);
			char * fileFound = "File found";
			send(new_fd, fileFound, strlen(fileFound),0);
			
			char newFileName[100];
			memset(newFileName,0,sizeof(newFileName));
			strcpy(newFileName, "./");
			char * backOfFile = newFileName + strlen(newFileName);
			backOfFile += sprintf(backOfFile, "%s", fileName);
			
			sendFile(addressIP, port, newFileName);
		}
		else{
			printf("File not found, sending error message to client\n");
			char * fileNotFound = "File not found";
			send(new_fd, fileNotFound, 100, 0);
		}
		deleteArray(files, 100);
	}
	else{
		send(new_fd, fail, strlen(fail), 0);
		printf("Invalid command sent\n");
	}
	
	printf("Stilling waiting for incoming connections\n");
}

//Waits for socket connection between client and server
void waitConnection(int sockfd){
	
	struct sockaddr_storage their_addr;
	
    socklen_t addr_size;
	
	int new_fd;
	
	while(1){
		
		addr_size = sizeof(their_addr);
		
		new_fd = accept(sockfd, (struct addrinfo *)&their_addr, &addr_size);
		
		if(new_fd == -1){
			
			continue;
		}
		
		getRequest(new_fd);
		close(new_fd);
	}
}


int main(int argc, char *argv[]){
	if(argc != 2){
		fprintf(stderr, "Invalid number of arguments\n");
		exit(1);
	}
	printf("Server open on port %s\n", argv[1]);
	struct addrinfo * res = createAddress(argv[1]);

	int sockfd = createSocket(res);
	bindSocket(sockfd, res);
	listenSocket(sockfd);

	waitConnection(sockfd);
	freeaddrinfo(res);
}
