# Makefile — SOLRAC Atelier
# Sujeto a gobernanza Top-Down de Noesis

IGNITE_ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))

.PHONY: help sync test check ignite serve

help:
	@echo "SOLRAC Atelier — Comandos disponibles:"
	@echo "  make serve   — Iniciar servidor web local en http://localhost:8080"
	@echo "  make sync    — Sincronizar cambios locales y remotos con GitHub"
	@echo "  make check   — Verificación de salud y archivos canónicos"
	@echo "  make test    — Validar sintaxis y estructura del portfolio"
	@echo "  make ignite  — Despertar táctico y lectura de identidad"

serve:
	@echo "Iniciando portfolio web en http://localhost:8080 ..."
	@python3 -m http.server 8080

sync:
	@git pull --rebase --autostash --prune origin main

check:
	@test -f index.html || { echo "✖ Falta index.html" >&2; exit 1; }
	@test -f TABLERO_AGENTES.md || { echo "✖ Falta TABLERO_AGENTES.md" >&2; exit 1; }
	@echo "✔ SOLRAC Atelier verificado bajo estándar Noesis."

test: check
	@echo "✔ Tests de estructura completados con éxito."

ignite:
	@echo "=== SOLRAC Atelier · ignite local ==="
	@cat "$(IGNITE_ROOT)/AGENTS.md"
