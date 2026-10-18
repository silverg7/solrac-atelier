"""NOE-MERGE-WORKTREE-20261018: make merge desde un worktree sin tocar el checkout principal.

Git real en un directorio temporal: origin desnudo local, checkout principal con
trabajo sin commitear de otra sesión y un worktree en rama. Los gates son dobles;
fetch, merge, push y fast-forward son de verdad. Cero remotos reales.
"""

import os
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BRANCH = "master"


def _gate(d: Path, fail: bool = False) -> None:
    """Doble del gate de merge.sh (`python3 -m pytest tests/`): un python3 en scripts/,
    primero en el PATH de merge.sh, que registra la llamada sin exigir pytest."""
    (d / "tests").mkdir(exist_ok=True)
    (d / "tests" / ".keep").write_text("", encoding="utf-8")
    stub = d / "scripts" / "python3"
    stub.write_text(f"#!/usr/bin/env bash\necho gate >> gate.log\nexit {int(fail)}\n", encoding="utf-8")
    stub.chmod(0o755)


def _git(cwd: Path, *args: str) -> str:
    return subprocess.run(["git", *args], cwd=cwd, check=True, capture_output=True, text=True).stdout.strip()


def _merge(wt: Path, msg: str = "docs: ticket") -> subprocess.CompletedProcess:
    env = {**os.environ, "GIT_TERMINAL_PROMPT": "0", "SKIP_TESTS": "0"}
    for var in ("MAKEFLAGS", "MAKELEVEL", "MFLAGS"):
        env.pop(var, None)
    return subprocess.run(["bash", "scripts/merge.sh", msg], cwd=wt, env=env, capture_output=True, text=True, timeout=60)


class MergeDesdeWorktree(unittest.TestCase):
    remoto = True

    def setUp(self) -> None:
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.tmp = Path(tmp.name)
        self.origin, self.repo = self.tmp / "origin.git", self.tmp / "repo"
        repo = self.repo
        (repo / "scripts").mkdir(parents=True)
        _git(repo, "init", "-q", "-b", BRANCH)
        _git(repo, "config", "user.email", "t@t")
        _git(repo, "config", "user.name", "t")
        shutil.copy2(ROOT / "scripts" / "merge.sh", repo / "scripts" / "merge.sh")
        _gate(repo)
        (repo / ".gitignore").write_text("gate.log\n.pytest_cache/\n__pycache__/\n", encoding="utf-8")
        (repo / "TABLERO_AGENTES.md").write_text("# Tablero\n", encoding="utf-8")
        _git(repo, "add", "-A")
        _git(repo, "commit", "-q", "-m", "base")
        if self.remoto:
            subprocess.run(["git", "init", "--bare", "-q", "-b", BRANCH, str(self.origin)], check=True)
            _git(repo, "remote", "add", "origin", str(self.origin))
            _git(repo, "push", "-q", "origin", BRANCH)
        (repo / ".git" / "info" / "exclude").write_text(".claude/\n", encoding="utf-8")
        self.wt = repo / ".claude" / "worktrees" / "sesion"
        _git(repo, "worktree", "add", "-q", "-b", "claude/sesion", str(self.wt), BRANCH)
        (self.wt / "ticket.md").write_text("ticket\n", encoding="utf-8")
        # Trabajo sin commitear de otra sesión en el checkout principal.
        (repo / "TABLERO_AGENTES.md").write_text("# Tablero\n- fila ajena\n", encoding="utf-8")
        (repo / "ajeno.md").write_text("sin commitear\n", encoding="utf-8")
        self.base = _git(repo, "rev-parse", BRANCH)

    def publicado(self) -> str:
        return _git(self.origin if self.remoto else self.repo, "rev-parse", BRANCH)

    def assert_principal_intacto(self) -> None:
        self.assertEqual(_git(self.repo, "status", "--porcelain").split(), ["M", "TABLERO_AGENTES.md", "??", "ajeno.md"])
        self.assertEqual((self.repo / "TABLERO_AGENTES.md").read_text(encoding="utf-8"), "# Tablero\n- fila ajena\n")

    def test_publica_la_rama_sin_el_trabajo_ajeno_del_principal(self):
        res = _merge(self.wt)
        self.assertEqual(res.returncode, 0, res.stdout + res.stderr)
        tip = _git(self.wt, "rev-parse", "HEAD")
        self.assertEqual(self.publicado(), tip)
        self.assertEqual(_git(self.repo, "show", "--name-only", "--format=", tip).split(), ["ticket.md"])
        self.assertEqual(_git(self.repo, "rev-parse", BRANCH), tip)  # fast-forward del principal
        self.assert_principal_intacto()
        self.assertIn("gate", (self.wt / "gate.log").read_text(encoding="utf-8"))  # gates en el worktree

    def test_avisa_si_el_principal_no_puede_avanzar(self):
        (self.wt / "TABLERO_AGENTES.md").write_text("# Tablero\n- fila nueva\n", encoding="utf-8")
        res = _merge(self.wt)
        self.assertEqual(res.returncode, 0, res.stdout + res.stderr)
        self.assertIn("no avanza", res.stdout)
        if self.remoto:
            self.assertEqual(self.publicado(), _git(self.wt, "rev-parse", "HEAD"))
        self.assertEqual(_git(self.repo, "rev-parse", BRANCH), self.base)
        self.assert_principal_intacto()

    def test_gate_fallido_no_toca_nada(self):
        _gate(self.wt, fail=True)
        res = _merge(self.wt)
        self.assertNotEqual(res.returncode, 0)
        self.assertEqual(_git(self.wt, "rev-parse", "HEAD"), self.base)
        self.assertEqual(self.publicado(), self.base)
        self.assertEqual(_git(self.repo, "rev-parse", BRANCH), self.base)
        self.assert_principal_intacto()

    def test_integra_lo_que_avanzo_en_destino(self):
        if self.remoto:
            otro = self.tmp / "otro"
            _git(self.tmp, "clone", "-q", str(self.origin), str(otro))
            (otro / "remoto.md").write_text("remoto\n", encoding="utf-8")
            _git(otro, "add", "remoto.md")
            _git(otro, "-c", "user.email=t@t", "-c", "user.name=t", "commit", "-q", "-m", "remoto")
            _git(otro, "push", "-q", "origin", BRANCH)
        else:
            # Otra sesión commitea en el principal solo su fichero; el resto sigue sucio.
            (self.repo / "remoto.md").write_text("remoto\n", encoding="utf-8")
            _git(self.repo, "add", "remoto.md")
            _git(self.repo, "commit", "-q", "-m", "remoto", "--", "remoto.md")
        res = _merge(self.wt)
        self.assertEqual(res.returncode, 0, res.stdout + res.stderr)
        self.assertEqual(self.publicado(), _git(self.wt, "rev-parse", "HEAD"))
        self.assertLessEqual({"ticket.md", "remoto.md"}, set(_git(self.repo, "ls-tree", "--name-only", BRANCH).split()))

    def test_enlaza_el_venv_del_principal_fuera_de_git(self):
        venv = self.repo / ".venv"
        (venv / "bin").mkdir(parents=True)
        (venv / ".gitignore").write_text("*\n", encoding="utf-8")
        (venv / "pyvenv.cfg").write_text("home = /usr/bin\n", encoding="utf-8")
        res = _merge(self.wt)
        self.assertEqual(res.returncode, 0, res.stdout + res.stderr)
        self.assertTrue((self.wt / ".venv" / "bin").is_symlink())
        self.assertEqual((self.wt / ".venv" / "bin").resolve(), (venv / "bin").resolve())
        self.assertEqual(_git(self.repo, "show", "--name-only", "--format=", self.publicado()).split(), ["ticket.md"])
        self.assertEqual(_git(self.wt, "status", "--porcelain"), "")


if __name__ == "__main__":
    unittest.main()
