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
    <div>
      <h1>Créer un compte</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom</label>

          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

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

        <button type="submit" disabled={chargement}>
          {chargement ? "Création..." : "Créer mon compte"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;