from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlencode, urlparse
from urllib.request import Request, urlopen
import json


CPF_API_TOKEN = "56fb9cbc8d3a7cf7d1c1c8ac12730ec883f150a7134687099bab95058c76aaab"
CPF_API_BASE = "https://bk.elaiflow.dev/consultar-filtrada/cpf"


class SpaHandler(SimpleHTTPRequestHandler):
    def send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def handle_cpf_proxy(self):
        query = parse_qs(urlparse(self.path).query)
        cpf = "".join(ch for ch in query.get("cpf", [""])[0] if ch.isdigit())

        if len(cpf) != 11:
            self.send_json(400, {"error": "CPF invalido"})
            return

        api_url = f"{CPF_API_BASE}?{urlencode({'cpf': cpf, 'token': CPF_API_TOKEN})}"
        request = Request(api_url, headers={"Accept": "application/json"})

        try:
            with urlopen(request, timeout=15) as response:
                raw = response.read()
                payload = json.loads(raw.decode("utf-8"))
                self.send_json(200, payload)
        except HTTPError as error:
            try:
                payload = json.loads(error.read().decode("utf-8"))
            except Exception:
                payload = {"error": "Erro na API de CPF"}
            self.send_json(error.code, payload)
        except (URLError, TimeoutError, json.JSONDecodeError) as error:
            self.send_json(502, {"error": f"Erro ao consultar CPF: {error}"})

    def route_spa_request(self):
        requested = self.path.split("?", 1)[0].split("#", 1)[0]
        local_path = Path(self.directory, requested.lstrip("/"))

        if requested != "/" and not local_path.exists():
            self.path = "/index.html"

    def do_GET(self):
        if self.path.startswith("/cpf-proxy") or self.path.startswith("/api/cpf-proxy"):
            self.handle_cpf_proxy()
            return

        self.route_spa_request()

        return super().do_GET()

    def do_HEAD(self):
        self.route_spa_request()

        return super().do_HEAD()


if __name__ == "__main__":
    host = "127.0.0.1"
    port = 4173
    server = ThreadingHTTPServer((host, port), SpaHandler)
    print(f"Serving local copy at http://{host}:{port}")
    server.serve_forever()
