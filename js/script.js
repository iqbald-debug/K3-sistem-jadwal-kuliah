// script.js - Sistem Jadwal Kuliah (K5)
// Seluruh logika menggunakan jQuery (selektor, event, manipulasi DOM, validasi)

$(document).ready(function () {
  // =========================
  // State aplikasi
  // =========================
  var dataJadwal = [
    { kode_mk: "SI101", nama_mk: "Algoritma dan Pemrograman", dosen: "Ir. Hendra Wijaya", ruang: "R-101", hari: "Senin", jam_mulai: "07:30", jam_selesai: "09:10", semester: 1, sks: 3 },
    { kode_mk: "SI102", nama_mk: "Matematika Diskrit", dosen: "Dra. Sari Utami", ruang: "R-102", hari: "Senin", jam_mulai: "08:00", jam_selesai: "09:40", semester: 1, sks: 3 },
    { kode_mk: "SI301", nama_mk: "Pemrograman Web Dasar", dosen: "Dr. Budi Santoso", ruang: "Lab-1", hari: "Selasa", jam_mulai: "08:00", jam_selesai: "09:40", semester: 3, sks: 3 },
    { kode_mk: "SI303", nama_mk: "Basis Data", dosen: "Dr. Ratna Dewi", ruang: "R-201", hari: "Selasa", jam_mulai: "10:00", jam_selesai: "11:40", semester: 3, sks: 3 },
    { kode_mk: "SI305", nama_mk: "Struktur Data", dosen: "Andi Pratama, M.Kom", ruang: "R-202", hari: "Rabu", jam_mulai: "09:00", jam_selesai: "11:30", semester: 3, sks: 3 },
    { kode_mk: "SI501", nama_mk: "Rekayasa Perangkat Lunak", dosen: "Rina Kurnia, M.T", ruang: "R-301", hari: "Rabu", jam_mulai: "13:00", jam_selesai: "14:40", semester: 5, sks: 3 },
    { kode_mk: "SI502", nama_mk: "Kecerdasan Buatan", dosen: "Dr. Eko Prasetyo", ruang: "Lab-2", hari: "Kamis", jam_mulai: "08:00", jam_selesai: "10:30", semester: 5, sks: 3 },
    { kode_mk: "SI503", nama_mk: "Jaringan Komputer", dosen: "Fajar Nugroho, M.Cs", ruang: "R-303", hari: "Kamis", jam_mulai: "13:00", jam_selesai: "14:40", semester: 5, sks: 2 },
    { kode_mk: "SI701", nama_mk: "Manajemen Proyek TI", dosen: "Gita Maharani, M.Kom", ruang: "R-401", hari: "Jumat", jam_mulai: "09:00", jam_selesai: "10:40", semester: 7, sks: 3 }
  ];
  // Catatan: SI101 (Senin 07:30-09:10, R-101) dan SI102 (Senin 08:00-09:40, R-102)
  // beririsan jam tetapi ruang berbeda, sehingga bukan konflik.

  var kodeDihapus = null; // kode_mk yang menunggu konfirmasi hapus
  var urutanHari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  // =========================
  // Fungsi bantu
  // =========================

  // Mengubah "HH:MM" menjadi total menit untuk perbandingan jam
  function jamKeMenit(jam) {
    var bagian = jam.split(":");
    return (parseInt(bagian[0], 10) * 60) + parseInt(bagian[1], 10);
  }

  // Mengembalikan class warna tetap per kode_mk (minimal 5 warna, CSS: mk-color-0..5)
  function warnaMk(kodeMk) {
    var warnaKelas = ["mk-color-0", "mk-color-1", "mk-color-2", "mk-color-3", "mk-color-4", "mk-color-5"];
    var hash = 0;
    for (var i = 0; i < kodeMk.length; i++) {
      hash += kodeMk.charCodeAt(i);
    }
    return warnaKelas[hash % warnaKelas.length];
  }

  // Menghitung total SKS dari data yang sedang tampil
  function hitungTotalSks(data) {
    var total = 0;
    $.each(data, function (index, item) {
      total += Number(item.sks);
    });
    return total;
  }

  // =========================
  // Render tabel jadwal
  // =========================
  function renderJadwal(data) {
    var html = "";

    if (data.length === 0) {
      // Tampilkan pesan kosong jika tidak ada jadwal
      html = "<tr><td colspan='8' class='text-center py-3'>Tidak ada jadwal</td></tr>";
      $("#tabelJadwal").html(html);
      $("#totalSks").text("0 SKS");
      $("#totalSks").css("opacity", "0.7"); // efek kecil (.css) untuk menandakan kosong
      return;
    }

    // Kelompokkan per hari sesuai urutan Senin-Jumat
    $.each(urutanHari, function (i, hari) {
      var jadwalHari = [];
      $.each(data, function (j, item) {
        if (item.hari === hari) {
          jadwalHari.push(item);
        }
      });

      // Urutkan berdasarkan jam_mulai di dalam satu hari
      jadwalHari.sort(function (a, b) {
        return jamKeMenit(a.jam_mulai) - jamKeMenit(b.jam_mulai);
      });

      // Hari tanpa data tidak menampilkan header kosong
      if (jadwalHari.length > 0) {
        html += "<tr class='baris-hari'><th colspan='8'>" + hari + "</th></tr>";

        $.each(jadwalHari, function (k, item) {
          var kelasWarna = warnaMk(item.kode_mk);
          html += "<tr class='" + kelasWarna + "'>"
            + "<td>" + item.kode_mk + "</td>"
            + "<td>" + item.nama_mk + "</td>"
            + "<td>" + item.dosen + "</td>"
            + "<td>" + item.ruang + "</td>"
            + "<td>" + item.jam_mulai + " - " + item.jam_selesai + "</td>"
            + "<td><span class='badge badge-smt'>Smt " + item.semester + "</span></td>"
            + "<td>" + item.sks + "</td>"
            + "<td>"
            +   "<button type='button' class='btn btn-sm btn-outline-danger btn-hapus' "
            +   "data-kode='" + item.kode_mk + "' data-nama='" + item.nama_mk + "'>"
            +   "Hapus</button>"
            + "</td>"
            + "</tr>";
        });
      }
    });

    // Bangun tabel dengan .html() dan perbarui total SKS dengan .text()
    $("#tabelJadwal").html(html);
    $("#totalSks").text(hitungTotalSks(data) + " SKS");
    $("#totalSks").css("opacity", "1"); // efek kecil (.css) saat data normal
  }

  // =========================
  // Filter dan search (jQuery Filter)
  // =========================
  function applyFilter() {
    var hariDipilih = $("#filterHari").val();
    var semesterDipilih = $("#filterSemester").val();
    var keyword = $("#cariJadwal").val().toLowerCase().trim();

    var hasil = [];

    $.each(dataJadwal, function (index, item) {
      var cocokHari = (hariDipilih === "" || item.hari === hariDipilih);
      var cocokSemester = (semesterDipilih === "" || String(item.semester) === semesterDipilih);

      // Search nama mata kuliah atau dosen, tidak peka huruf besar/kecil
      var namaMk = item.nama_mk.toLowerCase();
      var dosen = item.dosen.toLowerCase();
      var cocokSearch = (keyword === "" || namaMk.indexOf(keyword) !== -1 || dosen.indexOf(keyword) !== -1);

      if (cocokHari && cocokSemester && cocokSearch) {
        hasil.push(item);
      }
    });

    renderJadwal(hasil);
  }

  // =========================
  // Deteksi konflik jadwal
  // =========================
  function cekKonflik(jadwalBaru) {
    var konflik = null;
    var mulaiBaru = jamKeMenit(jadwalBaru.jam_mulai);
    var selesaiBaru = jamKeMenit(jadwalBaru.jam_selesai);

    $.each(dataJadwal, function (index, item) {
      // Konflik jika hari sama, ruang sama, dan jam beririsan
      if (item.hari === jadwalBaru.hari && item.ruang.toLowerCase() === jadwalBaru.ruang.toLowerCase()) {
        var mulaiLama = jamKeMenit(item.jam_mulai);
        var selesaiLama = jamKeMenit(item.jam_selesai);

        // Jam bersentuhan (selesai == mulai) bukan konflik
        if (mulaiBaru < selesaiLama && selesaiBaru > mulaiLama) {
          konflik = item;
          return false; // hentikan loop, kembalikan konflik pertama
        }
      }
    });

    return konflik;
  }

  // =========================
  // Validasi form (jQuery Validation manual)
  // =========================
  function bersihkanError() {
    $("#formJadwal .form-control, #formJadwal .form-select").removeClass("is-invalid");
    $("#formJadwal .invalid-feedback").remove();
  }

  function tampilkanError(selector, pesan) {
    var $field = $(selector);
    $field.addClass("is-invalid");

    // Buat elemen invalid-feedback jika belum ada
    if ($field.next(".invalid-feedback").length === 0) {
      $field.after("<div class='invalid-feedback'></div>");
    }
    $field.next(".invalid-feedback").text(pesan);
  }

  function validasiForm() {
    var valid = true;
    bersihkanError();

    var kodeMk = $("#kodeMk").val().trim();
    var namaMk = $("#namaMk").val().trim();
    var namaDosen = $("#namaDosen").val().trim();
    var ruang = $("#ruang").val().trim();
    var hari = $("#hari").val();
    var jamMulai = $("#jamMulai").val();
    var jamSelesai = $("#jamSelesai").val();
    var semester = $("#semester").val();
    var sks = $("#sks").val();

    // Semua field wajib terisi
    if (kodeMk === "") {
      tampilkanError("#kodeMk", "Kode mata kuliah wajib diisi.");
      valid = false;
    } else {
      // Pola sederhana kode MK: huruf/angka, minimal 2 karakter
      var polaKode = /^[A-Za-z0-9-]+$/;
      if (!polaKode.test(kodeMk)) {
        tampilkanError("#kodeMk", "Kode MK hanya boleh berisi huruf, angka, atau tanda hubung.");
        valid = false;
      }
    }

    if (namaMk === "") {
      tampilkanError("#namaMk", "Nama mata kuliah wajib diisi.");
      valid = false;
    }
    if (namaDosen === "") {
      tampilkanError("#namaDosen", "Nama dosen wajib diisi.");
      valid = false;
    }
    if (ruang === "") {
      tampilkanError("#ruang", "Ruangan wajib diisi.");
      valid = false;
    }
    if (hari === "") {
      tampilkanError("#hari", "Hari wajib dipilih.");
      valid = false;
    }
    if (jamMulai === "") {
      tampilkanError("#jamMulai", "Jam mulai wajib diisi.");
      valid = false;
    }
    if (jamSelesai === "") {
      tampilkanError("#jamSelesai", "Jam selesai wajib diisi.");
      valid = false;
    }

    // Jam selesai harus lebih besar dari jam mulai
    if (jamMulai !== "" && jamSelesai !== "") {
      if (jamKeMenit(jamSelesai) <= jamKeMenit(jamMulai)) {
        tampilkanError("#jamSelesai", "Jam selesai harus lebih besar dari jam mulai.");
        valid = false;
      }
    }

    // Semester 1 sampai 8
    if (semester === "") {
      tampilkanError("#semester", "Semester wajib dipilih.");
      valid = false;
    } else if (Number(semester) < 1 || Number(semester) > 8) {
      tampilkanError("#semester", "Semester harus antara 1 sampai 8.");
      valid = false;
    }

    // SKS 1 sampai 6
    if (sks === "") {
      tampilkanError("#sks", "SKS wajib diisi.");
      valid = false;
    } else if (Number(sks) < 1 || Number(sks) > 6) {
      tampilkanError("#sks", "SKS harus antara 1 sampai 6.");
      valid = false;
    }

    return valid;
  }

  // =========================
  // Alert konflik & sukses
  // =========================
  var timeoutSukses = null;

  function sembunyikanKonflik() {
    $("#peringatanKonflik").addClass("d-none");
    $("#pesanKonflik").text("");
  }

  function tampilkanKonflik(jadwalBaru, konflik) {
    var pesan = "Jadwal " + jadwalBaru.nama_mk + " (" + jadwalBaru.hari + ", "
      + jadwalBaru.ruang + ", " + jadwalBaru.jam_mulai + "-" + jadwalBaru.jam_selesai
      + ") bentrok dengan " + konflik.nama_mk + " (" + konflik.hari + ", "
      + konflik.ruang + ", " + konflik.jam_mulai + "-" + konflik.jam_selesai + ").";

    $("#pesanKonflik").text(pesan);
    // Pastikan alert menggunakan gaya danger dan punya tombol close
    $("#peringatanKonflik").removeClass("d-none alert-warning").addClass("alert-danger alert-dismissible");

    // Tambahkan tombol X untuk menutup alert jika belum ada
    if ($("#peringatanKonflik .btn-close-konflik").length === 0) {
      $("#peringatanKonflik").prepend(
        "<button type='button' class='btn-close btn-close-konflik' aria-label='Tutup'></button>"
      );
    }
  }

  // Menampilkan popup sukses tambah jadwal (hilang otomatis setelah 3 detik)
  function tampilkanSukses(pesan) {
    // Buat elemen popup sukses jika belum ada
    if ($("#popupSukses").length === 0) {
      var suksesHtml = ""
        + "<div id='popupSukses' class='alert alert-success shadow d-none' role='alert' "
        + "style='position:fixed; top:20px; left:50%; transform:translateX(-50%); z-index:1060; min-width:280px; max-width:360px; text-align:center;'>"
        +   "<span id='pesanSukses'></span>"
        + "</div>";
      $("body").append(suksesHtml);
    }

    $("#pesanSukses").text(pesan);
    $("#popupSukses").removeClass("d-none");

    if (timeoutSukses) {
      clearTimeout(timeoutSukses);
    }
    timeoutSukses = setTimeout(function () {
      $("#popupSukses").addClass("d-none");
      $("#pesanSukses").text("");
    }, 6000);
  }

  // Event: Tutup alert konflik lewat tombol X
  $("#peringatanKonflik").on("click", ".btn-close-konflik", function () {
    sembunyikanKonflik();
  });

  // =========================
  // Event: Filter dan Search
  // =========================
  $("#filterHari, #filterSemester").on("change", function () {
    applyFilter();
  });

  $("#cariJadwal").on("keyup", function () {
    applyFilter();
  });

  // =========================
  // Event: Submit form tambah jadwal
  // =========================
  $("#formJadwal").on("submit", function (event) {
    event.preventDefault();
    sembunyikanKonflik();
    bersihkanError();

    // Validasi form; jika gagal, berhenti (semua error tampil sekaligus)
    if (!validasiForm()) {
      return;
    }

    // Susun jadwalBaru dari .val() (angka dengan Number())
    var jadwalBaru = {
      kode_mk: $("#kodeMk").val().trim(),
      nama_mk: $("#namaMk").val().trim(),
      dosen: $("#namaDosen").val().trim(),
      ruang: $("#ruang").val().trim(),
      hari: $("#hari").val(),
      jam_mulai: $("#jamMulai").val(),
      jam_selesai: $("#jamSelesai").val(),
      semester: Number($("#semester").val()),
      sks: Number($("#sks").val())
    };

    // Cek konflik sebelum push()
    var konflik = cekKonflik(jadwalBaru);
    if (konflik) {
      // Tutup form tambah jadwal langsung saat konflik
      var modalTambahEl = $("#modalTambah")[0];
      if (modalTambahEl) {
        bootstrap.Modal.getOrCreateInstance(modalTambahEl).hide();
      }
      tampilkanKonflik(jadwalBaru, konflik);
      return;
    }

    // Jika aman: simpan, reset form, render ulang
    dataJadwal.push(jadwalBaru);
    $("#formJadwal")[0].reset();
    bersihkanError();

    // Tutup modal tambah setelah berhasil
    var modalTambahSuksesEl = $("#modalTambah")[0];
    if (modalTambahSuksesEl) {
      bootstrap.Modal.getOrCreateInstance(modalTambahSuksesEl).hide();
    }

    applyFilter();
    tampilkanSukses("Jadwal berhasil ditambahkan");
  });

  // Bersihkan error saat modal tambah ditutup
  $("#modalTambah").on("hidden.bs.modal", function () {
    bersihkanError();
  });

  // =========================
  // Event: Hapus jadwal (event delegation)
  // =========================
  $("#tabelJadwal").on("click", ".btn-hapus", function () {
    kodeDihapus = $(this).attr("data-kode");
    var namaMk = $(this).attr("data-nama");

    // Tampilkan nama mata kuliah di modal hapus
    $("#modalHapus .modal-body").html(
      "Apakah kamu yakin ingin menghapus jadwal <strong>" + namaMk + "</strong>?"
    );

    // Buka modal hapus melalui Bootstrap API (dibungkus jQuery selector)
    bootstrap.Modal.getOrCreateInstance($("#modalHapus")[0]).show();
  });

  // Konfirmasi hapus
  $("#btnKonfirmasiHapus").on("click", function () {
    if (!kodeDihapus) {
      return;
    }

    // Hapus data berdasarkan kode_mk
    var indexHapus = -1;
    $.each(dataJadwal, function (index, item) {
      if (item.kode_mk === kodeDihapus) {
        indexHapus = index;
        return false;
      }
    });

    if (indexHapus !== -1) {
      dataJadwal.splice(indexHapus, 1);
    }

    kodeDihapus = null;
    bootstrap.Modal.getOrCreateInstance($("#modalHapus")[0]).hide();
    sembunyikanKonflik();
    applyFilter();
  });

  // =========================
  // Inisialisasi awal
  // =========================
  applyFilter();
});
