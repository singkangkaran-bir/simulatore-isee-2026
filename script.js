function toggleCasa() {
    const tipo = document.getElementById('tipo_casa').value;
    document.getElementById('div_affitto').style.display = tipo === 'locazione' ? 'block' : 'none';
    document.getElementById('div_proprieta').style.display = tipo === 'proprieta' ? 'block' : 'none';
}

function eseguiCalcolo() {
    // 1. INPUT
    const n = parseInt(document.getElementById('n_componenti').value);
    const reddito = parseFloat(document.getElementById('reddito_totale').value) || 0;
    const n_figli = parseInt(document.getElementById('n_figli').value) || 0;
    
    // 2. PATRIMONIO IMMOBILIARE (ISP_imm)
    let valore_casa = parseFloat(document.getElementById('valore_casa').value) || 0;
    let mutuo_casa = parseFloat(document.getElementById('mutuo_casa').value) || 0;
    let altri_imm = parseFloat(document.getElementById('altri_immobili').value) || 0;
    let mutuo_altri = parseFloat(document.getElementById('mutuo_altri').value) || 0;

    // Franchigia casa abitazione: valore IMU - mutuo, poi eccedenza oltre 52.500 ridotta a 2/3
    let netto_casa = Math.max(0, valore_casa - mutuo_casa);
    let franchigia_casa = 52500; // Valore base franchigia casa
    let casa_rilevante = Math.max(0, netto_casa - franchigia_casa) * 0.66;
    
    let altri_netti = Math.max(0, altri_imm - mutuo_altri);
    let ISP_imm = casa_rilevante + altri_netti;

    // 3. PATRIMONIO MOBILIARE (ISP_mob)
    let mobiliare = parseFloat(document.getElementById('patr_mobiliare').value) || 0;
    let titoli = parseFloat(document.getElementById('titoli_stato').value) || 0;
    // Novità 2026: esclusione titoli stato fino a 50k
    let titoli_effettivi = Math.max(0, titoli - 50000);
    let mobiliare_tot = mobiliare + titoli_effettivi;
    
    // Franchigia mobiliare: 6.000 + 2.000 per ogni componente oltre il primo (max 10k)
    let franchigia_mob = 6000 + (Math.max(0, n - 1) * 2000);
    franchigia_mob = Math.min(10000, franchigia_mob); 
    let ISP_mob = Math.max(0, mobiliare_tot - franchigia_mob);

    // 4. ISR (Reddito) e detrazione affitto
    let canone = parseFloat(document.getElementById('canone_affitto').value) || 0;
    let detrazione_affitto = Math.min(canone, 7000); // Semplificato
    let ISR = Math.max(0, reddito - detrazione_affitto);

    // 5. SCALA DI EQUIVALENZA (SE)
    const scale = [0, 1, 1.57, 2.04, 2.46, 2.85];
    let SE = n <= 5 ? scale[n] : 2.85 + (0.35 * (n - 5));

    // Maggiorazioni
    if (n_figli >= 3) SE += 0.2;
    if (document.getElementById('figli_minori_3').checked) SE += 0.2;
    if (document.getElementById('entrambi_genitori_lavorano').checked) SE += 0.05;
    if (document.getElementById('genitore_solo').checked) SE += 0.1;

    // 6. CALCOLO FINALE
    let ISE = ISR + (0.20 * (ISP_imm + ISP_mob));
    let ISEE = ISE / SE;

    // 7. OUTPUT
    document.getElementById('res_isr').innerText = ISR.toLocaleString();
    document.getElementById('res_isp').innerText = (ISP_imm + ISP_mob).toLocaleString();
    document.getElementById('res_ise').innerText = ISE.toLocaleString();
    document.getElementById('res_se').innerText = SE.toFixed(2);
    document.getElementById('res_isee').innerText = ISEE.toLocaleString('it-IT', {maximumFractionDigits: 2});
    document.getElementById('risultato').style.display = 'block';
}