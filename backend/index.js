import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";

const app = express();

// Middleware for parsing request body
app.use(express.json());

app.get("/", (request, respone) => {
  console.log(request);
  return respone.status(234).send("Welcome to MERN");
});

// Route for Save a new Book
app.post("/books", async (request, respone) => {
  try {
    if (!request.body.title || !request.body.author || !request.body.title) {
      return respone.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }
    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
    };

    const book = await Book.create(newBook);
  } catch (error) {
    console.log(error.message);
    respone.status(500).send({ message: error.message });
  }
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App is connected to database");
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
