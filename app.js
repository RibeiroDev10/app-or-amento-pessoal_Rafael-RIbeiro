//VARIÁVEIS "LET ano..." ARMAZENAM O ELEMENTO HTML COM SEU RESPECTIVO ID NO DOM
function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    //VARÍAVEL "let despesa" QUE VAI CONTER O OBJETO: DESPESA
    //PARÂMETROS DE "new Despesa" SERÃO ENVIADOS AO: CONSTRUCTOR
    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value)

    if (despesa.validarDados()) {

        //APÓS ARMAZENAR OS VALORES DOS ELEMENTOS HTML NAS INSTRUÇÕES A CIMA 
        //EXECUTAMOS A FUNÇÃO "GRAVAR", QUE IRÁ SETAR OS VALORES DENTRO DE LOCALSTORAGE DE FORMA JSON STRING
        //CHAMA O OBJETO "BD", PASSANDO A FUNÇÃO "GRAVAR" PASSANDO O OBJETO "DESPESA" COMO PARÂMETRO
        bd.gravar(despesa)

        //modificando os elementos HTML (de forma programática) no caso de sucesso
        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa cadastrada com sucesso!'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'

        //dialog de sucesso
        //retorn true no método validarDados dentro do objeto Despesa
        $('#modalRegistraDespesa').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else {
        //dialog de erro
        //retorn false no método validarDados dentro do objeto Despesa
        $('#modalRegistraDespesa').modal('show')

        //modificando os elementos HTML (de forma programática) no caso de erro
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registo.'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação verifique se todos os campos foram preenchidos corretamente.'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'
    }
}

//OBJETO - DESPESA
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano //ATRIBUTOS QUE RECEBEM A variavel "ano" referente ao parâmetro de "new Despesa" com valor (inputado) no elemento id 'ano'
        this.mes = mes //variavel com valor (inputado) no elemento id 'mes'
        this.dia = dia //variavel com valor (inputado) no elemento id 'dia'
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    //valida se os campos foram preenchidos corretamente
    //se não foram, retorna false implicando no id = erroGravacao
    //se foram, retorna true implicando no id = sucessoGravacao
    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

//INDÍCES DINÂMICOS
//CLASSE/OBJETO "BD" QUE NOS PERMITE INSTANCIAR UM OBJETO PARA LIDAR COM O BANCO DE DADOS (LOCAL STORAGE)
//PARA QUE NÃO AJA SOBREPOSIÇÃO
//RESPONSÁVEL POR CONTROLAR NOSSA COMUNICAÇÃO COM LOCAL STORAGE
class Bd {

    //VERIFICA SE EXISTE "ID" E SETA UM VALOR SE NÃO EXISTIR NENHUMA KEY "ID"
    constructor() {
        let id = localStorage.getItem('id')

        //SE NÃO EXISTIR "ID", SETAMOS UMA KEY COM NOME "ID" E O VALUE, NESTE CASO "0"
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    //PEGA O "ID" DO INDÍCE ATUAL E ADICIONA +1 KEY '1, 2, 3...' E 'VALUE' FAZENDO QUE NÃO ACONTEÇA A SOBREPOSIÇÃO
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return (parseInt(proximoId) + 1)
    }

    //FUNÇÃO/MÉTODO QUE INSERE OS DADOS EM LOCAL STORAGE (BANCO DE DADOS WEB)
    //PARÂMETRO DE GRAVAR "(d)" será enviado ao: bd.gravar(despesa) que REFERE-SE (parametro) ao OBJETO DESPESA
    gravar(d) {

        //variável "let id" pega o método "getProximoId (que retorna: id e value + 1)"
        let id = this.getProximoId()

        //SETA OS VALORES DO OBJETO "despesa (variável) - parâmetro (d)" DENTRO DE LOCALSTORAGE DE MODO JSON STRING
        localStorage.setItem(id, JSON.stringify(d))

        //atualiza o valor contido dentro da chave "id" com a informação do novo id (varíavel let id à cima) produzido pelo método getProximoId
        //id + 1
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {

        //ARRAY de DESPESAS
        let despesas = Array()

        //obtem o id de localstorage
        let id = localStorage.getItem('id')

        //recuperar todas as despesas cadastradas em localstorage
        //vai percorrer os indices dentro de localstorage de 1 até ser menor que ID
        for (let i = 1; i <= id; i++) {

            //recuperar despesa
            //obtem, recupera e guarda todos os itens que foram percorridos no laço
            let despesa = JSON.parse(localStorage.getItem(i))

            //verificar possibilidade se existe indices que foram pulados/removidos
            //vamos pular esses indices
            //despesa se refere ao item obtido durante a repetição de indices
            if (despesa == null) {
                continue // faz com que o laço avance para a proxima interação, pula para a próxima interação do laço, antes que o push seja executado
            }

            despesa.id = 1

            //adiciona mais um indice no final do array
            //o indice adicionado é baseado na variavel "i" que está como parâmetro (despesa), que vai percorrer a estrutura de repetição em localStorage
            despesas.push(despesa)
        }

        return despesas
    }

    //recuperar os dados obtidos em LocalStorage
    pesquisar(despesa) {
        //recuperando o parametro despesa, que é o objeto que contem os detalhes preenchidos no formulario de consulta

        let despesasFiltradas = Array()
        //pegar todos os itens para depois atuar sobre esses itens filtrando ou não
        despesasFiltradas = this.recuperarTodosRegistros()

        //ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        //mes
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        //dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descricao
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        //valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }
    
    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

//objetivo dessa função será ser chamada sempre que houver o "onload" no body de HTML
function carregaListaDespesas(despesas = Array(), filtro = false) {

    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }

    //selecionando o elemento TBODY (consulta.html) da tabela  
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    //percorrer o array "despesas" listando cada despesa de forma dinamica
    despesas.forEach(function (d) {

        //criando a linha (tr)
        let linha = listaDespesas.insertRow()

        //criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        //ajustar o tipo
        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criar botão de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function () {
            //remover despesa

            let id = this.id.replace('id_despesa_', '')

            bd.remover(id)

            window.location.reload
        }
        linha.insertCell(4).append(btn)

        console.log(d)
    })
}

//função que será acionada quando o evento de click do mouse for sob o botão de pesquisa na página de consulta.html
//recupera o value do elemento html no respectivo id
function pesquisarDespesa() {

    //pega o value do campo com o id referido. Ex: 'ano'
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    this.carregaListaDespesas(despesas, true)


}