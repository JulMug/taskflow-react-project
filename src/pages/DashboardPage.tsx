import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { Projet, Tache } from "../types";
import { useAuth } from "../context/AuthContext";

function DashboardPage() {
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();

  function handleDeconnexion() {
    deconnexion();
    navigate("/connexion");
  }

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


  // STATISTIQUES
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


  const progression =
    totalTaches > 0
      ? Math.round((tachesTerminees / totalTaches) * 100)
      : 0;


  // PROJETS ACTIFS
  const projetsActifs = projets.filter((projet) =>
    taches.some(
      (tache) => tache.projetId === Number(projet.id)
    )
  ).length;


  // PROGRESSION PAR PROJET
  const projetsAvecProgression = projets.map((projet) => {
    const tachesProjet = taches.filter(
      (tache) => tache.projetId === Number(projet.id)
    );

    const terminees = tachesProjet.filter(
      (tache) => tache.statut === "terminee"
    ).length;

    const progressionProjet =
      tachesProjet.length > 0
        ? Math.round(
          (terminees / tachesProjet.length) * 100
        )
        : 0;

    return {
      ...projet,
      progression: progressionProjet,
    };
  });


  // TÂCHES RÉCENTES
  const tachesRecentes = [...taches]
    .sort(
      (a, b) =>
        new Date(b.creeLe).getTime() -
        new Date(a.creeLe).getTime()
    )
    .slice(0, 5);


  function formaterDate(date: string) {
    return new Date(date).toLocaleDateString("fr-FR");
  }


  function getClassePriorite(priorite: string) {
    if (priorite === "haute") {
      return "bg-red-100 text-red-700";
    }

    if (priorite === "moyenne") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-slate-100 text-slate-600";
  }


  function getClasseStatut(statut: string) {
    if (statut === "terminee") {
      return "bg-teal-100 text-teal-700";
    }

    if (statut === "en_cours") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-slate-100 text-slate-600";
  }


  function formatStatut(statut: string) {
    if (statut === "a_faire") return "À faire";
    if (statut === "en_cours") return "En cours";

    return "Terminée";
  }


  if (chargement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <span className="loading loading-spinner loading-lg text-teal-500"></span>
      </div>
    );
  }


  if (erreur) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="alert alert-error max-w-md">
          <span>{erreur}</span>
        </div>
      </div>
    );
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
            className="rounded-lg bg-[#2d7088] px-4 py-3 font-semibold"
          >
            Tableau de bord
          </NavLink>


          <NavLink
            to="/projets"
            className="rounded-lg px-4 py-3 text-slate-300 hover:bg-white/10 transition"
          >
            Mes projets
          </NavLink>


          <NavLink
            to="/taches"
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
              Tableau de bord
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Voici l'état de vos projets et de vos tâches.
            </p>
          </div>


          <button className="btn border-0 bg-teal-500 hover:bg-teal-600 text-white shadow-none">
            + Nouveau projet
          </button>

        </div>


        {/* ================= STATISTIQUES ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">


          {/* PROJETS */}

          <div className="bg-white rounded-xl border border-slate-200 p-5">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Projets
            </p>

            <p className="text-4xl font-bold text-[#31556f] mt-2">
              {totalProjets}
            </p>

            <p className="text-xs text-slate-500 mt-2">
              dont {projetsActifs} actifs
            </p>

          </div>


          {/* TOTAL TACHES */}

          <div className="bg-white rounded-xl border border-slate-200 p-5">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Total tâches
            </p>

            <p className="text-4xl font-bold text-[#26364b] mt-2">
              {totalTaches}
            </p>

            <p className="text-xs text-slate-500 mt-2">
              tous projets confondus
            </p>

          </div>


          {/* EN COURS */}

          <div className="bg-white rounded-xl border border-slate-200 p-5">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              En cours
            </p>

            <p className="text-4xl font-bold text-[#b77912] mt-2">
              {tachesEnCours}
            </p>

            <p className="text-xs text-slate-500 mt-2">
              à terminer cette semaine
            </p>

          </div>


          {/* TERMINEES */}

          <div className="bg-white rounded-xl border border-slate-200 p-5">

            <p className="text-xs uppercase tracking-wider text-slate-500">
              Terminées
            </p>

            <p className="text-4xl font-bold text-teal-600 mt-2">
              {tachesTerminees}
            </p>

            <p className="text-xs text-slate-500 mt-2">
              {progression}% du total
            </p>

          </div>

        </div>


        {/* ================= GRAPHIQUES ================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">


          {/* REPARTITION */}

          <section className="bg-white rounded-xl border border-slate-200 p-5">

            <h2 className="font-bold text-lg text-[#37465a]">
              Répartition des tâches par statut
            </h2>


            <div className="h-64 flex items-end justify-around pt-10">

              {/* A FAIRE */}

              <div className="flex flex-col items-center justify-end h-full">

                <span className="font-bold text-sm mb-2">
                  {tachesAFaire}
                </span>

                <div
                  className="w-14 md:w-16 bg-[#94a3b8] rounded-t-lg"
                  style={{
                    height: `${Math.max(
                      (tachesAFaire / Math.max(totalTaches, 1)) * 180,
                      20
                    )}px`,
                  }}
                />

                <span className="text-xs text-slate-500 mt-3">
                  À faire
                </span>

              </div>


              {/* EN COURS */}

              <div className="flex flex-col items-center justify-end h-full">

                <span className="font-bold text-sm mb-2">
                  {tachesEnCours}
                </span>

                <div
                  className="w-14 md:w-16 bg-[#f5b21b] rounded-t-lg"
                  style={{
                    height: `${Math.max(
                      (tachesEnCours / Math.max(totalTaches, 1)) * 180,
                      20
                    )}px`,
                  }}
                />

                <span className="text-xs text-slate-500 mt-3">
                  En cours
                </span>

              </div>


              {/* TERMINEES */}

              <div className="flex flex-col items-center justify-end h-full">

                <span className="font-bold text-sm mb-2">
                  {tachesTerminees}
                </span>

                <div
                  className="w-14 md:w-16 bg-teal-500 rounded-t-lg"
                  style={{
                    height: `${Math.max(
                      (tachesTerminees / Math.max(totalTaches, 1)) * 180,
                      20
                    )}px`,
                  }}
                />

                <span className="text-xs text-slate-500 mt-3">
                  Terminées
                </span>

              </div>

            </div>

          </section>


          {/* PROGRESSION */}

          <section className="bg-white rounded-xl border border-slate-200 p-5">

            <h2 className="font-bold text-lg text-[#37465a] mb-5">
              Avancement par projet
            </h2>


            <div className="space-y-5">

              {projetsAvecProgression.map((projet) => (

                <div key={projet.id}>

                  <div className="flex justify-between items-center mb-2">

                    <span className="font-semibold text-sm text-[#37465a]">
                      {projet.nom}
                    </span>

                    <span className="text-xs text-slate-500">
                      {projet.progression} %
                    </span>

                  </div>


                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-teal-500"
                      style={{
                        width: `${projet.progression}%`,
                      }}
                    />

                  </div>

                </div>

              ))}

            </div>

          </section>

        </div>


        {/* ================= TABLEAU ================= */}

        <section className="bg-white rounded-xl border border-slate-200 p-5">

          <h2 className="font-bold text-lg text-[#37465a] mb-4">
            Tâches récentes
          </h2>


          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">

                  <th className="text-left pb-3">
                    Tâche
                  </th>

                  <th className="text-left pb-3">
                    Projet
                  </th>

                  <th className="text-left pb-3">
                    Priorité
                  </th>

                  <th className="text-left pb-3">
                    Échéance
                  </th>

                  <th className="text-left pb-3">
                    Statut
                  </th>

                </tr>

              </thead>


              <tbody>

                {tachesRecentes.map((tache) => {

                  const projet = projets.find(
                    (p) =>
                      Number(p.id) === tache.projetId
                  );

                  return (

                    <tr
                      key={tache.id}
                      className="border-b border-slate-100"
                    >

                      <td className="py-4 font-semibold text-[#37465a]">
                        {tache.titre}
                      </td>


                      <td className="py-4 text-slate-500">
                        {projet?.nom || "Projet inconnu"}
                      </td>


                      <td className="py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getClassePriorite(
                            tache.priorite
                          )}`}
                        >
                          {tache.priorite}
                        </span>

                      </td>


                      <td className="py-4 text-slate-500">
                        {formaterDate(tache.echeance)}
                      </td>


                      <td className="py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getClasseStatut(
                            tache.statut
                          )}`}
                        >
                          {formatStatut(tache.statut)}
                        </span>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>


          {/* NOTE MAQUETTE */}

          <div className="mt-4 border border-dashed border-yellow-400 bg-yellow-50 px-3 py-2 rounded-lg">

            <p className="text-xs text-yellow-700">
              Tableau de bord — Toutes les valeurs sont calculées à partir des données.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default DashboardPage;