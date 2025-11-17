import app from "./app";
const port = 3001;
app.listen(port, () => {
  console.log();
  console.log(`Servidor escutando na porta: ${port}`);
  console.log(`CTRL + Clique http://localhost:${port}`);
});
