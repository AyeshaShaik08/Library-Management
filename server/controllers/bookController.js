const Book = require("../models/Book");

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch books", error: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, category, isbn, quantity } = req.body;

    if (!title || !author || !category || !isbn || quantity === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (Number(quantity) < 0) {
      return res.status(400).json({ message: "Quantity must be greater than or equal to 0" });
    }

    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: "A book with this ISBN already exists" });
    }

    const newBook = await Book.create({
      title,
      author,
      category,
      isbn,
      quantity: Number(quantity),
      availableQuantity: Number(quantity),
    });

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Unable to create book", error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { title, author, category, isbn, quantity } = req.body;

    if (!title || !author || !category || !isbn || quantity === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (Number(quantity) < 0) {
      return res.status(400).json({ message: "Quantity must be greater than or equal to 0" });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const normalizedQuantity = Number(quantity);
    const availableDelta = normalizedQuantity - book.quantity;
    book.title = title;
    book.author = author;
    book.category = category;
    book.isbn = isbn;
    book.quantity = normalizedQuantity;
    book.availableQuantity = Math.min(
      Math.max(book.availableQuantity + availableDelta, 0),
      normalizedQuantity
    );

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Unable to update book", error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete book", error: error.message });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
};
