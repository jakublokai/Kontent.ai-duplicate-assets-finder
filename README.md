# Asset Duplicate Finder

A web application that helps identify duplicate assets in your Kontent.ai asset library using the Management API (MAPI).

## Code Specification

### Frontend Structure
- **HTML (`index.html`)**
  - Single-page application with a clean, responsive design
  - Input fields for Environment ID and Management API Key
  - Results display area with three categorized columns
  - Pastel-colored UI for better visual organization

### JavaScript Functionality (`index.js`)
1. **Asset Data Fetching**
   - Connects to Kontent.ai Management API
   - Uses provided Environment ID and API Key for authentication
   - Fetches all assets from the specified project

2. **Duplicate Detection Logic**
   - Categorizes assets into three groups:
     - `allMatch`: Assets with identical file names, sizes, and types
     - `sizeAndTypeMatch`: Assets with matching sizes and types but different names
     - `sizeOrNameMatch`: Assets with matching sizes or names

3. **Data Processing**
   - Formats file sizes for better readability
   - Groups assets based on their properties
   - Identifies potential duplicates using multiple criteria

4. **Results Display**
   - Organizes results in three distinct columns
   - Each column has a unique pastel color for easy identification
   - Displays asset names and sizes
   - Provides clickable links to view assets in Kontent.ai

### Color Scheme
- All Match Column: Soft pink (#FFE5E5)
- Size and Type Match Column: Soft blue (#E5F4FF)
- Size or Name Match Column: Soft green (#E5FFE5)

### Error Handling
- Validates input fields
- Handles API authentication errors
- Displays user-friendly error messages
- Manages loading states

### Security Features
- Secure handling of API keys
- Password field for API key input
- No local storage of sensitive data

This application helps content managers identify and manage duplicate assets in their Kontent.ai projects, improving asset organization and reducing storage usage.
