import React, { useEffect, useState, useContext } from "react";
import { HashRouter as Router, NavLink, Route, Routes, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./auth/AuthContext";
import Login from "./auth/Login";
import Register from "./auth/Register";

const STORAGE_KEYS = {
  books: "library_books",
  members: "library_members",
  transactions: "library_transactions",
};

const defaultBooks = [
  { id: "book-1", title: "The Hobbit", author: "J.R.R. Tolkien", category: "Fantasy", isbn: "9780007118359", quantity: 3, availableQuantity: 3 },
  { id: "book-2", title: "1984", author: "George Orwell", category: "Dystopia", isbn: "9780451524935", quantity: 5, availableQuantity: 5 },
];

const defaultMembers = [
  { id: "member-1", name: "Alice Johnson", email: "alice@example.com", phone: "1234567890", membershipDate: "2025-01-10" },
  { id: "member-2", name: "Bob Smith", email: "bob@example.com", phone: "9876543210", membershipDate: "2025-01-15" },
];

const defaultTransactions = [
  { id: "txn-1", bookId: "book-1", memberId: "member-1", issueDate: "2026-09-01", returnDate: null, status: "Issued" },
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureDemoData() {
  if (!localStorage.getItem(STORAGE_KEYS.books)) {
    writeStorage(STORAGE_KEYS.books, defaultBooks);
  }
  if (!localStorage.getItem(STORAGE_KEYS.members)) {
    writeStorage(STORAGE_KEYS.members, defaultMembers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.transactions)) {
    writeStorage(STORAGE_KEYS.transactions, defaultTransactions);
  }
}

function Dashboard() {
  const [stats, setStats] = useState({ totalBooks: 0, totalMembers: 0, issuedBooks: 0, returnedBooks: 0 });

  useEffect(() => {
    ensureDemoData();

    const books = readStorage(STORAGE_KEYS.books, []);
    const members = readStorage(STORAGE_KEYS.members, []);
    const transactions = readStorage(STORAGE_KEYS.transactions, []);

    setStats({
      totalBooks: books.length,
      totalMembers: members.length,
      issuedBooks: transactions.filter((item) => item.status === "Issued").length,
      returnedBooks: transactions.filter((item) => item.status === "Returned").length,
    });
  }, []);

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="card stat-card"><h3>Total Books</h3><p>{stats.totalBooks}</p></div>
        <div className="card stat-card"><h3>Total Members</h3><p>{stats.totalMembers}</p></div>
        <div className="card stat-card"><h3>Issued Books</h3><p>{stats.issuedBooks}</p></div>
        <div className="card stat-card"><h3>Returned Books</h3><p>{stats.returnedBooks}</p></div>
      </div>
    </div>
  );
}

function BooksPage() {
  const emptyForm = { title: "", author: "", category: "", isbn: "", quantity: "" };
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  const fetchBooks = () => {
    setBooks(readStorage(STORAGE_KEYS.books, []));
  };

  useEffect(() => {
    ensureDemoData();
    fetchBooks();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, quantity: Number(form.quantity), availableQuantity: Number(form.quantity) };
    const currentBooks = readStorage(STORAGE_KEYS.books, []);

    if (editingId) {
      const updatedBooks = currentBooks.map((book) =>
        book.id === editingId ? { ...book, ...payload } : book
      );
      writeStorage(STORAGE_KEYS.books, updatedBooks);
    } else {
      const newBook = { id: `book-${Date.now()}`, ...payload };
      writeStorage(STORAGE_KEYS.books, [...currentBooks, newBook]);
    }

    setForm(emptyForm);
    setEditingId("");
    fetchBooks();
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      quantity: book.quantity,
    });
  };

  const handleDelete = (id) => {
    const remainingBooks = readStorage(STORAGE_KEYS.books, []).filter((book) => book.id !== id);
    writeStorage(STORAGE_KEYS.books, remainingBooks);
    fetchBooks();
  };

  return (
    <div className="page">
      <h1>Books</h1>
      <form className="card form-card" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Book" : "Add Book"}</h3>
        <div className="form-grid">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
          <input name="author" value={form.author} onChange={handleChange} placeholder="Author" required />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
          <input name="isbn" value={form.isbn} onChange={handleChange} placeholder="ISBN" required />
          <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} placeholder="Quantity" required />
        </div>
        <div className="button-row">
          <button type="submit">{editingId ? "Update Book" : "Add Book"}</button>
          {editingId && (
            <button type="button" className="secondary" onClick={() => { setEditingId(""); setForm(emptyForm); }}>Cancel</button>
          )}
        </div>
      </form>

      <div className="card">
        <h3>Book List</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>ISBN</th>
              <th>Qty</th>
              <th>Available</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.isbn}</td>
                <td>{book.quantity}</td>
                <td>{book.availableQuantity}</td>
                <td className="action-cell">
                  <button type="button" onClick={() => handleEdit(book)}>Edit</button>
                  <button type="button" className="danger" onClick={() => handleDelete(book.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MembersPage() {
  const emptyForm = { name: "", email: "", phone: "" };
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  const fetchMembers = () => {
    setMembers(readStorage(STORAGE_KEYS.members, []));
  };

  useEffect(() => {
    ensureDemoData();
    fetchMembers();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentMembers = readStorage(STORAGE_KEYS.members, []);
    const payload = { ...form, membershipDate: new Date().toISOString().slice(0, 10) };

    if (editingId) {
      const updatedMembers = currentMembers.map((member) =>
        member.id === editingId ? { ...member, ...payload } : member
      );
      writeStorage(STORAGE_KEYS.members, updatedMembers);
    } else {
      const newMember = { id: `member-${Date.now()}`, ...payload };
      writeStorage(STORAGE_KEYS.members, [...currentMembers, newMember]);
    }

    setForm(emptyForm);
    setEditingId("");
    fetchMembers();
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setForm({ name: member.name, email: member.email, phone: member.phone });
  };

  const handleDelete = (id) => {
    const remainingMembers = readStorage(STORAGE_KEYS.members, []).filter((member) => member.id !== id);
    writeStorage(STORAGE_KEYS.members, remainingMembers);
    fetchMembers();
  };

  return (
    <div className="page">
      <h1>Members</h1>
      <form className="card form-card" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Member" : "Add Member"}</h3>
        <div className="form-grid">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
        </div>
        <div className="button-row">
          <button type="submit">{editingId ? "Update Member" : "Add Member"}</button>
          {editingId && (
            <button type="button" className="secondary" onClick={() => { setEditingId(""); setForm(emptyForm); }}>Cancel</button>
          )}
        </div>
      </form>

      <div className="card">
        <h3>Member List</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Membership Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>{member.membershipDate}</td>
                <td className="action-cell">
                  <button type="button" onClick={() => handleEdit(member)}>Edit</button>
                  <button type="button" className="danger" onClick={() => handleDelete(member.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TransactionsPage() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [issueForm, setIssueForm] = useState({ memberId: "", bookId: "" });

  const fetchData = () => {
    setBooks(readStorage(STORAGE_KEYS.books, []));
    setMembers(readStorage(STORAGE_KEYS.members, []));
    setTransactions(readStorage(STORAGE_KEYS.transactions, []));
  };

  useEffect(() => {
    ensureDemoData();
    fetchData();
  }, []);

  const handleIssue = (e) => {
    e.preventDefault();
    const booksList = readStorage(STORAGE_KEYS.books, []);
    const selectedBook = booksList.find((book) => book.id === issueForm.bookId);
    if (!selectedBook || selectedBook.availableQuantity <= 0) {
      alert("Selected book is unavailable");
      return;
    }

    const updatedBooks = booksList.map((book) =>
      book.id === issueForm.bookId ? { ...book, availableQuantity: book.availableQuantity - 1 } : book
    );
    writeStorage(STORAGE_KEYS.books, updatedBooks);

    const allTransactions = readStorage(STORAGE_KEYS.transactions, []);
    const newTransaction = {
      id: `txn-${Date.now()}`,
      bookId: issueForm.bookId,
      memberId: issueForm.memberId,
      issueDate: new Date().toISOString().slice(0, 10),
      returnDate: null,
      status: "Issued",
    };

    writeStorage(STORAGE_KEYS.transactions, [...allTransactions, newTransaction]);
    setIssueForm({ memberId: "", bookId: "" });
    fetchData();
  };

  const handleReturn = (id) => {
    const transactionsList = readStorage(STORAGE_KEYS.transactions, []);
    const targetTransaction = transactionsList.find((txn) => txn.id === id);
    if (!targetTransaction) return;

    const updatedTransactions = transactionsList.map((txn) =>
      txn.id === id ? { ...txn, returnDate: new Date().toISOString().slice(0, 10), status: "Returned" } : txn
    );
    writeStorage(STORAGE_KEYS.transactions, updatedTransactions);

    const booksList = readStorage(STORAGE_KEYS.books, []);
    const updatedBooks = booksList.map((book) =>
      book.id === targetTransaction.bookId ? { ...book, availableQuantity: book.availableQuantity + 1 } : book
    );
    writeStorage(STORAGE_KEYS.books, updatedBooks);
    fetchData();
  };

  return (
    <div className="page">
      <h1>Transactions</h1>
      <form className="card form-card" onSubmit={handleIssue}>
        <h3>Issue Book</h3>
        <div className="form-grid">
          <select name="memberId" value={issueForm.memberId} onChange={(e) => setIssueForm({ ...issueForm, memberId: e.target.value })} required>
            <option value="">Select Member</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
          <select name="bookId" value={issueForm.bookId} onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })} required>
            <option value="">Select Book</option>
            {books.filter((book) => book.availableQuantity > 0).map((book) => (
              <option key={book.id} value={book.id}>{book.title}</option>
            ))}
          </select>
        </div>
        <button type="submit">Issue Book</button>
      </form>

      <div className="card">
        <h3>Transaction History</h3>
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Member</th>
              <th>Issue Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{books.find((book) => book.id === transaction.bookId)?.title || "-"}</td>
                <td>{members.find((member) => member.id === transaction.memberId)?.name || "-"}</td>
                <td>{transaction.issueDate}</td>
                <td>{transaction.returnDate || "-"}</td>
                <td>{transaction.status}</td>
                <td>
                  {transaction.status === "Issued" ? (
                    <button onClick={() => handleReturn(transaction.id)}>Return</button>
                  ) : (
                    <span>Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/books" element={<PrivateRoute><BooksPage /></PrivateRoute>} />
      <Route path="/members" element={<PrivateRoute><MembersPage /></PrivateRoute>} />
      <Route path="/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
    </Routes>
  );
}

function Header() {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="topbar">
      {user ? (
        <div className="topbar-content">
          <span>Hello, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : null}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="layout">
          <aside className="sidebar">
            <h2>LIBRARY MANAGEMENT SYSTEM</h2>
            <nav>
              <NavLink to="/" end>Dashboard</NavLink>
              <NavLink to="/books">Books</NavLink>
              <NavLink to="/members">Members</NavLink>
              <NavLink to="/transactions">Transactions</NavLink>
            </nav>
          </aside>

          <main className="main-content">
            <Header />
            <AppRoutes />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
