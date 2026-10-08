---
chapter: "06.04"
tags: []
---
# Backpressure, feldolgozási kapacitás és mintaválasztás

Backpressure alatt azt értjük, hogy a lassabb fogyasztó vagy feldolgozó visszahat a termelésre, a kézbesítésre vagy az elfogadásra. Ha egy rendszer korlátlanul átvesz több munkát, mint amennyit elvégez, a terhelést csak memóriába vagy tartós sorba tolja át.

## Egyszerű kapacitásmodell

Jelölje `λ` az érkezési ütemet és `μ` a teljes feldolgozási ütemet. Ha tartósan `λ > μ`, a várakozó munka nő. Rövid ideig a puffer hasznos lehet, de a fenntartható működéshez a teljes feldolgozási kapacitásnak és a terhelési mintának össze kell illenie.

Ha percenként 600 export érkezik, egy worker pedig 120-at kezel, öt worker elméleti kapacitása éppen elég. A valóságban változó feladathossz, függőségi korlát és kiesés miatt tartalék is szükséges. Több worker nem gyorsít, ha mind ugyanazon korlátozott külső API-n várakozik.

## Korlátok a fogyasztónál

Prefetch vagy in-flight limit szabályozhatja, mennyi nem nyugtázott munkát kap egyszerre egy consumer. Ez védi a memóriát, és segítheti az egyenletes elosztást. A túl nagy prefetch miatt egy worker sok feladatot lefoglalhat, miközben mások üresek.

A párhuzamosságot az üzleti és technikai korlátokhoz választjuk. Ha egy rendelés eseményeit sorban kell alkalmazni, ugyanazon kulcshoz nem indítunk korlátlan párhuzamos feldolgozást. Más kulcsok ettől még haladhatnak egyszerre.

## Korlátok a belépési ponton

A rendszer megtagadhat vagy késleltethet új munkát, ha nincs vállalható kapacitás. A fogyasztó számára világos válasz kell: elfogadtuk és sorba állítottuk, később próbálja újra, vagy a művelet nem indítható. A tartósan fogadott munka állapotát és lejáratát meg kell mutatni.

Bizonyos adatok összevonhatók. Egy aktuális hőmérséklet kijelzésénél elég lehet a legfrissebb érték, egy banki tranzakciónál nem dobhatunk el köztes rekordot. A „drop old messages” szabály csak a jelentésből következhet.

## Szinkron és aszinkron választás

Azonnali döntéshez, például jogosultsági ellenőrzéshez vagy foglalási eredményhez gyakran kell közvetlen válasz. Hosszú feldolgozáshoz és több önálló reakcióhoz az aszinkron modell előnyös lehet. Nem minden szolgáltatáshívást kell eseményre cserélni.

Az aszinkron működés ára a függő állapot, a késői eredmény, az ismétlés és a több helyen követett folyamat. A kliensnek is tudnia kell, hogy a munka még készül. A felhasználó elől elrejtett háttérhiba nem megbízható működés.

> [!tip] A sorhossz mellé életkort és eredményt mérj
> A várakozó üzenetek száma mellett figyeld a legrégebbi munka korát, a feldolgozási időt, a retryarányt és a végleges hibát. Ugyanaz a sorhossz eltérő hosszúságú munkáknál mást jelent.

## Elemzési feladat

Egy e-mail worker óránként 10 000 levelet küldhet, de a rendszer fél óra alatt 20 000 munkát fogad. Számold ki az elméleti kiürülési időt új munka nélkül. Ezután tervezd meg a prioritást, a lejáratot és a felhasználó számára látható állapotot. Vizsgáld meg, mit okozna a workerpéldányok számának növelése változatlan szolgáltatói limit mellett.
