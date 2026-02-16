function toggleCasa() {
    const tipo = document.getElementById('tipo_casa').value;
    const divAffitto = document.getElementById('div_affitto');
    const wrapperCasa = document.getElementById('wrapper_casa_abitazione');

    divAffitto.classList.toggle('hidden', tipo !== 'locazione');
    wrapperCasa.classList.toggle('hidden', tipo !== 'proprieta');
    
    // Rendi il campo obbligatorio visivamente
    if (tipo === 'proprieta') {
        document.getElementById('valore_casa').focus();
    }
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
    // Controllo obbligatorietà per casa di proprietà
    const tipoCasa = document.getElementById('tipo_casa').value;
    const valoreCasaInput = document.getElementById('valore_casa');
    
    if (tipoCasa === 'proprieta' && (valoreCasaInput.value === "" || valoreCasaInput.value <= 0)) {
        alert("ATTENZIONE: Se l'abitazione è di proprietà, il Valore IMU è obbligatorio nella Sezione C.");
        valoreCasaInput.style.borderColor = "red";
        valoreCasaInput.focus();
        return;
    } else {
        valoreCasaInput.style.borderColor = "";
    }

    // --- LOGICA DI CALCOLO ---
    const n = parseInt(document.getElementById('n_componenti').value) || 1;
    const n_figli = parseInt(document.getElementById('n_figli').value) || 0;
    
    // Scala Equivalenza
    const scale = [0, 1, 1.57, 2.04, 2.46, 2.85];
    let se = n <= 5 ? scale[n] : 2.85 + (0.35 * (n - 5));
    if (n_figli >= 3) se += 0.2;
    if (document.getElementById('figli_minori_3').checked) se += 0.2;
    if (document.getElementById('entrambi_genitori_lavorano').checked) se += 0.05;
    if (document.getElementById('genitore_solo').checked) se += 0.1;

    // Patrimonio Immobiliare (Gestione Multi-Immobile)
    let valore_casa_abit = parseFloat(valoreCasaInput.value) || 0;
    let mutuo_casa_abit = parseFloat(document.getElementById('mutuo_casa').value) || 0;
    
    let netto_casa = Math.max(0, valore_casa_abit - mutuo_casa_abit);
    let casa_rilevante = Math.max(0, netto_casa - 52500) * 0.66; // Franchigia standard

    // Somma tutti gli altri immobili aggiunti
    let altri_imm_totale = 0;
    const valoriAltri = document.getElementsByClassName('valore_altro');
    const mutuiAltri = document.getElementsByClassName('mutuo_altro');

    for (let i = 0; i < valoriAltri.length; i++) {
        let v = parseFloat(valoriAltri[i].value) || 0;
        let m = parseFloat(mutuiAltri[i].value) || 0;
        altri_imm_totale += Math.max(0, v - m);
    }

    let ISP_imm = casa_rilevante + altri_imm_totale;

    // Patrimonio Mobiliare (Novità 2026)
    let mobiliare = parseFloat(document.getElementById('patr_mobiliare').value) || 0;
    let titoli = parseFloat(document.getElementById('titoli_stato').value) || 0;
    let titoli_effettivi = Math.max(0, titoli - 50000); 
    let f_mob = Math.min(10000, 6000 + (Math.max(0, n - 1) * 2000));
    let ISP_mob = Math.max(0, (mobiliare + titoli_effettivi) - f_mob);

    // Reddito
    let reddito = parseFloat(document.getElementById('reddito_totale').value) || 0;
    let canone = parseFloat(document.getElementById('canone_affitto').value) || 0;
    let ISR = Math.max(0, reddito - Math.min(canone, 7000));

    // Finale
    let ise = ISR + (0.20 * (ISP_imm + ISP_mob));
    let isee = ise / se;

    // Output
    document.getElementById('res_isr').innerText = "€ " + ISR.toLocaleString('it-IT', {minimumFractionDigits: 2});
    document.getElementById('res_isp').innerText = "€ " + (ISP_imm + ISP_mob).toLocaleString('it-IT', {minimumFractionDigits: 2});
    document.getElementById('res_se').innerText = se.toFixed(2);
    document.getElementById('res_isee').innerText = "€ " + isee.toLocaleString('it-IT', {minimumFractionDigits: 2});
    
    document.getElementById('risultato').classList.remove('hidden');
    document.getElementById('risultato').scrollIntoView({ behavior: 'smooth' });
}