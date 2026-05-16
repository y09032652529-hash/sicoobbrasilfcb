const CPF_API_TOKEN = "56fb9cbc8d3a7cf7d1c1c8ac12730ec883f150a7134687099bab95058c76aaab";
const CPF_API_BASE = "https://bk.elaiflow.dev/consultar-filtrada/cpf";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const cpf = String(req.query.cpf || "").replace(/\D/g, "");
  if (cpf.length !== 11) {
    res.status(400).json({ error: "CPF invalido" });
    return;
  }

  const url = new URL(CPF_API_BASE);
  url.searchParams.set("cpf", cpf);
  url.searchParams.set("token", CPF_API_TOKEN);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(502).json({ error: `Erro ao consultar CPF: ${error.message}` });
  }
}
