import Input from "./Input";

const MaterialForm = () => {
  return (
    <form className="bg-slate-300 p-4 rounded mb-4 flex flex-col">
      <Input
        type="text"
        placeholder="Nome do material"
        className="w-full mb-2"
      />
      <textarea
        placeholder="Descrição"
        className="border border-slate-300 outline-slate-400 px-4 py-2 rounded-md w-full mb-2"
      ></textarea>
      <Input type="number" placeholder="Quantidade" className="w-full mb-2" />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Cadastrar
      </button>
    </form>
  );
};

export default MaterialForm;
