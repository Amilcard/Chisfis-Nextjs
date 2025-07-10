// Endpoint mock de simulation d'aides financières
module.exports = (req, res) => {
  res.json({
    eligible: true,
    montant: 120,
    details: [
      { type: "QPV", montant: 50 },
      { type: "Handicap", montant: 70 }
    ]
  });
};
