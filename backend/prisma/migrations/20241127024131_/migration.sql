-- CreateTable
CREATE TABLE "driver" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vehicle" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT NOT NULL,
    "tax" DECIMAL NOT NULL,
    "km" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ride" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer_id" INTEGER NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "distance" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "value" DECIMAL NOT NULL,
    "date" DATETIME NOT NULL,
    "driver_id" INTEGER NOT NULL,
    CONSTRAINT "ride_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "driver" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO driver (name, description, vehicle, rating, comment, tax, km)
VALUES 
  ('Homer Simpson', 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios). ', 'Plymouth Valiant 1973 rosa e enferrujado ', 2,'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts. ', 2.50, 1),
  ('Dominic Toretto', 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada. ', 'Dodge Charger R/T 1970 modificado ', 4,'Que viagem incrível! O carro é um show à parte e o motorista, apesar de ter uma cara de poucos amigos, foi super gente boa. Recomendo! ', 5.0, 5),
  ('James Bond', 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem. ', 'Aston Martin DB5 clássico ', 5, 'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto. ', 10.0, 10);