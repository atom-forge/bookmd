---
type: content
tags: []
---
# A web fő szereplői: böngésző, szerver, keresőmotor és tartalomszolgáltató

A web nem két szereplő – böngésző és szerver – közvetlen kapcsolata csupán. A tartalom létrehozásában, tárolásában, terjesztésében, megtalálásában és használatában több, egymástól függő szereplő vesz részt.

Egy egyszerűnek látszó híroldal megnyitásakor a felhasználó csak egy címet ír be, de a háttérben szereplők láncolata működik együtt. A böngésző névfeloldást kér, kapcsolatot létesít egy szerverrel, képeket akár egy másik földrajzi helyről tölt le, a keresőmotor korábban feltérképezhette az oldalt, és a szolgáltató külső mérési vagy hirdetési rendszereket is használhat. A webes rendszereket ezért nem önmagukban, hanem ökoszisztémaként érdemes vizsgálni.


## Felhasználó és böngésző

A felhasználó a böngészőn keresztül lép kapcsolatba a webes szolgáltatással. A böngésző nem egyszerűen megjeleníti az oldalakat: hálózati kéréseket küld, ellenőrzi a biztonsági tanúsítványokat, feldolgozza a dokumentumokat, tárol bizonyos adatokat, valamint a saját biztonsági szabályai szerint korlátozza a weboldalak lehetőségeit.

Példák böngészőkre: Chrome, Firefox, Safari, Edge. Bár közös szabványokat támogatnak, viselkedésük és támogatottságuk részletekben eltérhet. Ezért fontos a webes interoperabilitás.

## Webszerver és alkalmazásszerver

A **webszerver** fogadja a böngésző felől érkező HTTP-kéréseket, és válaszokat küld. Egyszerű esetben egy fájlt ad vissza – például egy HTML-oldalt vagy képet. Összetettebb szolgáltatásnál a kérés egy alkalmazáshoz jut el, amely adatot kérhet le, jogosultságot ellenőrizhet, és az eredmény alapján állítja elő a választ.

Nem szükséges minden webes rendszerben élesen különválasztani a webszervert és az alkalmazásszervert, de a szerepek megértése fontos:

- a webszerver a webes forgalmat fogadja és továbbíthatja;
- az alkalmazás a szolgáltatás üzleti logikáját valósítja meg;
- az adattároló rendszer megőrzi és lekérdezhetővé teszi az adatokat.

## Tartalomszolgáltató

A tartalomszolgáltató az a szervezet vagy személy, amely a weben elérhető információért vagy szolgáltatásért felel. Lehet egy egyetem, hírportál, vállalat, magánszemély vagy közintézmény. Nem feltétlenül ő üzemelteti a szervert: a tárhelyet, a kézbesítést vagy a biztonsági infrastruktúrát külső szolgáltató is biztosíthatja.

Ez a különbség különösen fontos felelősségi kérdéseknél. A tartalomért, az adatkezelésért és a szolgáltatás feltételeiért általában a szolgáltató felel, míg az infrastruktúrát részben más szervezetek működtethetik.

## Keresőmotorok

A keresőmotorok segítenek a webes tartalom felfedezésében. Automatizált programok – gyakran robotoknak vagy crawlereknek nevezik őket – járják be a nyilvánosan elérhető oldalakat, feltérképezik a hivatkozásokat, majd indexet építenek. Amikor a felhasználó keres, a kereső ebből az indexből választ és rangsorol találatokat.

A keresőmotor nem maga a web, és nem garantálja, hogy minden weboldalt ismer. A kereshetőség függhet a tartalom szerkezetétől, a hozzáférési szabályoktól, a hivatkozásoktól és a kereső saját rangsorolási elveitől.

A kereső a tartalom megtalálását segíti; a megtalált oldal használatakor a böngésző már közvetlenül a webes szolgáltatáshoz fordul:

```mermaid
flowchart LR
    F[Felhasználó] -->|Keresés| K[Keresőmotor]
    K -->|Találat címe| F
    F -->|Oldal megnyitása| B[Böngésző]
    B -->|Webes kérés| S[Webes szolgáltatás]
    S -->|Válasz| B
```

## Közvetítő és támogató szereplők

Egy webes szolgáltatás működésében további szereplők is részt vehetnek:

- **internetszolgáltató:** hálózati kapcsolatot ad;
- **domainregisztrátor:** kezeli a domainnév regisztrációját;
- **DNS-szolgáltató:** a névhez IP-címet rendel;
- **CDN:** földrajzilag több helyről kézbesít tartalmat;
- **hitelesítésszolgáltató:** tanúsítványokat ad ki a HTTPS-hez;
- **külső bejelentkezési szolgáltató:** például egy központi azonosítási rendszer;
- **hirdetési, analitikai vagy fizetési szolgáltató:** külön funkciót nyújt a weboldal számára.

Ezek miatt egyetlen oldal megnyitásakor több szervezettel és technikai rendszerrel is kapcsolatba kerülhetünk.

## Példa: egy webáruház szereplői

| Szereplő | Feladat |
| --- | --- |
| Vásárló és böngésző | Termékek keresése, kosár használata, rendelés leadása |
| Webáruház alkalmazása | Katalógus, rendelés, jogosultság és üzleti folyamatok kezelése |
| Adatbázis | Termékek, készlet, rendelések és felhasználói adatok tárolása |
| Fizetési szolgáltató | Online fizetés feldolgozása |
| Futárszolgálat | Szállítási információk kezelése |
| Keresőmotor | Termék- és kategóriaoldalak felfedezése |

## Gyakori félreértések

| Állítás | Pontosítás |
| --- | --- |
| „A szerver egyetlen fizikai számítógép.” | A szerver lehet szoftveres szerep, virtuális gép vagy több rendszer együttese is. |
| „A keresőmotor hozza létre a weboldalakat.” | A kereső megtalálja és rangsorolja a mások által publikált tartalmat. |
| „A tárhelyszolgáltató mindenért felel az oldalon.” | A tartalom, az adatkezelés és a szolgáltatás szabályai jellemzően a tartalomszolgáltató felelősségei. |
