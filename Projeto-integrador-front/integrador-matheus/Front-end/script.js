const modal = document.querySelector(".modal-container");
const tbody = document.querySelector("tbody");
const sId = document.querySelector("#m-id");
const sModelo = document.querySelector("#m-modelo");
const sAno = document.querySelector("#m-ano");
const sPreco = document.querySelector("#m-preco");
const sCor = document.querySelector("#m-cor");
const sPlaca = document.querySelector("#m-placa");
const btnSalvar = document.querySelector("#btnSalvar");

let itens;
let id;

function openModal(edit = false, index = 0) {
  modal.classList.add("active");

  modal.onclick = (e) => {
    if (e.target.className.indexOf("modal-container") !== -1) {
      modal.classList.remove("active");
    }
  };

  if (edit) {
    sId.value = itens[index].id;
    sModelo.value = itens[index].modelo;
    sAno.value = itens[index].ano;
    sPreco.value = itens[index].preco;
    sCor.value = itens[index].cor;
    sPlaca.value = itens[index].placa;
    id = index;
  } else {
    sId.value = "";
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
    <td>${item.id}</td>
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
  if (sId.value == "" || sModelo.value == "" || sAno.value == "" || sPreco.value == "" || sCor.value == "" || sPlaca.value == "") {
    return;
  }

  e.preventDefault();

  const carImage = document.getElementById('m-img').files[0]; // Pegando o arquivo de imagem

  // Verifica se a imagem foi carregada
  if (!carImage) {
    alert("Por favor, carregue uma imagem.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    // O base64 da imagem
    const carImageData = e.target.result;
    
    // Se estamos editando um item existente
    if (id !== undefined) {
      itens[id].id = sId.value;
      itens[id].modelo = sModelo.value;
      itens[id].ano = sAno.value;
      itens[id].preco = sPreco.value;
      itens[id].cor = sCor.value;
      itens[id].placa = sPlaca.value;
      itens[id].imagem = carImageData; // Salvando a imagem no item editado
    } else {
      itens.push({
        id: sId.value,
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

    loadItens(); // Atualizar a tabela

    id = undefined; // Resetando o id
  };

  // Lendo o arquivo da imagem como base64
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

const getItensBD = () => JSON.parse(localStorage.getItem("dbfunc")) ?? [];
const setItensBD = () => localStorage.setItem("dbfunc", JSON.stringify(itens));

loadItens();

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

// Função para colocar a vírgula no preço
function virgula(event) {
  const campo = event.target;
  let valor = campo.value.replace(/\D/g, '');  

  if (valor.length > 9) {
    valor = valor.slice(0, 9);
  }

  if (valor.length > 7) {
    valor = valor.slice(0, 7) + ',' + valor.slice(7);
  }

  campo.value = valor;
}

// Função para visualizar a imagem antes de salvar
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
