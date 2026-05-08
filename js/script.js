// ==========================================
// LOGIKA LOGIN (KODE ASLI ALMA)
// ==========================================
const form = document.querySelector("form");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.querySelector('input[type="email"]').value;
        const password = document.querySelector('input[type="password"]').value;

        if(email === "" || password === ""){
            alert("Email dan password wajib diisi!");
            return;
        }

        const akunDemo = [
            {
                email: "admin@ut.ac.id",
                password: "admin123",
                nama: "Admin SITTA",
                role: "Administrator",
                lokasi: "Pusat"
            },
            {
                email: "rina@ut.ac.id",
                password: "rina123",
                nama: "Rina Wulandari",
                role: "UPBJJ-UT",
                lokasi: "Jakarta"
            }
        ];

        const user = akunDemo.find(function(akun){
            return akun.email === email && akun.password === password;
        });

        if(user){
            // Simpan data agar dashboard tidak "undefined"
            localStorage.setItem('userLoggedIn', JSON.stringify(user));
            alert("Login berhasil. Selamat datang!");
            
            // Redirect diaktifkan ke dashboard.html
            window.location.href = "dashboard.html";
        }
        else{
            alert("Email atau password salah!");
        }
    });
}

// ==========================================
// LOGIKA LOGOUT
// ==========================================
const btnLogout = document.querySelector('.nav-button.danger');

if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        // Konfirmasi dulu biar gak sengaja ke-klik
        const yakin = confirm("Al, yakin mau keluar dari SITTA QIRKA?");
        
        if (yakin) {
            // Hapus data login jika ada (opsional)
            // localStorage.removeItem('userLogin'); 
            
            // Pindah ke halaman login
            window.location.href = "index.html"; 
        }
    });
}

// ==========================================
// 1. FUNGSI TAMPILKAN STOK (Ditaruh di luar agar bisa diakses semua)
// ==========================================
function tampilkanStok(daftarBuku) {
    const stokContainer = document.getElementById('stok-container');
    if (!stokContainer) return;
    stokContainer.innerHTML = "";

    daftarBuku.forEach(item => {
        stokContainer.innerHTML += `
            <div class="stok-card">
                <span class="stok-badge">${item.stok} Tersedia</span>
                <div class="stok-img-wrapper">
                    <img src="${item.cover}" alt="${item.namaBarang}" onerror="this.src='https://via.placeholder.com/200x300?text=No+Cover'">
                </div>
                <div class="stok-info">
                    <span class="kode-buku">${item.kodeBarang}</span>
                    <h3>${item.namaBarang}</h3>
                    <p class="edisi-buku">Edisi: ${item.edisi}</p>
                    <div class="price-row">
                        <span class="price">${item.harga}</span>
                        <button class="btn-detail">Detail</button>
                    </div>
                </div>
            </div>`;
    });
}

// ==========================================
// 1. FUNGSI RENDER STOK (BERSIH & RAPI)
// ==========================================
function tampilkanStok(daftarBuku) {
    const stokContainer = document.getElementById('stok-container');
    if (!stokContainer) return;
    stokContainer.innerHTML = "";

    daftarBuku.forEach(item => {
        // Logika buang undefined & Rp -
        const hasEdisi = item.edisi && item.edisi !== "undefined" && item.edisi !== "";
        const hasHarga = item.harga && item.harga !== "undefined" && item.harga !== "Rp -" && item.harga !== "";

        const edisiTeks = hasEdisi ? `<p class="edisi-buku">Edisi: ${item.edisi}</p>` : "";
        const hargaTeks = hasHarga ? `<span class="price">${item.harga}</span>` : "";

        stokContainer.innerHTML += `
            <div class="stok-card">
                <span class="stok-badge">${item.stok} Tersedia</span>
                <div class="stok-img-wrapper">
                    <img src="${item.cover}" alt="${item.namaBarang}" onerror="this.src='https://via.placeholder.com/200x300?text=No+Cover'">
                </div>
                <div class="stok-info">
                    <span class="kode-buku">${item.kodeBarang}</span>
                    <h3>${item.namaBarang}</h3>
                    ${edisiTeks}
                    <div class="price-row">
                        ${hargaTeks}
                    </div>
                </div>
            </div>`;
    });
}

// ==========================================
// 2. LOGIKA SEARCH (TETAP ADA & AKTIF)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');

    // Tampilkan data awal dari data.js
    if (typeof dataBahanAjar !== 'undefined') {
        tampilkanStok(dataBahanAjar);
    }

    // Fungsi Pencarian (Gak dihilangin, Al!)
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const keyword = e.target.value.toLowerCase();
            const hasilFilter = dataBahanAjar.filter(buku => 
                buku.namaBarang.toLowerCase().includes(keyword) || 
                buku.kodeBarang.toLowerCase().includes(keyword)
            );
            tampilkanStok(hasilFilter);
        });
    }
});

// ==========================================
// 3. LOGIKA TOMBOL TAMBAH STOK
// ==========================================

// 1. Tangkap dulu input file-nya (Pastikan di HTML id-nya 'fileInput')
const fileInput = document.querySelector('#fileInput'); 
const btnTambah = document.querySelector('.btn-submit-stok');

if (btnTambah) {
    btnTambah.addEventListener('click', function() {
        const inputs = document.querySelectorAll('.stok-input');
        const kode = inputs[0].value;
        const nama = inputs[1].value;
        const jumlah = inputs[2].value;

        // Validasi data teks
        if (kode === "" || nama === "" || jumlah === "") {
            alert("Isi dulu semua datanya ya!");
            return;
        }

        // Validasi: Cek apakah user sudah pilih file gambar
        if (!fileInput || fileInput.files.length === 0) {
            alert("Pilih gambar dari device kamu dulu, Al!");
            return;
        }

        // AMBIL GAMBAR DARI DEVICE:
        // Membuat URL sementara agar gambar langsung muncul di browser
        const fileGambar = fileInput.files[0];
        const linkGambarSementara = URL.createObjectURL(fileGambar);

        const dataBaru = {
            kodeBarang: kode,
            namaBarang: nama,
            stok: parseInt(jumlah),
            edisi: "1", 
            // Cover sekarang pakai link dari device, bukan cuma path 'img/'
            cover: linkGambarSementara 
        };

        if (typeof dataBahanAjar !== 'undefined') {
            dataBahanAjar.push(dataBaru); 
            tampilkanStok(dataBahanAjar); 
            
            // Bersihkan inputan
            inputs.forEach(input => input.value = "");
            fileInput.value = ""; // Reset pilihan file
            
            alert("Data stok berhasil ditambahkan langsung dari device!");
        }
    });
}

// ==========================================
// 3. LOGIKA TRACKING PENGIRIMAN (Update for Object Data)
// ==========================================
const btnLacak = document.getElementById('btnLacak');

if (btnLacak) {
    btnLacak.addEventListener('click', (e) => {
        e.preventDefault(); // Mencegah reload halaman
        
        const inputDO = document.getElementById('resiInput').value.trim();
        const resultArea = document.getElementById('tracking-result');

        // 1. Validasi Input Kosong
        if (inputDO === "") {
            alert("Masukkan nomor DO dulu ya, Al!");
            return;
        }

        // 2. Cek apakah dataTracking tersedia
        if (typeof dataTracking !== 'undefined') {
            // Karena dataTracking sekarang Object, kita panggil kuncinya langsung
            const dataDitemukan = dataTracking[inputDO];

            if (dataDitemukan) {
                // 3. Masukkan Data ke Elemen HTML (Sesuaikan dengan nama property di data.js)
                document.getElementById('res-do').innerText = dataDitemukan.nomorDO;
                document.getElementById('res-nama').innerText = dataDitemukan.nama;
                document.getElementById('res-status').innerText = dataDitemukan.status;
                document.getElementById('res-ekspedisi').innerText = dataDitemukan.ekspedisi;
                document.getElementById('res-tgl').innerText = dataDitemukan.tanggalKirim;
                document.getElementById('res-paket').innerText = dataDitemukan.paket;
                document.getElementById('res-bayar').innerText = dataDitemukan.total;

                // 4. Update Progress Bar
                const progressBar = document.getElementById('res-progress');
                if (progressBar) {
                    const progVal = dataDitemukan.progress || "70%"; 
                    progressBar.style.width = progVal;
                    progressBar.innerText = progVal;
                }

                // 5. Render Riwayat Perjalanan (Property: perjalanan)
                const riwayatList = document.getElementById('res-riwayat');
                riwayatList.innerHTML = ""; 
                
                if (dataDitemukan.perjalanan && dataDitemukan.perjalanan.length > 0) {
                    dataDitemukan.perjalanan.forEach(step => {
                        riwayatList.innerHTML += `
                            <li style="margin-bottom: 15px; list-style: none;">
                                <strong style="color: #1e293b;">• ${step.waktu}</strong><br>
                                <span style="margin-left: 15px; color: #64748b; font-size: 13px;">${step.keterangan}</span>
                            </li>`;
                    });
                } else {
                    riwayatList.innerHTML = "<li>Belum ada riwayat perjalanan.</li>";
                }

                // 6. Tampilkan Area Hasil
                resultArea.style.display = "block";
                resultArea.scrollIntoView({ behavior: 'smooth' }); 
                
            } else {
                alert("Yah, Nomor DO " + inputDO + " gak ketemu. Pastikan inputnya benar (Contoh: 2023001234)");
                resultArea.style.display = "none";
            }
        } else {
            console.error("Variabel dataTracking belum didefinisikan di data.js!");
        }
    });
}
