var url = "http://localhost:3000/tarefas";
var key = "648c9e4ef64735fd4b4f0db1222f825f";


carregarTarefas();

function carregarTarefas() {
  fetch(url + "/listar")
.then(function(res) {
      return res.json();
    })
.then(function(tarefas) {
      mostrarTarefas(tarefas);
    });
}

function mostrarTarefas(tarefas) {
  var container = document.getElementById("tarefas-container");
  if (!container) return;

  container.innerHTML = "";

  if (tarefas.length == 0) {
    container.innerHTML = "<p>Nenhuma tarefa cadastrada</p>";
    return;
  }

  for (var i = 0; i < tarefas.length; i++) {
    var t = tarefas[i];
    var card = document.createElement("div");
    card.className = "card";
    card.onclick = (function(id) {
      return function() {
        editar(id);
      }
    })(t.id);

    
    var linkImg = localStorage.getItem("img_" + t.id);

   
    var imagemHtml = "";
    if (linkImg && linkImg!= "") {
      imagemHtml = '<img src="' + linkImg + '">';
    }

    card.innerHTML = imagemHtml +
      '<h3>' + t.nome + '</h3>' +
      '<p>Início: ' + t.diainicio + '</p>' +
      '<p>Fim: ' + t.diafim + '</p>' +
      '<p>' + t.descricao + '</p>' +
      '<button onclick="excluir(event, ' + t.id + ')">Excluir</button>';

    container.appendChild(card);
  }
}

function excluir(event, id) {
  event.stopPropagation();
  if (confirm("Deseja excluir tarefa?")) {
    localStorage.removeItem("img_" + id);
    fetch(url + "/excluir/" + id, { method: "DELETE" })
.then(function() {
        carregarTarefas();
      });
  }
}

function editar(id) {
  fetch(url + "/buscar/" + id)
.then(function(res) {
      return res.json();
    })
.then(function(t) {
      document.getElementById("tituloModal").innerHTML = "Editar Tarefa";
      document.getElementById("idTarefa").value = t.id;
      document.getElementById("nome").value = t.nome;
      document.getElementById("inicio").value = t.diainicio;
      document.getElementById("fim").value = t.diafim;
      document.getElementById("descricao").value = t.descricao;

      var img = localStorage.getItem("img_" + t.id);
      if (img) {
        document.getElementById("imagem").value = img;
      } else {
        document.getElementById("imagem").value = "";
      }

      document.getElementById("modal").style.display = "block";
    });
}

function abrirModalCriar() {
  document.getElementById("tituloModal").innerHTML = "Nova Tarefa";
  document.getElementById("idTarefa").value = "";
  document.getElementById("modal").style.display = "block";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("nome").value = "";
  document.getElementById("inicio").value = "";
  document.getElementById("fim").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("imagem").value = "";
  document.getElementById("idTarefa").value = "";
}

function salvarTarefa() {
  var id = document.getElementById("idTarefa").value;
  var nome = document.getElementById("nome").value;
  var inicio = document.getElementById("inicio").value;
  var fim = document.getElementById("fim").value;
  var descricao = document.getElementById("descricao").value;
  var imagem = document.getElementById("imagem").value;

  if (nome == "" || inicio == "" || fim == "" || descricao == "") {
    alert("Preencha todos os campos!");
    return;
  }

  var dados = {
    nome: nome,
    diainicio: inicio,
    diafim: fim,
    descricao: descricao
  };

  if (id!= "") {
   
    fetch(url + "/atualizar/" + id, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(dados)
    })
 .then(function(res) {
      return res.json();
    })
 .then(function(data) {
      if (imagem!= "") {
        localStorage.setItem("img_" + id, imagem);
      } else {
        localStorage.removeItem("img_" + id);
      }
      fecharModal();
      carregarTarefas();
    });
  } else {

    fetch(url + "/cadastrar", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(dados)
    })
 .then(function(res) {
      return res.json();
    })
 .then(function(data) {
      if (imagem!= "") {
        localStorage.setItem("img_" + data.id, imagem);
      }
      fecharModal();
      carregarTarefas();
    });
  }
}


function buscarClima() {
  var cidade = document.getElementById("cidade").value;
  if (cidade == "") {
    return;
  }

  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cidade + "&appid=" + key + "&lang=pt_br&units=metric")
.then(function(res) {
      return res.json();
    })
.then(function(dados) {
      if (dados.cod == "404") {
        return;
      }
      mostrarClima(dados);
    });
}

function mostrarClima(dados) {
  var container = document.getElementById("clima-container");
  var card = document.createElement("div");
  card.className = "card";

  card.innerHTML = '<h3>' + dados.name + '</h3>' +
    '<p style="font-size: 30px;">' + Math.floor(dados.main.temp) + '°C</p>' +
    '<img src="https://openweathermap.org/img/wn/' + dados.weather[0].icon + '.png" style="width:50px; height:50px;">' +
    '<p>' + dados.weather[0].description + '</p>' +
    '<p>Umidade: ' + dados.main.humidity + '%</p>';

  container.appendChild(card);
}

function limparClima() {
  document.getElementById("clima-container").innerHTML = "";
}