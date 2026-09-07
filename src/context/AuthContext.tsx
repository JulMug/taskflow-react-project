import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Utilisateur } from "../types";

type AuthContextType = {
  utilisateur: Utilisateur | null;
  connexion: (utilisateur: Utilisateur) => void;
  deconnexion: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);

  function connexion(utilisateurConnecte: Utilisateur) {
    setUtilisateur(utilisateurConnecte);
  }

  function deconnexion() {
    setUtilisateur(null);
  }

  return (
    <AuthContext.Provider
      value={{
        utilisateur,
        connexion,
        deconnexion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }

  return context;
}