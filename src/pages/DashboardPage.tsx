import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Projet, Tache } from "../types";

function DashboardPage() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [taches, setTaches] = useState<Tache[]>([]);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    async function chargerDashboard() {
      try {
        setChargement(true);
        setErreur("");

        const projetsData = await api.get<Projet[]>("/projets");
        const tachesData = await api.get<Tache[]>("/taches");

        setProjets(projetsData);
        setTaches(tachesData);

      } catch {
        setErreur("Impossible de charger les données du tableau de bord.");
      } finally {
        setChargement(false);
      }
    }

    chargerDashboard();
  }, []);


  // Statistiques des projets et tâches
  const totalProjets = projets.length;
  const totalTaches = taches.length;

  const tachesAFaire = taches.filter(
    (tache) => tache.statut === "a_faire"
  ).length;

  const tachesEnCours = taches.filter(
    (tache) => tache.statut === "en_cours"
  ).length;

  const tachesTerminees = taches.filter(
    (tache) => tache.statut === "terminee"
  ).length;


  // Progression globale
  const progression =
    totalTaches > 0
      ? Math.round((tachesTerminees / totalTaches) * 100)
      : 0;


  if (chargement) {
    return <p>Chargement du tableau de bord...</p>;
  }

  if (erreur) {
    return <p>{erreur}</p>;
  }


  return (
    <div>
      <h1>Tableau de bord</h1>

      <h2>Statistiques</h2>

      <p>Total des projets : {totalProjets}</p>

      <p>Total des tâches : {totalTaches}</p>

      <p>À faire : {tachesAFaire}</p>

      <p>En cours : {tachesEnCours}</p>

      <p>Terminées : {tachesTerminees}</p>

      <p>Progression globale : {progression}%</p>

      <h2>Projets</h2>

      {projets.map((projet) => (
        <div key={projet.id}>
          <h3>{projet.nom}</h3>

          <p>{projet.description}</p>

          <p>Créé le : {projet.creeLe}</p>
        </div>
      ))}
    </div>
  );
}

export default DashboardPage;