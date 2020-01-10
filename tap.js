"use strict";
function tabellenzeile(tabelle, beschreibung, wert){
	var zeile = tabelle.insertRow(-1);
	var spalte1 = zeile.insertCell(0);
	var spalte2 = zeile.insertCell(1);
	var beschreibungstext = document.createTextNode(beschreibung);
	var werttext = document.createTextNode(wert);
	spalte1.appendChild(beschreibungstext);
	spalte2.appendChild(werttext);
	spalte1.className = 'beschreibung';
	spalte2.className = 'werte';
}
function probe(id, e1, e2, e3, taw, mod) {
	document.getElementById(id).textContent = `Probe ${(mod<0?"":"+") + mod} auf (${e1}/${e2}/${e3}) mit TaW ${taw}` ;
}
function calculate() {
	const params = new URLSearchParams(location.search);
	var e1 = parseInt(document.getElementById("e-eins").value,10);
	if (isNaN(e1) || e1 < 1 || e1 > 30) { e1 = 12; }
	var e2 = parseInt(document.getElementById("e-zwei").value,10);
	if (isNaN(e2) || e2 < 1 || e2 > 30) { e2 = 12; }
	var e3 = parseInt(document.getElementById("e-drei").value,10);
	if (isNaN(e3) || e3 < 1 || e3 > 30) { e3 = 12; }
	var taw = parseInt(document.getElementById("taw").value,10);
	if (isNaN(taw) || taw < 0 || taw > 35) { taw = 12; }
	var mod = parseInt(document.getElementById("mod").value,10);
	if (isNaN(mod)) { mod = 0; }
	var tapstern = tapsternliste(e1,e2,e3,taw,mod);
	const ergebnisse = document.getElementById("ergebnisse_einzeln");
	const sum_ergebnisse = document.getElementById("ergebnisse_kumulativ");
	while (ergebnisse.childElementCount > 1) {
		ergebnisse.removeChild(ergebnisse.lastChild);
	}
	while (sum_ergebnisse.childElementCount > 1) {
		sum_ergebnisse.removeChild(sum_ergebnisse.lastChild);
	}
	const taplist = Array(taw+1).fill(0);
	var fails = 0;
	for (var tap of tapstern) {
		if (tap < 0) {
			fails++;
		}
		else {
			taplist[tap]++;
		}
	}
	tabellenzeile(ergebnisse,'Scheitern',(fails/80).toFixed(2)+'%');
	tabellenzeile(sum_ergebnisse,'Scheitern',(fails/80).toFixed(2)+'%');
	const sumlist=[];
	var mittel=0;
	for (var i=0; i<taw+1; i++) {
		sumlist.push(taplist.slice(i,taw+1).reduce((pv, cv) => pv + cv, 0));
		mittel+=i*taplist[i];
		if (taplist[i] != 0) {
			tabellenzeile(ergebnisse, i, (taplist[i]/80).toFixed(2)+'%');
			tabellenzeile(sum_ergebnisse, i.toFixed(0)+'+', (sumlist[i]/80).toFixed(2)+'%');
		}
	}
	tabellenzeile(ergebnisse,'Mittelwert', (mittel/sumlist[0]).toFixed(4));
	probe('probe', e1, e2, e3, taw, mod);
	params.set('e1', e1);
	params.set('e2', e2);
	params.set('e3', e3);
	params.set('taw', taw);
	params.set('mod', mod);
	window.history.replaceState({}, '', `${location.pathname}?${params}`);
}
function initialisierung() {
	const params = new URLSearchParams(location.search);
	if (params.has('e1')) {document.getElementById("e-eins").value=params.get('e1');}
	if (params.has('e2')) {document.getElementById("e-zwei").value=params.get('e2');}
	if (params.has('e3')) {document.getElementById("e-drei").value=params.get('e3');}
	if (params.has('taw')) {document.getElementById("taw").value=params.get('taw');}
	if (params.has('mod')) {document.getElementById("mod").value=params.get('mod');}
	calculate()
}