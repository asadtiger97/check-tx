const fs = require('fs');
const csv = require('csv-parser');
const { format } = require('fast-csv');
const path = require('path');

const inputDirectory = path.join(process.cwd(),"/../../Downloads"); // Directory where CSV files are stored
const outputFile = 'merged_files.csv';

// Stream to write the merged output
const outputStream = format({ headers: true });
outputStream.pipe(fs.createWriteStream(outputFile));

fs.readdir(inputDirectory, (err, files) => {
  if (err) {
    return console.error('Error reading directory:', err);
  }

  let filesProcessed = 0;

  files.forEach((file) => {
    if (file.endsWith('.csv')) {
      const filePath = path.join(inputDirectory, file);
      
      // Read each CSV file and pipe it into the output stream
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          outputStream.write(row);
        })
        .on('end', () => {
          filesProcessed++;
          if (filesProcessed === files.length) {
            // Close the output stream when all files are processed
            outputStream.end();
          }
        });
    }
  });
});
