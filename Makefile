override SCOPE_ROOT := $(abspath $(dir $(firstword $(MAKEFILE_LIST))))
include $(SCOPE_ROOT)/scripts/project_scope.mk
.DEFAULT_GOAL :=

# Makefile — SOLRAC Atelier
# Sujeto a gobernanza Top-Down de Noesis

IGNITE_ROOT := $(abspath $(dir $(firstword $(MAKEFILE_LIST))))

.PHONY: help sync test check check-browser ignite serve merge escala mariskal magnus

help:
	@echo "SOLRAC Atelier — Comandos disponibles:"
	@echo "  make serve   — Iniciar servidor web local en http://localhost:8080"
	@echo "  make sync    — Sincronizar cambios locales y remotos con GitHub"
	@echo "  make check   — Verificación de salud y archivos canónicos"
	@echo "  make test    — Validar sintaxis y estructura del portfolio"
	@echo "  make ignite  — Despertar táctico y lectura de identidad"
	@echo "  make merge MSG=... — Ciclo completo fail-closed (preflights + push)"
	@echo "  make escala  — Protocolo 'escala a noesis' ante fricción o bloqueo"

serve:
	@echo "Iniciando portfolio web en http://localhost:8080 ..."
	@python3 scripts/server.py 8080

sync:
ifeq ($(PROJECT_TRANSVERSAL),1)
	@cd "$(SCOPE_ROOT)" && bash "$(SCOPE_ROOT)/scripts/transversal.sh" sync
else
	@cd "$(SCOPE_ROOT)" && bash "$(SCOPE_ROOT)/scripts/sync_local.sh"
endif

PYTHON ?= $(if $(wildcard $(SCOPE_ROOT)/.venv/bin/python3),$(SCOPE_ROOT)/.venv/bin/python3,python3)
BROWSER_PYTHON ?= $(PYTHON)

check:
	@test -f index.html || { echo "✖ Falta index.html" >&2; exit 1; }
	@test -f TABLERO_AGENTES.md || { echo "✖ Falta TABLERO_AGENTES.md" >&2; exit 1; }
	@$(PYTHON) -B -m unittest -q scripts/test_merge_worktree.py scripts/test_portfolio_assets.py scripts/test_concierge_flow.py scripts/test_lead_pipeline.py scripts/test_leads_cli.py scripts/test_ui_consistency.py scripts/test_i18n.py scripts/test_lightbox_navigation.py scripts/test_lightbox_multifoto.py scripts/test_a11y_legal.py scripts/test_audit_regressions.py scripts/test_performance_seo.py scripts/test_visual_chroma.py
	@echo "✔ SOLRAC Atelier verificado bajo estándar Noesis."

check-browser:
	@$(BROWSER_PYTHON) -B -m unittest -v scripts/test_browser_regressions.py

test: check
	@echo "✔ Tests de estructura completados con éxito."

ignite:
	@echo "=== SOLRAC Atelier · ignite local ==="
	@cat "$(IGNITE_ROOT)/AGENTS.md"

merge:
ifeq ($(PROJECT_TRANSVERSAL),1)
	@cd "$(SCOPE_ROOT)" && bash "$(SCOPE_ROOT)/scripts/transversal.sh" merge "$${MSG:-}"
else
	@cd "$(SCOPE_ROOT)" && bash scripts/merge.sh "$${MSG:-}"
endif

escala:
	@python3 ../noesis/mando.py escala --satelite solrac-atelier 2>/dev/null || echo "✖ Noesis no disponible en ruta hermana."

mariskal:
	@python3 ../noesis/mando.py mariskal solrac-atelier $(if $(TICKET),--ticket $(TICKET),) $(if $(WORKTREE),--worktree $(WORKTREE),) $(if $(DISPATCH),--dispatch,) $(if $(JSON),--json,)

magnus: mariskal


# Testigo de relevo canónico de flota (Noesis `mando.py relevo`).
.PHONY: relevo
relevo:
	@principal="$$(dirname "$$(git rev-parse --path-format=absolute --git-common-dir)")"; sat="$$(basename "$$principal")"; AUTOR="$(AUTOR)" ENTREGADO="$(ENTREGADO)" ESTADO="$(ESTADO)" NOTAS="$(NOTAS)" \
	python3 "$$principal/../noesis/mando.py" relevo "$$sat" --raiz "$(CURDIR)"
