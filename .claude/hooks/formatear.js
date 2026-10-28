// Hook PostToolUse: formatea con Prettier los archivos .js y .json que Claude crea o edita.
// Nunca bloquea: ante cualquier error termina con código 0 sin tocar el archivo.
const fs = require("node:fs");
const path = require("node:path");

const EXTENSIONES = [".js", ".json"];

async function main() {
  const entrada = JSON.parse(fs.readFileSync(0, "utf8"));
  const archivo = entrada?.tool_input?.file_path;
  if (!archivo || !EXTENSIONES.includes(path.extname(archivo).toLowerCase()))
    return;

  // Usa el Prettier instalado en el proyecto, no uno global.
  const dirProyecto = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const prettier = require(
    require.resolve("prettier", { paths: [dirProyecto] }),
  );

  const codigo = fs.readFileSync(archivo, "utf8");
  const config = (await prettier.resolveConfig(archivo)) ?? {};
  const formateado = await prettier.format(codigo, {
    ...config,
    filepath: archivo,
  });
  if (formateado !== codigo) fs.writeFileSync(archivo, formateado);
}

main()
  .catch(() => {})
  .finally(() => process.exit(0));
