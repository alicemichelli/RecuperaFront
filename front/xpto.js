var uriChamados = `http://localhost:3000/read`;
var chamados = [];
var saldo = 0;

const creditos = document.querySelector("#creditos");
const selectdescricaos = document.querySelector("#descricaos");

//Mostrar mensagens do sistema
function msg(m) {
    document.querySelector('#modais').setAttribute('style', 'display:flex');
    document.querySelector('#modalMsg').setAttribute('style', 'display:block');
    document.querySelector("#msg").innerHTML = m;
}

//Verificar se recebeu alguma mensagem através da URL
function verificarURLMsgs() {
    if (localStorage.getItem('msg') != null) {
        msg(localStorage.getItem('msg'));
        localStorage.removeItem('msg');
    }
}

//Carregar todos os dados na lista "chamados" para montar a página inicial
function carregarTodos() {
    fetch(uriChamados)
        .then(res => { return res.json() })
        .then(descricao => {
            chamados = descricao;
            tabelaSolicitacoes();
            verificarURLMsgs();
        })
        .catch(err => msg('Erro ao carregar dados, Erro:' + err));
    resumo.innerHTML = `<hr/>Saldo acumulado: R$ ${saldo}`;
}

//Carregar a tabela de Créditos
function tabelaSolicitacoes() {
    chamados.forEach(e => {
        if (e.hora_inicio  ) {
            creditos.appendChild(tabtipo(e));
            saldo += parseFloat(e.hora);
        }
    });
}


function tabtipo(dados) {
    let linha = document.createElement("tr");
    let tipo = document.createElement("td");
    let severidade = document.createElement("td");
    let descricao = document.createElement("td");
    let data = document.createElement("td");
    let hora = document.createElement("td");
    let hora_inicio = document.createElement("td");
    let hora_fim = document.createElement("td");
    let destino = document.createElement("td");


    tipo.innerHTML = dados.tipo;
    severidade.innerHTML = dados.severidade;
    descricao.innerHTML = dados.descricao.split('T')[0];
    data.innerHTML = dados.data;
    hora.innerHTML = dados.hora;
    hora_inicio.innerHTML = dados.hora_inicio == 'D' ? "Entrada" : "Saída";
    hora_fim.innerHTML = dados.hora_fim == 'D' ? "Entrada" : "Saída";
    destino.innerHTML = dados.destino;


    linha.appendChild(tipo);
    linha.appendChild(severidade);
    linha.appendChild(descricao);
    linha.appendChild(data);
    linha.appendChild(hora);
    linha.appendChild(hora_inicio);
    linha.appendChild(hora_fim);
    linha.appendChild(destino);


    return linha;
}




//Criar novo lançamento
function abrirChamado() {
    //Cria um objeto com os dados dos campos html <input>
    let corpo = {
        "descricao": document.querySelector("#descricao").value,
        "tipo": document.querySelector("#tipo").value,
        "severidade": document.querySelector("#severidade").value,
        "destino": document.querySelector("#destino").value

    }
    //Cria outro objeto com os dados da requisição HTTP
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };
    //Acrescenta o corpo na requisição no formato JSON
    options.body = JSON.stringify(corpo);
    //Faz efetivamente a requisição ao back-end
    fetch(uriChamados, options)
        .then(resp => resp.status)
        .then(resp => {
            if (resp == 201) {
                localStorage.setItem('msg', 'Chamado aberto com sucesso.');
                window.location.reload();
            } else {
                localStorage.setItem('msg', 'Erro ao enviar dados ao Banco de dados:' + resp);
                window.location.reload();
            }
        })
        .catch(err => alert(err));
}