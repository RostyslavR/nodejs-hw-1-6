const resSuccess = (res, result) => {
  return res.json({
    status: "success",
    code: 200,
    data: { result },
  });
};

module.exports = resSuccess;
