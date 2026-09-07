import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Projet } from "../types";

function ProjectsPage() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    async function chargerProjets() {
      try {
        setChargement(true);
        setErreur("");

        const projetsData = await api.get<Projet[]>("/projets");

        setProjets(projetsData);
      } catch {
        setErreur("Impossible de charger les projets.");
      } finally {
        setChargement(false);
      }
    }

    chargerProjets();
  }, []);

  if (chargement) {
    return <p>Chargement des projets...</p>;
  }

  if (erreur) {
    return <p>{erreur}</p>;
  }

  return (
    <div>
      <h1>Mes projets</h1>

      {projets.length === 0 ? (
        <p>Aucun projet pour le moment.</p>
      ) : (
        <div>
          {projets.map((projet) => (
            <div key={projet.id}>
              <h2>{projet.nom}</h2>

              <p>{projet.description}</p>

              <p>Créé le : {projet.creeLe}</p>

              <p>Couleur : {projet.couleur}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;