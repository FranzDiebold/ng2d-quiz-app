function getError() {
  const errorMessage = {
    error: "'seed' parameter must be provided!",
  };
  return ContentService.createTextOutput(JSON.stringify(errorMessage))
    .setMimeType(ContentService.MimeType.JSON);
}
