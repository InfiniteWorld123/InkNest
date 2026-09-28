import type { TopicSeed } from "./content.types";

export const germanTopics: TopicSeed[] = [
	{
		lang: "de",
		category: "technology",
		tags: ["web-development", "engineering"],
		cover: "code",
		posts: [
			{
				title: "Warum wir unser Frontend auf TanStack Start umgestellt haben",
				markdown: `Unser altes Setup bestand aus drei Tools, die sich gegenseitig im Weg standen. Nach dem Umstieg ist es eines.

## Was sich verbessert hat

- Routing, Datenladen und Server-Funktionen an einem Ort
- typsichere Links, die beim Umbenennen einer Route sofort auffallen
- weniger Glue-Code zwischen Client und Server

## Was wir unterschätzt haben

Die Migration der Datenabfragen dauerte länger als gedacht. Es lohnt sich, zuerst eine einzelne Seite komplett umzustellen und daraus Regeln für den Rest abzuleiten.`,
			},
			{
				title: "Serverseitiges Rendering ohne Kopfschmerzen",
				markdown: `SSR klingt nach Performance-Gewinn und endet oft in Hydration-Fehlern. Drei Regeln haben uns geholfen.

1. Kein Zugriff auf \`window\` während des Renderns
2. Datum und Uhrzeit immer mit fester Zeitzone formatieren
3. Zufallswerte nur im Browser erzeugen

## Fehler früh finden

Wir lassen jeden Pull Request einmal im Produktionsmodus bauen. Hydration-Warnungen gelten als Fehler, nicht als Hinweis.`,
			},
		],
	},
	{
		lang: "de",
		category: "technology",
		tags: ["security", "engineering"],
		cover: "network",
		posts: [
			{
				title: "Zwei-Faktor-Authentifizierung richtig einführen",
				markdown: `2FA ist schnell eingebaut. Schwierig wird es, wenn Nutzer ihr Handy verlieren.

## Vor dem Start klären

- Wie funktionieren Wiederherstellungscodes?
- Wer darf 2FA für einen Account zurücksetzen?
- Wie wird das Zurücksetzen protokolliert?

## Schrittweise ausrollen

Zuerst für Admins verpflichtend, dann optional für alle, später verpflichtend. So lernen Support und Nutzer das Verfahren in kleinen Gruppen kennen.`,
			},
			{
				title: "Passwort-Regeln, die wirklich schützen",
				markdown: `Sonderzeichen-Pflicht und monatliche Passwortwechsel machen Passwörter nicht sicherer, sondern vorhersehbarer.

## Was stattdessen hilft

- Mindestlänge von zwölf Zeichen
- Abgleich mit bekannten geleakten Passwörtern
- Passwort-Manager ausdrücklich erlauben und empfehlen

> Ein langes, zufälliges Passwort im Manager schlägt jede komplizierte Regel.`,
			},
		],
	},
	{
		lang: "de",
		category: "technology",
		tags: ["ai", "learning"],
		cover: "network",
		posts: [
			{
				title: "KI im Alltag eines Entwicklers: eine ehrliche Bilanz",
				markdown: `Nach einem Jahr mit KI-Assistenten schreibe ich nicht weniger Code, sondern anderen.

## Wo es spürbar hilft

- Tests für bestehende Funktionen entwerfen
- unbekannte Bibliotheken schneller verstehen
- Fehlermeldungen einordnen

## Wo ich vorsichtig bleibe

Bei Sicherheit, Datenmodellen und allem, was schwer rückgängig zu machen ist. Dort prüfe ich jede Zeile, als hätte sie ein neuer Kollege geschrieben.`,
			},
			{
				title: "Wie ich KI-generierten Code reviewe",
				markdown: `Generierter Code sieht oft plausibel aus. Genau das macht ihn gefährlich.

## Meine Checkliste

1. Verstehe ich jede Zeile?
2. Gibt es einen Test, der den Fehlerfall abdeckt?
3. Passt der Stil zum Rest des Projekts?
4. Wurden neue Abhängigkeiten eingeführt?

Wenn eine Antwort Nein lautet, geht der Code zurück, egal wie gut er aussieht.`,
			},
		],
	},
	{
		lang: "de",
		category: "technology",
		tags: ["web-development", "accessibility"],
		cover: "design",
		posts: [
			{
				title: "Barrierefreiheit ab 2025: Was das BFSG für Webshops bedeutet",
				markdown: `Seit Juni 2025 gilt das Barrierefreiheitsstärkungsgesetz auch für viele Onlineshops. Für Entwickler heißt das vor allem: sauberes HTML.

## Die häufigsten Baustellen

- Formulare ohne sichtbare Labels
- Buttons, die nur aus einem Icon bestehen
- zu geringe Kontraste im Checkout

## Pragmatisch anfangen

Wer die wichtigsten Nutzerwege mit Tastatur und Screenreader testet, findet die gravierendsten Probleme an einem Nachmittag.`,
			},
			{
				title: "Tastaturbedienung als Qualitätsmerkmal",
				markdown: `Wenn eine Seite nur mit der Maus funktioniert, schließt sie viele Menschen aus und frustriert Power-User.

## Kurztest

- Mit \`Tab\` durch die Seite gehen
- Ist der Fokus immer sichtbar?
- Lassen sich Dialoge mit \`Esc\` schließen?
- Landet der Fokus nach dem Schließen wieder am Auslöser?

Vier Fragen, fünf Minuten, viel gewonnene Qualität.`,
			},
		],
	},
	{
		lang: "de",
		category: "technology",
		tags: ["engineering", "open-source"],
		cover: "code",
		posts: [
			{
				title: "Datenbank-Migrationen ohne Downtime",
				markdown: `Eine Spalte umzubenennen klingt harmlos. In Produktion kann es alle laufenden Requests brechen.

## Das Expand-and-Contract-Muster

1. Neue Spalte hinzufügen
2. Code schreibt in beide Spalten
3. Alte Daten übertragen
4. Code liest nur noch die neue Spalte
5. Alte Spalte entfernen

Mehr Schritte, aber jeder einzelne ist sicher und rückgängig zu machen.`,
			},
			{
				title: "Seed-Daten, die sich wie echte Daten anfühlen",
				markdown: `Mit \`Test 1\`, \`Test 2\` und \`Lorem ipsum\` findet man keine Layout-Probleme.

## Worauf wir achten

- realistische Längen: kurze und sehr lange Titel
- echte Sonderfälle: Umlaute, Emojis, leere Felder
- deterministische Erzeugung, damit Screenshots vergleichbar bleiben

Gute Seed-Daten sind ein Test, den man jeden Tag im Browser sieht.`,
			},
		],
	},
	{
		lang: "de",
		category: "writing",
		tags: ["writing", "habits"],
		cover: "writing",
		posts: [
			{
				title: "Jeden Tag 300 Wörter: mein Schreibexperiment",
				markdown: `Drei Monate lang habe ich jeden Tag 300 Wörter geschrieben. Nicht mehr, nicht weniger.

## Was passiert ist

Die ersten zwei Wochen waren mühsam. Danach wurde das Schreiben zur Gewohnheit wie Zähneputzen. Am Ende standen 27.000 Wörter und der Entwurf eines Sachbuchs.

## Der wichtigste Trick

Ich habe jeden Tag mitten im Satz aufgehört. So wusste ich am nächsten Morgen sofort, wie es weitergeht.`,
			},
			{
				title: "Überarbeiten in drei Durchgängen",
				markdown: `Ein Text wird nicht beim Schreiben gut, sondern beim Überarbeiten.

## Meine Reihenfolge

1. **Aufbau:** Stimmt die Reihenfolge der Abschnitte?
2. **Klarheit:** Versteht man jeden Satz beim ersten Lesen?
3. **Klang:** Laut vorlesen und stolpern, wo es hakt

> Füllwörter wie „eigentlich“, „irgendwie“ und „ja“ sind die ersten Kandidaten zum Streichen.`,
			},
		],
	},
	{
		lang: "de",
		category: "writing",
		tags: ["storytelling", "craft"],
		cover: "books",
		posts: [
			{
				title: "Wie man eine Kurzgeschichte beginnt",
				markdown: `Die ersten zwei Sätze entscheiden, ob jemand weiterliest.

## Drei Einstiege, die funktionieren

- mitten in einer Handlung
- mit einer ungewöhnlichen Beobachtung
- mit einem Satz Dialog, der eine Frage aufwirft

## Was man vermeiden sollte

Wetterbeschreibungen und Aufwachszenen. Beide sind so häufig, dass Leser sie überspringen.`,
			},
			{
				title: "Figuren, die im Kopf bleiben",
				markdown: `Leser erinnern sich nicht an Beschreibungen, sondern an Entscheidungen.

## Eine Figur wird lebendig, wenn sie

- etwas will, das sie nicht leicht bekommt
- einen Widerspruch in sich trägt
- in einer Situation anders handelt, als man erwartet

Ein kurzer Steckbrief vor dem Schreiben hilft, aber die Figur entsteht erst in Szenen.`,
			},
		],
	},
	{
		lang: "de",
		category: "writing",
		tags: ["writing", "learning"],
		cover: "writing",
		posts: [
			{
				title: "Technische Texte verständlich schreiben",
				markdown: `Gute technische Dokumentation ist langweilig im besten Sinne: vorhersehbar, klar und schnell zu überfliegen.

## Regeln für uns

- ein Gedanke pro Absatz
- Anleitungen immer als nummerierte Liste
- Codebeispiele, die man kopieren und ausführen kann

## Test mit Neuen

Die beste Prüfung ist eine neue Kollegin, die der Anleitung folgt, während man schweigend zusieht.`,
			},
			{
				title: "Gendergerecht schreiben, ohne dass es holpert",
				markdown: `Viele Texte werden holprig, weil jede Personenbezeichnung einzeln gegendert wird. Oft gibt es elegantere Wege.

## Alternativen

- neutrale Begriffe: „Teilnehmende“, „Lehrkräfte“, „das Team“
- direkte Ansprache: „Sie“ oder „du“ statt „der Nutzer“
- Umformulieren: „Wer sich anmeldet, …“

So bleibt der Text lesbar und schließt trotzdem alle ein.`,
			},
		],
	},
	{
		lang: "de",
		category: "productivity",
		tags: ["deep-work", "habits"],
		cover: "productivity",
		posts: [
			{
				title: "Fokuszeit im Großraumbüro",
				markdown: `Konzentriert arbeiten im Großraumbüro ist möglich, wenn das Team gemeinsame Regeln hat.

## Unsere Absprachen

- Kopfhörer bedeuten: bitte nur im Notfall ansprechen
- Fokuszeiten stehen sichtbar im Kalender
- Fragen sammeln wir im Chat statt am Schreibtisch

Nach zwei Monaten sagten die meisten, sie hätten mehr geschafft und seien abends weniger erschöpft.`,
			},
			{
				title: "Die Zwei-Minuten-Regel im Alltag",
				markdown: `Alles, was weniger als zwei Minuten dauert, erledige ich sofort. Alles andere kommt auf eine Liste.

## Warum das funktioniert

Kleine Aufgaben kosten auf einer Liste mehr Energie als ihre Erledigung. Große Aufgaben brauchen dagegen einen geplanten Zeitpunkt.

## Die Ausnahme

In Fokuszeiten gilt die Regel nicht. Dann wird auch die kleinste Aufgabe notiert und später erledigt.`,
			},
		],
	},
	{
		lang: "de",
		category: "productivity",
		tags: ["remote-work", "community"],
		cover: "city",
		posts: [
			{
				title: "Homeoffice: Was nach drei Jahren geblieben ist",
				markdown: `Die Pandemie-Provisorien sind verschwunden, einige Gewohnheiten sind geblieben.

## Was sich bewährt hat

- ein fester Arbeitsplatz statt Küchentisch
- ein Spaziergang als Arbeitsbeginn und -ende
- zwei feste Bürotage pro Woche für das Team

## Was wir abgeschafft haben

Kameras, die den ganzen Tag laufen, und Meetings ohne Agenda.`,
			},
			{
				title: "Gute Übergaben im verteilten Team",
				markdown: `Wenn Kolleginnen in anderen Zeitzonen weiterarbeiten, ist eine gute Übergabe wichtiger als jede Besprechung.

## Unser Übergabe-Template

- **Stand:** Was ist fertig, was halb fertig?
- **Nächster Schritt:** Was genau soll als Nächstes passieren?
- **Risiken:** Worauf sollte man achten?
- **Links:** Ticket, Pull Request, Dokumentation

Fünf Minuten Schreiben sparen am nächsten Morgen oft eine Stunde Rätselraten.`,
			},
		],
	},
	{
		lang: "de",
		category: "productivity",
		tags: ["mental-clarity", "habits"],
		cover: "growth",
		posts: [
			{
				title: "Digitaler Minimalismus: ein Monat ohne Social-Media-Apps",
				markdown: `Ich habe für einen Monat alle Social-Media-Apps vom Handy gelöscht. Die Accounts blieben, nur der schnelle Zugriff war weg.

## Beobachtungen

- In der ersten Woche griff ich ständig ins Leere
- Ab der zweiten Woche las ich abends wieder Bücher
- Wichtige Nachrichten erreichten mich trotzdem

Zurückgekommen ist nur eine App, mit festen Zeiten.`,
			},
			{
				title: "Aufgabenlisten, die nicht überquellen",
				markdown: `Eine Liste mit 80 offenen Punkten ist keine Planung, sondern ein schlechtes Gewissen.

## Meine Regeln

1. Maximal drei Prioritäten pro Tag
2. Alles andere kommt in eine „Vielleicht“-Liste
3. Jeden Freitag wird die Vielleicht-Liste ausgemistet

Seitdem ist die Liste kürzer und ich vertraue ihr wieder.`,
			},
		],
	},
	{
		lang: "de",
		category: "design",
		tags: ["product-design", "typography"],
		cover: "design",
		posts: [
			{
				title: "Designsysteme für kleine Teams",
				markdown: `Ein Designsystem muss nicht mit hundert Komponenten starten. Unseres begann mit Farben, Abständen und drei Buttons.

## Reihenfolge, die funktioniert

1. Design Tokens für Farben, Abstände und Schrift
2. Die fünf am häufigsten genutzten Komponenten
3. Dokumentation mit echten Beispielen

Alles Weitere entsteht, wenn ein Screen es wirklich braucht.`,
			},
			{
				title: "Dark Mode richtig umsetzen",
				markdown: `Dark Mode heißt nicht, Farben einfach zu invertieren.

## Worauf es ankommt

- kein reines Schwarz, sondern dunkle Grautöne
- Akzentfarben leicht entsättigen
- Schatten durch hellere Flächen ersetzen
- Kontraste separat prüfen

Und: die Einstellung des Betriebssystems respektieren, bevor man einen eigenen Schalter anbietet.`,
			},
		],
	},
	{
		lang: "de",
		category: "design",
		tags: ["product-design", "research"],
		cover: "design",
		posts: [
			{
				title: "Nutzertests mit kleinem Budget",
				markdown: `Nutzertests brauchen kein Labor. Ein Videocall und fünf Personen reichen für die meisten Fragen.

## Ablauf

- eine konkrete Aufgabe formulieren
- die Person laut denken lassen
- nicht helfen, auch wenn es schwerfällt

Nach fünf Tests wiederholen sich die Probleme. Das ist der Moment, sie zu beheben.`,
			},
			{
				title: "Microcopy: kleine Texte, große Wirkung",
				markdown: `Button-Beschriftungen, Fehlermeldungen und leere Zustände entscheiden oft darüber, ob Nutzer weitermachen.

## Beispiele aus unserem Produkt

- „Absenden“ wurde zu „Anfrage senden“
- „Fehler 422“ wurde zu „Bitte prüfe die Postleitzahl“
- „Keine Einträge“ wurde zu „Lege deinen ersten Eintrag an“

Jede Änderung dauerte fünf Minuten und senkte die Abbruchrate messbar.`,
			},
		],
	},
	{
		lang: "de",
		category: "business",
		tags: ["indie-business", "personal-finance"],
		cover: "business",
		posts: [
			{
				title: "Selbstständig als Entwickler: das erste Jahr",
				markdown: `Im ersten Jahr als Freelancer habe ich mehr über Buchhaltung gelernt als über Code.

## Was ich früher gewusst haben wollte

- Rücklagen für Steuern sofort auf ein eigenes Konto
- Verträge mit klar definiertem Leistungsumfang
- lieber zwei feste Kunden als zehn kleine Projekte

Die Freiheit ist groß. Die Verantwortung auch.`,
			},
			{
				title: "Angebote schreiben, die Kunden verstehen",
				markdown: `Ein Angebot ist kein technisches Dokument, sondern eine Entscheidungshilfe.

## Aufbau

1. Ausgangslage in den Worten des Kunden
2. Ziel und Ergebnis
3. Leistungsumfang und ausdrücklich nicht enthaltene Punkte
4. Preis, Zeitplan und nächste Schritte

Seit ich so schreibe, gibt es weniger Rückfragen und schnellere Zusagen.`,
			},
		],
	},
	{
		lang: "de",
		category: "business",
		tags: ["leadership", "career"],
		cover: "business",
		posts: [
			{
				title: "Einarbeitung neuer Kolleginnen und Kollegen",
				markdown: `Die ersten zwei Wochen prägen, wie sich jemand im Team fühlt.

## Unser Einarbeitungsplan

- Tag 1: Laptop fertig eingerichtet, Buddy zugeteilt
- Woche 1: kleine echte Aufgabe bis in Produktion
- Woche 2: Gespräch über Erwartungen und offene Fragen

Das Ziel ist nicht, alles zu erklären, sondern früh Erfolgserlebnisse zu ermöglichen.`,
			},
			{
				title: "Mitarbeitergespräche ohne Formular-Frust",
				markdown: `Jährliche Gespräche mit langen Formularen fühlen sich für beide Seiten wie Pflicht an.

## Was wir geändert haben

- kurze Gespräche alle sechs Wochen
- drei feste Fragen: Was läuft gut? Was bremst dich? Was willst du lernen?
- Notizen, die beide Seiten sehen

Das Jahresgespräch fasst dann nur noch zusammen, was ohnehin besprochen wurde.`,
			},
		],
	},
	{
		lang: "de",
		category: "culture",
		tags: ["books", "learning"],
		cover: "books",
		posts: [
			{
				title: "Warum ich wieder in die Stadtbibliothek gehe",
				markdown: `Die Stadtbibliothek hat sich verändert: Arbeitsplätze, Makerspace, E-Books und ein Café.

## Was ich dort finde

- Bücher, die ich nie gekauft hätte
- einen ruhigen Arbeitsplatz ohne Ablenkung
- Veranstaltungen, bei denen man Nachbarn kennenlernt

Der Jahresausweis kostet weniger als zwei Taschenbücher.`,
			},
			{
				title: "Ein Lesekreis, der nicht einschläft",
				markdown: `Viele Lesekreise treffen sich nach einem Jahr nur noch zum Essen. Unserer liest seit drei Jahren.

## Unsere Regeln

- Bücher unter 300 Seiten
- jede Person schlägt reihum ein Buch vor
- drei Diskussionsfragen werden vorher verschickt

Das Essen gibt es trotzdem. Es ist nur nicht mehr der Hauptgrund.`,
			},
		],
	},
	{
		lang: "de",
		category: "culture",
		tags: ["community", "sustainability"],
		cover: "city",
		posts: [
			{
				title: "Nachbarschaftshilfe digital organisieren",
				markdown: `In unserem Viertel läuft Nachbarschaftshilfe über eine einfache Gruppe und eine geteilte Tabelle.

## Was gut funktioniert

- Ausleihen von Werkzeug und Leitern
- Einkaufen für ältere Nachbarn
- Pflanzen gießen im Urlaub

Technisch ist das nichts Besonderes. Der Unterschied ist, dass sich jemand verantwortlich fühlt.`,
			},
			{
				title: "Reparieren statt wegwerfen: ein Jahr im Repair-Café",
				markdown: `Jeden zweiten Samstag helfe ich im Repair-Café. Die häufigsten Patienten: Toaster, Lampen und Kaffeemaschinen.

## Was ich gelernt habe

- viele Defekte sind ein einzelnes Kabel oder eine Sicherung
- Hersteller machen Reparaturen oft unnötig schwer
- Menschen freuen sich mehr über ein repariertes Gerät als über ein neues

Die Erfolgsquote liegt bei etwa zwei Dritteln.`,
			},
		],
	},
	{
		lang: "de",
		category: "travel",
		tags: ["travel-notes", "sustainability"],
		cover: "travel",
		posts: [
			{
				title: "Mit dem Deutschlandticket durch Thüringen",
				markdown: `Eine Woche, nur Regionalzüge: Erfurt, Weimar, Jena, Eisenach und ein Abstecher in den Thüringer Wald.

## Höhepunkte

- die Krämerbrücke in Erfurt am frühen Morgen
- ein Spaziergang durch den Park an der Ilm
- die Wartburg bei Nebel

## Tipp

Die Verbindungen sind gut, aber sonntags seltener. Ein Blick in den Fahrplan am Vorabend spart Wartezeit.`,
			},
			{
				title: "Wandern im Thüringer Wald: der Rennsteig in Etappen",
				markdown: `Der Rennsteig ist 170 Kilometer lang. Wir sind ihn in sechs Etappen gelaufen, verteilt auf drei Wochenenden.

## Was man einpacken sollte

- gute Schuhe und Regenjacke, auch im Sommer
- genug Wasser, Einkehrmöglichkeiten sind nicht überall
- Bargeld für kleine Hütten

Der Weg ist gut markiert. Das Schönste sind die Aussichten nach den Anstiegen.`,
			},
		],
	},
	{
		lang: "de",
		category: "travel",
		tags: ["travel-notes", "photography"],
		cover: "travel",
		posts: [
			{
				title: "Ostsee im Herbst: ruhige Tage an der Küste",
				markdown: `Im Oktober ist die Ostsee leer, windig und wunderschön.

## Warum der Herbst sich lohnt

- günstigere Unterkünfte
- lange Strandspaziergänge ohne Menschenmassen
- Licht, das Fotografen lieben

Ein Pullover mehr im Gepäck, und die Nebensaison wird zur besten Reisezeit.`,
			},
			{
				title: "Städtereise ohne Sehenswürdigkeiten-Stress",
				markdown: `Früher habe ich Städtereisen mit Listen geplant. Heute plane ich nur einen Programmpunkt pro Tag.

## Der Rest des Tages

- in einem Viertel bleiben und laufen
- dort essen, wo Einheimische Schlange stehen
- einmal einfach eine Stunde im Park sitzen

Ich sehe weniger Sehenswürdigkeiten und erinnere mich an mehr.`,
			},
		],
	},
	{
		lang: "de",
		category: "food",
		tags: ["cooking", "sustainability"],
		cover: "food",
		posts: [
			{
				title: "Saisonal kochen im Winter",
				markdown: `Im Winter gibt es mehr als Kartoffeln und Kohl. Aber auch die können richtig gut sein.

## Drei Lieblingsgerichte

- Ofengemüse aus Roter Bete, Pastinake und Möhre mit Feta
- Grünkohl-Pesto zu Nudeln
- Kürbissuppe mit Ingwer und Kokosmilch

Saisonal kochen ist günstiger, und das Gemüse schmeckt einfach nach mehr.`,
			},
			{
				title: "Resteküche: aus wenig viel machen",
				markdown: `Freitags koche ich nur mit dem, was im Kühlschrank übrig ist.

## Bewährte Resteverwerter

- Frittata mit Gemüseresten
- gebratener Reis mit allem, was da ist
- Brotsalat aus altem Brot, Tomaten und Zwiebeln

Wir werfen seitdem deutlich weniger Lebensmittel weg und der Freitag ist zum Überraschungsabend geworden.`,
			},
		],
	},
	{
		lang: "de",
		category: "food",
		tags: ["cooking", "gardening"],
		cover: "food",
		posts: [
			{
				title: "Kräuter auf der Fensterbank ziehen",
				markdown: `Supermarkt-Basilikum stirbt oft nach einer Woche. Das liegt meistens am Topf, nicht am Gärtner.

## So klappt es

- Pflanzen direkt nach dem Kauf auf zwei Töpfe verteilen
- von unten gießen, Staunässe vermeiden
- regelmäßig die Spitzen ernten, nicht einzelne Blätter

Petersilie und Schnittlauch sind noch dankbarer als Basilikum.`,
			},
			{
				title: "Brot backen mit Übernachtgare",
				markdown: `Gutes Brot braucht vor allem Zeit, nicht Arbeit.

## Grundrezept

- 500 g Weizenmehl Type 550
- 350 ml Wasser
- 10 g Salz
- 2 g Hefe

Abends verrühren, über Nacht im Kühlschrank gehen lassen, morgens formen und im gusseisernen Topf backen. Die lange Gare sorgt für Aroma und eine lockere Krume.`,
			},
		],
	},
	{
		lang: "de",
		category: "photography",
		tags: ["photography", "creativity"],
		cover: "photography",
		posts: [
			{
				title: "Street Photography und das Recht am eigenen Bild",
				markdown: `Straßenfotografie ist in Deutschland möglich, aber nicht grenzenlos.

## Faustregeln

- Menschen als „Beiwerk“ einer Szene sind meist unproblematisch
- erkennbare Einzelpersonen im Mittelpunkt brauchen oft eine Einwilligung
- bei Veröffentlichung gelten strengere Maßstäbe als beim Fotografieren

Im Zweifel fragen. Die meisten Menschen reagieren freundlicher, als man denkt.`,
			},
			{
				title: "Mit einer Festbrennweite ein Jahr lang fotografieren",
				markdown: `Ein Jahr lang nur 35 mm. Kein Zoom, keine Ausreden.

## Was sich verändert hat

- ich bewege mich mehr und gehe näher heran
- meine Bilder sind ruhiger aufgebaut
- ich denke über den Ausschnitt nach, bevor ich die Kamera hebe

Die Einschränkung hat mich zu einem besseren Fotografen gemacht als jede neue Ausrüstung.`,
			},
		],
	},
	{
		lang: "de",
		category: "photography",
		tags: ["photography", "learning"],
		cover: "photography",
		posts: [
			{
				title: "Blaue Stunde fotografieren: eine Anleitung",
				markdown: `Die blaue Stunde dauert kürzer als ihr Name vermuten lässt, oft nur 20 bis 30 Minuten.

## Vorbereitung

- Standort am Tag vorher auswählen
- Stativ und Fernauslöser mitnehmen
- ISO niedrig halten, lieber länger belichten

## Einstellung zum Start

Blende 8, ISO 100, Belichtungszeit nach Histogramm. Und dann: warten, bis Himmel und Stadtlichter gleich hell wirken.`,
			},
			{
				title: "Fotos archivieren, bevor es zu spät ist",
				markdown: `Eine kaputte Festplatte hat mich 2019 zwei Jahre Fotos gekostet. Seitdem gilt die 3-2-1-Regel.

## Die Regel

- **3** Kopien jeder Datei
- auf **2** verschiedenen Medien
- davon **1** außer Haus oder in der Cloud

Einmal im Quartal teste ich, ob sich eine zufällige Datei wirklich wiederherstellen lässt.`,
			},
		],
	},
	{
		lang: "de",
		category: "personal-growth",
		tags: ["learning", "mental-clarity"],
		cover: "growth",
		posts: [
			{
				title: "Mit 35 noch eine Sprache lernen",
				markdown: `Ich lerne seit einem Jahr Spanisch. Nicht perfekt, aber jeden Tag.

## Was funktioniert

- 15 Minuten App am Morgen
- einmal pro Woche ein Gespräch mit einer Tandempartnerin
- Serien mit spanischen Untertiteln

Der Durchbruch kam nicht durch Grammatik, sondern durch das erste echte Gespräch, bei dem ich nicht in Panik geriet.`,
			},
			{
				title: "Pausen machen, bevor man sie braucht",
				markdown: `Früher habe ich Pausen gemacht, wenn nichts mehr ging. Heute plane ich sie ein.

## Mein Rhythmus

- nach 50 Minuten zehn Minuten weg vom Bildschirm
- mittags mindestens 20 Minuten draußen
- ein Abend pro Woche ohne Termine

Ich arbeite nicht weniger, aber ich komme abends mit mehr Energie nach Hause.`,
			},
		],
	},
	{
		lang: "de",
		category: "personal-growth",
		tags: ["habits", "personal-finance"],
		cover: "growth",
		posts: [
			{
				title: "Haushaltsbuch führen, ohne es zu hassen",
				markdown: `Jede Ausgabe einzeln aufzuschreiben hält niemand lange durch. Mir reichen vier Kategorien.

## Meine Kategorien

- Fixkosten
- Lebensmittel
- Freizeit
- Sparen

Einmal pro Woche trage ich die Summen ein. Nach drei Monaten wusste ich genau, wohin mein Geld geht, und konnte ohne Verzicht 150 Euro im Monat mehr sparen.`,
			},
			{
				title: "Gewohnheiten klein anfangen",
				markdown: `Große Vorsätze scheitern oft im Februar. Kleine Gewohnheiten überleben.

## Beispiele

- statt „jeden Tag Sport“: jeden Morgen zehn Kniebeugen
- statt „mehr lesen“: vor dem Schlafen eine Seite
- statt „gesünder essen“: zu jedem Mittagessen ein Stück Gemüse

Die kleine Version ist fast lächerlich einfach. Genau deshalb bleibt sie.`,
			},
		],
	},
	{
		lang: "de",
		category: "technology",
		tags: ["typescript", "web-development"],
		cover: "code",
		posts: [
			{
				title: "Formulare validieren mit einem Schema für Client und Server",
				markdown: `Früher hatten wir Validierungsregeln im Frontend und andere im Backend. Die Unterschiede fanden Nutzer vor uns.

## Ein Schema, zwei Orte

Wir definieren das Schema einmal in einem gemeinsamen Modul und nutzen es im Formular und in der API.

\`\`\`ts
export const ContactSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  message: v.pipe(v.string(), v.minLength(10)),
});
\`\`\`

Seitdem stimmen Fehlermeldungen überall überein.`,
			},
			{
				title: "Fehlerbehandlung, die Nutzern hilft",
				markdown: `„Ein Fehler ist aufgetreten“ hilft niemandem. Aber technische Details gehören auch nicht in den Browser.

## Unsere Unterscheidung

- **Erwartete Fehler** (Validierung, fehlende Rechte) erklären, was zu tun ist
- **Unerwartete Fehler** werden geloggt und mit einer allgemeinen Meldung beantwortet

So erfahren Nutzer, was sie selbst ändern können, und wir sehen in den Logs, was wir ändern müssen.`,
			},
		],
	},
	{
		lang: "de",
		category: "technology",
		tags: ["engineering", "learning"],
		cover: "network",
		posts: [
			{
				title: "Logging, das man im Ernstfall lesen kann",
				markdown: `Im Ernstfall sucht man nicht nach schönen Logs, sondern nach der einen relevanten Zeile.

## Was wir loggen

- Request-ID in jeder Zeile
- Fehler mit Ursache, aber ohne Passwörter oder Tokens
- Dauer langsamer Abfragen

## Was wir nicht loggen

Personenbezogene Daten, soweit es sich vermeiden lässt. Das spart Ärger mit dem Datenschutz und Speicherplatz.`,
			},
			{
				title: "Code-Reviews, die niemanden verletzen",
				markdown: `Ein Review kommentiert den Code, nicht die Person. Das klingt selbstverständlich und ist im Alltag schwer.

## Formulierungen, die helfen

- Fragen statt Urteile: „Was passiert hier, wenn die Liste leer ist?“
- Vorschläge markieren: „Optional:“ oder „Nitpick:“
- Lob aussprechen, wenn etwas gut gelöst ist

Gute Reviews machen das Team schneller, nicht nur den Code besser.`,
			},
		],
	},
	{
		lang: "de",
		category: "business",
		tags: ["career", "learning"],
		cover: "business",
		posts: [
			{
				title: "Quereinstieg in die Softwareentwicklung",
				markdown: `Ich war zehn Jahre Grafikdesignerin, bevor ich meine erste Zeile Produktionscode geschrieben habe.

## Was mir geholfen hat

- ein eigenes Projekt, das ich wirklich nutzen wollte
- ein Mentor, der wöchentlich Fragen beantwortet hat
- Vorwissen aus dem alten Beruf, besonders beim Frontend

Der Einstieg war schwer, aber mein Blick für Nutzer ist heute ein Vorteil im Team.`,
			},
			{
				title: "Das Portfolio als Entwickler: weniger ist mehr",
				markdown: `Ein Portfolio mit zwanzig Tutorial-Projekten überzeugt weniger als drei durchdachte Anwendungen.

## Was Personaler und Teams sehen wollen

- eine kurze Beschreibung des Problems
- die wichtigsten technischen Entscheidungen
- eine laufende Demo mit Beispieldaten
- sauberen, lesbaren Code

Eine gute Demo erklärt in zwei Minuten mehr als ein langer Lebenslauf.`,
			},
		],
	},
	{
		lang: "de",
		category: "culture",
		tags: ["storytelling", "community"],
		cover: "books",
		posts: [
			{
				title: "Podcasts selbst produzieren: was man wirklich braucht",
				markdown: `Für unseren Stadtteil-Podcast haben wir mit zwei Mikrofonen und einem Laptop angefangen.

## Die Grundausstattung

- dynamische Mikrofone, die Raumhall schlucken
- ein ruhiger Raum mit Teppich und Vorhängen
- eine Aufnahme-Software, die jede Spur einzeln speichert

Der Inhalt ist wichtiger als die Technik. Aber schlechter Ton lässt Menschen schneller abschalten als ein schwaches Thema.`,
			},
			{
				title: "Geschichten aus der Nachbarschaft sammeln",
				markdown: `Die interessantesten Geschichten unseres Viertels erzählen Menschen, die niemand fragt.

## Wie wir vorgehen

- offene Fragen: „Wie sah die Straße früher aus?“
- Zuhören, ohne zu unterbrechen
- Aufnahmen nur mit ausdrücklicher Zustimmung

Aus den Gesprächen ist eine kleine Ausstellung in der Bibliothek entstanden.`,
			},
		],
	},
	{
		lang: "de",
		category: "productivity",
		tags: ["learning", "deep-work"],
		cover: "productivity",
		posts: [
			{
				title: "Notizen mit Markdown: einfach und zukunftssicher",
				markdown: `Nach drei Notiz-Apps in fünf Jahren schreibe ich nur noch in Markdown-Dateien.

## Warum

- funktioniert in jedem Editor
- lässt sich mit Git versionieren
- bleibt lesbar, auch wenn eine App verschwindet

Ein Ordner pro Thema und eine gute Suche reichen für fast alles.`,
			},
			{
				title: "Meetings halbieren: ein Experiment",
				markdown: `Wir haben für einen Monat jede Besprechung von 60 auf 30 Minuten gekürzt.

## Ergebnis

- kaum ein Meeting brauchte mehr Zeit
- Agenden wurden präziser
- Entscheidungen fielen schneller

Nach dem Experiment haben wir die neue Länge beibehalten. Die gewonnene Zeit fließt in Fokusarbeit.`,
			},
		],
	},
];
