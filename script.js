function berechnen() {
    // 1. Read input values
    const rasenFlaeche = parseFloat(document.getElementById('rasenFlaeche').value) || 0;
    const rasenHoehe = document.getElementById('rasenHoehe').value;

    const heckenLaenge = parseFloat(document.getElementById('heckenLaenge').value) || 0;
    const heckenHoehe = parseFloat(document.getElementById('heckenHoehe').value) || 0;
    const heckenSchnitt = document.getElementById('heckenSchnitt').value;

    // Rates
    const HOURLY_RATE = 49;
    const DISPOSAL_RATE_PER_BAG = 49;
    const BIG_BAG_VOLUME = 0.729; // 0.9m x 0.9m x 0.9m

    // --- LAWN CALCULATION ---
    let rasenZeitMinuten = 0;
    let rasenVolumenM3 = 0;

    if (rasenFlaeche > 0) {
        let zeitFaktor = 0.12; // ~12 min per 100m² for normal grass
        let volFaktor = 0.0006; // m³ grass clipping per m²

        if (rasenHoehe === 'mittel') {
            zeitFaktor *= 1.5;
            volFaktor *= 1.8;
        } else if (rasenHoehe === 'hoch') {
            zeitFaktor *= 2.5;
            volFaktor *= 3.0;
        }

        rasenZeitMinuten = rasenFlaeche * zeitFaktor;
        rasenVolumenM3 = rasenFlaeche * volFaktor;
    }

    // --- HEDGE CALCULATION ---
    let heckenZeitMinuten = 0;
    let heckenVolumenM3 = 0;

    if (heckenLaenge > 0 && heckenHoehe > 0) {
        const heckenFlaeche = heckenLaenge * heckenHoehe;

        if (heckenSchnitt === 'pflege') {
            heckenZeitMinuten = heckenFlaeche * 2.5;
            heckenVolumenM3 = heckenFlaeche * 0.04;
        } else if (heckenSchnitt === 'rueck') {
            heckenZeitMinuten = heckenFlaeche * 5.0;
            heckenVolumenM3 = heckenFlaeche * 0.10;
        }
    }

    // --- TOTAL QUANTITIES ---
    const gesamtZeitMinuten = Math.round(rasenZeitMinuten + heckenZeitMinuten);
    const gesamtVolumenM3 = rasenVolumenM3 + heckenVolumenM3;
    const rawBagCount = gesamtVolumenM3 / BIG_BAG_VOLUME;

    // --- FINANCIAL CALCULATION ---
    // Started hours calculation (angefangene Stunde)
    const hoursBilled = gesamtZeitMinuten > 0 ? Math.ceil(gesamtZeitMinuten / 60) : 0;
    const laborCost = hoursBilled * HOURLY_RATE;

    // Full bags billed (rounded up for partial bags)
    const bagsBilled = rawBagCount > 0 ? Math.ceil(rawBagCount) : 0;
    const disposalCost = bagsBilled * DISPOSAL_RATE_PER_BAG;

    const totalPrice = laborCost + disposalCost;

    // --- UI DISPLAY FORMATTING ---
    const stunden = Math.floor(gesamtZeitMinuten / 60);
    const minuten = gesamtZeitMinuten % 60;
    let zeitText = stunden > 0 ? `${stunden} Std. ${minuten} Min.` : `${minuten} Min.`;

    document.getElementById('resZeit').innerText = zeitText;
    document.getElementById('resVolumen').innerText = gesamtVolumenM3.toFixed(2);
    document.getElementById('resBags').innerText = rawBagCount.toFixed(1);

    // Price output
    document.getElementById('resHoursBilled').innerText = hoursBilled;
    document.getElementById('resLaborCost').innerText = laborCost.toFixed(2);
    document.getElementById('resBagsBilled').innerText = bagsBilled;
    document.getElementById('resDisposalCost').innerText = disposalCost.toFixed(2);
    document.getElementById('resTotalPrice').innerText = totalPrice.toFixed(2);

    document.getElementById('ergebnis').style.display = 'block';
}
