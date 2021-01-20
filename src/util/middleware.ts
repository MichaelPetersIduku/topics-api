export const inputValidator = (schema: any) => {
  return (req, res, next) => {
    for (const [key, value] of Object.entries(schema)) {
      if (key === "body") {
        // @ts-ignore
        const { error } = value.validate(req.body);

        if (error) {
          return res.status(400).json({
            status: false,
            message: error.message,
            data: "invalid payload",
          });
        }
      } else if (key === "query") {
        // @ts-ignore
        const { error } = value.validate(req.query);
        if (error) {
          return res.status(400).json({
            status: false,
            message: error.message,
            data: "invalid payload",
          });
        }
      } else {
        // @ts-ignore
        const { error } = value.validate(req.params);
        if (error) {
          console.log(error, "++++++++++++++++++++++++++++++++++++++++++");

          return res.status(400).json({
            status: false,
            message: error.message,
            data: "invalid payload",
          });
        }
      }
    }
    next();
  };
};
