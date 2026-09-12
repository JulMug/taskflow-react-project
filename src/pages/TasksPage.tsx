import { NavLink } from "react-router-dom";

function TasksPage() {
    const utilisateur = {
        nom: "Jean Dupont",
        email: "jean.dupont@example.com",
    };

    const handleDeconnexion = () => {
        // Ajoute ici la logique de déconnexion si nécessaire.
    };

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
        </div>
    );
}

export default TasksPage;