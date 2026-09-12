export type StatutTache = "a_faire" | "en_cours" | "terminee";

export type Priorite = "haute" | "moyenne" | "basse";

export interface Utilisateur {
  id: string | number;
  nom: string;
  email: string;
  motDePasse: string;
}

export interface Projet {
  id: string | number;
  utilisateurId: string | number;
  nom: string;
  description: string;
  couleur: string;
  creeLe: string;
}

export interface Tache {
  id: string | number;
  projetId: string | number;
  titre: string;
  description: string;
  statut: StatutTache;
  priorite: Priorite;
  echeance: string;
  creeLe: string;
  modifieLe: string;
}