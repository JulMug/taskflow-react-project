import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Utilisateur } from "../types";

function RegisterPage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const navigate = useNavigate();
  const { connexion } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setErreur("");
    setChargement(true);

    try {
      // Vérifier si l'email existe déjà
      const utilisateursExistants = await api.get<Utilisateur[]>(
        `/utilisateurs?email=${email}`
      );

      if (utilisateursExistants.length > 0) {
        setErreur("Un compte existe déjà avec cette adresse email.");
        return;
      }

      // Préparer le nouvel utilisateur
      const nouvelUtilisateur = {
        nom,
        email,
        motDePasse,
      };

      // Envoyer l'utilisateur vers JSON Server
      const utilisateurCree = await api.post<Utilisateur>(
        "/utilisateurs",
        nouvelUtilisateur
      );

      // Connecter automatiquement l'utilisateur
      connexion(utilisateurCree);

      // Aller au tableau de bord
      navigate("/dashboard");

    } catch {
      setErreur("Impossible de créer le compte. Réessaie.");
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1e2d43]">
            Task<span className="text-teal-500">Flow</span>
          </h1>

          <p className="text-slate-500 mt-2">
            Créez votre compte
          </p>
        </div>

        {/* FORMULAIRE */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-[#1e2d43] mb-2">
            Créer un compte
          </h2>

          <p className="text-sm text-slate-500 mb-6">
            Commencez à organiser vos projets et vos tâches.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NOM */}
            <div>
              <label className="label">
                <span className="label-text font-medium">
                  Nom
                </span>
              </label>

              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Votre nom"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="label">
                <span className="label-text font-medium">
                  Email
                </span>
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* MOT DE PASSE */}
            <div>
              <label className="label">
                <span className="label-text font-medium">
                  Mot de passe
                </span>
              </label>

              <input
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="Votre mot de passe"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* ERREUR */}
            {erreur && (
              <div className="alert alert-error text-sm">
                <span>{erreur}</span>
              </div>
            )}

            {/* BOUTON */}
            <button
              type="submit"
              disabled={chargement}
              className="btn w-full bg-teal-500"
            >
              {chargement ? "Création..." : "Créer mon compte"}
            </button>

          </form>

          {/* RETOUR CONNEXION */}
          <div className="text-center mt-6 text-sm text-slate-500">
            Vous avez déjà un compte ?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-teal-600 font-semibold hover:underline"
            >
              Se connecter
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RegisterPage; 