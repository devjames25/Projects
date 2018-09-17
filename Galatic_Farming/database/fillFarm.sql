


	  
	  
INSERT INTO planet (name, solar_system, population)
VALUES ("Arion", "Anteus", 775000),
	   ("Suaineach", "Gaelica", 2250000),
	   ("Vitellius", "Flavian", 350000),
	   ("Ent", "Tolkien", 1420000),
	   ("Khafra", "Azara", 22100);
	   
	   
	   
INSERT INTO crops (name, price, quantity) 
VALUES ("Nitro Rice", 1.25, 11250),
	   ("Space Beef", 7.45, 1135),
	   ("Astro Chow", 6.15, 1500),
	   ("Milky Corn", 1.70, 12345),
	   ("Solar Garlic", 2.80, 3500),
	   ("Starlight Lavender", 11.50, 500),
	   ("Synthetic Herbs", 1.00, 10000);
	   
	   
	   
INSERT INTO weapon (name, category, price)
VALUES ("Ray Gun", "laser", 150),
	   ("Pulse Rifle", "laser", 300),
	   ("Light Saber", "energy", 1000),
	   ("Dark Bow", "energy", 2500),
	   ("Power Suit", "exoskeleton", 5000),
	   ("Speed Suit", "exoskeleton", 5000);
	   
INSERT INTO space_farmer (fname, lname, experience, homeworld, fav_weapon)
VALUES ("John", "Wayne", 6, (SELECT pid FROM planet WHERE name="Arion"), (SELECT wid FROM weapon WHERE name="Pulse Rifle")),
	   ("Billy", "Ray", 11, (SELECT pid FROM planet WHERE name="Arion"), (SELECT wid FROM weapon WHERE name="Light Saber")),
	   ("Sally", "Kohn", 3, (SELECT pid FROM planet WHERE name="Suaineach"), (SELECT wid FROM weapon WHERE name="Ray Gun")),
	   ("Kim", "Brown", 8, (SELECT pid FROM planet WHERE name="Ent"), (SELECT wid FROM weapon WHERE name="Dark Bow")),
	   ("William", "Buckley", 15, (SELECT pid FROM planet WHERE name="Vitellius"), (SELECT wid FROM weapon WHERE name="Pulse Rifle")),
	   ("Tim", "Allen", 21, (SELECT pid FROM planet WHERE name="Khafra"), (SELECT wid FROM weapon WHERE name="Speed Suit")),
	   ("Sarah", "Silverman", 4, (SELECT pid FROM planet WHERE name="Vitellius"), (SELECT wid FROM weapon WHERE name="Speed Suit")),
	   ("Neal", "Allen", 19, (SELECT pid FROM planet WHERE name="Ent"), (SELECT wid FROM weapon WHERE name="Power Suit")),
	   ("Mike", "Jenkins", 1, (SELECT pid FROM planet WHERE name="Suaineach"), (SELECT wid FROM weapon WHERE name="Pulse Rifle")),
	   ("Andrew", "Jackson", 5, (SELECT pid FROM planet WHERE name="Ent"), (SELECT wid FROM weapon WHERE name="Light Saber"));
	   	   
	   
	   
INSERT INTO aliens (species, description, fav_food, weakness)
VALUES ("Byz'at", "Aggressive, but small like a dog", (SELECT cid FROM crops WHERE name="Milky Corn"), (SELECT wid FROM weapon WHERE name="Pulse Rifle")),
	   ("Xroamt", "Quite slow, but has overpowering strength", (SELECT cid FROM crops WHERE name="Synthetic Herbs"), (SELECT wid FROM weapon WHERE name="Speed Suit")),
	   ("Phaln", "Intelligent and cunning like a human", (SELECT cid FROM crops WHERE name="Nitro Rice"), (SELECT wid FROM weapon WHERE name="Light Saber")),
	   ("Chah'i", "Passive and very timid", (SELECT cid FROM crops WHERE name="Starlight Lavender"), (SELECT wid FROM weapon WHERE name="Ray Gun")),
	   ("Steikhelkue", "Towering giant the size of a skyscraper", (SELECT cid FROM crops WHERE name="Space Beef"), (SELECT wid FROM weapon WHERE name="Dark Bow")),
	   ("Guaffeshae", "Quick and has fiery claws", (SELECT cid FROM crops WHERE name="Solar Garlic"), (SELECT wid FROM weapon WHERE name="Power Suit"));