# 🎬 Filmový Kvíz pro Mamu

Interaktivní webová aplikace, která pomáhá vybrat perfektní film nebo seriál na základě aktuální nálady a preferencí.

## ✨ Funkce

- **Personalizovaný kvíz** - 6 otázek zaměřených na náladu, čas, společnost, prostředí, typ protagonisty a preferovaný konec
- **Inteligentní doporučení** - Využívá The Movie Database (TMDB) API pro načítání filmových doporučení
- **Responzivní design** - Optimalizováno pro všechna zařízení
- **Webshare integrace** - Přímé odkazy pro vyhledávání filmů na Webshare.cz
- **Moderní UI** - Gradientní pozadí, animace a pěkné vizuální efekty

## 🚀 Live Demo

Aplikace je dostupná na: **https://yung988.github.io/filmovyradce**

## 🛠️ Technologie

- **React 18** - Frontend framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP klient pro API komunikaci
- **TMDB API** - Databáze filmů a seriálů
- **GitHub Pages** - Hosting
- **GitHub Actions** - Automatické nasazování

## 🏗️ Lokální spuštění

1. Klonování repository:
```bash
git clone https://github.com/yung988/filmovyradce.git
cd filmovyradce
```

2. Instalace závislostí:
```bash
pnpm install
```

3. Spuštění dev serveru:
```bash
pnpm start
```

4. Otevření v prohlížeči: `http://localhost:3000`

## 📦 Build pro produkci

```bash
pnpm run build
```

## 🔄 Automatické nasazování

Projekt používá GitHub Actions pro automatické buildování a nasazování na GitHub Pages při každém push do main branch.

## 📝 Jak to funguje

1. **Úvodní obrazovka** - Uvítání s tlačítkem pro start kvízu
2. **Kvíz** - 6 otázek s přehledným progress barem
3. **Výsledky** - 5 personalizovaných filmových doporučení s:
   - Postery filmů
   - Hodnocení
   - Match skóre
   - Popis filmu
   - Přímý odkaz na Webshare

## 🎯 Příští funkce

- [ ] Podpora pro seriály
- [ ] Více detailních filtrů
- [ ] Uložení historie doporučení
- [ ] Sdílení výsledků
- [ ] Tmavý režim

## 🤝 Přispívání

Contributions, issues a feature requesty jsou vítány!

## 📄 Licence

Tento projekt je licencován pod MIT licencí.

---

Vytvořeno s ❤️ pro mamu
