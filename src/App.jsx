import { useState, useEffect } from "react";
import "./App.css";
import logoFortisko from "./assets/logoFortisko.png";

const App = () => {
  const [capital, setCapital] = useState(1000); // Kapitał w PLN
  const [openingPrice, setOpeningPrice] = useState("");
  const [closingPrice, setClosingPrice] = useState("");
  const [leverage, setLeverage] = useState("1:10");
  const [currency, setCurrency] = useState("PLN");
  const [calculatedCurrency, setCalculatedCurrency] = useState(""); // Waluta wynikowa
  const [profit, setProfit] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [exchangeRates, setExchangeRates] = useState("");

  // Funkcja do pobierania kursów walut z NBP
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const res = await fetch(
          "https://api.nbp.pl/api/exchangerates/tables/C?format=json"
        );
        const data = await res.json();

        // Sprawdzenie, co zostało pobrane
        console.log("Pobrane dane z API NBP:", data);

        const rates = data[0].rates;
        console.log("Lista kursów walut:", rates);

        const newRates = {
          PLN: 1,
          EUR: rates.find((rate) => rate.code === "EUR").ask,
          USD: rates.find((rate) => rate.code === "USD").ask,
        };

        console.log("Nowe kursy walut:", newRates);

        setExchangeRates(newRates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRates();
  }, []); // Nowy stan dla komunikatu o błędzie

  // Kursy wymiany
  // const exchangeRates = {
  //   PLN: 1,
  //   EUR: 4.5,
  //   USD: 4.0,
  // };

  const handleCalculate = () => {
    setErrorMessage("");
    setProfit(null); // Resetowanie komunikatu o błędzie
    if (!openingPrice || !closingPrice) return;

    const leverageValue = parseFloat(leverage.split(":")[1]);
    console.log(`Leverage Value: ${leverageValue}`);
    console.log(exchangeRates);

    // Przeliczenie kapitału z PLN na walutę, w której są ceny
    const capitalInCurrency = capital / exchangeRates[currency];

    console.log(`Capital in ${currency}: ${capitalInCurrency}`);

    // Obliczenie wartości jednej akcji w walucie
    const openingPriceValue = parseFloat(openingPrice);
    const closingPriceValue = parseFloat(closingPrice);
    const shareValue = openingPriceValue / leverageValue;
    console.log(`Share Value (${currency}): ${shareValue}`);
    // Sprawdzenie, czy kapitał jest wystarczający, aby kupić przynajmniej jedną jednostkę
    if (capitalInCurrency < shareValue) {
      setErrorMessage(
        "Kapitał początkowy zbyt niski, aby kupić przynajmniej jedną jednostkę."
      );
      return;
    }

    // Obliczenie liczby akcji w walucie, w której są ceny
    const numberOfShares = Math.floor(capitalInCurrency / shareValue); // Zaokrąglij do najbliższej liczby całkowitej
    console.log(`Number of Shares: ${numberOfShares}`);

    // Obliczenie różnicy cen w walucie (Cena zamknięcia - Cena otwarcia)
    const priceDifference = closingPriceValue - openingPriceValue; // Poprawka tutaj
    console.log(`Price Difference (${currency}): ${priceDifference}`);

    // Obliczenie zysku w walucie
    const resultInCurrency = numberOfShares * priceDifference;
    console.log(`Profit in ${currency}: ${resultInCurrency}`);
    setCalculatedCurrency(currency);

    // Przeliczenie wyniku na PLN
    // const resultPLN = resultInCurrency * exchangeRates[currency];
    // console.log(`Profit (PLN): ${resultPLN}`);

    // Ustawienie zysku jako wartość bezwzględna
    setProfit(Math.abs(resultInCurrency)); // Przechowuj wynik w walucie
  };

  return (
    <div className="container">
      <img className="logo" src={logoFortisko} alt="logo" />
      <div className="form-group">
        <label>Initial Capital (PLN):</label>
        <input
          type="number"
          value={capital}
          onChange={(e) => setCapital(parseFloat(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label>Opening Price:</label>
        <input
          type="number"
          value={openingPrice}
          onChange={(e) => setOpeningPrice(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Closing Price:</label>
        <input
          type="number"
          value={closingPrice}
          onChange={(e) => setClosingPrice(e.target.value)}
        />
        <label>
          Actual Currency
          <br />
          NBP
        </label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="PLN">PLN</option>
          <option value="EUR">EUR ({exchangeRates.EUR?.toFixed(2)})</option>
          <option value="USD">USD ({exchangeRates.USD?.toFixed(2)})</option>
        </select>
      </div>
      <div className="form-group">
        <label>Leverage:</label>
        <select value={leverage} onChange={(e) => setLeverage(e.target.value)}>
          <option value="1:2">1:2 Krypto</option>
          <option value="1:5">1:5 Akcje</option>
          <option value="1:10">1:10 Surowce/pozostałe indeksy</option>
          <option value="1:20">1:20 Złoto/Głowne Indeksy/Inne waluty</option>
          <option value="1:30">1:30 Główne waluty</option>
        </select>
      </div>
      <button onClick={handleCalculate}>Calculate</button>
      <h2>Result:</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      {profit !== null && (
        <div className="result">
          <p className="increase">
            {profit.toFixed(2)} {calculatedCurrency}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
