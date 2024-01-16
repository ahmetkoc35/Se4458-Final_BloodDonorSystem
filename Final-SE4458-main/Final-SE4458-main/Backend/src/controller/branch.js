const db = require('../database');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const secret = '91bd5038a3661bdf9a339ca9d2262c9d';
const expirationTime = 86400; // 24 hours in seconds




async function createBranch(req, res) {
    try {
        const branchData = req.body;
        const hash = await bcrypt.hash(branchData.Password, 10);
        const result = await db.query("INSERT INTO branch (BranchName, Password) VALUES (?, ?)", [branchData.BranchName, hash]);
        return res.status(201).json("Branch created successfully.");
    } catch (error) {
        console.error('Error creating branch:', error);
        return res.status(500).json({ error: 'Failed to create branch.' });
    }
}

async function getBranches(req, res) {
    try {
        const result = await db.query("SELECT * FROM branch");
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error getting branches:', error);
        return res.status(500).json({ error: 'Failed to get branches.' });
    }
}

async function getBranch(req, res) {
    try {
        const branchId = req.params.id;
        const result = await db.query("SELECT * FROM branch WHERE BranchID = ?", [branchId]);
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error getting branch:', error);
        return res.status(500).json({ error: 'Failed to get branch.' });
    }
}

async function updateBranch(req, res) {
    try {
        const branchData = req.body;

        const result = await db.query("UPDATE branch SET BranchName = ?, Authentication = ? WHERE BranchID = ?", [branchData.BranchName, branchData.Authentication, branchData.BranchID]);
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating branch:', error);
        return res.status(500).json({ error: 'Failed to update branch.' });
    }
}


async function deleteBranch(req, res) {
    try {
        const branchId = req.params.id;
        const result = await db.query("DELETE FROM branch WHERE BranchID = ?", [branchId]);
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting branch:', error);
        return res.status(500).json({ error: 'Failed to delete branch.' });
    }
}

async function login(req, res) {
    try {
        const branchData = req.body;
        const result = await db.query("SELECT * FROM branch WHERE BranchName = ?", [branchData.BranchName]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Incorrect branch name or password' });
        }
        const branch = result.rows[0];
        
        if (!await bcrypt.compare(branchData.Password, branch.password)) {
            return res.status(401).json({ error: 'Incorrect branch name or password' });
        }

        const token = jwt.sign({ id: branch.BranchID }, secret, { expiresIn: expirationTime });
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in branch:', error);
        return res.status(500).json({ error: 'Failed to login branch.' });
    }
}



module.exports = {
    createBranch,
    getBranches,
    getBranch,
    updateBranch,
    deleteBranch,
    login
};


