const nama = document.getElementById("nama");
const harga = document.getElementById("harga");
const jumlah = document.getElementById("jumlah");
const errNama = document.getElementById("errNama");
const errHarga = document.getElementById("errHarga");
const errJumlah = document.getElementById("errJumlah");
const formBarang = document.getElementById("formBarang");
const HARGA_MIN = 500;
let cekError = "";
let namaValue = nama.value.trim();
let hargaValue = parseFloat(harga.value);
let jumlahValue = Number(jumlah.value);

let daftarKeranjang = [];

formBarang.addEventListener("submit", function (event) {
  event.preventDefault();
  namaValue = nama.value.trim();
  hargaValue = parseFloat(harga.value);
  jumlahValue = Number(jumlah.value);

  if (namaValue.length <= 2) {
    errNama.textContent = "Nama barang minimal 3 karakter.";
    cekError = "error";
  } else {
    errNama.textContent = "";
  }

  if (isNaN(hargaValue) || hargaValue < HARGA_MIN) {
    errHarga.textContent = `Harga barang minimal ${HARGA_MIN}.`;
    cekError = "error";
  } else {
    errHarga.textContent = "";
  }

  if (!Number.isInteger(jumlahValue) || jumlahValue < 1) {
    errJumlah.textContent =
      "Jumlah barang minimal 1 dan berupa bilangan bulat.";
    cekError = "error";
  } else {
    errJumlah.textContent = "";
  }

  if (cekError === "error") {
    cekError = "";
    return;
  }

  daftarKeranjang.push({
    namaBarang: namaValue,
    hargaBarang: hargaValue,
    jumlahBarang: jumlahValue,
  });

  simpanKeranjang();
  tampilkanKeranjang();

  formBarang.reset();
});

const tbodyKeranjang = document.getElementById("isiKeranjang");
const keranjangKosong = document.getElementById("keranjangKosong");
const KUNCI_KERANJANG = "keranjangGokil";
const transaksiBaru = document.getElementById("transaksiBaru");
const KODE_PROMO = "HEMAT10";
let CEK_DISKON = false;
const kodePromo = document.getElementById("kodePromo");
const errKodePromo = document.getElementById("errKodePromo");
const kembalian = document.getElementById("kembalian");
const uangBayar = document.getElementById("uangBayar");
const errUangBayar = document.getElementById("errUangBayar");

function tampilkanKeranjang() {
  document.getElementById("totalBelanja").innerHTML = hitungJumlahSubtotal();
  hitungJumlahAkhir();
  tbodyKeranjang.innerHTML = "";
  keranjangKosong.hidden = daftarKeranjang.length > 0;

  daftarKeranjang.forEach(function (item, index) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.namaBarang}</td>
        <td>${item.hargaBarang}</td>
        <td>${item.jumlahBarang}</td>
        <td>${item.hargaBarang * item.jumlahBarang}</td>
        <td><button type="button" data-index="${index}">Hapus</button></td>
    `;
    tbodyKeranjang.appendChild(tr);
  });
  hitungKembalian();
}

function simpanKeranjang() {
  localStorage.setItem(KUNCI_KERANJANG, JSON.stringify(daftarKeranjang));
}

function muatKeranjang() {
  const teks = localStorage.getItem(KUNCI_KERANJANG);
  daftarKeranjang = teks ? JSON.parse(teks) : [];
}

tbodyKeranjang.addEventListener("click", function (event) {
  const index = event.target.dataset.index;
  if (index === undefined) {
    return;
  }
  hapusBarang(Number(index));
});

function hapusBarang(index) {
  daftarKeranjang.splice(index, 1);
  simpanKeranjang();
  tampilkanKeranjang();
}

function resetKeranjang() {
  daftarKeranjang = [];
  localStorage.removeItem(KUNCI_KERANJANG);
  uangBayar.value = "";
  CEK_DISKON = false;
  tampilkanKeranjang();
}

transaksiBaru.addEventListener("click", resetKeranjang);

function hitungJumlahSubtotal() {
  return daftarKeranjang.reduce(function (hasil, n) {
    return hasil + n.hargaBarang * n.jumlahBarang;
  }, 0);
}

function cekPromo() {
  const isiKode = kodePromo.value;
  if (isiKode === KODE_PROMO) {
    CEK_DISKON = true;
    errKodePromo.textContent = "";
  } else {
    errKodePromo.textContent = "Kode promo tidak valid.";
  }
  kodePromo.value = "";

  hitungJumlahAkhir();
  hitungKembalian();
}

kodePromo.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    cekPromo();
  }
});

function hitungJumlahAkhir() {
  const subtotal = hitungJumlahSubtotal();
  let diskon = 0;

  if (subtotal >= 50000 || CEK_DISKON === true) {
    diskon = Math.round(subtotal * 0.1);
  }

  const totalAkhir = subtotal - diskon;

  document.getElementById("diskon").innerHTML = diskon;
  document.getElementById("totalAkhir").innerHTML = totalAkhir;
  return totalAkhir;
}

function hitungKembalian() {
  const bayar = uangBayar.value.trim();

  if (bayar === "") {
    kembalian.textContent = 0;
    errUangBayar.textContent = "";
    return;
  }

  const totalAkhir = hitungJumlahAkhir();
  const bayarAngka = Number(bayar);

  if (bayarAngka >= totalAkhir) {
    kembalian.textContent = bayarAngka - totalAkhir;
    errUangBayar.textContent = "";
  } else {
    kembalian.textContent = 0;
    errUangBayar.textContent = "Uang belum mencukupi.";
  }
}

uangBayar.addEventListener("input", hitungKembalian);

muatKeranjang();
tampilkanKeranjang();
