# hamdi-landing

Kisisel landing page projesi. Bu sayfa sadece urun vitrinini ve GitHub public proje listesini gosterir.

## Ozellikler
- GitHub benzeri yerlesim: ust bar, sol profil sidebar, sag icerik alani.
- Urun kartlari: `cvmakes.com`, `adres100.com`, `legiflare.com`.
- Urunlerde iframe preview yok, statik gorsel kullanilir.
- Light / dark tema destegi.
- 10 dil destegi: `tr`, `en`, `de`, `fr`, `es`, `it`, `pt`, `ru`, `ar`, `ja`.
- GitHub alaninda sadece public repolar listelenir.
- README icerigi uygulama icinde gosterilmez.
- GitHub API cagrisi yapilmaz; token gerekmez.
- Repo listesi tek seferlik snapshot dosyasindan okunur: `src/data/githubReposSnapshot.json`.

## Teknoloji
- React 18
- Vite 5

## Kurulum ve Calistirma
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Klasor Yapisi
```text
src/
  assets/                  # urun preview gorselleri
  components/              # sayfa bolumleri ve kartlar
  data/
    content.js             # metinler, diller, urun icerigi
    githubReposSnapshot.json
  utils/helpers.js
  App.jsx
```

## GitHub Repo Snapshot Guncelleme
Snapshot kaynagi:
- `https://github.com/hamdiituu?tab=repositories`

Guncelleme adimi:
1. `src/data/githubReposSnapshot.json` dosyasini yeni public repo listesiyle degistir.
2. `fork: false` ve `private: false` formatini koru.
3. `npm run build` ile dogrula.
