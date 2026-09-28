const Member = require("../models/Member");

const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch members", error: error.message });
  }
};

const createMember = async (req, res) => {
  try {
    const { name, email, phone, membershipDate } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email and phone are required" });
    }

    const member = await Member.create({
      name,
      email,
      phone,
      membershipDate: membershipDate || new Date(),
    });

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: "Unable to create member", error: error.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const { name, email, phone, membershipDate } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email and phone are required" });
    }

    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.name = name;
    member.email = email;
    member.phone = phone;
    member.membershipDate = membershipDate || member.membershipDate;

    await member.save();
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Unable to update member", error: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete member", error: error.message });
  }
};

module.exports = {
  getAllMembers,
  createMember,
  updateMember,
  deleteMember,
};
