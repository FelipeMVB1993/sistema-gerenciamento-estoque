import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  UserRoundX,
  UserRoundCog,
  Box,
  LogOut,
  ClipboardList,
  PackagePlus,
  ClipboardCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const { user, token, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const isAdmin = user?.perfil === "admin";
  const isAlmoxarife = user?.perfil === "almoxarife";
  const isColaborador = user?.perfil === "colaborador";

  // 🔹 Busca número de solicitações pendentes
  useEffect(() => {
    if (isAdmin && token) {
      fetch("http://localhost:3001/usuarios?solicitacoes=true", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status) setPendingCount(data.usuarios.length);
        })
        .catch(() => setPendingCount(0));
    }
  }, [isAdmin, token]);

  // ✅ Menus dinâmicos conforme perfil
  const menuItems = [
    // 🔹 ADMIN
    ...(isAdmin
      ? [
          {
            to: "/cadastrar-usuarios",
            icon: <User className="w-5 h-5 text-slate-700" />,
            label: "Cadastrar Usuários",
          },
          {
            to: "/cadastrar-materiais",
            icon: <Box className="w-5 h-5 text-slate-700" />,
            label: "Cadastrar Materiais",
          },
          {
            to: "/aprovar-pedidos",
            icon: <ClipboardCheck className="w-5 h-5 text-slate-700" />,
            label: "Aprovar Pedidos",
          },
          {
            to: "/registrar-entrada",
            icon: <PackagePlus className="w-5 h-5 text-slate-700" />,
            label: "Registrar Entrada",
          },
          {
            to: "/listar-usuarios",
            icon: <User className="w-5 h-5 text-slate-700" />,
            label: "Lista de Usuários",
          },
          {
            to: "/listar-materiais",
            icon: <ClipboardList className="w-5 h-5 text-slate-700" />,
            label: "Lista de Materiais",
          },
          {
            to: "/solicitacoes-reativacao",
            icon: (
              <div className="relative">
                <UserRoundX className="w-5 h-5 text-slate-700" />
                <AnimatePresence>
                  {pendingCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {pendingCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            ),
            label: "Reativações Pendentes",
          },
        ]
      : []),

    // 🔹 ALMOXARIFE
    ...(isAlmoxarife
      ? [
          {
            to: "/atualizar-usuario",
            icon: <UserRoundCog className="w-5 h-5 text-slate-700" />,
            label: "Atualizar Cadastro",
          },
          {
            to: "/cadastrar-materiais",
            icon: <Box className="w-5 h-5 text-slate-700" />,
            label: "Cadastrar Materiais",
          },
          {
            to: "/registrar-entrada",
            icon: <PackagePlus className="w-5 h-5 text-slate-700" />,
            label: "Registrar Entrada",
          },
          {
            to: "/aprovar-pedidos",
            icon: <ClipboardCheck className="w-5 h-5 text-slate-700" />,
            label: "Aprovar Pedidos",
          },
        ]
      : []),

    // 🔹 COLABORADOR
    ...(isColaborador
      ? [
          {
            to: "/colaborador/cadastrar-pedidos",
            icon: <Box className="w-5 h-5 text-slate-700" />,
            label: "Cadastrar Pedidos",
          },
          {
            to: "/colaborador/listar-pedidos",
            icon: <ClipboardList className="w-5 h-5 text-slate-700" />,
            label: "Meus Pedidos",
          },
          {
            to: "/atualizar-usuario",
            icon: <UserRoundCog className="w-5 h-5 text-slate-700" />,
            label: "Atualizar Cadastro",
          },
        ]
      : []),
  ];

  return (
    <motion.div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      animate={{ width: isOpen ? 240 : 64 }}
      transition={{ duration: 0.25, type: "spring", stiffness: 250 }}
      className="h-full bg-slate-400 flex flex-col justify-between shadow-md overflow-hidden"
    >
      {/* 🔹 Cabeçalho */}
      <div className="p-4">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="header"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-bold text-slate-700 text-base">
                Bem-vindo, {user?.username} 👋
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Perfil: {user?.perfil}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🔹 Menu */}
        <div className="flex flex-col space-y-2 mt-6">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.to;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  to={item.to}
                  className={`p-2 flex items-center space-x-2 rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-slate-300 shadow-inner"
                      : "hover:bg-slate-300 hover:shadow-inner"
                  }`}
                >
                  {item.icon}
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 🔹 Botão de Logout */}
      <motion.button
        onClick={logout}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`bg-red-500 text-white rounded m-4 flex items-center justify-center transition-all duration-300 shadow-sm hover:bg-red-600 ${
          isOpen ? "px-4 py-2 w-auto gap-2" : "w-10 h-10"
        }`}
      >
        <LogOut className="w-5 h-5" />
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-medium"
            >
              Sair
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

export default Sidebar;
