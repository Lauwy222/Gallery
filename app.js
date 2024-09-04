const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the "folder" directory
app.use('/folder', express.static(path.join(__dirname, 'folder')));

// Home page route to display events
app.get('/', (req, res) => {
  const eventDate = '4-9-2024'; // Hardcoded date for this example
  const eventUrl = `/event/${eventDate}`;
  
  res.send(`
    <html>
      <head><title>Gallery</title></head>
      <body>
        <h1>Events:</h1>
        <ul>
          <li><a href="${eventUrl}">${eventDate}</a></li>
        </ul>
      </body>
    </html>
  `);
});

// Route to display all images from the 4-9-2024 folder
app.get('/event/:date', (req, res) => {
  const eventDate = req.params.date;
  const folderPath = path.join(__dirname, 'folder', eventDate);
  
  // Read files from the specified folder
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(404).send('Event not found');
    }
    
    // Filter image files (simple filter for JPG and PNG)
    const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));

    // Generate HTML with image tags
    let imageTags = imageFiles.map(file => `<img src="/folder/${eventDate}/${file}" style="width:300px; height:auto; margin:10px;">`).join('');

    res.send(`
      <html>
        <head><title>Images for ${eventDate}</title></head>
        <body>
          <h1>Images for Event on ${eventDate}</h1>
          ${imageTags}
          <br><a href="/">Back to events</a>
        </body>
      </html>
    `);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Gallery app listening at http://localhost:${port}`);
});
