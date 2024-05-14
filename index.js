const express = require('express');
const cors = require('cors'); 
const bodyParser = require('body-parser');

// Importing removeBackground function from imglybackgroundRemoval module
const { removeBackground } = require('@imgly/background-removal-node');

const app = express();
const port = 3000;

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function removeImageBackground(imgSource) {
    try {
        // Assuming removeBackground function accepts imgSource and returns a Promise
        const blob = await removeBackground(imgSource, { output: { format: 'image/jpeg' } });
        const buffer = Buffer.from(await blob.arrayBuffer());
        return buffer;
    } catch (error) {
        throw new Error('Error removing background: ' + error);
    }
}

app.get('/remove-background', async (req, res) => {
    try {
        const imgSource = req.query.url;
        const resultBuffer = await removeImageBackground(imgSource);
        res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': resultBuffer.length
        });
        res.end(resultBuffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
