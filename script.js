function toggleCasa() {
    const tipo = document.getElementById('tipo_casa').value;
    document.getElementById('div_affitto').classList.toggle('hidden', tipo !== 'locazione');
    document.getElementById('wrapper_casa_abitazione').classList.toggle('hidden', tipo !== 'proprieta');
}

function toggleInfoImu() {
    const box = document.getElementById('info_imu_box');
    box.classList.toggle('hidden');
}

function calcolaValoreDaRendita() {
    const rendita = parseFloat(document.getElementById('rendita_catastale').value);
    if (isNaN(rendita) || rendita <= 0) {
        alert("Inserisci una rendita valida.");
        return;
    }
    // Formula ISEE: Rendita * 1.05 (rivalutazione) * 160 (moltiplicatore)
    const valore = rendita * 1.05 * 160;
    document.getElementById('valore_casa').value = valore.toFixed(2);
    toggleInfoImu();
}

function aggiungiImmobile() {
    const container = document.getElementById('lista_altri_immobili');
    const div = document.createElement('div');
    div.className = 'field-row immobile-item';
    div.innerHTML = `
        <div class="field-group w-50">
            <label>Valore IMU altro immobile (€)</label>
            <input type="number" class="valore_altro" placeholder="0">
        </div>
        <div class="field-group w-50">
            <label>Quota residua mutuo (€)</label>
            <input type="number" class="mutuo_altro" placeholder="0">
        </div>
    `;
    container.appendChild(div);
}

function eseguiCalcolo() {
    const tipoCasa = document.getElementById('tipo_casa').value;
    const valoreCasaInput = document.getElementById('valore_casa');
    
    if (tipoCasa === 'proprieta' && (valoreCasaInput.value === "" || valoreCasaInput.value <= 0)) {
        alert("Il Valore IMU della casa di abitazione è obbligatorio.");
        valoreCasaInput.focus();
        return;
    }

    // Scala Equivalenza
    const n = parseInt(document.getElementById('n_componenti').value) || 1;
    const n_figli = parseInt(document.getElementById('n_figli').value) || 0;
    const scale = [0, 1, 1.57, 2.04, 2.46, 2.85];
    let se = n <= 5 ? scale[n] : 2.85 + (0.35 * (n - 5));
    if (n_figli >= 3) se += 0.2;
    if (document.getElementById('figli_minori_3').checked) se += 0.2;
    if (document.getElementById('entrambi_genitori_lavorano').checked) se += 0.05;
    if (document.getElementById('genitore_solo').checked) se += 0.1;

    // Immobili
    let valore_casa = parseFloat(valoreCasaInput.value) || 0;
    let mutuo_casa = parseFloat(document.getElementById('mutuo_casa').value) || 0;
    let netto_casa = Math.max(0, valore_casa - mutuo_casa);
    let casa_rilevante = Math.max(0, netto_casa - 52500) * 0.66;

    let altri_imm_totale = 0;
    const valAltri = document.getElementsByClassName('valore_altro');
    const mutAltri = document.getElementsByClassName('mutuo_altro');
    for (let i = 0; i < valAltri.length; i++) {
        altri_imm_totale += Math.max(0, (parseFloat(valAltri[i].value) || 0) - (parseFloat(mutAltri[i].value) || 0));
    }
    let ISP_imm = casa_rilevante + altri_imm_totale;

    // Mobili (Esclusione Titoli Stato 2026)
    let mob = parseFloat(document.getElementById('patr_mobiliare').value) || 0;
    let titoli = parseFloat(document.getElementById('titoli_stato').value) || 0;
    let ISP_mob = Math.max(0, (mob + Math.max(0, titoli - 50000)) - Math.min(10000, 6000 + (Math.max(0, n - 1) * 2000)));

    // Redditi
    let reddito = parseFloat(document.getElementById('reddito_totale').value) || 0;
    let canone = parseFloat(document.getElementById('canone_affitto').value) || 0;
    let ISR = Math.max(0, reddito - Math.min(canone, 7000));

    let ise = ISR + (0.20 * (ISP_imm + ISP_mob));
    let isee = ise / se;

    document.getElementById('res_isr').innerText = "€ " + ISR.toLocaleString('it-IT', {minimumFractionDigits: 2});
    document.getElementById('res_isp').innerText = "€ " + (ISP_imm + ISP_mob).toLocaleString('it-IT', {minimumFractionDigits: 2});
    document.getElementById('res_se').innerText = se.toFixed(2);
    document.getElementById('res_isee').innerText = "€ " + isee.toLocaleString('it-IT', {minimumFractionDigits: 2});
    document.getElementById('risultato').classList.remove('hidden');
    document.getElementById('risultato').scrollIntoView({ behavior: 'smooth' });
}