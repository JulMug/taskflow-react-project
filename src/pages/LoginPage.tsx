import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
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
    <div>
      <h1>Connexion</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Mot de passe</label>

          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </div>

        {erreur && <p>{erreur}</p>}

        <button type="submit">
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default LoginPage;