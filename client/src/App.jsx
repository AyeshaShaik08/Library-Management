import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, NavLink, Route, Routes, Navigate } from "react-router-dom";
import api from "./api";
import { AuthContext, AuthProvider } from "./auth/AuthContext";
import Login from "./auth/Login";
import Register from "./auth/Register";

function Dashboard() {
  const [stats, setStats] = useState({ totalBooks: 0, totalMembers: 0, issuedBooks: 0, returnedBooks: 0 });

  useEffect(() => {
    api.get("/transactions/stats").then((res) => setStats(res.data)).catch(() => {});
    api.get("/books").then((res) => setStats((prev) => ({ ...prev, totalBooks: res.data.length }))).catch(() => {});
    api.get("/members").then((res) => setStats((prev) => ({ ...prev, totalMembers: res.data.length }))).catch(() => {});
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
    api.get("/books").then((res) => setBooks(res.data)).catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, quantity: Number(form.quantity) };

    const request = editingId
      ? api.put(`/books/${editingId}`, payload)
      : api.post("/books", payload);

    request
      .then(() => {
        setForm(emptyForm);
        setEditingId("");
        fetchBooks();
      })
      .catch((err) => alert(err.response?.data?.message || "Unable to save book"));
  };

  const handleEdit = (book) => {
    setEditingId(book._id);
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn,
      quantity: book.quantity,
    });
  };

  const handleDelete = (id) => {
    api.delete(`/books/${id}`).then(() => fetchBooks()).catch((err) => alert(err.response?.data?.message || "Unable to delete book"));
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
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.isbn}</td>
                <td>{book.quantity}</td>
                <td>{book.availableQuantity}</td>
                <td className="action-cell">
                  <button type="button" onClick={() => handleEdit(book)}>Edit</button>
                  <button type="button" className="danger" onClick={() => handleDelete(book._id)}>Delete</button>
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
    api.get("/members").then((res) => setMembers(res.data)).catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editingId ? api.put(`/members/${editingId}`, form) : api.post("/members", form);

    request
      .then(() => {
        setForm(emptyForm);
        setEditingId("");
        fetchMembers();
      })
      .catch((err) => alert(err.response?.data?.message || "Unable to save member"));
  };

  const handleEdit = (member) => {
    setEditingId(member._id);
    setForm({ name: member.name, email: member.email, phone: member.phone });
  };

  const handleDelete = (id) => {
    api.delete(`/members/${id}`).then(() => fetchMembers()).catch((err) => alert(err.response?.data?.message || "Unable to delete member"));
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
              <tr key={member._id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>{new Date(member.membershipDate).toLocaleDateString()}</td>
                <td className="action-cell">
                  <button type="button" onClick={() => handleEdit(member)}>Edit</button>
                  <button type="button" className="danger" onClick={() => handleDelete(member._id)}>Delete</button>
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
    api.get("/books").then((res) => setBooks(res.data));
    api.get("/members").then((res) => setMembers(res.data));
    api.get("/transactions").then((res) => setTransactions(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssue = (e) => {
    e.preventDefault();
    api.post("/transactions/issue", issueForm)
      .then(() => {
        setIssueForm({ memberId: "", bookId: "" });
        fetchData();
      })
      .catch((err) => alert(err.response?.data?.message || "Unable to issue book"));
  };

  const handleReturn = (id) => {
    api.put(`/transactions/${id}/return`)
      .then(() => fetchData())
      .catch((err) => alert(err.response?.data?.message || "Unable to return book"));
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
              <option key={member._id} value={member._id}>{member.name}</option>
            ))}
          </select>
          <select name="bookId" value={issueForm.bookId} onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })} required>
            <option value="">Select Book</option>
            {books.filter((book) => book.availableQuantity > 0).map((book) => (
              <option key={book._id} value={book._id}>{book.title}</option>
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
              <tr key={transaction._id}>
                <td>{transaction.bookId?.title || "-"}</td>
                <td>{transaction.memberId?.name || "-"}</td>
                <td>{new Date(transaction.issueDate).toLocaleDateString()}</td>
                <td>{transaction.returnDate ? new Date(transaction.returnDate).toLocaleDateString() : "-"}</td>
                <td>{transaction.status}</td>
                <td>
                  {transaction.status === "Issued" ? (
                    <button onClick={() => handleReturn(transaction._id)}>Return</button>
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
