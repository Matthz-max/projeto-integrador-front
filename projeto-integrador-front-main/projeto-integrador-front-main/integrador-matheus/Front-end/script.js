const modal = document.querySelector(".modal-container");
const tbody = document.querySelector("tbody");
const sModelo = document.querySelector("#m-modelo");
const sAno = document.querySelector("#m-ano");
const sPreco = document.querySelector("#m-preco");
const sCor = document.querySelector("#m-cor");
const sPlaca = document.querySelector("#m-placa");
const btnSalvar = document.querySelector("#btnSalvar");
const modalConfirm = document.querySelector("#modalConfirm");
const btnConfirmDelete = document.querySelector("#btnConfirmDelete");
const btnCancelDelete = document.querySelector("#btnCancelDelete");

//const principais(o resto pode ficar dentro das fuctions mesmo)
//////////////////////////////////
let itens;
let modelo;

//te amo modal
function openModal(edit = false, index = 0) {
  modal.classList.add("active");

  modal.onclick = (e) => {
    if (e.target.className.indexOf("modal-container") !== -1) {
      modal.classList.remove("active");
    }
  };

  if (edit) {
    sModelo.value = itens[index].modelo;
    sAno.value = itens[index].ano;
    sPreco.value = itens[index].preco;
    sCor.value = itens[index].cor;
    sPlaca.value = itens[index].placa;
    id = index;
  } else {
    sModelo.value = "";
    sAno.value = "";
    sPreco.value = "";
    sCor.value = "";
    sPlaca.value = "";
  }
}

function editItem(index) {
  openModal(true, index);
}

function deleteItem(index) {
  itens.splice(index, 1);
  setItensBD();
  loadItens();
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td><img src="${item.imagem}" alt="Imagem do Carro" style="max-width: 100px; max-height: 100px;" /></td> <!-- Exibindo a imagem -->
    <td>${item.modelo}</td>
    <td>${item.ano}</td>
    <td>${item.preco}</td>
    <td>${item.cor}</td>
    <td>${item.placa}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

btnSalvar.onclick = (e) => {
  if (sModelo.value == "" || sAno.value == "" || sPreco.value == "" || sCor.value == "" || sPlaca.value == "") {
    return;
  }

  e.preventDefault();

  const carImage = document.getElementById('m-img').files[0]; 

  // Verifica se a imagem foi carregada
  if (!carImage) {
    alert("Por favor, carregue uma imagem.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
 
    const carImageData = e.target.result;
    
     
    if (modelo !== undefined) {
      itens[modelo].modelo = sModelo.value;
      itens[modelo].ano = sAno.value;
      itens[modelo].preco = sPreco.value;
      itens[modelo].cor = sCor.value;
      itens[modelo].placa = sPlaca.value;
      itens[modelo].imagem = carImageData; // Salvando a imagem no item editado
    } else {
      itens.push({
        modelo: sModelo.value,
        ano: sAno.value,
        preco: sPreco.value,
        cor: sCor.value,
        placa: sPlaca.value,
        imagem: carImageData // Adicionando a imagem ao novo carro
      });
    }

    setItensBD(); // Atualizar o localStorage

    modal.classList.remove("active");

    loadItens();  

    modelo = undefined;  
  };

   
  reader.readAsDataURL(carImage);
};

// Carregar os itens armazenados no LocalStorage
function loadItens() {
  itens = getItensBD();
  tbody.innerHTML = ""; // Limpar a tabela
  itens.forEach((item, index) => {
    insertItem(item, index);
  });
}



// Função para formatar a placa (semelhante à da vida real)
function formatarPlaca(event) {
  const campo = event.target;
  let valor = campo.value.toUpperCase();
  
  valor = valor.replace(/[^A-Za-z0-9]/g, ''); 

  let parte1 = valor.slice(0, 3);
  let parte2 = valor.slice(3, 7);
  
  parte1 = parte1.replace(/[^A-Za-z]/g, '');
  parte2 = parte2.replace(/[^0-9]/g, '');
  
  if (parte2.length > 4) {
    parte2 = parte2.slice(0, 4);
  }

  valor = parte1 + (parte2 ? '-' + parte2 : '');
  
  campo.value = valor;
}

// função para colocar virgula no preço
function virgula(event) {
  const campo = event.target;
  let valor = campo.value.replace(/\D/g, '');  // Remove todos os caracteres não numéricos
  
  if (valor.length > 8) {
    valor = valor.slice(0, 8);
  }
  9
  let resultado = '';
  for (let i = 0; i < valor.length; i++) {
    if (i > 0 && (valor.length - i) % 3 === 0) {
      resultado += ',';   
    }
    resultado += valor[i];
  }
  campo.value = resultado;
}

// Função para visualizar a imagem(vai dar trabalho para deixar bonito)
document.getElementById('m-img').addEventListener('change', function (event) {
  const file = event.target.files[0];
  const preview = document.querySelector('#carImagePreview');
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});
  
let itemToDelete = null;  

function showConfirmDeleteModal(index) {
  itemToDelete = index;  
  modalConfirm.classList.add("active");
}

btnConfirmDelete.onclick = () => {
  if (itemToDelete !== null) {
    deleteItem(itemToDelete);
    itemToDelete = null;  
  }
  modalConfirm.classList.remove("active");  
};

btnCancelDelete.onclick = () => {
  itemToDelete = null;  
  modalConfirm.classList.remove("active");  
};

// Função de excluir o item
function deleteItem(index) {
  itens.splice(index, 1);
  setItensBD();
  loadItens();
}


/////////////////////////////////////////////////////////////
function insertItem(item, index) {
  let tr = document.createElement("tr");
  
  tr.innerHTML = `
  <td><img src="${item.imagem}" alt="Imagem do Carro" style="max-width: 100px; max-height: 100px;" /></td>
  <td>${item.modelo}</td>
  <td>${item.ano}</td>
  <td>${item.preco}</td>
  <td>${item.cor}</td>
  <td>${item.placa}</td>
  <td class="acao">
  <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
  </td>
  <td class="acao">
  <!-- Alterar a chamada para o modal de confirmação -->
  <button onclick="showConfirmDeleteModal(${index})"><i class='bx bx-trash'></i></button>
  </td>
  `;
  tbody.appendChild(tr);
}
//////////////////////////////////////////////////////////////////
//outra função de aceitar apenas numeros pq a merda do maxlenght nao funciona com number
function apenasnumeros(event){
  const campo = event.target;
  let valor = campo.value.replace(/\D/g, '');  
  
  campo.value = valor;
  
}

//////////////////////////////////////////////////////////////
//limitando o ano para 2024 pq vai ter doente que vai tentar colocar ano 2343
function limitarAno(event) {
  const campo = event.target;  
  let valor = parseInt(campo.value, 10);  
  
  if (valor > 2024) {
    campo.value = 2024; 
  }
}
const inputAno = document.querySelector("#m-ano");

inputAno.addEventListener("input", limitarAno);

///////////////////////////////////////////////////////////

function apenasletras(event){
  const campo = event.target;
  let valor = campo.value;
  
  // Remove tudo o que não for letra (A-Z, a-z)
  valor = valor.replace(/[^A-Za-z]/g, '');
  
  campo.value = valor;
}

const inputLetras = document.querySelector("#m-cor");
inputLetras.addEventListener("input", apenasletras);
//quem ler é viado(Matheus Serafim está imune)

const getItensBD = () => JSON.parse(localStorage.getItem("dbfunc")) ?? [];
const setItensBD = () => localStorage.setItem("dbfunc", JSON.stringify(itens));

loadItens();