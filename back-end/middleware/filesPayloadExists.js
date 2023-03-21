const filesPayloadExists = (req, res, next) => {
    if (!req.files) return res.status(400).json({
        errors: [
          {
            message: "Missing files"
          }
        ],
        data: null
      })

    next()
}

module.exports = filesPayloadExists