---
type: content
tags: []
---
# REST, RPC, GraphQL és custom API összehasonlítása

Az API-stílus megválasztásakor először a fogyasztót, a műveletet és a változási igényt vizsgáljuk. Egy rendszerben több stílus is együtt élhet: például publikus HTTP API, belső gRPC, GraphQL-alapú kliensaggregáció és webhookos külső integráció.

## Azonos probléma, eltérő interfész

Egy foglalás létrehozását REST-szemléletű API erőforrásként mutathatja: `POST /reservations`, majd `GET /reservations/r-42`. RPC-ben `CreateReservation` és `GetReservation` műveletek jelennek meg. GraphQL-ben egy mutation hozza létre a foglalást, és a kliens kiválasztja a visszakért mezőket. Egyedi protokollban `reservation.create` típusú üzenet indulhat.

Mindegyik megoldásnál szükséges ugyanaz az üzleti szabály, jogosultság és ismétlésvédelem. A különbség az interfész kifejezőeszközeiben, a toolingban és a fogyasztói kapcsolatban van. Nem a stílus neve biztosítja a helyes állapotváltozást.

| Szempont | REST-szemléletű HTTP | RPC/gRPC | GraphQL | Egyedi API |
| --- | --- | --- | --- | --- |
| Központi fogalom | Erőforrás és reprezentáció | Művelet és típusos üzenet | Séma és mezőigény | Saját szerződés |
| Tipikus erősség | HTTP-ökoszisztéma, közvetítők | Belső hívások, generálás, streaming | Eltérő kliensadatigény | Speciális követelmény |
| Kliens eszközei | HTTP-kliens, OpenAPI | Generált stub | Query és sémaismeret | Saját kliens vagy SDK |
| Összetett olvasás | Több végpont vagy aggregáció | Összefoglaló művelet | Mezőalapú lekérdezés | Saját művelet |
| Fő tervezési kockázat | Chatty API, félrehasznált HTTP | Túl finom távoli metódusok | Lekérdezési költség, N+1 | Hiányos saját szabályok |
| Cache | HTTP-eszközökkel közvetlenebb | Alkalmazásszinten | Query- és adatmodellfüggő | Saját szabályok szerint |

A táblázat nem minőségi rangsor. Az egyik megoldás erőssége csak akkor előny, ha a használati helyzet igényli. Egy egyszerű árlekérdezéshez nem feltétlenül kell szabad gráflekérdezés, egy élő kétirányú streamhez pedig nem elegendő a klasszikus egyszeri HTTP-válasz.

## Fogyasztó és bizalmi határ

Publikus API-nál a széles eszköztámogatás, a dokumentáció és a lassú kliensfrissítések fontosak. Belső szolgáltatásoknál a típusos szerződés és a közös tooling könnyebben vállalható. Böngészőnél a rendelkezésre álló transportok, a hitelesítés és a köztes infrastruktúra korlátozza a választást.

A GraphQL akkor lehet előnyös, ha több kliens ugyanazon gráf különböző részhalmazait használja. RPC akkor lehet természetes, ha a határ üzleti műveleteket publikál. REST akkor lehet jó, ha stabil erőforrás-életciklus és HTTP-funkciók segítik az együttműködést. Egyedi API-nál a szabadságért cserébe több szabályt és toolingot kell fenntartani.

## Együttélés és adapterek

A külső interfész nem szükségképpen azonos a belsővel. Egy BFF GraphQL-lekérdezést fogadhat, miközben gRPC-n és HTTP-n kér adatokat a szolgáltatásoktól. Az adapternek a hibákat, időkereteket és jogosultsági kontextust is fordítania kell. A fordítás nem jelentheti, hogy minden belső hibát sikeres üres válaszként tüntet el.

A túl sok API-stílus növeli a tanulási és működtetési költséget. A változatosság indokát dokumentálni kell. A „minden szolgáltatás mást használhat” szabadság helyett közös irányelvek segíthetnek a konzisztens működésben.

> [!tip] Döntési sorrend
> Először az üzleti műveletet és a fogyasztót határozd meg. Utána az interakciós modellt, az API-stílust, a transportot és a formátumot. A keretrendszer kiválasztása ezek után következik.

## Összehasonlító feladat

Tervezz interfészt három helyzetre: publikus termékkatalógus, belső készletfoglalás, mobilképernyő több szolgáltatásból összeállított adatai. Mindegyiknél indokolj egy választást és egy elvetett alternatívát. Mutasd meg a sikeres, hibás és ismételt művelet szerződését is.
