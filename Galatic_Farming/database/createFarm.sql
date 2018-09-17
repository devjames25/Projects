
DROP TABLE IF EXISTS `planet`;
DROP TABLE IF EXISTS `crops`;
DROP TABLE IF EXISTS `weapon`;
DROP TABLE IF EXISTS `space_farmer`;
DROP TABLE IF EXISTS `aliens`;


CREATE TABLE `planet` (
	pid INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	solar_system VARCHAR(255),
	population INT(11)
) ENGINE=InnoDB;


CREATE TABLE `crops` (
	cid INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	price FLOAT(11),
	quantity INT(11)
) ENGINE=InnoDB;


CREATE TABLE `weapon` (
	wid INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
	category VARCHAR(255),
	price INT(11)
) ENGINE=InnoDB;


CREATE TABLE `space_farmer` (
	sfid INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	fname VARCHAR(255) NOT NULL,
	lname VARCHAR(255),
	experience INT(11),
	homeworld INT(11),
	fav_weapon INT(11),
	FOREIGN KEY(homeworld) REFERENCES planet(pid)
	 ON DELETE CASCADE
     ON UPDATE CASCADE,
    FOREIGN KEY(fav_weapon) REFERENCES weapon(wid)
	 ON DELETE CASCADE
     ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `aliens` (
	aid INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	species VARCHAR(255) NOT NULL,
	description VARCHAR(255),
	fav_food INT(11),
	weakness INT(11),
	FOREIGN KEY(fav_food) REFERENCES crops(cid)
	 ON DELETE CASCADE
     ON UPDATE CASCADE,
	FOREIGN KEY(weakness) REFERENCES weapon(wid)
	 ON DELETE CASCADE
     ON UPDATE CASCADE,
) ENGINE=InnoDB;