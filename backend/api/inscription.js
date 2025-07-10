// Endpoint mock d'inscription
module.exports = (req, res) => {
  res.json({
    success: true,
    message: "Inscription simulée avec succès",
    userId: "mock-user-123"
  });
};
