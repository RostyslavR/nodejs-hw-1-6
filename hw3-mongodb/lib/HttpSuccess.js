const HttpSuccess = (result = null, code = 200, status = "success") => {
  return {
    status,
    code,
    data: { result },
  };
};

module.exports = HttpSuccess;
