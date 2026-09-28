const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      trim: true,
      unique: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity must be greater than or equal to 0"],
      default: 0,
    },
    availableQuantity: {
      type: Number,
      min: [0, "Available quantity must be greater than or equal to 0"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.pre("save", function (next) {
  if (this.availableQuantity === undefined || this.availableQuantity === null) {
    this.availableQuantity = this.quantity;
  }

  if (this.availableQuantity > this.quantity) {
    this.availableQuantity = this.quantity;
  }

  next();
});

module.exports = mongoose.model("Book", bookSchema);
