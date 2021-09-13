<template>
  <div>
    <div class="row">
      <div class="col-sm-10">
        <h1 class="font-weight-light">Lista de Tarefas</h1>
      </div>
      <div class="col-sm-2">
        <button
          class="btn btn-primary float-right"
          @click="exibirFormularioCriarTarefa"
        >
          <i class="fa fa-plus mr-2"></i>
          <span>Criar</span>
        </button>
      </div>
    </div>

    <ul class="list-group" v-if="tarefas.length > 0">
      <TarefasListaItem
        v-for="tarefa in tarefasOrdenadas"
        :key="tarefa.id"
        :tarefa="tarefa"
        @editar="selecionarTarefaParaEdicao"
        @deletar="deletarTarefa"
        @concluir="editarTarefa"
      />
    </ul>

    <p v-else>Nenhuma tarefa criada.</p>

    <TarefaSalvar
      v-if="exibirFormulario"
      :tarefa="tarefaSelecionada"
      @criar="criarTarefa"
      @editar="editarTarefa"
    />
  </div>
</template>

<script>
import axios from "axios";

import config from "./../config/config.js";
import TarefaSalvar from "./TarefaSalvar.vue";
import TarefasListaItem from "./TarefasListaItem.vue";

export default {
  components: {
    TarefaSalvar,
    TarefasListaItem,
  },
  data() {
    return {
      tarefas: [],
      exibirFormulario: false,
      tarefaSelecionada: undefined,
    };
  },
  computed: {
    tarefasOrdenadas() {
      return this.tarefas.slice().sort((tarefa1, tarefa2) => {
        if (tarefa1.concluido === tarefa2.concluido){
          return tarefa1.titulo < tarefa2.titulo
            ? -1
            : tarefa1.titulo > tarefa2.titulo
              ? 1
              : 0
        }
        return tarefa1.concluido - tarefa2.concluido
      })
    }
  },
  created() {
    this.carregarTarefas();
  },
  methods: {
    carregarTarefas() {
      axios.get(`${config.apiURL}/tarefas`).then((response) => {
        this.tarefas = response.data;
      });
    },
    criarTarefa(tarefa) {
      axios.post(`${config.apiURL}/tarefas`, tarefa).then((response) => {
        this.tarefas.push(response.data);
        this.resetar();
      });
    },
    deletarTarefa(tarefa) {
      const confirmar = window.confirm(
        `Deseja excluir a tarefa "${tarefa.titulo}"?`
      );
      if (confirmar) {
        axios
          .delete(`${config.apiURL}/tarefas/${tarefa.id}`)
          .then((response) => {
            console.log(`DELETE /tarefas/${tarefa.id}`, response);
            const indice = this.tarefas.findIndex((t) => t.id === tarefa.id);
            this.tarefas.splice(indice, 1);
          });
      }
    },
    editarTarefa(tarefa) {
      axios
        .put(`${config.apiURL}/tarefas/${tarefa.id}`, tarefa)
        .then((response) => {
          console.log(`PUT /tarefas/${tarefa.id}`, response);
          const indice = this.tarefas.findIndex((t) => t.id === tarefa.id);
          this.tarefas.splice(indice, 1, tarefa);
          this.resetar();
        });
    },
    exibirFormularioCriarTarefa(event){
      if (this.tarefaSelecionada){
        this.tarefaSelecionada = undefined;
        return
      }
      this.exibirFormulario = !this.exibirFormulario;
    },
    resetar() {
      this.tarefaSelecionada = undefined;
      this.exibirFormulario = false;
    },
    selecionarTarefaParaEdicao(tarefa) {
      this.tarefaSelecionada = tarefa;
      this.exibirFormulario = true;
    },
  },
};
</script>
