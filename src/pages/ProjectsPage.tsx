import { useEffect, useState, type FormEvent } from "react";
import { api } from "../services/api";
import type { Projet, Tache } from "../types";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";



function ProjectsPage() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [taches, setTaches] = useState<Tache[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();

  function handleDeconnexion() {
    deconnexion();
    navigate("/login");
  }

  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [nomProjet, setNomProjet] = useState("");
  const [descriptionProjet, setDescriptionProjet] = useState("");
  const [couleurProjet, setCouleurProjet] = useState("#14b8a6");
  const [creationEnCours, setCreationEnCours] = useState(false);

  useEffect(() => {
    async function chargerProjets() {
      try {
        setChargement(true);
        setErreur("");

        const projetsData = await api.get<Projet[]>("/projets");
        const tachesData = await api.get<Tache[]>("/taches");

        setProjets(projetsData);
        setTaches(tachesData);

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

  async function handleCreationProjet(e: FormEvent) {
    e.preventDefault();

    if (!utilisateur) {
      setErreur("Vous devez être connecté pour créer un projet.");
      return;
    }

    try {
      setCreationEnCours(true);
      setErreur("");

      const nouveauProjet = {
        utilisateurId: utilisateur.id,
        nom: nomProjet,
        description: descriptionProjet,
        couleur: couleurProjet,
        creeLe: new Date().toISOString().split("T")[0],
      };

      const projetCree = await api.post<Projet>(
        "/projets",
        nouveauProjet
      );

      setProjets((projetsActuels) => [
        ...projetsActuels,
        projetCree,
      ]);

      setNomProjet("");
      setDescriptionProjet("");
      setCouleurProjet("#14b8a6");
      setFormulaireOuvert(false);

    } catch {
      setErreur("Impossible de créer le projet.");
    } finally {
      setCreationEnCours(false);
    }
  }


  return (
    <div className="min-h-screen flex bg-[#eef1f5]">

      {/* ================= SIDEBAR ================= */}

      <aside className="w-64 min-h-screen bg-[#1e2d43] text-white p-4 hidden md:flex flex-col">

        {/* LOGO */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-wide">
            Task<span className="text-teal-400">Flow</span>
          </h1>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-2">

          <NavLink
            to="/dashboard"
            className="rounded-lg px-4 py-3 text-slate-300 hover:bg-white/10 transition"
          >
            Tableau de bord
          </NavLink>

          <NavLink
            to="/projets"
            className="rounded-lg bg-[#2d7088] px-4 py-3 font-semibold"
          >
            Mes projets
          </NavLink>

          <NavLink
            to="/tasks"
            className="rounded-lg px-4 py-3 text-slate-300 hover:bg-white/10 transition"
          >
            Toutes les tâches
          </NavLink>

          <NavLink
            to="/parametres"
            className="rounded-lg px-4 py-3 text-slate-300 hover:bg-white/10 transition"
          >
            Paramètres
          </NavLink>

        </nav>

        {/* UTILISATEUR */}
        <div className="mt-10 border-t border-slate-700 pt-4">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {utilisateur?.nom
                ?.split(" ")
                .map((mot) => mot[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {utilisateur?.nom}
              </p>

              <p className="text-xs text-slate-400 truncate">
                {utilisateur?.email}
              </p>
            </div>

            <button
              onClick={handleDeconnexion}
              className="text-xs text-slate-400 hover:text-white"
            >
              Déconnexion
            </button>

          </div>
        </div>

      </aside>

      {/* ================= CONTENU ================= */}

      <main className="flex-1 p-5 md:p-8 max-w-[1500px] mx-auto w-full">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">

          <div>
            <h1 className="text-3xl font-bold text-[#26364b]">
              Mes projets
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Gérez vos projets et suivez leur avancement.
            </p>
          </div>

          <button
            onClick={() => setFormulaireOuvert(true)}
            className="btn border-0 bg-teal-500 hover:bg-teal-600 text-white shadow-none"
          >
            + Nouveau projet
          </button>

        </div>


        {formulaireOuvert && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">

            <h2 className="text-lg font-bold text-[#37465a] mb-5">
              Nouveau projet
            </h2>

            <form
              onSubmit={handleCreationProjet}
              className="space-y-5"
            >

              {/* NOM */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Nom du projet
                  </span>
                </label>

                <input
                  type="text"
                  value={nomProjet}
                  onChange={(e) => setNomProjet(e.target.value)}
                  placeholder="Ex : Mon portfolio"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Description
                  </span>
                </label>

                <textarea
                  value={descriptionProjet}
                  onChange={(e) => setDescriptionProjet(e.target.value)}
                  placeholder="Décrivez votre projet..."
                  className="textarea textarea-bordered w-full"
                  rows={4}
                  required
                />
              </div>

              {/* COULEUR */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Couleur
                  </span>
                </label>

                <input
                  type="color"
                  value={couleurProjet}
                  onChange={(e) => setCouleurProjet(e.target.value)}
                  className="w-16 h-10 cursor-pointer"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">

                <button
                  type="submit"
                  disabled={creationEnCours}
                  className="btn bg-teal-500 hover:bg-teal-600 text-white border-0"
                >
                  {creationEnCours
                    ? "Création..."
                    : "Créer le projet"}
                </button>

                <button
                  type="button"
                  onClick={() => setFormulaireOuvert(false)}
                  className="btn btn-outline"
                >
                  Annuler
                </button>

              </div>

            </form>
          </div>
        )}

        {/* PROJETS */}

        {projets.length === 0 ? (

          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
            <h2 className="text-lg font-semibold text-[#37465a]">
              Aucun projet
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Vous n'avez pas encore créé de projet.
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {projets.map((projet) => {

              const tachesProjet = taches.filter(
                (tache) => Number(tache.projetId) === Number(projet.id)
              );

              const totalTachesProjet = tachesProjet.length;

              const tachesTermineesProjet = tachesProjet.filter(
                (tache) => tache.statut === "terminee"
              ).length;

              const progressionProjet =
                totalTachesProjet > 0
                  ? Math.round(
                    (tachesTermineesProjet / totalTachesProjet) * 100
                  )
                  : 0;

              return (
                <div
                  key={projet.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition"
                >

                  {/* COULEUR DU PROJET */}

                  <div
                    className="w-10 h-10 rounded-lg mb-4"
                    style={{
                      backgroundColor: projet.couleur,
                    }}
                  />

                  {/* NOM */}

                  <h2 className="text-lg font-bold text-[#37465a]">
                    {projet.nom}
                  </h2>

                  {/* DESCRIPTION */}

                  <p className="text-sm text-slate-500 mt-2 line-clamp-3">
                    {projet.description}
                  </p>

                  {/* DATE */}

                  <p className="text-xs text-slate-400 mt-4">
                    Créé le : {projet.creeLe}
                  </p>

                  {/* PROGRESSION */}

                  <div className="mt-5">

                    <div className="flex justify-between items-center mb-2">

                      <span className="text-xs font-medium text-slate-500">
                        Progression
                      </span>

                      <span className="text-xs font-bold text-teal-600">
                        {progressionProjet}%
                      </span>

                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-teal-500 transition-all"
                        style={{
                          width: `${progressionProjet}%`,
                        }}
                      />

                    </div>

                    <p className="text-xs text-slate-400 mt-2">
                      {tachesTermineesProjet} / {totalTachesProjet} tâches terminées
                    </p>

                  </div>

                  {/* ACTION */}

                  <button className="btn btn-sm btn-outline border-slate-300 text-slate-600 hover:bg-slate-100 mt-5">
                    Voir le projet
                  </button>

                </div>
              );
            })}

          </div>

        )}

      </main>

    </div>
  );
}

export default ProjectsPage;