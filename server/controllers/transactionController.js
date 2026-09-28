const Book = require("../models/Book");
const Member = require("../models/Member");
const Transaction = require("../models/Transaction");

const issueBook = async (req, res) => {
  try {
    const { memberId, bookId } = req.body;

    if (!memberId || !bookId) {
      return res.status(400).json({ message: "Member and book are required" });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableQuantity <= 0) {
      return res.status(400).json({ message: "Cannot issue book. No copies available." });
    }

    const existingActiveIssue = await Transaction.findOne({
      bookId,
      status: "Issued",
    });

    if (existingActiveIssue) {
      return res.status(400).json({ message: "This book is already issued and not returned yet." });
    }

    const transaction = await Transaction.create({
      bookId,
      memberId,
      issueDate: new Date(),
      returnDate: null,
      status: "Issued",
    });

    book.availableQuantity -= 1;
    await book.save();

    res.status(201).json({
      message: "Book issued successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to issue book", error: error.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status === "Returned") {
      return res.status(400).json({ message: "This book has already been returned" });
    }

    const book = await Book.findById(transaction.bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.availableQuantity += 1;
    transaction.returnDate = new Date();
    transaction.status = "Returned";

    await book.save();
    await transaction.save();

    res.json({
      message: "Book returned successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to return book", error: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .populate("bookId")
      .populate("memberId");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch transactions", error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalMembers = await Member.countDocuments();
    const issuedBooks = await Transaction.countDocuments({ status: "Issued" });
    const returnedBooks = await Transaction.countDocuments({ status: "Returned" });

    res.json({
      totalBooks,
      totalMembers,
      issuedBooks,
      returnedBooks,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch dashboard stats", error: error.message });
  }
};

module.exports = {
  issueBook,
  returnBook,
  getAllTransactions,
  getDashboardStats,
};
