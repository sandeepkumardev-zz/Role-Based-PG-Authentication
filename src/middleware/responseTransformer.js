const responseTransformer = (res, result, message, success) => {
  return res.send({
    result,
    message,
    success,
  });
};

module.exports = responseTransformer;
