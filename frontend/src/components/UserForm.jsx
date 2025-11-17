import Input from "./Input";

const UserForm = () => {
  return (
    <form className="bg-slate-300 p-4 rounded mb-4">
      <Input type="text" placeholder="Nome" className="w-full mb-2" />
      <Input type="email" placeholder="Email" className="w-full mb-2" />
      <Input type="password" placeholder="Senha" className="w-full mb-2" />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Cadastrar
      </button>
    </form>
  );
};

export default UserForm;
