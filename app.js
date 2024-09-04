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
      <head>
        <title>Gallery</title>
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
      </head>
      <body class="bg-light">
        <div class="container mt-5">
          <h1 class="mb-4">Events</h1>
          <ul class="list-group">
            <li class="list-group-item"><a href="${eventUrl}">${eventDate}</a></li>
          </ul>
        </div>
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

    // Generate HTML with image tags using a responsive gallery layout
    let imageColumns = '';
    
    // We'll loop over the files in sets of 2 for each column to keep the layout structured
    for (let i = 0; i < imageFiles.length; i += 2) {
      let firstImage = imageFiles[i];
      let secondImage = imageFiles[i + 1];

      imageColumns += `
        <div class="col-lg-4 col-md-12 mb-4 mb-lg-0">
          <img src="/folder/${eventDate}/${firstImage}" class="w-100 shadow-1-strong rounded mb-4" alt="${firstImage}">
          ${secondImage ? `<img src="/folder/${eventDate}/${secondImage}" class="w-100 shadow-1-strong rounded mb-4" alt="${secondImage}">` : ''}
        </div>
      `;
    }

    res.send(`
      <html>
        <head>
          <title>Images for ${eventDate}</title>
          <!-- Bootstrap CSS -->
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
        </head>
        <body class="bg-light">
          <div class="container mt-5">
            <h1 class="mb-4">Images for Event on ${eventDate}</h1>
            <div class="row">
              ${imageColumns}
            </div>
            <a href="/" class="btn btn-primary">Back to events</a>
          </div>
        </body>
      </html>
    `);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Gallery app listening at http://localhost:${port}`);
});
