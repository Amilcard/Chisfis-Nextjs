// Endpoint mock de reporting collectivité
module.exports = (req, res) => {
  res.json({
    totalInscriptions: 42,
    totalAides: 3500,
    repartition: [
      { territoire: "QPV Nord", inscriptions: 20 },
      { territoire: "Centre", inscriptions: 22 }
    ]
  });
};
