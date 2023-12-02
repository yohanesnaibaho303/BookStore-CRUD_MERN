import express, { response } from "express";
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

// Route for Get All Books from database
app.get("/books", async (request, respone) => {
  try {
    const books = await Book.find({});

    return respone.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    respone.status(500).send({ message: error.message });
  }
});

// Route for Get One Books from database by ID
app.get("/books/:id", async (request, respone) => {
  try {
    const { id } = request.params;

    const book = await Book.findById(id);

    return respone.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    respone.status(500).send({ message: error.message });
  }
});

// Route for Update a Book
app.put("/books/:id", async (request, respone) => {
  try {
    if (!request.body.title || !request.body.author || !request.body.title) {
      return respone.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }

    const { id } = request.params;

    const result = await Book.findByIdAndUpdate(id, request.body);

    if (!result) {
      return respone.status(404).json({ message: "Book Not Found" });
    }

    return respone.status(200).send({ message: "Book Updated Successfully" });
  } catch (error) {
    console.log(error.message);
    respone.status(500).send({ message: error.message });
  }
});

// Route for Delete a Book
app.delete("/books/:id", async (request, respone) => {
  try {
    const { id } = request.params;
    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return respone.status(404).json({ message: "Book Not Found" });
    }

    return respone.status(200).send({ message: "Book Deleted Successfully" });
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
