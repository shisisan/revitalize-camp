<h1 align="center">Welcome to revitalizecamp 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> Revitalize Meet and Greet for all players

## Install

```sh
pnpm install
```

## Usage

```sh
pnpm run dev:watch
```

## Run tests

```sh
pnpm run dev:build
```

## 📁 Struktur Folder

Proyek ini memiliki struktur sebagai berikut:

```
src/
├── client/
│ ├── controllers/
│ │ ├── audio/
│ │ │ └── sound-controller.ts
│ │ └── player\character/
│ │ └── character-controller.ts
│ ├── store/
│ ├── ui/
│ ├── constants.ts
│ ├── network.ts
│ └── runtime.client.ts
├── server/
│ ├── controllers/
│ │ └── services/
│ │ ├── character-services/
│ │ ├── player-core-services/
│ │ └── player-data-services/
│ ├── util-services/
│ ├── store/
│ ├── mtx-service.ts
│ ├── network.ts
│ └── runtime.server.ts
├── shared/
│ └── functions/
├── types/
```
## 📦 Penjelasan Modul

### `client/`
Berisi semua script yang dijalankan di sisi **klien (player)**.

- `controllers/`: Pengendali logika gameplay klien.
  - `audio/sound-controller.ts`: Mengatur efek suara atau musik.
  - `player\character/character-controller.ts`: Mengatur kontrol karakter pemain seperti pergerakan atau animasi.
- `store/`: Menyimpan state lokal klien (misalnya, inventory, stats).
- `ui/`: Modul UI (User Interface) untuk menampilkan antarmuka pengguna.
- `constants.ts`: Nilai tetap global yang digunakan di sisi klien.
- `network.ts`: Modul komunikasi RemoteEvent/RemoteFunction dari klien.
- `runtime.client.ts`: Titik masuk utama untuk memulai skrip klien.

### `server/`
Berisi semua script yang dijalankan di sisi **server (Roblox game server)**.

- `controllers/services/`: Modul logika bisnis.
  - `character-services/`: Layanan terkait karakter (spawn, data, abilities).
  - `player-core-services/`: Layanan inti pemain (masuk, keluar, state dasar).
  - `player-data-services/`: Manajemen data pemain (penyimpanan, pemuatan).
- `util-services/`: Fungsi utilitas yang digunakan lintas modul server.
- `store/`: Penyimpanan global di server (misalnya, cache data).
- `mtx-service.ts`: Layanan terkait monetisasi atau transaksi (MTX).
- `network.ts`: Modul komunikasi RemoteEvent/RemoteFunction dari server.
- `runtime.server.ts`: Titik masuk utama untuk memulai skrip server.

### `shared/`
Kode dan fungsi yang dibagikan antara klien dan server.

- `functions/`: Fungsi bersama untuk meminimalkan duplikasi logika.

### `types/`
Berisi definisi tipe (`.d.ts`) untuk memastikan strong typing lintas sisi (client/server/shared), seperti:

- Interface data pemain
- Enum global
- Struktur konfigurasi


## Author

👤 **shisisan**

* Website: revitalize.id
* Github: [@shisisan](https://github.com/shisisan)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/shisisan/revitalize-camp/issues). 

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_