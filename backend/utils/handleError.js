const handleError = (
  res,
  error,
  message = "Server Error"
) => {
  console.error(error);

  return res.status(500).json({
    success: false,
    message,
    error: error.message,
  });
};

module.exports = handleError;