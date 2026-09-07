import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Utilisateur } from "../types";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");

  const navigate = useNavigate();
  const { connexion } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setErreur("");

    try {
      const utilisateurs = await api.get<Utilisateur[]>(
        `/utilisateurs?email=${email}`
      );

      const utilisateur = utilisateurs.find(
        (user) => user.motDePasse === motDePasse
      );

      if (!utilisateur) {
        setErreur("Email ou mot de passe incorrect.");
        return;
      }

      connexion(utilisateur);

      navigate("/dashboard");
    } catch {
      setErreur("Impossible de se connecter au serveur.");
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Partie gauche */}
      <section className="hidden lg:flex lg:w-1/2 bg-slate-800 text-white p-12 flex-col justify-center">

        <div className="max-w-md">

          <h1 className="text-4xl font-bold tracking-wide mb-4">
            Task<span className="text-teal-400">Flow</span>
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed">
            Organisez vos projets, suivez vos tâches,
            <br />
            et gardez le contrôle de votre avancement.
          </p>

          <div className="border-l-2 border-teal-400 pl-4 mt-10 space-y-3 text-slate-400">

            <p>
              Créez autant de projets que nécessaire
            </p>

            <p>
              Suivez chaque tâche de bout en bout
            </p>

            <p>
              Visualisez votre progression en un coup d'œil
            </p>

          </div>

        </div>

      </section>


      {/* Partie droite */}
      <section className="w-full lg:w-1/2 bg-slate-100 flex items-center justify-center px-6">

        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold text-slate-700">
            Connexion
          </h2>

          <p className="text-slate-500 mt-2 mb-8">
            Entrez vos identifiants pour continuer
          </p>


          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Adresse e-mail
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                className="input input-bordered w-full bg-white focus:outline-none focus:border-teal-500"
              />
            </div>


            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Mot de passe
              </label>

              <input
                type="password"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
                placeholder="••••••••"
                className="input input-bordered w-full bg-white focus:outline-none focus:border-teal-500"
              />
            </div>


            {/* Erreur */}
            {erreur && (
              <div className="alert alert-error text-sm">
                <span>{erreur}</span>
              </div>
            )}


            {/* Bouton */}
            <button
              type="submit"
              className="btn w-full bg-teal-500 hover:bg-teal-600 border-none text-slate-900 font-bold"
            >
              Se connecter
            </button>

          </form>


          {/* Inscription */}
          <p className="text-center text-sm text-slate-500 mt-5">

            Pas encore de compte ?{" "}

            <Link
              to="/register"
              className="font-semibold text-slate-700 hover:text-teal-600"
            >
              Créer un compte
            </Link>

          </p>

        </div>

      </section>

    </div>
  );
}

export default LoginPage;