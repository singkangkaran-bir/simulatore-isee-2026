function calcola() {
    const componenti = parseInt(document.getElementById('componenti').value);
    const reddito = parseFloat(document.getElementById('reddito').value) || 0;
    let mobiliare = parseFloat(document.getElementById('mobiliare').value) || 0;
    const titoliStato = parseFloat(document.getElementById('titoliStato').value) || 0;

    // Logica 2026: Esclusione Titoli di Stato (es. BOT, BTP) fino a 50.000€
    const titoliEsclusi = Math.min(titoliStato, 50000);
    const patrimonioNetto = Math.max(0, mobiliare - titoliEsclusi);

    // Scala di equivalenza (standard)
    const scale = [0, 1, 1.57, 2.04, 2.46, 2.85];
    let se = componenti <= 5 ? scale[componenti] : 2.85 + (0.35 * (componenti - 5));

    // Calcolo ISE = ISR + (20% del patrimonio)
    let ise = reddito + (0.20 * patrimonioNetto);

    // Calcolo ISEE = ISE / SE
    let isee = ise / se;

    // Mostra il risultato
    const divRisultato = document.getElementById('risultato');
    document.getElementById('valoreIsee').innerText = isee.toLocaleString('it-IT', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    divRisultato.style.display = 'block';
}