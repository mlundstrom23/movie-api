CREATE DATABASE movies_api;
USE movies_api;
CREATE TABLE movies (
    id INT AUTO_INCREMENT,
    title VARCHAR(255),
    releaseDate VARCHAR(10),
    rating VARCHAR(10),
    runTime VARCHAR(10),
    createdAt DATETIME DEFAULT NOW(),
    updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW(),
    deletedAt DATETIME DEFAULT NOW(),
    PRIMARY KEY(id)
);

CREATE TABLE directors (
  id INT AUTO_INCREMENT,
  director VARCHAR(255),
  createdAt DATETIME DEFAULT NOW(),
  updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW(),
  deletedAt DATETIME DEFAULT NOW(),
  PRIMARY KEY(id)
);

CREATE TABLE genres (
  id INT AUTO_INCREMENT,
  genre VARCHAR(255),
  createdAt DATETIME DEFAULT NOW(),
  updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW(),
  deletedAt DATETIME DEFAULT NOW(),
  PRIMARY KEY(id)
);

CREATE TABLE movieDirectors (
  movieId INT NOT NULL,
  directorId INT NOT NULL,
  createdAt DATETIME DEFAULT NOW(),
  updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW(),
  deletedAt DATETIME DEFAULT NOW(),
  PRIMARY KEY (movieId, directorId),
  FOREIGN KEY (movieId) REFERENCES movies(id),
  FOREIGN KEY (directorId) REFERENCES directors(id)
);

CREATE TABLE movieGenres (
  movieId INT NOT NULL,
  genreId INT NOT NULL,
  createdAt DATETIME DEFAULT NOW(),
  updatedAt DATETIME DEFAULT NOW() ON UPDATE NOW(),
  deletedAt DATETIME DEFAULT NOW(),
  PRIMARY KEY (movieId, genreId),
  FOREIGN KEY (movieId) REFERENCES movies(id),
  FOREIGN KEY (genreId) REFERENCES genres(id)
);

