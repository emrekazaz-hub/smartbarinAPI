const handleEntries = (req, res,db) => {
    const { id } = req.body;
    console.log(`recived id: ${id}`);
    db.select("*")
      .from("users")
      .where("id", "=", id)
      .increment("entries", 1)
      .returning("entries")
      .then((entries) => {
        res.json(entries[0]);
      })
      .catch((err) => {
        res.status(400).json("error to get entries");
      });
  };

  module.exports = {
    handleEntries : handleEntries
  }