const path = require('path');

const index = (req, res) => {
    const file = path.join(__dirname, '../index.html')
    res.sendFile(file);
}

module.exports = {
    index
}