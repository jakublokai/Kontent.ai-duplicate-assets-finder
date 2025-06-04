# Asset Duplicate Finder

This web application helps users find duplicate assets in their asset library. It connects to the Kontent.ai Management API to fetch asset data and identify duplicates based on file names, sizes, and types.

## Features

- **Input Fields**: Users can enter their Environment ID and Management API Key to access their assets.
- **Duplicate Detection**: The application identifies and highlights duplicate assets.
- **User-Friendly Interface**: A simple and responsive design for easy navigation and interaction.

## Technologies Used

- HTML
- CSS
- JavaScript
- Fetch API for making HTTP requests

## How It Works

1. **HTML Structure**: The application consists of a simple HTML layout with input fields for the Environment ID and Management API Key, a button to fetch asset data, and a container to display results.

2. **JavaScript Functionality**:
   - **Element References**: The script references the necessary HTML elements to interact with user inputs and display results.
   - **Fetching Data**: It constructs an API request to fetch asset data from the Kontent.ai Management API using the provided credentials.
   - **Processing Data**: The fetched data is processed to identify duplicates based on file name, size, and type.
   - **Displaying Results**: A dynamic table is created to display the assets, highlighting any duplicates for easy identification.

## Usage

1. Enter your Environment ID and Management API Key in the respective input fields.
2. Click the "Export Assets Info" button to fetch and display asset information.
3. Review the displayed assets and their duplicates.

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
