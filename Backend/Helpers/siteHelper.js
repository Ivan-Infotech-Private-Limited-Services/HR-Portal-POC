var fs = require("fs");

const downloadXlsxFile = async function (wb, csvFilePath, resp) {
  wb.write(csvFilePath, (e, stats) => {
    if (e) {
      console.error(e);
      return;
    }

    console.log("CSV file saved:", csvFilePath);

    // Download the file
    const file = fs.createReadStream(csvFilePath);

    // Set headers for file download
    const headers = {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=" + csvFilePath,
    };

    // Pipe the file to the response
    file.on("open", () => {
      resp.writeHead(200, headers);
      file.pipe(resp);
    });

    // After the file has been sent, delete the saved file
    file.on("end", () => {
      fs.unlink(csvFilePath, (e) => {
        if (e) {
          console.error("Error deleting file:", e);
        } else {
          console.log("File deleted:", csvFilePath);
        }
      });
    });

    // Handle errors
    file.on("error", (e) => {
      console.error(e);
      resp.statusCode = 500;
      resp.end("Internal Server Error");
    });
  });
};

module.exports = {
  downloadXlsxFile,
};
