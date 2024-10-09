# CFD Calculator

This project is a **Contract for Difference (CFD) Calculator**, designed to help traders calculate potential profits or losses from a CFD position based on financial parameters such as **initial capital**, **opening and closing prices**, and **leverage**. It supports multiple currencies (PLN, EUR, USD) and adjusts calculations using real-time exchange rates.

## Features

- **Multi-currency Support**: Calculate profits or losses in PLN, EUR, or USD with automatic exchange rate conversions.
- **Leverage Handling**: Choose from various leverage ratios (1:2, 1:5, 1:10, etc.) to simulate potential gains or losses.
- **Real-time Calculation**: Provides immediate profit or loss calculations based on input data.
- **Exchange Rate Integration**: Allows for the integration of exchange rates (from NBP or manual input) for accurate currency conversions.

## How It Works

1. **Input Parameters**:
   - Initial Capital in PLN
   - Opening Price
   - Closing Price
   - Leverage (e.g., 1:10)
   - Currency (PLN, EUR, USD)

2. **Calculation Formula**:
   The calculator determines the number of shares based on the opening price and leverage:
   ```plaintext
   Shares = Initial Capital / (Opening Price / Leverage)
   Profit/Loss = (Closing Price - Opening Price) * Shares
