ifneq ($(filter default undefined,$(origin MAKECMDGOALS)),$(origin MAKECMDGOALS))
$(error MAKECMDGOALS no se acepta como variable de autorización)
endif
# Contrato local por defecto; el marcador de flota procede solo de los goals.
override PROJECT_ACTIONS := $(filter sync merge,$(MAKECMDGOALS))
ifneq ($(strip $(PROJECT_ACTIONS)$(filter transversal,$(MAKECMDGOALS))),)
ifneq ($(words $(PROJECT_ACTIONS)),1)
$(error Uso: make sync [transversal] o make merge [transversal] MSG="...")
endif
ifneq ($(filter-out sync merge transversal,$(MAKECMDGOALS)),)
$(error Argumentos de alcance inválidos; ninguna operación ejecutada)
endif
ifneq ($(words $(filter transversal,$(MAKECMDGOALS))),$(words $(sort $(filter transversal,$(MAKECMDGOALS)))))
$(error Marcador transversal repetido)
endif
endif
override PROJECT_TRANSVERSAL := $(if $(filter transversal,$(MAKECMDGOALS)),1,0)
ifeq ($(PROJECT_TRANSVERSAL),1)
ifneq ($(strip $(PR)$(BRANCH)$(FULL)),)
$(error PR/BRANCH/FULL no son argumentos de operaciones transversales)
endif
endif
.PHONY: transversal
transversal:
	@:

export PATH := $(SCOPE_ROOT)/scripts:$(PATH)
